# Pharma Platform Rebuild

Reconstruction du projet `pharma.client-main` en architecture separee:

- `frontend/`: Next.js App Router + TypeScript + Tailwind + React Query
- `backend/`: NestJS modulaire + Prisma + PostgreSQL
- `docker-compose.yml`: frontend + backend + database
- `backend/uploads/`: stockage local des documents et medias

## Ce que le ZIP legacy contient

Fonctionnalites identifiees dans le projet d'origine:

- landing page marketing avec mise en avant des fournisseurs premium
- authentification et inscription par role
- workflow d'approbation admin pour pharmaciens et fournisseurs
- dashboards admin, pharmacien et fournisseur
- recherche de listings PDF et consultation fournisseurs
- gestion d'offres, notifications, abonnements, paiements
- notation des fournisseurs
- upload et extraction de catalogues PDF

## Problemes de performance trouves dans le legacy

- frontend et backend melanges dans un seul projet Next.js
- nombreux appels client-side `fetch` et Supabase declenches au montage
- middleware qui interroge Supabase a chaque navigation protegee
- duplication des requetes pour les memes donnees
- pages lourdes entierement en client components
- absence de pagination et d'indexation claire sur les recherches metier
- acces direct aux tables depuis le frontend, ce qui rend la logique difficile a optimiser

## Ameliorations dans cette version

- separation nette frontend/backend/database
- auth JWT avec refresh token et cookies
- Prisma avec schema relationnel et indexes de base
- modules NestJS pour `auth`, `users`, `pharmacists`, `supplier`, `products`, `orders`, `admin`
- React Query pour limiter les requetes repetitives et mettre en cache le client
- middleware Next.js base sur cookies pour proteger les routes sans toucher la base
- Docker Compose pour demarrage local unifie

## Lancer avec Docker

```bash
docker-compose up --build
```

Applications:

- frontend: `http://localhost:3000`
- backend: `http://localhost:3001/api/v1`
- postgres: `localhost:5432`

Compte admin seed:

- email: `admin@pharma.local`
- password: `admin123`

## Lancer sans Docker

### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run start:dev
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Notes d'architecture

- Les donnees publiques passent par `PublicModule` et les flux authentifies par modules de role.
- Les ecrans doivent progressivement migrer vers des Server Components quand la lecture seule suffit.
- Les operations interactives restent cote client avec React Query pour mutations, retries et invalidation.
- Les gros resultats metier doivent etre pagines avant mise en production a grand volume.
