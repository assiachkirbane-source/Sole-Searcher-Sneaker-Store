import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ProductService, Product } from './product.service';
import { CartService } from './cart.service';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf],
  template: `
<!-- Hero Section -->
<section class="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
  <div class="absolute inset-0 flex transition-transform duration-700 ease-in-out" [style.transform]="'translateX(-' + activeSlide() * 100 + '%)'">
    @for (slide of heroSlides(); track slide.id; let i = $index) {
      <div class="w-full flex-shrink-0 h-full relative">
        <img [src]="slide.imageUrl" [alt]="slide.title" class="w-full h-full object-cover object-center">
        <div class="absolute inset-0 bg-black/40"></div>
        <div class="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter">{{ slide.title }}</h1>
          <p class="mt-4 max-w-lg text-lg md:text-xl text-gray-200">{{ slide.subtitle }}</p>
          <button class="mt-8 px-8 py-3 bg-white text-black font-semibold uppercase tracking-wider hover:bg-gray-200 transition-colors">
            {{ slide.buttonText }}
          </button>
        </div>
      </div>
    }
  </div>

  <!-- Slideshow Controls -->
  <button (click)="prevSlide()" class="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm transition">
    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  </button>
  <button (click)="nextSlide()" class="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm transition">
    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  </button>

  <!-- Dots Navigation -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
    @for (slide of heroSlides(); track slide.id; let i = $index) {
      <button (click)="goToSlide(i)" class="h-3 w-3 rounded-full transition-colors" [class]="i === activeSlide() ? 'bg-white' : 'bg-white/50 hover:bg-white/75'"></button>
    }
  </div>
</section>

<!-- Product Grid -->
<section class="py-16 sm:py-24">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl sm:text-4xl font-black text-center uppercase tracking-tighter">New Arrivals</h2>
    <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
      @for (product of products(); track product.id) {
        <div class="group relative flex flex-col">
          <div class="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
            <img [src]="product.imageUrl" [alt]="product.name" class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105">
          </div>
          <div class="mt-4 flex-grow flex flex-col">
            <div class="flex-grow">
              <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
              <p class="mt-1 text-md font-medium text-gray-700">{{ product.price }}</p>
            </div>
            <button (click)="addToCart(product)" class="mt-4 w-full bg-gray-800 text-white py-3 px-6 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              Add to Cart
            </button>
          </div>
        </div>
      }
    </div>
  </div>
</section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  productService = inject(ProductService);
  cartService = inject(CartService);

  products = this.productService.products;

  // Hero slideshow state
  activeSlide = signal(0);
  private intervalId: any;

  readonly heroSlides = signal<HeroSlide[]>([
    {
      id: 1,
      title: 'Aura Flex SR',
      subtitle: 'Experience the Future of Comfort',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
      buttonText: 'Shop Now',
    },
    {
      id: 2,
      title: 'Velocity Pro',
      subtitle: 'Engineered for Maximum Speed',
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop',
      buttonText: 'Explore Collection',
    },
    {
      id: 3,
      title: 'Urban Nomad X',
      subtitle: 'Style That Moves With You',
      imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1996&auto=format&fit=crop',
      buttonText: 'View Lookbook',
    },
  ]);

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startAutoplay() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  resetAutoplay() {
    clearInterval(this.intervalId);
    this.startAutoplay();
  }

  nextSlide() {
    this.activeSlide.update(current => (current + 1) % this.heroSlides().length);
  }

  prevSlide() {
    this.activeSlide.update(current => (current - 1 + this.heroSlides().length) % this.heroSlides().length);
  }

  goToSlide(index: number) {
    this.activeSlide.set(index);
    this.resetAutoplay();
  }

  addToCart(product: Product) {
    this.cartService.addItem(product);
  }
}
