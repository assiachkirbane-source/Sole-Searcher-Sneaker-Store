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
  templateUrl: './home.component.html',
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
