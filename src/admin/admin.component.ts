import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ProductService, Product } from '../product.service';

type SortKey = keyof Product;

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './admin.component.html',
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
