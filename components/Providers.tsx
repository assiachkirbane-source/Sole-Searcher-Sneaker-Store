'use client';

import React, { ReactNode } from 'react';
import { AuthProvider, ProductProvider, CartProvider } from '@/lib/state';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>{children}</CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
