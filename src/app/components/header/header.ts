import { Component, HostListener, computed, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartDrawer } from '../cart-drawer/cart-drawer';

/** Substitua pelo WhatsApp real: código do país + DDD + número, só dígitos. */
const WHATSAPP_NUMBER = '5511999999999';
const WHATSAPP_TEXT = encodeURIComponent(
  'Olá! Vim pelo site e gostaria de fazer uma encomenda de bolo artesanal.',
);

@Component({
  selector: 'app-header',
  imports: [RouterLink, CartDrawer],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly cartService = inject(CartService);
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly cartOpen = signal(false);
  protected readonly menuToggleLabel = computed(() =>
    this.menuOpen() ? 'Fechar menu de navegação' : 'Abrir menu de navegação',
  );

  readonly whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;

  readonly navItems = [
    { label: 'Home', href: '/' },
    { label: 'Cardápio', href: '/cardapio' },
    // { label: 'Sobre', href: '#sobre' },
  ] as const;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(globalThis.scrollY > 6);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.menuOpen()) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
