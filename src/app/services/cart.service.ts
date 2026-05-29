import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  boloId: number;
  title: string;
  image: string;
  weight: number;
  pricePerKg: number;
  totalPrice: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly total = computed(() => {
    return this._items().reduce((acc, item) => acc + item.totalPrice * item.quantity, 0);
  });

  readonly count = computed(() =>
    this._items().reduce((acc, item) => acc + item.quantity, 0)
  );

  addItem(item: Omit<CartItem, 'quantity'>) {
    this._items.update(prev => {
      const existing = prev.find(
        i => i.boloId === item.boloId && i.weight === item.weight
      );
      if (existing) {
        return prev.map(i =>
          i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  increaseQty(id: string) {
    this._items.update(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
    );
  }

  decreaseQty(id: string) {
    this._items.update(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      if (item.quantity <= 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  }

  removeItem(id: string) {
    this._items.update(prev => prev.filter(i => i.id !== id));
  }

  clear() {
    this._items.set([]);
  }
}
