# PharmaFlow

[![CI](https://github.com/imenei/PharmaFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/imenei/PharmaFlow/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![NestJS](https://img.shields.io/badge/NestJS-11-EA2845)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

> A modern pharmacy supplier management platform connecting pharmacists, suppliers, and administrators in a unified digital ecosystem — with role-based workflows, catalog management, offer publishing, and operational dashboards.

---

## Features

- Role-based authentication for admins, pharmacists, and suppliers
- Admin approval workflow for new user registrations
- Supplier dashboard: profile, listings, offers, and subscriptions
- Pharmacist dashboard: browse, search, and rate suppliers
- Product catalog and PDF listing management
- Notification and subscription handling
- JWT authentication with refresh tokens
- PostgreSQL + Prisma ORM + Dockerized dev setup

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js App Router, TypeScript, Tailwind CSS, TanStack Query |
| **Backend** | NestJS, REST API, Prisma ORM, class-validator |
| **Database** | PostgreSQL |
| **DevOps** | Docker, Docker Compose |

---

## Project Structure
```bash
PharmaFlow/
├── frontend/          # Next.js application
├── backend/           # NestJS API
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/imenei/PharmaFlow.git
cd PharmaFlow
```

### 2. Configure environment variables

**`backend/.env`**
```env
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
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run the application

**Option A — Docker (recommended)**
```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api/v1 |

**Option B — Local dev**
```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

### Default Admin Account

> After seeding the database:
> - **Email:** `admin@pharma.local`
> - **Password:** `admin123`

---

## Core Modules

### Admin
- Manage users
- Approve or reject accounts
- Manage subscriptions and payments
- Monitor platform activity

### Supplier
- Manage company profile
- Upload product listings
- Publish promotional offers
- Track subscription status

### Pharmacist
- Browse suppliers
- Search supplier catalogs
- View supplier profiles
- Submit ratings and reviews

---

## API Endpoints

| Method | Endpoint |
|--------|----------|
| `POST` | `/api/v1/auth/login` |
| `POST` | `/api/v1/auth/register` |
| `POST` | `/api/v1/auth/refresh` |
| `GET` | `/api/v1/admin/users` |
| `GET` | `/api/v1/pharmacists/suppliers` |
| `POST` | `/api/v1/pharmacists/ratings` |
| `GET` | `/api/v1/supplier/dashboard` |
| `POST` | `/api/v1/supplier/listings` |
| `POST` | `/api/v1/supplier/offers` |

---

## Security

- JWT access tokens + refresh tokens
- Cookie-based authentication flow
- Role-based route protection
- DTO validation using `class-validator`

---

## Development Notes

- Prisma schema → `backend/prisma/schema.prisma`
- Uploaded files → `backend/uploads/`
- Frontend communicates with backend exclusively via REST API
- Project is structured for scalability and deployment readiness
