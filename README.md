# PharmaFlow

PharmaFlow is a modern pharmacy supply platform that connects pharmacists, suppliers, and administrators in one scalable web application. It streamlines supplier discovery, catalog sharing, offer management, subscriptions, approvals, and role-based dashboards through a clean full-stack architecture.

## Features

- Role-based authentication for admins, pharmacists, and suppliers
- Admin approval workflow for newly registered users
- Supplier dashboard for profile, listings, offers, and subscriptions
- Pharmacist dashboard for supplier discovery, catalog search, and ratings
- Product listing and PDF catalog management
- Notification and subscription management
- JWT authentication with refresh tokens
- PostgreSQL database with Prisma ORM
- Dockerized local development environment

## Tech Stack

### Frontend
- Next.js App Router
- TypeScript
- Tailwind CSS
- TanStack Query

### Backend
- NestJS
- REST API
- Prisma ORM
- class-validator

### Database
- PostgreSQL

### DevOps
- Docker
- Docker Compose

## Project Structure

```bash
PharmaFlow/
├── frontend/        # Next.js application
├── backend/         # NestJS API
├── docker-compose.yml
└── README.md
Getting Started
1. Clone the repository
git clone https://github.com/your-username/PharmaFlow.git
cd PharmaFlow
2. Configure environment variables
Create the following files:

backend/.env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=pharma_db

DATABASE_URL=postgresql://postgres:your_password@localhost:5432/pharma_db?schema=public

FRONTEND_URL=http://localhost:3000

JWT_SECRET=change-me
JWT_ACCESS_TTL=15m
JWT_REFRESH_SECRET=change-refresh-me
JWT_REFRESH_TTL=7d

UPLOAD_DIR=uploads
frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
Run with Docker
docker-compose up --build
Application URLs:

Frontend: http://localhost:3000
Backend API: http://localhost:3001/api/v1
Run Locally
Backend
cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run start:dev
Frontend
cd frontend
npm install
npm run dev
Default Admin Account
After running the seed:

Email: admin@pharma.local
Password: admin123
Main Modules
Admin
Manage users
Approve or reject accounts
Manage subscriptions and payments
Review platform activity
Supplier
Manage company profile
Upload product listings
Publish promotional offers
Track subscription status
Pharmacist
Browse suppliers
Search catalog listings
View supplier profiles
Submit ratings and reviews
API Overview
Example endpoints:

POST   /api/v1/auth/login
POST   /api/v1/auth/register
GET    /api/v1/admin/users
GET    /api/v1/pharmacists/suppliers
POST   /api/v1/pharmacists/ratings
GET    /api/v1/supplier/dashboard
POST   /api/v1/supplier/listings
POST   /api/v1/supplier/offers
Security
JWT access tokens
Refresh tokens
Secure cookie-based auth flow
Role-based route protection
DTO validation with class-validator
Development Notes
Prisma schema lives in backend/prisma/schema.prisma
Uploaded files are stored in backend/uploads
Frontend communicates with backend through REST APIs
The app is structured for modular growth and production deployment
