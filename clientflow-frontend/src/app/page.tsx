'use client';

import { useEffect, useState } from 'react';

type Client = {
  id: number;
  name: string;
  email: string;
  clientCategory: string;
};

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/clients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error('Failed to fetch clients:', err));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Client List</h1>
      {clients.map(client => (
        <div key={client.id} className="border p-4 rounded shadow mb-3">
          <h2 className="text-xl font-semibold">{client.name}</h2>
          <p>Email: {client.email}</p>
          <p>Category: {client.clientCategory}</p>
        </div>
      ))}
    </main>
  );
}
