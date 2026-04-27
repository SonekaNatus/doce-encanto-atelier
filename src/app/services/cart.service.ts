import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  title: string;
  image: string;
  weight: number;
  pricePerKg: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _items = signal<CartItem[]>([]);
  
  readonly items = this._items.asReadonly();
  
  readonly total = computed(() => {
    return this._items().reduce((acc, item) => acc + item.totalPrice, 0);
  });

  readonly count = computed(() => this._items().length);

  addItem(item: CartItem) {
    this._items.update(prev => [...prev, item]);
  }

  removeItem(id: string) {
    this._items.update(prev => prev.filter(i => i.id !== id));
  }

  clear() {
    this._items.set([]);
  }
}
