'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/state';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdminDashboard } from '@/components/AdminDashboard';

function AdminPageClient() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth state is loaded and user is not an admin, redirect
    if (currentUser === null || (currentUser && currentUser.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [currentUser, router]);

  // Render a loading state or null while checking auth
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
       <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <AdminDashboard />;
}


export default function AdminPage() {
    return (
     <div className="min-h-screen flex flex-col bg-gray-900">
        <Header />
        <main className="flex-grow">
            <AdminPageClient />
        </main>
        <Footer />
    </div>
    )
}
