'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabaseClient';

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  clientcategory: string;
  businessname: string;
  startdate: string;
  enddate: string;
  fee: number;
  paymentstatus: string;
  clientstatus: string;
};

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // purely for UI messaging
  const [authStatus, setAuthStatus] = useState<
    'unknown' | 'logged_in' | 'logged_out'
  >('unknown');

  useEffect(() => {
    let isMounted = true;

    const fetchClients = async (accessToken?: string) => {
      try {
        setError('');

        const headers: Record<string, string> = {};
        if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
          headers,
        });

        if (!res.ok) {
          // Don’t redirect. Just show error.
          throw new Error(`Failed to fetch clients (${res.status})`);
        }

        const data = await res.json();
        if (isMounted) setClients(data);
      } catch (err) {
        console.error(err);
        if (isMounted) setError('Failed to load clients');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const run = async () => {
      setLoading(true);

      // Listen for auth changes (no redirects, just update UI + optionally refetch)
      const { data: sub } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (!isMounted) return;

          if (session?.access_token) {
            setAuthStatus('logged_in');
            // optional: refetch clients on login
            await fetchClients(session.access_token);
          } else {
            setAuthStatus('logged_out');
            // optional: clear sensitive data on logout
            setClients([]);
          }
        }
      );

      // Initial load
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token) {
        if (isMounted) setAuthStatus('logged_in');
        await fetchClients(session.access_token);
      } else {
        if (isMounted) setAuthStatus('logged_out');
        // Still attempt fetch without token if you want “public/loose” behavior:
        await fetchClients(undefined);
      }

      return () => sub.subscription.unsubscribe();
    };

    const cleanupPromise = run();

    return () => {
      isMounted = false;
      cleanupPromise?.then((cleanup) => cleanup?.());
    };
  }, []);


  const exportToExcel = () => {
    const formattedData = clients.map((client) => ({
      Name: client.name,
      Email: client.email,
      Phone: client.phone,
      Business: client.businessname,
      Category: client.clientcategory,
      Fee: client.fee,
      Status: client.clientstatus,
      Payment: client.paymentstatus,
      StartDate: client.startdate
        ? new Date(client.startdate).toLocaleDateString()
        : '',
      EndDate: client.enddate
        ? new Date(client.enddate).toLocaleDateString()
        : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');

    XLSX.writeFile(workbook, 'ClientFlow_Clients.xlsx');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Clients</h1>

        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export as Excel
        </button>
      </div>

      {loading && <p>Loading clients...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && clients.length === 0 && (
        <p className="text-gray-500">No clients found.</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Business</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Fee</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Payment</th>
              <th className="border p-2">Start - End</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="border p-2">{client.name}</td>
                <td className="border p-2">{client.email}</td>
                <td className="border p-2">{client.phone}</td>
                <td className="border p-2">{client.businessname}</td>
                <td className="border p-2">{client.clientcategory}</td>
                <td className="border p-2">${client.fee}</td>
                <td className="border p-2">{client.clientstatus}</td>
                <td className="border p-2">{client.paymentstatus}</td>
                <td className="border p-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



