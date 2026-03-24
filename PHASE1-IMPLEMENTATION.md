# RenoFitness Phase 1: Foundation Implementation Guide

## Overview
Phase 1 establishes the core infrastructure for the RenoFitness booking platform. This phase takes 1-2 weeks and includes:
- Next.js 14+ project setup with TypeScript (App Router)
- Tailwind CSS + shadcn/ui configuration
- PostgreSQL database setup (Supabase free tier)
- Prisma ORM integration with type-safe database access
- Environment variable management with validation
- Git repository initialization with conventional commits

This is the **foundation phase** for the full-stack modernization plan. See `.github/plans/website-upgrade-plan.md` for the complete roadmap across all 7 phases and architectural decisions.

## Prerequisites
Before starting, ensure you have:
- Node.js 18+ installed (`node --version`)
- npm 9+ installed (`npm --version`)
- GitHub account with Git configured
- Supabase account created (free tier - https://supabase.com)
- Stripe account (free tier - https://stripe.com) - for Phase 4
- Render or Fly.io account (free tier) - for backend hosting in Phase 6

**Note:** Phase 1 focuses on infrastructure only. Booking and payment features come in later phases (Phases 3-4). This phase is 100% free — no costs incurred for database, hosting, or development.

## Step 1: Set Up Next.js Project with TypeScript

### 1.1 Create Next.js Project
```bash
# Create a new Next.js app with recommended settings
npx create-next-app@latest renofitness --typescript --tailwind --app --eslint --src-dir

# Navigate to project
cd renofitness
```

When prompted, select:
- ✅ Use TypeScript: **Yes**
- ✅ Use ESLint: **Yes**
- ✅ Use Tailwind CSS: **Yes**
- ✅ Use `src/` directory: **Yes**
- ✅ App Router: **Yes** (not Pages Router)
- ✅ Turbopack: **Yes** (faster builds in development)
- ✅ Import alias: Use default `@/*`
- ✅ Skip Tailwind config: **No** (let it auto-configure)

### 1.2 Project Structure After Creation
```
renofitness/
├── public/                 # Static assets (images, fonts, etc.)
├── src/
│   ├── app/               # Next.js App Router (SSG/SSR)
│   │   ├── (public)/      # Public-facing routes (home, about, services)
│   │   ├── (auth)/        # Auth routes (login, signup, password reset)
│   │   ├── (dashboard)/   # Member dashboard (protected)
│   │   ├── (admin)/       # Admin panel (protected)
│   │   ├── api/           # Backend API routes
│   │   ├── layout.tsx     # Root layout wrapper
│   │   ├── page.tsx       # Home page
│   │   ├── globals.css    # Global Tailwind styles
│   │   └── favicon.ico
│   ├── components/        # Shared React components
│   │   └── ui/            # shadcn/ui components (added in Step 2)
│   ├── lib/               # Utilities, helpers, database clients
│   └── types/             # TypeScript type definitions
├── prisma/
│   ├── schema.prisma      # Database schema (added in Step 4)
│   └── migrations/        # Database migration history
├── .env.local             # Local environment variables (not committed)
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── package.json
├── package-lock.json
└── README.md
```

**Key Points:**
- `(auth)`, `(dashboard)`, etc. are **route groups** - they don't affect URL paths
- `/src/app/(public)/page.tsx` renders at `/`
- `/src/app/api/bookings/route.ts` renders at `/api/bookings`
- All routes are SSG by default (static generation) for GitHub Pages deployment

### 1.3 Verify Installation
```bash
npm run dev
# Visit http://localhost:3000 to confirm it works
# You should see the Next.js default landing page
# Press Ctrl+C to stop the dev server
```

**Troubleshooting:**
- If you see `Port 3000 already in use`, kill the process: `netstat -ano | findstr :3000` (Windows) or `lsof -i :3000` (Mac/Linux)
- If TypeScript errors appear, run `npm run type-check` to see full list
- If Tailwind styles don't load, clear `.next` folder and rebuild: `rm -r .next && npm run dev`

### 1.4 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "feat(init): bootstrap next.js 14 project with typescript and tailwind

- Initialize Next.js 14+ with App Router
- Configure TypeScript, ESLint, Prettier
- Set up Tailwind CSS for styling
- Ready for Tailwind and shadcn/ui configuration

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Step 2: Configure Tailwind CSS + shadcn/ui

### 2.1 Verify Tailwind Is Installed
Tailwind should already be configured from the create-next-app command, but verify:

Check `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
```

### 2.2 Install shadcn CLI
```bash
npx shadcn@latest init -d

# When prompted, select:
# Style: Default
# Base color: Slate
# CSS variables: Yes (for theming)
```

This creates:
- `src/lib/utils.ts` - CN utility function for class merging
- `src/components/ui/` - Base UI component library (empty until you add components)
- `.prettierrc.json` - Prettier formatting config for components
- `components.json` - shadcn/ui configuration file

### 2.3 Install Common Components
```bash
# Install Button component (needed for all pages)
npx shadcn@latest add button

# Install Card component (common for dashboard)
npx shadcn@latest add card

# Install Form components (needed for auth/booking in later phases)
npx shadcn@latest add form

# Install Input component (forms)
npx shadcn@latest add input

# Install Label component (forms)
npx shadcn@latest add label

# Install Dialog component (modals)
npx shadcn@latest add dialog

# Install Dropdown Menu (navigation)
npx shadcn@latest add dropdown-menu

# Install Navigation Menu (for header)
npx shadcn@latest add navigation-menu

# Install Textarea (contact forms in Phase 2)
npx shadcn@latest add textarea
```

**Note:** Each `add` command imports the component source into `src/components/ui/` so you can customize as needed.

### 2.4 Update globals.css
Tailwind should auto-configure `src/app/globals.css`. Verify it has Tailwind's three layers:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

If missing, add them manually. This enables:
- `@tailwind base` - resets and default styles
- `@tailwind components` - reusable component classes
- `@tailwind utilities` - one-off utility classes (e.g., `flex`, `text-lg`, `mb-4`)

### 2.5 Verify Tailwind + shadcn/ui Works
Test by updating `src/app/page.tsx`:
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="text-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">RenoFitness</CardTitle>
            <CardDescription>Modern fitness booking platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-8">Built with Next.js, React, Tailwind CSS, and shadcn/ui</p>
            <Button size="lg" className="w-full">Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
```

Run `npm run dev` and verify at `http://localhost:3000`:
- ✅ Card component with shadow and border
- ✅ Button with hover effects
- ✅ Tailwind classes applied (colors, spacing, typography)
- ✅ No console errors or TypeScript warnings

### 2.6 Commit Tailwind + shadcn/ui Setup
```bash
git add .
git commit -m "feat(ui): setup tailwind css and shadcn/ui components

- Configure Tailwind CSS with utility-first styling
- Initialize shadcn/ui component library
- Install common UI components (button, card, form, input, dialog, etc.)
- Set up CSS variables for theming

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Step 3: Set Up PostgreSQL Database (Supabase)

### 3.1 Create Supabase Project
1. Go to https://supabase.com and sign in (or create free account)
2. Click **"New Project"** (or **"Create a new project"**)
3. Fill in:
   - **Project Name**: `renofitness-db`
   - **Database Password**: Generate strong password (save it! You'll need it for .env.local)
   - **Region**: Choose closest to your location (affects latency)
   - **Pricing Plan**: **Free** (unlimited for development/testing)
4. Click **"Create new project"** (takes 1-2 minutes to provision)

**Note:** On free tier, Supabase provides:
- 500MB storage (sufficient for ~10k members + bookings)
- 2M API calls/month
- Daily backups
- SSL always enabled
- Real-time subscriptions

### 3.2 Get Connection Details
Once project is created:
1. Go to **Settings** → **Database** (left sidebar)
2. Look for **"Connection string"** or **"Connection pooling"** section
3. Copy the **PostgreSQL URI** (looks like: `postgresql://user:password@host:5432/postgres`)
4. Keep this safe — you'll paste it into `.env.local` next

**Tip:** If you see connection pooling, use that for better performance (Prisma client connects via pooler).

### 3.3 Test Database Connection
Create a `.env.local` file in your project root (same level as `package.json`):
```bash
DATABASE_URL="postgresql://your_user:your_password@your_host:5432/postgres"
```

**Important:**
- Replace `your_user`, `your_password`, `your_host` with values from Supabase
- Do NOT commit `.env.local` to Git (it's in `.gitignore`)
- Never share this connection string — it contains your password!

You'll verify this works in Step 4 when Prisma connects to the database.

### 3.4 Understanding Supabase Free Tier & Upgrade Path
- **Storage**: 500MB (sufficient for initial data)
- **API Calls**: 2M/month (enough for 10k+ daily active users)
- **Real-time**: Included
- **Auto-backup**: Daily backups
- **SSL**: Always enabled

**If you scale beyond free tier limits**, Supabase costs only $10/month for 2GB storage (10x more capacity). Total cost at scale: ~$37/mo (Supabase + Render + Brevo). See `.github/plans/website-upgrade-plan.md` for full cost breakdown.

---

## Step 4: Configure Prisma ORM

### 4.1 Install Prisma
```bash
npm install @prisma/client
npm install -D prisma
```

This adds:
- `@prisma/client` - Runtime library for database access
- `prisma` - CLI tool for migrations and schema management

### 4.2 Initialize Prisma
```bash
npx prisma init

# This creates:
# - prisma/schema.prisma (database schema definition)
# - .env.local (already exists with DATABASE_URL)
```

Prisma is now initialized. The schema file defines all your database tables and relationships.

### 4.3 Configure .env.local
Verify your `.env.local` has the correct `DATABASE_URL` from Supabase:
```bash
DATABASE_URL="postgresql://user:password@host:5432/postgres"
```

**Verify connection works:**
```bash
npx prisma db execute --stdin --file /dev/null
```
(Or just proceed to 4.4 - Prisma will test the connection when you run `migrate dev`)

### 4.4 Create Database Schema

Edit `prisma/schema.prisma`:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Users & Authentication
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  name      String?
  role      Role       @default(MEMBER)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  member    Member?
  bookings  Booking[]

  @@map("users")
}

enum Role {
  MEMBER
  ADMIN
  INSTRUCTOR
}

// Member Profiles
model Member {
  id        String    @id @default(cuid())
  userId    String    @unique
  phone     String?
  joinDate  DateTime  @default(now())
  status    String    @default("active") // active, inactive, suspended
  bio       String?

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  bookings  Booking[]

  @@map("members")
}

// Fitness Classes
model Class {
  id          String     @id @default(cuid())
  name        String
  description String?
  maxCapacity Int        @default(20)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  schedules ClassSchedule[]

  @@map("classes")
}

// Class Schedules
model ClassSchedule {
  id            String    @id @default(cuid())
  classId       String
  date          DateTime
  startTime     DateTime
  endTime       DateTime
  availableSlots Int

  class     Class     @relation(fields: [classId], references: [id], onDelete: Cascade)
  bookings  Booking[]

  @@map("class_schedules")
  @@index([classId])
  @@index([date])
}

// Member Bookings
model Booking {
  id                String    @id @default(cuid())
  memberId          String
  classScheduleId   String
  bookingDate       DateTime  @default(now())
  status            String    @default("confirmed") // confirmed, cancelled, attended
  paymentId         String?

  member          Member          @relation(fields: [memberId], references: [id], onDelete: Cascade)
  classSchedule   ClassSchedule   @relation(fields: [classScheduleId], references: [id], onDelete: Cascade)
  payment         Payment?        @relation(fields: [paymentId], references: [id])

  @@map("bookings")
  @@unique([memberId, classScheduleId])
  @@index([memberId])
  @@index([classScheduleId])
}

// Payments
model Payment {
  id                String    @id @default(cuid())
  amount            Float
  currency          String    @default("USD")
  status            String    @default("pending") // pending, completed, failed, refunded
  stripeId          String?   @unique
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  booking           Booking   @relation(fields: [id], references: [paymentId], onDelete: Cascade)

  @@map("payments")
}
```

**Schema Overview:**
- **User** - Authentication, role-based access (MEMBER, ADMIN, INSTRUCTOR)
- **Member** - Profile info (phone, join date, bio)
- **Class** - Fitness class definitions
- **ClassSchedule** - Specific class instances (date, time, availability)
- **Booking** - Member attendance records
- **Payment** - Stripe transaction tracking

All relationships cascade on delete for data integrity. All models use `@map("table_name")` to ensure consistent PostgreSQL table naming.

### 4.5 Create and Run Migration
```bash
# Create migration from schema changes
npx prisma migrate dev --name init

# When prompted:
# - Enter migration name: "init"
# - Prisma will create the migration and apply it to Supabase
# - Watch for: "✔ Your database is now in sync with your schema"
```

This command:
1. Generates a migration file in `prisma/migrations/`
2. Applies the migration to your Supabase database
3. Creates all tables (users, members, classes, class_schedules, bookings, payments)
4. Sets up all indexes and constraints

### 4.6 Generate Prisma Client
```bash
npx prisma generate
```

This creates the `@prisma/client` code for type-safe database queries. Run this after any schema changes.

### 4.7 View Database (Optional)
```bash
# Open Prisma Studio - a visual database explorer
npx prisma studio

# Opens http://localhost:5555 - browse/edit all tables in real-time
# Close with Ctrl+C
```

Prisma Studio is useful for:
- Verifying tables were created correctly
- Adding test data manually
- Debugging data issues
- Understanding relationships visually

### 4.8 Commit Prisma Setup
```bash
git add .
git commit -m "feat(db): configure prisma orm and initialize database schema

- Initialize Prisma ORM with PostgreSQL
- Create schema with users, members, classes, bookings, payments
- Set up migrations for database initialization
- Add indexes for performance optimization

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Step 5: Set Up Environment Variables

### 5.1 Create Environment Files Structure

Environment variables keep secrets out of code. There are three environments:

**`.env.local`** (for local development - NEVER commit):
```bash
# Database Connection
DATABASE_URL="postgresql://user:password@host:5432/postgres"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# NextAuth.js (Authentication - Phase 3)
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (Payments - Phase 4)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Brevo (Email - Phase 4)
BREVO_API_KEY="your-api-key"

# Google Analytics (Phase 5)
NEXT_PUBLIC_GA_ID="G-..."

# Sentry (Error Tracking - Phase 5)
NEXT_PUBLIC_SENTRY_DSN="https://..."
```

**`.env.production`** (for production deployment):
```bash
# Database Connection (production Supabase instance)
DATABASE_URL="postgresql://prod-user:prod-password@prod-host:5432/postgres"

# App URLs (production domain)
NEXT_PUBLIC_APP_URL="https://www.renofitness.ca"
NEXT_PUBLIC_API_URL="https://api.renofitness.ca"

# NextAuth.js (production credentials)
NEXTAUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://www.renofitness.ca"

# Stripe (production keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."

# Brevo (production credentials)
BREVO_API_KEY="prod-brevo-key"

# Google Analytics (production property)
NEXT_PUBLIC_GA_ID="prod-ga-id"

# Sentry (production error tracking)
NEXT_PUBLIC_SENTRY_DSN="prod-sentry-dsn"
```

**`.env.staging`** (for staging environment - optional):
```bash
# Similar to production but with staging/test credentials
DATABASE_URL="postgresql://staging-user:password@staging-host:5432/postgres"
NEXT_PUBLIC_APP_URL="https://staging.renofitness.ca"
NEXTAUTH_SECRET="staging-secret"
# ... rest of keys use staging/test values
```

### 5.2 Update .env.local
1. Create a `.env.local` file in your project root (same level as `package.json`)
2. Replace placeholders with your Supabase connection string from Step 3:
```bash
DATABASE_URL="postgresql://your_user:your_password@your_supabase_host:5432/postgres"
```

**Important:** Never commit `.env.local` to Git — it's in `.gitignore` for a reason!

### 5.3 Generate NextAuth Secret
For local development, generate a strong random secret for `NEXTAUTH_SECRET`:

```bash
# On Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString())) | % { $_.Substring(0, 32) }

# On Mac/Linux
openssl rand -base64 32
```

Copy the output and add it to `.env.local`:
```bash
NEXTAUTH_SECRET="your-generated-32-char-secret"
```

**Why?** NextAuth.js uses this secret to sign session tokens. It must be strong and kept private.

### 5.4 Install Zod for Validation
```bash
npm install zod
```

Zod provides runtime type checking for environment variables, catching misconfiguration early.

### 5.5 Create Environment Validation
Create `src/lib/env.ts` for runtime validation:
```typescript
import { z } from 'zod'

const envSchema = z.object({
  // Required in all environments
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
})

// Validate at runtime - fails fast if env vars are missing/invalid
export const env = envSchema.parse(process.env)
```

This ensures environment variables are valid when your app starts. If anything is misconfigured, you'll know immediately (not hours later).

### 5.6 Update package.json Scripts
Add validation and type-checking to `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "validate-env": "node -r ts-node/register src/lib/env.ts"
  }
}
```

### 5.7 Update .gitignore
Ensure sensitive files are ignored. Verify `.gitignore` contains:
```
.env.local
.env.*.local
.env.production
.env.staging
.DS_Store
node_modules/
.next/
dist/
```

**Key points:**
- `.env.local` - never commit (development secrets)
- `.env.*.local` - never commit (any local overrides)
- `.env.production` - can commit template if values are placeholders
- Always check `.gitignore` before committing secrets!

### 5.8 Commit Environment Setup
```bash
git add .
git commit -m "feat(config): setup environment variables and validation

- Create .env.local, .env.production, .env.staging templates
- Add Zod schema for environment variable validation
- Add runtime validation on app startup
- Update .gitignore to protect secrets
- Document all environment variables

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Verification Checklist

After completing all 5 steps, verify the foundation is solid:

- ✅ **Next.js**: `npm run dev` runs at http://localhost:3000 without errors
- ✅ **TypeScript**: `npm run type-check` passes with no errors
- ✅ **Tailwind**: Home page shows styled Card component with Tailwind classes applied
- ✅ **shadcn/ui**: Button and Card components render correctly with shadows/borders
- ✅ **Supabase**: Can log into https://supabase.com and view your project
- ✅ **Prisma**: `npx prisma studio` opens and shows all 6 tables (users, members, classes, class_schedules, bookings, payments)
- ✅ **Database**: Tables have correct columns and relationships (verify in Prisma Studio)
- ✅ **Environment**: `.env.local` has `DATABASE_URL` and `NEXTAUTH_SECRET` set
- ✅ **Git**: All changes committed with conventional commits (`git log --oneline`)
- ✅ **Build**: `npm run build` completes without TypeScript or Next.js errors

If any check fails, see troubleshooting in each step (Steps 1-5).

## Next: Phase 2 - Core Pages & Layout

Once Phase 1 foundation is solid, proceed to **Phase 2: Core Pages & Layout**:

- [ ] Add online form for questions/comments (no sign up required)
- [ ] Create responsive layout components (Header, Footer, Navigation)
- [ ] Migrate existing pages (Home, About, Services)
- [ ] Set up routing structure using route groups
- [ ] Implement SEO metadata for all pages

**Important:** Phase 2 focuses on public-facing pages. Authentication (Phase 3) and booking system (Phase 4) come later.

**Reference:** See `.github/plans/website-upgrade-plan.md` for the complete 7-phase roadmap:
- Phase 1: ✅ Foundation (current)
- Phase 2: Core Pages & Layout
- Phase 3: User Authentication
- Phase 4: Booking System
- Phase 5: Analytics & Admin Dashboard
- Phase 6: Performance & Deployment
- Phase 7: Testing & Launch

The plan includes zero-cost hosting strategy, risk mitigation, and full cost breakdown.

---

## Additional Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Prisma ORM:** https://www.prisma.io/docs
- **Supabase PostgreSQL:** https://supabase.com/docs/guides/database
- **NextAuth.js:** https://next-auth.js.org (see Phase 3)
- **TypeScript:** https://www.typescriptlang.org/docs