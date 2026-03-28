import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { CategoriesComponent } from '../../components/categories/categories';
import { BestSellers } from '../../components/best-sellers/best-sellers';
import { Faq } from '../../components/faq/faq';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Alinhar com o número usado no header quando atualizar. */
const WHATSAPP_NUMBER = '5511999999999';
const WHATSAPP_TEXT = encodeURIComponent(
  'Olá! Vim pelo site e gostaria de fazer uma encomenda de bolo artesanal.',
);

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CategoriesComponent, BestSellers, Faq, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly heroRoot = viewChild<ElementRef<HTMLElement>>('heroRoot');
  private readonly heroInner = viewChild<ElementRef<HTMLElement>>('heroInner');

  private readonly destroyRef = inject(DestroyRef);

  private heroImgEl: HTMLImageElement | null = null;
  private gsapCtx?: gsap.Context;
  private onResize?: () => void;

  readonly whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;

  constructor() {
    afterNextRender(() => {
      this.initAnimations();
    });

    this.destroyRef.onDestroy(() => {
      this.disposeAnimations();
    });
  }

  private initAnimations(): void {
    const root = this.heroRoot()?.nativeElement;
    const inner = this.heroInner()?.nativeElement;
    if (!root || !inner) {
      return;
    }

    this.heroImgEl = root.querySelector('.hero__img');

    const reduceMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (!reduceMotion) {
      gsap.set(inner, { force3D: true });

      this.gsapCtx = gsap.context(() => {
        gsap.fromTo(
          inner,
          { y: 0, opacity: 1 },
          {
            y: -56,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          },
        );
      }, root);

      this.onResize = () => {
        ScrollTrigger.refresh();
      };
      globalThis.addEventListener('resize', this.onResize);
      this.heroImgEl?.addEventListener('load', this.onResize, { once: true });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
  }

  private disposeAnimations(): void {
    this.gsapCtx?.revert();
    this.gsapCtx = undefined;

    if (this.onResize) {
      globalThis.removeEventListener('resize', this.onResize);
      this.heroImgEl?.removeEventListener('load', this.onResize);
      this.onResize = undefined;
    }

    this.heroImgEl = null;
  }
}
