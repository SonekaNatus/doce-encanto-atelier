import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardapioService, Section } from '../../services/cardapio.service';
import { ImageService } from '../../services/image.service';

export interface CakeCategory {
  readonly sectionId: number;
  readonly title: string;
  readonly image: string;
}

const GAP_FALLBACK_PX = 20;
const AUTO_SCROLL_PX_PER_SEC = 42;
const TRANSITION_MS = 480;
const DRAG_CLICK_THRESHOLD = 10;

// Mapa de imagens por id de seção (mantém as imagens já existentes no projeto)

@Component({
  selector: 'app-categories',
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class CategoriesComponent implements OnInit {
  private readonly sectionRef = viewChild<ElementRef<HTMLElement>>('sectionRoot');
  private readonly viewportRef = viewChild<ElementRef<HTMLElement>>('scrollViewport');
  private readonly destroyRef = inject(DestroyRef);
  private readonly cardapioService = inject(CardapioService);
  private readonly router = inject(Router);
  readonly imageService = inject(ImageService);

  protected readonly isVisible = signal(false);
  protected readonly translateX = signal(0);
  protected readonly useTrackTransition = signal(false);
  protected readonly cardWidthPx = signal(0);
  private readonly setWidthPx = signal(0);
  private gapPx = GAP_FALLBACK_PX;

  protected readonly loopIndices: readonly number[] = [0, 1, 2];
  protected loopSlots: { key: string; cat: CakeCategory }[] = [];

  protected categories: CakeCategory[] = [];

  private reduceMotion = false;
  private rafId = 0;
  private lastFrameTs = 0;
  private carouselActive = false;
  private hoverPaused = false;
  private transitionPaused = false;
  private isDragging = false;
  private suppressCardClick = false;
  private dragPointerId: number | null = null;
  private dragStartX = 0;
  private dragStartOffset = 0;
  private dragPending = false;

  constructor(private el: ElementRef) {
    this.reduceMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    afterNextRender(() => {
      this.setupIntersectionFade();
      queueMicrotask(() => {
        this.measureLayout();
        this.setupResizeObserver();
        this.normalizeTranslate();
      });
    });

    this.destroyRef.onDestroy(() => {
      this.stopRaf();
      this.resizeObserver?.disconnect();
    });
  }

  ngOnInit(): void {
    this.cardapioService.getSections().subscribe({
      next: (sections) => {
        this.categories = sections.map(s => ({
          sectionId: s.id,
          title: s.title,
          image: s.image ?? '',
        }));
        this.rebuildLoopSlots();
        queueMicrotask(() => {
          this.measureLayout();
          this.normalizeTranslate();
        });
      },
      error: () => {}
    });
  }

  private rebuildLoopSlots(): void {
    this.loopSlots = this.loopIndices.flatMap((copy) =>
      this.categories.map((cat) => ({ key: `${copy}-${cat.sectionId}`, cat }))
    );
  }

  navigateToSection(cat: CakeCategory, event: Event): void {
    if (this.suppressCardClick) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    this.router.navigate(['/cardapio'], { fragment: String(cat.sectionId) });
  }

  private resizeObserver?: ResizeObserver;

  private stepPx(): number { return this.cardWidthPx() + this.gapPx; }

  private measureLayout(): void {
    const vp = this.viewportRef()?.nativeElement;
    if (!vp) return;
    const track = vp.querySelector('.categories__track');
    if (track) {
      const g = Number.parseFloat(getComputedStyle(track).gap || getComputedStyle(track).columnGap || '0');
      if (Number.isFinite(g) && g > 0) this.gapPx = g;
    }
    const w = vp.clientWidth;
    const cols = w <= 639 ? 1 : w <= 1023 ? 2 : 4;
    const cw = cols > 0 ? (w - (cols - 1) * this.gapPx) / cols : 0;
    this.cardWidthPx.set(Math.max(0, cw));
    const count = this.categories.length;
    this.setWidthPx.set(count * cw + count * this.gapPx);
  }

  private normalizeTranslate(): void {
    const sw = this.setWidthPx();
    if (sw <= 0) return;
    let x = this.translateX();
    while (x <= -2 * sw) x += sw;
    while (x > -sw) x -= sw;
    this.translateX.set(x);
  }

  private setupIntersectionFade(): void {
    const el = this.sectionRef()?.nativeElement;
    if (!el) return;
    if (this.reduceMotion) {
      this.isVisible.set(true);
      this.startCarouselIfNeeded();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.isVisible.set(true);
            this.startCarouselIfNeeded();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );
    observer.observe(el);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private startCarouselIfNeeded(): void {
    if (this.reduceMotion || this.carouselActive) return;
    this.carouselActive = true;
    this.lastFrameTs = 0;
    this.rafId = globalThis.requestAnimationFrame((ts) => this.onRaf(ts));
  }

  private stopRaf(): void {
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = 0; }
    this.carouselActive = false;
  }

  private onRaf(ts: number): void {
    if (!this.carouselActive) return;
    const dt = this.lastFrameTs ? (ts - this.lastFrameTs) / 1000 : 0;
    this.lastFrameTs = ts;
    const canAuto = !this.reduceMotion && !this.hoverPaused && !this.transitionPaused && !this.isDragging && this.isVisible() && this.setWidthPx() > 0;
    if (canAuto && dt > 0) {
      let x = this.translateX();
      x -= AUTO_SCROLL_PX_PER_SEC * dt;
      const sw = this.setWidthPx();
      while (x <= -2 * sw) x += sw;
      this.translateX.set(x);
    }
    this.rafId = globalThis.requestAnimationFrame((t) => this.onRaf(t));
  }

  private setupResizeObserver(): void {
    const vp = this.viewportRef()?.nativeElement;
    if (!vp || typeof ResizeObserver === 'undefined') return;
    this.resizeObserver = new ResizeObserver(() => {
      const oldSw = this.setWidthPx();
      this.measureLayout();
      const newSw = this.setWidthPx();
      if (oldSw > 0 && newSw > 0 && oldSw !== newSw) {
        this.translateX.update(x => x * (newSw / oldSw));
      } else if (oldSw === 0) {
        this.translateX.set(0);
      }
      queueMicrotask(() => this.normalizeTranslate());
    });
    this.resizeObserver.observe(vp);
  }

  protected onCarouselPointerEnter(): void { this.hoverPaused = true; }
  protected onCarouselPointerLeave(): void { if (!this.isDragging) this.hoverPaused = false; }

  protected onTrackTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName !== 'transform' || event.target !== event.currentTarget) return;
    this.useTrackTransition.set(false);
    this.transitionPaused = false;
    this.normalizeTranslate();
  }

  private beginSmoothScroll(deltaCards: -1 | 1): void {
    if (this.useTrackTransition() || this.setWidthPx() <= 0 || this.cardWidthPx() <= 0) return;
    this.transitionPaused = true;
    this.useTrackTransition.set(true);
    const step = this.stepPx();
    this.translateX.set(this.translateX() + deltaCards * -step);
    globalThis.setTimeout(() => {
      if (this.useTrackTransition()) {
        this.useTrackTransition.set(false);
        this.transitionPaused = false;
        this.normalizeTranslate();
      }
    }, TRANSITION_MS + 80);
  }

  protected scrollPrev(): void { if (!this.isDragging) this.beginSmoothScroll(-1); }
  protected scrollNext(): void { if (!this.isDragging) this.beginSmoothScroll(1); }

  protected onViewportPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.dragPointerId = event.pointerId;
    this.dragPending = true;
    this.isDragging = false;
    this.dragStartX = event.clientX;
    this.dragStartOffset = this.translateX();
    this.suppressCardClick = false;
  }

  protected onViewportPointerMove(event: PointerEvent): void {
    if (event.pointerId !== this.dragPointerId) return;
    const dx = event.clientX - this.dragStartX;
    if (this.dragPending && Math.abs(dx) > DRAG_CLICK_THRESHOLD) {
      this.dragPending = false;
      this.isDragging = true;
      this.suppressCardClick = true;
      this.hoverPaused = true;
      this.useTrackTransition.set(false);
      this.transitionPaused = true;
      this.viewportRef()?.nativeElement?.setPointerCapture(event.pointerId);
    }
    if (!this.isDragging) return;
    let x = this.dragStartOffset + dx;
    const sw = this.setWidthPx();
    if (sw > 0) {
      while (x <= -2 * sw) x += sw;
      while (x > -sw) x -= sw;
    }
    this.translateX.set(x);
  }

  protected onViewportPointerUp(event: PointerEvent): void { this.finishViewportPointer(event); }
  protected onViewportPointerCancel(event: PointerEvent): void { this.finishViewportPointer(event); }

  private finishViewportPointer(event: PointerEvent): void {
    if (event.pointerId !== this.dragPointerId) return;
    if (this.isDragging) {
      try { this.viewportRef()?.nativeElement?.releasePointerCapture(event.pointerId); } catch {}
    }
    this.dragPointerId = null;
    this.dragPending = false;
    this.isDragging = false;
    this.transitionPaused = false;
    this.normalizeTranslate();
    if (this.suppressCardClick) {
      globalThis.setTimeout(() => { this.suppressCardClick = false; }, 0);
    }
  }
}
