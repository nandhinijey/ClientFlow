'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';

type ClientApi = {
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

// Form shape uses the camelCase your backend expects in req.body
type ClientForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
  clientcategory: string;
  businessname: string;
  startdate: string;
  enddate: string;
  fee: string;           // keep as string for input, convert to number on submit
  paymentstatus: string;
  clientstatus: string;
};

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<ClientForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load existing client
  useEffect(() => {
    if (!id) return;

    const fetchClient = async () => {
      try {
        const res = await fetch(`http://localhost:3000/clients/${id}`);
        if (!res.ok) throw new Error('Failed to fetch client');
        const data: ClientApi = await res.json();

        setForm({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          clientcategory: data.clientcategory,
          businessname: data.businessname,
          startdate: data.startdate?.slice(0, 10) || '',
          enddate: data.enddate ? data.enddate.slice(0, 10) : '',
          fee: String(data.fee ?? ''),
          paymentstatus: data.paymentstatus,
          clientstatus: data.clientstatus,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load client');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;

    try {
      const res = await fetch(`http://localhost:3000/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fee: Number(form.fee || 0),
        }),
      });

      if (!res.ok) throw new Error('Failed to update client');

      // go back to search page
      router.push('/dashboard/search');
    } catch (err) {
      console.error(err);
      setError('Failed to update client. Please try again.');
    }
  };

  if (loading) return <p>Loading client...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!form) return <p>Client not found.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Client</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 border rounded"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-2 border rounded"
        />
        <input
          name="clientCategory"
          value={form.clientcategory}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-2 border rounded"
        />
        <input
          name="businessName"
          value={form.businessname}
          onChange={handleChange}
          placeholder="Business Name"
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startdate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.enddate ?? ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <input
          name="fee"
          value={form.fee}
          onChange={handleChange}
          placeholder="Fee"
          className="w-full p-2 border rounded"
        />
        <input
          name="paymentStatus"
          value={form.paymentstatus}
          onChange={handleChange}
          placeholder="Payment Status"
          className="w-full p-2 border rounded"
        />
        <input
          name="clientStatus"
          value={form.clientstatus}
          onChange={handleChange}
          placeholder="Client Status"
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/search')}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
