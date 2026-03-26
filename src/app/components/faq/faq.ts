import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  templateUrl: './faq.html',
  styleUrl: './faq.scss'
})
export class Faq implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  readonly whatsappHref = 'https://wa.me/5511999999999';

  faqsLeft = [
    { question: 'Como faço minha encomenda?', answer: 'Você pode encomendar diretamente pelo nosso WhatsApp, escolhendo os sabores no cardápio.', open: false, index: 0 },
    { question: 'Qual o prazo mínimo para encomendar?', answer: 'Pedimos um prazo mínimo de 48 horas de antecedência para bolos decorados e 24h para os tradicionais.', open: false, index: 1 }
  ];

  faqsRight = [
    { question: 'Vocês entregam na minha região?', answer: 'Realizamos entregas num raio de até 15km do nosso ateliê, mediante taxa calculada pelo app.', open: false, index: 2 },
    { question: 'Quais são as formas de pagamento?', answer: 'Aceitamos Pix (com aprovação imediata), cartões de crédito/débito na entrega ou dinheiro.', open: false, index: 3 }
  ];

  constructor(private el: ElementRef) {}

  toggleFaqLeft(i: number): void {
    this.faqsLeft[i].open = !this.faqsLeft[i].open;
  }

  toggleFaqRight(i: number): void {
    this.faqsRight[i].open = !this.faqsRight[i].open;
  }

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.el.nativeElement.querySelector('.faq-section')?.classList.add('visible');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      const target = this.el.nativeElement.querySelector('.faq-section');
      if (target) {
        this.observer?.observe(target);
      }
    }, 0);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
