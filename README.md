# AutoServe

A Smart Vehicle Maintenance & Service Management System that connects customers, mechanics, service center managers, and administrators on a single platform.

🔗 **Live Demo**: https://auto-serve-three.vercel.app

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | customer1@autoserve.demo | Demo@1234 |
| Manager | manager@autoserve.demo | Demo@1234 |
| Mechanic | mechanic1@autoserve.demo | Demo@1234 |
| Admin | admin@autoserve.demo | Demo@1234 |

## Features

- Role-based authentication (customer, mechanic, manager, admin)
- Multi-service booking with live price calculation
- Real-time job progress tracking with WebSockets
- Digital job cards with task management
- Inventory tracking with low stock alerts
- Invoice generation, payment flow and PDF download
- Email-based forgot/reset password
- Admin analytics dashboard

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL (Neon) |
| Auth | JWT, bcrypt |
| Real-time | Socket.io |
| Email | Brevo API |
| Deployment | Vercel (frontend), Railway (backend) |

## System Workflow

1. Manager registers and creates a Service Center
2. Mechanics register and request to join a Service Center
3. Manager approves mechanics
4. Customer adds a vehicle and books a service
5. Manager approves booking and assigns a mechanic
6. Mechanic works through job card tasks
7. Manager generates invoice on completion
8. Customer pays invoice and downloads PDF

## Getting Started (Local)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Setup

1. Clone the repo
```bash
git clone https://github.com/sauravpunjabi/AutoServe.git
cd AutoServe
```

2. Backend setup
```bash
cd server
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

3. Database setup
```bash
psql -U postgres -f server/db/database.sql
```

4. Frontend setup
```bash
cd client
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

Backend runs at `http://localhost:5000`  
Frontend runs at `http://localhost:5173`

## Environment Variables

See `server/.env.example` and `client/.env.example` for required variables.



## License

MIT
