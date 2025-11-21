'use client';

import React from 'react';
import Image from 'next/image';
import { useProducts, useCart } from '@/lib/state';

export function ProductGrid() {
  const { products } = useProducts();
  const { addItem } = useCart();

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-black text-center uppercase tracking-tighter">New Arrivals</h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {products.map(product => (
            <div key={product.id} className="group relative flex flex-col">
              <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
                <Image 
                    src={product.imageUrl} 
                    alt={product.name} 
                    width={600}
                    height={800}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex-grow flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-md font-medium text-gray-700">{product.price}</p>
                </div>
                <button onClick={() => addItem(product)} className="mt-4 w-full bg-gray-800 text-white py-3 px-6 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
