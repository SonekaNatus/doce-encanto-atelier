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
import { Avaliacoes } from '../../components/avaliacoes/avaliacoes';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

gsap.registerPlugin(ScrollTrigger);

/** Alinhar com o número usado no header quando atualizar. */
const WHATSAPP_NUMBER = '5511999999999';
const WHATSAPP_TEXT = encodeURIComponent(
  'Olá! Vim pelo site e gostaria de fazer uma encomenda de bolo artesanal.',
);

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CategoriesComponent, BestSellers, Faq, RouterLink, Avaliacoes],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})


export class Home {
  private readonly heroRoot = viewChild<ElementRef<HTMLElement>>('heroRoot');
  private readonly heroInner = viewChild<ElementRef<HTMLElement>>('heroInner');

  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);

  private heroImgEl: HTMLImageElement | null = null;
  private gsapCtx?: gsap.Context;
  private onResize?: () => void;

  readonly whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;
  readonly mapUrl: SafeResourceUrl;

  constructor() {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.485122557579!2d-46.6599187!3d-23.5581977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce58332da757af%3A0xe5ebce8813a43bf!2sR.%20Augusta%2C%201500%20-%20Consola%C3%A7%C3%A3o%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr&t=${Date.now()}`
    );

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
        // Hero animation
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

        // Map animation
        gsap.fromTo(
          '.map-wrapper',
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.location-section',
              start: 'top 80%',
            }
          }
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
