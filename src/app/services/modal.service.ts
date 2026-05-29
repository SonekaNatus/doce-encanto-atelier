import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  /** Nome do bolo que deve ser aberto em modal ao chegar no cardápio */
  readonly pendingBolo = signal<string | null>(null);

  request(boloTitle: string) {
    this.pendingBolo.set(boloTitle);
  }

  consume(): string | null {
    const val = this.pendingBolo();
    this.pendingBolo.set(null);
    return val;
  }
}
