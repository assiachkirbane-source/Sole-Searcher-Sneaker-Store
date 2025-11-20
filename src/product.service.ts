import { Injectable, signal } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly storageKey = 'sole-searcher-products';

  products = signal<Product[]>([]);

  constructor() {
    this.loadProductsFromStorage();
  }

  private loadProductsFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedProducts = localStorage.getItem(this.storageKey);
        if (savedProducts) {
          this.products.set(JSON.parse(savedProducts));
        } else {
          // If nothing in storage, load initial mock data and save it
          this.products.set(this.getInitialProducts());
          this.saveProducts();
        }
      } catch (e) {
        console.error('Error reading products from localStorage', e);
        this.products.set(this.getInitialProducts());
      }
    } else {
      this.products.set(this.getInitialProducts());
    }
  }

  private saveProducts() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.products()));
      } catch (e) {
        console.error('Error writing products to localStorage', e);
      }
    }
  }

  private getInitialProducts(): Product[] {
    return [
      { id: 1, name: 'AeroGlide 1', price: '$180', imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1925&auto=format&fit=crop' },
      { id: 2, name: 'Quantum Leap', price: '$220', imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=2070&auto=format&fit=crop' },
      { id: 3, name: 'Stealth Runner', price: '$150', imageUrl: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1964&auto=format&fit=crop' },
      { id: 4, name: 'Vertex High-Top', price: '$250', imageUrl: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1974&auto=format&fit=crop' },
      { id: 5, name: 'Nova Trainer', price: '$195', imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop' },
      { id: 6, name: 'Echo Classic', price: '$130', imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop' },
    ];
  }

  addProduct(productData: Omit<Product, 'id'>) {
    const newProduct: Product = {
      ...productData,
      id: Date.now()
    };
    this.products.update(products => [...products, newProduct]);
    this.saveProducts();
  }

  updateProduct(updatedProduct: Product) {
    this.products.update(products => 
      products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    this.saveProducts();
  }

  deleteProduct(productId: number) {
    this.products.update(products => products.filter(p => p.id !== productId));
    this.saveProducts();
  }
}