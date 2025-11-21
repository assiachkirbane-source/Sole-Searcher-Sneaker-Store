import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { AuthComponent } from './auth.component';
import { Product } from './product.service';

@Component({
  selector: 'app-root',
  template: `
<div class="min-h-screen flex flex-col">
  <!-- Header -->
  <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center space-x-2">
          <svg class="h-8 w-8 text-black" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 15.5c-2.3 2.3-2.3 6.1 0 8.5.6.6 1.5.6 2.1 0l3.8-3.8c.6-.6.6-1.5 0-2.1l-8.5-8.5c-.6-.6-1.5-.6-2.1 0l-3.8 3.8c-.6.6-.6 1.5 0 2.1l3.5 3.5"/><path d="M14.5 11.5 12 9l-3 3 2.5 2.5"/><path d="m21.5 21.5-5-5"/></svg>
          <span class="font-black text-2xl tracking-tight">SOLE</span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <a routerLink="/" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">New Arrivals</a>
          <a href="#" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">Men</a>
          <a href="#" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">Women</a>
          <a href="#" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">Collections</a>
          @if (authService.currentUser()?.role === 'ADMIN') {
             <a routerLink="/admin" class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Admin</a>
          }
        </nav>

        <!-- Auth & Cart Icons -->
        <div class="flex items-center space-x-4">
          @if (authService.currentUser(); as user) {
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600 hidden sm:inline">Welcome, {{ user.email }}</span>
              <button (click)="logout()" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">Logout</button>
            </div>
          } @else {
            <div class="flex items-center space-x-2 sm:space-x-4">
                <button (click)="openAuthModal('login')" class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors">Login</button>
                <button (click)="openAuthModal('register')" class="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors">Sign Up</button>
            </div>
          }

          <div class="h-6 border-l border-gray-300"></div>

          <button (click)="toggleCart()" type="button" class="relative p-2 text-gray-600 hover:text-black transition-colors">
            <span class="sr-only">Open cart</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            @if (cartCount() > 0) {
              <span class="absolute top-0 right-0 block h-4 w-4 rounded-full bg-black text-white text-xs text-center leading-4 font-bold">{{ cartCount() }}</span>
            }
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="flex-grow">
    <router-outlet></router-outlet>
  </main>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <p class="text-sm text-gray-400">&copy; 2024 Sole Searcher. All Rights Reserved.</p>
    </div>
  </footer>
</div>

<!-- Cart Modal -->
@if (isCartVisible()) {
  <div class="relative z-50" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <div (click)="toggleCart()" class="fixed inset-0 bg-gray-500 bg-opacity-0 transition-opacity duration-500 ease-in-out" [class.bg-opacity-75]="isCartAnimating()"></div>

    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div class="pointer-events-auto w-screen max-w-md transform transition ease-in-out duration-500 translate-x-full" [class.translate-x-0]="isCartAnimating()">
            <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div class="flex items-start justify-between">
                  <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                  <div class="ml-3 flex h-7 items-center">
                    <button (click)="toggleCart()" type="button" class="-m-2 p-2 text-gray-400 hover:text-gray-500">
                      <span class="sr-only">Close panel</span>
                      <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="mt-8">
                  <div class="flow-root">
                    @if (cartItems().length > 0) {
                      <ul role="list" class="-my-6 divide-y divide-gray-200">
                        @for (item of cartItems(); track item.product.id) {
                          <li class="flex py-6">
                            <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img [src]="item.product.imageUrl" [alt]="item.product.name" class="h-full w-full object-cover object-center">
                            </div>

                            <div class="ml-4 flex flex-1 flex-col">
                              <div>
                                <div class="flex justify-between text-base font-medium text-gray-900">
                                  <h3><a href="#">{{ item.product.name }}</a></h3>
                                  <p class="ml-4">{{ item.product.price }}</p>
                                </div>
                              </div>
                              <div class="flex flex-1 items-end justify-between text-sm">
                                <p class="text-gray-500">Qty {{ item.quantity }}</p>
                                <div class="flex">
                                  <button (click)="removeFromCart(item.product.id)" type="button" class="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
                                </div>
                              </div>
                            </div>
                          </li>
                        }
                      </ul>
                    } @else {
                      <div class="text-center py-12">
                         <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.841a.75.75 0 00-.543-.907l-12.75-3.5A.75.75 0 004.5 5.25v.003" />
                         </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                        <p class="mt-1 text-sm text-gray-500">Start adding some sneakers to see them here.</p>
                      </div>
                    }
                  </div>
                </div>
              </div>

              @if (cartItems().length > 0) {
                <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div class="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>\${{ totalPrice().toFixed(2) }}</p>
                  </div>
                  <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div class="mt-6">
                    <a href="#" class="flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800">Checkout</a>
                  </div>
                  <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or
                      <button (click)="toggleCart()" type="button" class="font-medium text-indigo-600 hover:text-indigo-500">
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}

<!-- Auth Modal -->
@if (isAuthModalVisible()) {
  <app-auth [mode]="authMode()" (close)="closeAuthModal()"></app-auth>
}
  `,
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
