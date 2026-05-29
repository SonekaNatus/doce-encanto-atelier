import { Component, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardapioService, Bolo } from '../../services/cardapio.service';
import { ModalService } from '../../services/modal.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-best-sellers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './best-sellers.html',
  styleUrl: './best-sellers.scss'
})
export class BestSellers implements OnInit, OnDestroy {
  private readonly cardapioService = inject(CardapioService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);
  readonly imageService = inject(ImageService);
  private observer: IntersectionObserver | null = null;

  destaques: Bolo[] = [];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.cardapioService.getDestaques().subscribe({
      next: (bolos) => { this.destaques = bolos; },
      error: () => {}
    });

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.el.nativeElement.querySelector('.bs-section')?.classList.add('visible');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      const target = this.el.nativeElement.querySelector('.bs-section');
      if (target) this.observer?.observe(target);
    }, 0);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  encomendar(bolo: Bolo) {
    this.modalService.request(bolo.title);
    this.router.navigate(['/cardapio'], { fragment: String(bolo.sectionId) });
  }
}
