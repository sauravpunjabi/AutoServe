# AutoServe

Smart Vehicle Maintenance and Service Management System.

Full-stack web application for managing vehicle service bookings, job cards, inventory, and invoicing across multiple service centers.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Auth**: JWT, bcrypt

## Roles

| Role | Access |
|------|--------|
| Customer | Book services, track jobs, view invoices |
| Mechanic | View and update assigned job cards |
| Manager | Run a service center — bookings, job cards, inventory, invoices |
| Admin | System-wide analytics, user management |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Setup

1. Clone the repo
2. `cp server/.env.example server/.env` and fill in your values
3. `cp client/.env.example client/.env` (optional — defaults to `http://localhost:5000/api`)
4. `psql -U postgres -f server/db/database.sql` or `cd server && node scripts/initDb.js`
5. `cd server && npm install && npm run dev`
6. `cd client && npm install && npm run dev`

Backend: `http://localhost:5000` · Frontend: `http://localhost:5173`

## Environment Variables

See `server/.env.example` and `client/.env.example`.

**Never commit `.env` files** — they are listed in `.gitignore`.
