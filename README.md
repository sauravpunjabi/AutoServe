# AutoServe

Full-stack Vehicle Maintenance and Service Management System.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Auth**: JWT, bcrypt

## Prerequisites
- Node.js installed
- PostgreSQL installed and running
- Database configured (see `server/.env`)

## Getting Started

### 1. Database Setup
Ensure PostgreSQL is running. The initialization script should have created the `autoserve` database and `users` table.
If not, run:
```bash
cd server
node scripts/initDb.js
```

### 2. Start the Backend
Runs on `http://localhost:5000`
```bash
cd server
npm run dev
```

### 3. Start the Frontend
Runs on `http://localhost:5173`
```bash
cd client
npm run dev
```

## Default Roles
The system supports: `customer`, `mechanic`, `manager`, `admin`.
Select the role when registering.
