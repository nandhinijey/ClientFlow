# ClientFlow

ClientFlow is an internal full-stack client management tool designed to help businesses organize, track, and manage client relationships efficiently. Built using modern web technologies, ClientFlow supports client creation, editing, search, and categorization through a clean dashboard UI and a robust backend API.

---

## Features

-  **Real-Time Search**  
  Search and filter clients instantly by name, email, phone number, or client ID — ideal for quick access and lookups.

-  **Client Dashboard**  
  View a snapshot of all active and inactive clients with key data such as fee, category, and status. Designed with a large clientele in mind.

-  **Client Updates & Removals**  
  Administrators can effortlessly update client details or remove outdated records through a robust backend API.

-  **Fee & Payment Tracking**  
  Track project fees and current payment status (`Pending` / `Paid`) at a glance, right from the dashboard.


---

## Tech Stack

| Layer       | Tech                          |
|------------|-------------------------------|
| **Frontend** | Next.js (App Router) + TypeScript |
|             | Tailwind CSS for styling     |
|             | React Hooks (`useState`, `useEffect`) |
| **Backend**  | Express.js + Node.js         |
|             | PostgreSQL via Supabase      |
|             | `pg` module for DB queries    |
| **Other**    | CORS, Dotenv for configs     |
|             | Fetch API for frontend-backend calls |

---



