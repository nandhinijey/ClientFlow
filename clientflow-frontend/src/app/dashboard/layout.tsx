// src/app/dashboard/layout.tsx

import { ReactNode } from 'react';
import Link from 'next/link';
import PrivateRoute from '@/app/components/PrivateRoute';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
     <PrivateRoute>
        <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-6 space-y-6">
          <h2 className="text-2xl font-bold">
            <Link href="/dashboard/" className="hover:underline"> 
              ClientFlow
            </Link></h2>
          <nav className="flex flex-col space-y-4">
            <Link href="/dashboard/search" className="hover:underline">
              Search Clients
            </Link>
            <Link href="/dashboard/form" className="hover:underline">
              Add New Client
            </Link>
            <Link href="/" className="hover:underline">
              Logout
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
          {children}
        </main>
      </div>
     </PrivateRoute>
    
  );
}

