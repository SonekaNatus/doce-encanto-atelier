import { Component, HostListener, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Substitua pelo WhatsApp real: código do país + DDD + número, só dígitos. */
const WHATSAPP_NUMBER = '5511999999999';
const WHATSAPP_TEXT = encodeURIComponent(
  'Olá! Vim pelo site e gostaria de fazer uma encomenda de bolo artesanal.',
);

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly menuToggleLabel = computed(() =>
    this.menuOpen() ? 'Fechar menu de navegação' : 'Abrir menu de navegação',
  );

  readonly whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;

  readonly navItems = [
    { label: 'Início', href: '#inicio' },
    { label: 'Bolos', href: '#bolos' },
    { label: 'Sabores', href: '#sabores' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Contato', href: '#contato' },
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
