import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.scss'
})
export class CartDrawer {
  protected readonly cartService = inject(CartService);
  @Output() close = new EventEmitter<void>();

  closeDrawer() {
    this.close.emit();
  }

  removeItem(id: string) {
    this.cartService.removeItem(id);
  }

  checkout() {
    const items = this.cartService.items();
    if (items.length === 0) return;

    const itemsText = items
      .map(item => `${item.weight.toFixed(1).replace('.', ',')}kg de ${item.title}`)
      .join(', ');

    const message = `Olá! Vim pelo site e gostaria de fazer uma encomenda de: ${itemsText}.`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  }
}
