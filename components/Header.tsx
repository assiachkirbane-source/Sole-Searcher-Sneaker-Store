'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/state';
import { useCart } from '@/lib/state';
import { AuthModal } from './AuthModal';
import { CartModal } from './CartModal';
import { Package, ShoppingBag, Footprints } from 'lucide-react';

export function Header() {
  const { currentUser, logout } = useAuth();
  const { cartCount } = useCart();
  const [isAuthModalVisible, setAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isCartVisible, setCartVisible] = useState(false);

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalVisible(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <Footprints className="h-8 w-8 text-black" />
              <span className="font-black text-2xl tracking-tight">SOLE</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">New Arrivals</Link>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">Men</a>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">Women</a>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">Collections</a>
              {currentUser?.role === 'ADMIN' && (
                <Link href="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Admin</Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 hidden sm:inline">Welcome, {currentUser.email}</span>
                  <button onClick={logout} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">Logout</button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button onClick={() => openAuthModal('login')} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors">Login</button>
                  <button onClick={() => openAuthModal('register')} className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors">Sign Up</button>
                </div>
              )}
              <div className="h-6 border-l border-gray-300"></div>
              <button onClick={() => setCartVisible(true)} type="button" className="relative p-2 text-gray-600 hover:text-black transition-colors">
                <span className="sr-only">Open cart</span>
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-black text-white text-xs text-center leading-4 font-bold">{cartCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <AuthModal
        isVisible={isAuthModalVisible}
        initialMode={authMode}
        onClose={() => setAuthModalVisible(false)}
      />
      <CartModal
        isVisible={isCartVisible}
        onClose={() => setCartVisible(false)}
      />
    </>
  );
}
