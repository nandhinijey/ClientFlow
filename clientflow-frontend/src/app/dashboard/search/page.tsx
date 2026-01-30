'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { requireAuth } from '../../lib/requireAuth';


type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  clientcategory: string;   // matches DB column "clientcategory"
  businessname: string;
  startdate: string;
  enddate: string;
  fee: number;
  paymentstatus: string;
  clientstatus: string;
};

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const session = await requireAuth();
      if (!session) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/clients', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch clients');

        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [router]);

  const filteredClients = clients.filter((client) => {
    const query = search.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone.toLowerCase().includes(query) ||
      client.id.toString().includes(query)
    );
  });

  const handleEdit = (id: number) => {
    router.push(`/dashboard/clients/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this client?');
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/clients/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete client');

      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting client. Please try again.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Client List</h1>

      <input
        type="text"
        placeholder="Search by Name / Email / Phone"
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
            <p>Business: {client.businessname}</p>
            <p>Category: {client.clientcategory}</p>
            <p>Fee: ${client.fee}</p>
            <p>Client Status: {client.clientstatus}</p>
            <p>Payment Status: {client.paymentstatus}</p>
            <p className="text-sm text-gray-500">
              {new Date(client.startdate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}{' '}
              →{' '}
              {client.enddate
                ? new Date(client.enddate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A'}
            </p>

            {/* Action buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleEdit(client.id)}
                className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(client.id)}
                className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
