import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private authService = inject(AuthService);
  private readonly storageKeyBase = 'sole-searcher-cart';

  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => this.cartItems().reduce((total, item) => total + item.quantity, 0));

  totalPrice = computed(() => {
    return this.cartItems().reduce((total, item) => {
      const price = parseFloat(item.product.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);
  });

  constructor() {
    // This effect reacts to user login/logout to load the correct cart
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadCartForUser(user.id);
      } else {
        // User logged out, clear the cart signal
        this.cartItems.set([]);
      }
    });

    // This effect persists the cart to localStorage whenever it changes for the logged-in user
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.saveCartForUser(user.id, this.cartItems());
      }
    });
  }

  private getUserCartStorageKey(userId: string): string {
    return `${this.storageKeyBase}-${userId}`;
  }

  private loadCartForUser(userId: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storageKey = this.getUserCartStorageKey(userId);
        const savedCart = localStorage.getItem(storageKey);
        this.cartItems.set(savedCart ? JSON.parse(savedCart) : []);
      } catch (e) {
        console.error('Error reading user cart from localStorage', e);
        this.cartItems.set([]);
      }
    }
  }

  private saveCartForUser(userId: string, items: CartItem[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storageKey = this.getUserCartStorageKey(userId);
        localStorage.setItem(storageKey, JSON.stringify(items));
      } catch (e) {
        console.error('Error writing user cart to localStorage', e);
      }
    }
  }

  addItem(product: Product) {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      if (existingItem) {
        return items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...items, { product, quantity: 1 }];
      }
    });
  }

  removeItem(productId: number) {
    this.cartItems.update(items => items.filter(item => item.product.id !== productId));
  }
}