'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/app/components/PrivateRoute';
import { supabase } from '../../lib/supabaseClient';


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
    hourssigned: '',
    hoursused: '',
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
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    address: formData.address || null,
    clientCategory: formData.clientcategory,        
    businessName: formData.businessname || null,    
    startDate: formData.startdate || null,                  
    endDate: formData.enddate || null,    
    fee: Number(formData.fee),
    paymentStatus: formData.paymentstatus || null,  
    clientStatus: formData.clientstatus || null,    
    hourssigned: formData.hourssigned
      ? Number(formData.hourssigned)
      : null,
    hoursused: formData.hoursused
      ? Number(formData.hoursused)
      : null,
  };

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/login');
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
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
      hourssigned: '',
      hoursused: '',
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
          { label: 'Business Name', name: 'businessname', required: false },
          { label: 'Start Date', name: 'startdate', type: 'date', required: true },
          { label: 'End Date', name: 'enddate', type: 'date', required: false },
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
            name="clientcategory"
            id="clientcategory"
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
            name="paymentstatus"
            id="paymentstatus"
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
            name="clientstatus"
            id="clientstatus"
            value={formData.clientstatus}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Select Client Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="hourssigned" className="text-sm font-medium mb-1">
            Consulting Hours Signed
          </label>
          <input
            type="number"
            id="hourssigned"
            name="hourssigned"
            value={formData.hourssigned}
            onChange={handleChange}
            placeholder="Hours Signed"
            className="p-2 border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="hoursused" className="text-sm font-medium mb-1">
            Consulting Hours Used
          </label>
          <input
            type="number"
            id="hoursused"
            name="hoursused"
            value={formData.hoursused}
            onChange={handleChange}
            placeholder="Hours Used"
            className="p-2 border rounded"
          />
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
