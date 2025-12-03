'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/app/components/PrivateRoute';

export default function NewClientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    clientcategory: '',
    businessname: '',
    startdate: '',
    enddate: '',
    fee: '',
    paymentstatus: '',
    clientstatus: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setSuccess(false);

  // Replace empty strings with null for optional fields
  const sanitizedData = {
    ...formData,
    address: formData.address || null,
    businessName: formData.businessname || null,
    endDate: formData.enddate || null,
    paymentStatus: formData.paymentstatus || null,
    clientStatus: formData.clientstatus || null,
  };

  try {
    const res = await fetch('http://localhost:3000/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedData),
    });

    if (!res.ok) throw new Error('Failed to create client');

    setSuccess(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      clientcategory: '',
      businessname: '',
      startdate: '',
      enddate: '',
      fee: '',
      paymentstatus: '',
      clientstatus: '',
    });

    setTimeout(() => router.push('/dashboard'), 1500);
  } catch (err) {
    setError('Something went wrong');
    console.error(err);
  }
};


  return (
    <PrivateRoute>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Create New Client</h1>
  
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">Client created successfully!</p>}
  
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {[
          { label: 'Name', name: 'name', required: true },
          { label: 'Email', name: 'email', required: true },
          { label: 'Phone', name: 'phone', required: true },
          { label: 'Address', name: 'address', required: false },
          { label: 'Business Name', name: 'businessName', required: false },
          { label: 'Start Date', name: 'startDate', type: 'date', required: true },
          { label: 'End Date', name: 'endDate', type: 'date', required: false },
          { label: 'Fee', name: 'fee', type: 'number', required: true },
        ].map(({ label, name, type = 'text', required }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-sm font-medium mb-1">
              {label}
            </label>
            <input
              type={type}
              id={name}
              name={name}
              placeholder={label}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              required={required}
              className="p-2 border rounded"
            />
          </div>
        ))}

        <div className="flex flex-col">
          <label htmlFor="clientCategory" className="text-sm font-medium mb-1">
            Client Category
          </label>
          <select
            name="clientCategory"
            id="clientCategory"
            value={formData.clientcategory}
            onChange={handleChange}
            required
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
          <label htmlFor="paymentStatus" className="text-sm font-medium mb-1">
            Payment Status
          </label>
          <select
            name="paymentStatus"
            id="paymentStatus"
            value={formData.paymentstatus}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Select Payment Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="clientStatus" className="text-sm font-medium mb-1">
            Client Status
          </label>
          <select
            name="clientStatus"
            id="clientStatus"
            value={formData.clientstatus}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Select Client Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Create Client
        </button>
      </form> 
      </div>
    </PrivateRoute>
  );
  
}
