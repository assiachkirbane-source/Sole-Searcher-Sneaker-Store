import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ProductService, Product } from '../product.service';

type SortKey = keyof Product;

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  template: `
<div class="bg-gray-900 text-white min-h-full p-4 sm:p-6 lg:p-8">
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-black uppercase tracking-tighter">Admin Dashboard</h1>
      <button (click)="showCreateForm()" class="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors">
        Add New Product
      </button>
    </div>

    <!-- Product Form Modal -->
    @if (isFormVisible()) {
      <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
        <div class="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
          <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
            <div class="p-6">
              <h2 class="text-xl font-bold mb-6">{{ editingProduct() ? 'Edit Product' : 'Create New Product' }}</h2>
              <div class="space-y-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-300">Product Name</label>
                  <input formControlName="name" id="name" type="text" class="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white">
                   @if (productForm.get('name')?.invalid && productForm.get('name')?.touched) {
                    <p class="mt-1 text-xs text-red-400">Product name is required.</p>
                  }
                </div>
                <div>
                  <label for="price" class="block text-sm font-medium text-gray-300">Price</label>
                  <input formControlName="price" id="price" type="text" placeholder="$150.00" class="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white">
                   @if (productForm.get('price')?.invalid && productForm.get('price')?.touched) {
                    <p class="mt-1 text-xs text-red-400">Please enter a valid price (e.g., $150 or $150.99).</p>
                  }
                </div>
                <div>
                  <label for="imageUrl" class="block text-sm font-medium text-gray-300">Image URL</label>
                  <input formControlName="imageUrl" id="imageUrl" type="url" placeholder="https://" class="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white">
                   @if (productForm.get('imageUrl')?.invalid && productForm.get('imageUrl')?.touched) {
                    <p class="mt-1 text-xs text-red-400">Please enter a valid URL.</p>
                  }
                </div>
              </div>
            </div>
            <div class="bg-gray-700 px-6 py-4 flex justify-end space-x-4">
              <button type="button" (click)="hideForm()" class="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors">Cancel</button>
              <button type="submit" [disabled]="productForm.invalid" class="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {{ editingProduct() ? 'Update Product' : 'Create Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Products Table -->
    <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-300">
          <thead class="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 cursor-pointer" (click)="toggleSort('name')">
                Name 
                <span [class.opacity-50]="sortKey() !== 'name'">{{ sortDirection() === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th scope="col" class="px-6 py-3 cursor-pointer" (click)="toggleSort('price')">
                Price
                 <span [class.opacity-50]="sortKey() !== 'price'">{{ sortDirection() === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th scope="col" class="px-6 py-3">Image</th>
              <th scope="col" class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (product of sortedProducts(); track product.id) {
              <tr class="border-b border-gray-700 hover:bg-gray-600">
                <td class="px-6 py-4 font-medium text-white">{{ product.name }}</td>
                <td class="px-6 py-4">{{ product.price }}</td>
                <td class="px-6 py-4">
                  <img [src]="product.imageUrl" [alt]="product.name" class="w-16 h-16 object-cover rounded-md">
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <button (click)="showEditForm(product)" class="font-medium text-blue-400 hover:text-blue-300">Edit</button>
                  <button (click)="deleteProduct(product.id)" class="font-medium text-red-500 hover:text-red-400">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        @if (products().length === 0) {
           <p class="text-center py-8 text-gray-400">No products found. Add one to get started.</p>
        }
      </div>
    </div>
  </div>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private fb = inject(FormBuilder);
  productService = inject(ProductService);

  products = this.productService.products;
  isFormVisible = signal(false);
  editingProduct = signal<Product | null>(null);

  sortKey = signal<SortKey>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  productForm = this.fb.group({
    name: ['', Validators.required],
    price: ['', [Validators.required, Validators.pattern(/^\$\d+(\.\d{1,2})?$/)]],
    imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
  });

  sortedProducts = computed(() => {
    const key = this.sortKey();
    const direction = this.sortDirection();
    return [...this.products()].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }
      return direction === 'asc' ? comparison : -comparison;
    });
  });

  toggleSort(key: SortKey) {
    if (this.sortKey() === key) {
      this.sortDirection.update(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    }
  }

  showCreateForm() {
    this.editingProduct.set(null);
    this.productForm.reset({ price: '$' });
    this.isFormVisible.set(true);
  }

  showEditForm(product: Product) {
    this.editingProduct.set(product);
    this.productForm.setValue({
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    this.isFormVisible.set(true);
  }

  hideForm() {
    this.isFormVisible.set(false);
    this.editingProduct.set(null);
    this.productForm.reset();
  }

  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }
    const formValue = this.productForm.value;
    const productData = {
      name: formValue.name!,
      price: formValue.price!,
      imageUrl: formValue.imageUrl!,
    };

    if (this.editingProduct()) {
      this.productService.updateProduct({ ...this.editingProduct()!, ...productData });
    } else {
      this.productService.addProduct(productData);
    }
    this.hideForm();
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId);
    }
  }
}
