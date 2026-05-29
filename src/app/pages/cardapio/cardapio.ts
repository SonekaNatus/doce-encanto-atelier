import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CardapioService, SectionWithBolos, Bolo } from '../../services/cardapio.service';
import { ImageService } from '../../services/image.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-cardapio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cardapio.html',
  styleUrl: './cardapio.scss'
})
export class Cardapio implements OnInit {
  protected readonly cartService = inject(CartService);
  private readonly cardapioService = inject(CardapioService);
  private readonly modalService = inject(ModalService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly imageService = inject(ImageService);

  sections: SectionWithBolos[] = [];
  loading = true;
  error = false;

  ngOnInit() {
    this.cardapioService.getSectionsWithBolos().subscribe({
      next: (sections) => {
        this.sections = sections;
        this.loading = false;
        this.cdr.detectChanges();

        // Aguarda renderização e depois lida com fragment + modal
        setTimeout(() => {
          this.handleNavigation(sections);
        }, 100);
      },
      error: () => {
        this.loading = false;
        this.error = true;
        this.cdr.detectChanges();
      }
    });
  }

  private handleNavigation(sections: SectionWithBolos[]) {
    const fragment = this.route.snapshot.fragment;
    const queryParams = this.route.snapshot.queryParams;
    const pendingBolo = this.modalService.consume();

    // Scroll para seção pelo fragment
    if (fragment) {
      const element = document.getElementById(fragment);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Determina bolo a abrir em modal
    let boloToOpen: Bolo | null = null;

    if (pendingBolo) {
      // Veio do ModalService (best-sellers ou categories)
      for (const section of sections) {
        const found = section.items.find(
          item => item.title.toLowerCase() === pendingBolo.toLowerCase()
        );
        if (found) { boloToOpen = found; break; }
      }
    } else if (queryParams['buy'] === 'true' && sections.length > 0 && sections[0].items.length > 0) {
      boloToOpen = sections[0].items[0];
    } else if (queryParams['bolo']) {
      const boloName = queryParams['bolo'];
      for (const section of sections) {
        const found = section.items.find(
          item => item.title.toLowerCase() === boloName.toLowerCase()
        );
        if (found) { boloToOpen = found; break; }
      }
    }

    if (boloToOpen) {
      // Abre modal após o scroll terminar
      const delay = fragment ? 600 : 150;
      setTimeout(() => {
        this.openModal(boloToOpen!);
        this.cdr.detectChanges();
      }, delay);
    }
  }

  selectedBolo: Bolo | null = null;
  modalOpen = false;
  showSuccess = false;
  selectedOption: number | 'custom' = 4;
  customWeight: number = 1;
  calculatedWeight: number = 1;
  totalPrice: number = 0;

  get isWeightInvalid(): boolean {
    return this.selectedOption === 'custom' && this.customWeight > 5;
  }

  openModal(bolo: Bolo) {
    this.selectedBolo = bolo;
    this.modalOpen = true;
    this.showSuccess = false;
    this.selectOption(4);
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedBolo = null;
    this.showSuccess = false;
  }

  selectOption(opt: number | 'custom') {
    this.selectedOption = opt;
    if (opt !== 'custom') {
      this.calculatedWeight = opt * 0.25;
    } else {
      this.calculatedWeight = this.customWeight;
    }
    this.updatePrice();
  }

  onCustomWeightChange(event: any) {
    this.customWeight = parseFloat(event.target.value) || 0;
    this.calculatedWeight = this.customWeight;
    this.updatePrice();
  }

  updatePrice() {
    if (this.selectedBolo) {
      this.totalPrice = this.selectedBolo.price * this.calculatedWeight;
    }
  }

  addToCart() {
    if (this.selectedBolo && !this.isWeightInvalid) {
      this.cartService.addItem({
        id: Math.random().toString(36).substr(2, 9),
        boloId: this.selectedBolo.id,
        title: this.selectedBolo.title,
        image: this.imageService.getSrc(this.selectedBolo.image) || '/assets/placeholder-cake.png',
        weight: this.calculatedWeight,
        pricePerKg: this.selectedBolo.price,
        totalPrice: this.totalPrice
      });

      this.showSuccess = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.closeModal();
        this.cdr.detectChanges();
      }, 2000);
    }
  }
}
