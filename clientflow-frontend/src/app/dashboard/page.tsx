'use client';

import { useEffect, useState } from 'react';
import PrivateRoute from '@/app/components/PrivateRoute';

import Link from 'next/link';


type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  clientCategory: string;
  businessName: string;
  startDate: string;
  endDate: string;
  fee: number;
  paymentStatus: string;
  clientStatus: string;
};

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/clients')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch clients');
        return res.json();
      })
      .then((data) => setClients(data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load clients');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredClients = clients.filter((client) => {
    const query = search.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone.toLowerCase().includes(query) ||
      client.id.toString().includes(query)
    );
  });

  return (
    <PrivateRoute>
      <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
    <h1 className="text-3xl font-bold">Client List</h1>

    <Link href="/dashboard/form">
    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Create New Client
    </button>
    </Link>
    </div>


        <input
          type="text"
          placeholder="Search by name, email, phone, or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />

        {loading && <p>Loading clients...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && filteredClients.length === 0 && (
          <p className="text-gray-500">No matching clients found.</p>
        )}

        <div className="grid gap-4">
          {filteredClients.map((client) => (
            <div key={client.id} className="p-4 border rounded shadow bg-white">
              <h2 className="text-xl font-semibold">{client.name}</h2>
              <p>Email: {client.email}</p>
              <p>Phone: {client.phone}</p>
              <p>Business: {client.businessName}</p>
              <p>Category: {client.clientCategory}</p>
              <p>Fee: ${client.fee}</p>
              <p>Client Status: {client.clientStatus}</p>
              <p>Payment Status: {client.paymentStatus}</p>
              <p className="text-sm text-gray-500">
                {client.startDate} → {client.endDate}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PrivateRoute>
  );
}
