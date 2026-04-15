import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-best-sellers',
  standalone: true,
  templateUrl: './best-sellers.html',
  styleUrl: './best-sellers.scss'
})
export class BestSellers implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  products = [
    { name: 'Bolo de Chocolate', description: 'Massa cacau 50%, recheio cremoso e cobertura de ganache', price: 'R$ 89,90' },
    { name: 'Bolo Red Velvet', description: 'Massa aveludada, recheio de cream cheese e frutas vermelhas', price: 'R$ 110,00' },
    { name: 'Bolo de Morango', description: 'Massa branca, creme patissiere e morangos frescos', price: 'R$ 95,50' },
    { name: 'Bolo de Pistache', description: 'Massa branca, recheio de brigadeiro de pistache', price: 'R$ 130,00' }
  ];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
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
      if (target) {
        this.observer?.observe(target);
      }
    }, 0);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
