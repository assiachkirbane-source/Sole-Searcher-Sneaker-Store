'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useProducts } from '@/lib/state';
import { Product } from '@/lib/types';

type SortKey = keyof Product;

export function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct: deleteProductFromState } = useProducts();
  const [isFormVisible, setFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formErrors, setFormErrors] = useState({ name: '', price: '', imageUrl: '' });

  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      let comparison = 0;
      if (valA > valB) comparison = 1;
      else if (valA < valB) comparison = -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [products, sortKey, sortDirection]);

  const validateForm = () => {
      const errors = { name: '', price: '', imageUrl: '' };
      let isValid = true;
      if (!name) { errors.name = 'Product name is required.'; isValid = false; }
      if (!price) { errors.price = 'Price is required.'; isValid = false; }
      else if (!/^\$\d+(\.\d{1,2})?$/.test(price)) { errors.price = 'Please enter a valid price (e.g., $150 or $150.99).'; isValid = false; }
      if (!imageUrl) { errors.imageUrl = 'Image URL is required.'; isValid = false; }
      else if (!/^https?:\/\/.+/.test(imageUrl)) { errors.imageUrl = 'Please enter a valid URL.'; isValid = false; }
      setFormErrors(errors);
      return isValid;
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData = { name, price, imageUrl };
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...productData });
    } else {
      addProduct(productData);
    }
    hideForm();
  };
  
  const showCreateForm = () => {
    setEditingProduct(null);
    setName('');
    setPrice('$');
    setImageUrl('');
    setFormErrors({ name: '', price: '', imageUrl: '' });
    setFormVisible(true);
  };
  
  const showEditForm = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setImageUrl(product.imageUrl);
    setFormErrors({ name: '', price: '', imageUrl: '' });
    setFormVisible(true);
  };
  
  const hideForm = () => {
    setFormVisible(false);
  };

  const deleteProduct = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductFromState(productId);
    }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-full p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter">Admin Dashboard</h1>
          <button onClick={showCreateForm} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors">
            Add New Product
          </button>
        </div>

        {isFormVisible && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
              <form onSubmit={handleFormSubmit}>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300">Product Name</label>
                      <input value={name} onChange={e => setName(e.target.value)} id="name" type="text" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white" />
                      {formErrors.name && <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price</label>
                      <input value={price} onChange={e => setPrice(e.target.value)} id="price" type="text" placeholder="$150.00" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white" />
                      {formErrors.price && <p className="mt-1 text-xs text-red-400">{formErrors.price}</p>}
                    </div>
                    <div>
                      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300">Image URL</label>
                      <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} id="imageUrl" type="url" placeholder="https://" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white" />
                      {formErrors.imageUrl && <p className="mt-1 text-xs text-red-400">{formErrors.imageUrl}</p>}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 px-6 py-4 flex justify-end space-x-4">
                  <button type="button" onClick={hideForm} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('name')}>
                    Name <span className={sortKey !== 'name' ? 'opacity-50' : ''}>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  </th>
                  <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('price')}>
                    Price <span className={sortKey !== 'price' ? 'opacity-50' : ''}>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  </th>
                  <th scope="col" className="px-6 py-3">Image</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map(product => (
                  <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                    <td className="px-6 py-4">{product.price}</td>
                    <td className="px-6 py-4">
                      <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="w-16 h-16 object-cover rounded-md" />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => showEditForm(product)} className="font-medium text-blue-400 hover:text-blue-300">Edit</button>
                      <button onClick={() => deleteProduct(product.id)} className="font-medium text-red-500 hover:text-red-400">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <p className="text-center py-8 text-gray-400">No products found. Add one to get started.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
