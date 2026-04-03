# PharmaFlow

[![CI](https://github.com/imenei/PharmaFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/imenei/PharmaFlow/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![NestJS](https://img.shields.io/badge/NestJS-11-EA2845)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

PharmaFlow is a modern pharmacy supplier management platform designed to connect pharmacists, suppliers, and administrators in a unified digital ecosystem. It provides role-based workflows for supplier discovery, catalog management, offer publishing, subscriptions, approvals, and operational dashboards.

## Features

- Role-based authentication for admins, pharmacists, and suppliers
- Admin approval workflow for new user registrations
- Supplier dashboard for managing profile, listings, offers, and subscriptions
- Pharmacist dashboard for browsing suppliers, searching listings, and rating suppliers
- Product catalog and PDF listing management
- Notification and subscription handling
- JWT authentication with refresh tokens
- PostgreSQL database integration with Prisma ORM
- Dockerized local development setup

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
After seeding the database:

Email: admin@pharma.local
Password: admin123
Core Modules
Admin
Manage users
Approve or reject accounts
Manage subscriptions and payments
Monitor platform activity
Supplier
Manage company profile
Upload product listings
Publish promotional offers
Track subscription status
Pharmacist
Browse suppliers
Search supplier catalogs
View supplier profiles
Submit ratings and reviews

## Security
JWT access tokens
Refresh tokens
Cookie-based authentication flow
Role-based route protection
DTO validation using class-validator
Development Notes
Prisma schema is located in backend/prisma/schema.prisma
Uploaded files are stored in backend/uploads
Frontend communicates with backend through REST APIs
The project is structured for scalability and deployment readiness



