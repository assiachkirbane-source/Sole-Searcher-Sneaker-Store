import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { AuthComponent } from './auth.component';
import { Product } from './product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AuthComponent, NgIf, RouterOutlet, RouterLink],
})
export class AppComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);

  // Cart signals
  cartItems = this.cartService.cartItems;
  cartCount = this.cartService.cartCount;
  totalPrice = this.cartService.totalPrice;

  // Cart modal state
  isCartVisible = signal(false);
  isCartAnimating = signal(false);

  // Auth modal state
  isAuthModalVisible = signal(false);
  authMode = signal<'login' | 'register'>('login');

  toggleCart() {
    if (this.isCartVisible()) {
      this.isCartAnimating.set(false);
      setTimeout(() => this.isCartVisible.set(false), 500);
    } else {
      this.isCartVisible.set(true);
      setTimeout(() => this.isCartAnimating.set(true), 10);
    }
  }
  
  openAuthModal(mode: 'login' | 'register') {
    this.authMode.set(mode);
    this.isAuthModalVisible.set(true);
  }

  closeAuthModal() {
    this.isAuthModalVisible.set(false);
  }

  logout() {
    this.authService.logout();
  }

  removeFromCart(productId: number) {
    this.cartService.removeItem(productId);
  }
}