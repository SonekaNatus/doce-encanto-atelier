import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.el.nativeElement.querySelector('.footer-container')?.classList.add('visible');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      const target = this.el.nativeElement.querySelector('.footer-container');
      if (target) {
        this.observer?.observe(target);
      }
    }, 0);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
