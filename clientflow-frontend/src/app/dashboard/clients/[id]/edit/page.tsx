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
  hourssigned: number | null;
  hoursused: number | null;
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
  hourssigned: string;
  hoursused: string;
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
          address: data.address ?? '',
          clientcategory: data.clientcategory ?? '',
          businessname: data.businessname ?? '',
          startdate: data.startdate?.slice(0, 10) || '',
          enddate: data.enddate ? data.enddate.slice(0, 10) : '',
          fee: String(data.fee ?? ''),
          paymentstatus: data.paymentstatus ?? '',
          clientstatus: data.clientstatus ?? '',
          hourssigned: data.hourssigned != null ? String(data.hourssigned) : '',
          hoursused: data.hoursused != null ? String(data.hoursused) : '',
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
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address || null,
        clientCategory: form.clientcategory,
        businessName: form.businessname || null,
        startDate: form.startdate || null,           
        endDate: form.enddate || null,
        fee: Number(form.fee || 0),
        paymentStatus: form.paymentstatus || null,
        clientStatus: form.clientstatus || null,
        hourssigned: form.hourssigned ? Number(form.hourssigned) : null,
        hoursused: form.hoursused ? Number(form.hoursused) : null,
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

        <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Name</label>
            <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            />
        </div>

        <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Email</label>
            <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            />
        </div>

        <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Phone</label>
            <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            />
        </div>

        <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Address</label>
            <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            />
        </div>

        <div className="flex flex-col">
            <label htmlFor="clientcategory" className="text-sm font-medium mb-1">
                Client Category
            </label>
            <select
                name="clientcategory"
                id="clientcategory"
                value={form.clientcategory || ''}
                onChange={handleChange}
                className="p-2 border rounded"
            >
                <option value="">Select Client Category</option>
                <option value="Personal">Personal</option>
                <option value="Business">Business</option>
                <option value="Tax filing">Tax filing</option>
                <option value="Bookkeeping">Bookkeeping</option>
                <option value="Consulting">Consulting</option>
            </select>
        </div>

        <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Business Name</label>
            <input
            name="businessname"
            value={form.businessname}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            />
        </div>

        <div className="flex gap-2">
            <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium mb-1">Start Date</label>
            <input
                type="date"
                name="startdate"
                value={form.startdate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />
            </div>

            <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium mb-1">End Date</label>
            <input
                type="date"
                name="enddate"
                value={form.enddate ?? ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />
            </div>
        </div>

        <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Fee</label>
            <input
            name="fee"
            value={form.fee}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            />
        </div>

        <div className="flex flex-col">
            <label htmlFor="paymentstatus" className="text-sm font-medium mb-1">
                Payment Status
            </label>
            <select
                name="paymentstatus"
                id="paymentstatus"
                value={form.paymentstatus || ''}
                onChange={handleChange}
                className="p-2 border rounded"
            >
                <option value="">Select Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
            </select>
        </div>


        <div className="flex flex-col">
            <label htmlFor="clientstatus" className="text-sm font-medium mb-1">
                Client Status
            </label>
            <select
                name="clientstatus"
                id="clientstatus"
                value={form.clientstatus || ''}
                onChange={handleChange}
                className="p-2 border rounded"
            >
                <option value="">Select Client Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
        </div>


        <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Consulting Hours Signed</label>
            <input
                type="number"
                name="hourssigned"
                value={form.hourssigned}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />
        </div>

        <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Consulting Hours Used</label>
            <input
                type="number"
                name="hoursused"
                value={form.hoursused}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />
        </div>

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
