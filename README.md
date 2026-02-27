# DataPulse Landing Page

A Next.js 14 TypeScript marketing site for the DataPulse SaaS analytics dashboard. Includes hero, features, pricing, email capture, and lightweight API endpoints.

## Features
- Hero section with primary CTA
- Features grid with three cards
- Pricing section with three plans and recommended highlight
- Email capture form with client + server validation
- API endpoints for health checks, features, pricing, subscribe, and contact
- Accessible, responsive UI with Tailwind CSS

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM (SQLite)
- Zod validation
- Jest + Testing Library
- Playwright

## Prerequisites
- Node.js 18+
- npm

## Quick Start
```bash
./install.sh
# or
./install.ps1
```
Then run:
```bash
npm run dev
```

## Environment Variables
Copy `.env.example` to `.env` and update as needed:
- `DATABASE_URL` - Prisma connection string
- `JWT_SECRET` - secret for auth tokens (if needed)
- `NEXT_PUBLIC_API_URL` - base URL for API calls

## Project Structure
```
src/
  app/                # App Router pages + API routes
  components/         # UI and layout components
  lib/                # Utilities and API helpers
  providers/          # Context providers
  types/              # Shared types
prisma/               # Prisma schema
```

## API Endpoints
- `GET /api/health` → `{ status: "ok", timestamp }`
- `GET /api/features` → Feature list
- `GET /api/pricing` → Pricing plans
- `POST /api/subscribe` → `{ email, source }`
- `POST /api/contact` → `{ name, email, message, planId }`

## Available Scripts
- `npm run dev` - start dev server
- `npm run build` - build for production (includes `prisma generate`)
- `npm run start` - start production server
- `npm run lint` - run lint
- `npm run test` - run unit tests
- `npm run test:e2e` - run Playwright tests

## Testing
- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`

## Notes
- Update copy, pricing, and assets in `src/app/page.tsx`.
- Replace placeholder imagery with optimized assets in `public/`.
