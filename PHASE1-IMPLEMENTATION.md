# RenoFitness Phase 1: Foundation Implementation Guide

## Overview
Phase 1 establishes the core infrastructure for the RenoFitness booking platform. This phase takes 1-2 weeks and includes:
- Next.js 14+ project setup with TypeScript
- Tailwind CSS + shadcn/ui configuration
- PostgreSQL database setup (Supabase)
- Prisma ORM integration
- Environment variable management

## Prerequisites
Before starting, ensure you have:
- Node.js 18+ installed (`node --version`)
- npm 9+ installed (`npm --version`)
- GitHub account with Git configured
- Supabase account created (free tier)
- VS Code or preferred code editor

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
- ✅ Turbopack: **Yes** (faster builds)
- ✅ Import alias: Use default `@/*`

### 1.2 Project Structure After Creation
```
renofitness/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   ├── globals.css    # Global styles
│   │   └── favicon.ico
│   ├── components/        # Shared React components
│   └── lib/               # Utilities and helpers
├── .env.local             # Local environment variables
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── package.json
└── README.md
```

### 1.3 Verify Installation
```bash
npm run dev
# Visit http://localhost:3000 to confirm it works
# Press Ctrl+C to stop
```

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

### 2.2 Install shadcn/ui CLI
```bash
npx shadcn-ui@latest init -d

# When prompted, select:
# Style: Default
# Base color: Slate
# CSS variables: Yes
```

This creates:
- `src/lib/utils.ts` - Utility functions
- `src/components/ui/` - Base UI component library

### 2.3 Install Common Components
```bash
# Install Button component (needed for all pages)
npx shadcn-ui@latest add button

# Install Card component (common for dashboard)
npx shadcn-ui@latest add card

# Install Form components (needed for auth/booking)
npx shadcn-ui@latest add form

# Install Input component
npx shadcn-ui@latest add input

# Install Dialog component (modals)
npx shadcn-ui@latest add dialog

# Install Dropdown Menu
npx shadcn-ui@latest add dropdown-menu

# Install Navigation Menu
npx shadcn-ui@latest add navigation-menu
```

### 2.4 Update globals.css
Tailwind should auto-configure `src/app/globals.css`. Verify it has:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2.5 Verify Tailwind + shadcn/ui Works
Test by updating `src/app/page.tsx`:
```typescript
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">RenoFitness</h1>
        <p className="text-gray-600 mb-8">Modern fitness booking platform</p>
        <Button size="lg">Get Started</Button>
      </div>
    </main>
  )
}
```

Run `npm run dev` and verify the styled button appears at `http://localhost:3000`.

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
1. Go to https://supabase.com and sign in (or create account)
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: `renofitness-db`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
4. Click **"Create new project"** (takes 1-2 minutes)

### 3.2 Get Connection Details
Once project is created:
1. Go to **Settings → Database**
2. Copy the **Connection String** (PostgreSQL URI)
3. It looks like: `postgresql://user:password@host:5432/postgres`

### 3.3 Test Database Connection
Create a `.env.local` file in your project root:
```bash
DATABASE_URL="postgresql://your_user:your_password@your_host:5432/postgres"
```

You'll use this in the next step with Prisma.

### 3.4 Understanding Supabase Free Tier
- **Storage**: 500MB (plenty for initial data)
- **API Calls**: 2M/month (sufficient for small app)
- **Real-time**: Included
- **Auto-backup**: Daily backups
- **SSL**: Always enabled

---

## Step 4: Configure Prisma ORM

### 4.1 Install Prisma
```bash
npm install @prisma/client
npm install -D prisma
```

### 4.2 Initialize Prisma
```bash
npx prisma init

# This creates:
# - prisma/schema.prisma (database schema)
# - .env.local (already has DATABASE_URL)
```

### 4.3 Configure .env.local
Your `.env.local` should already have `DATABASE_URL`, verify it's correct from Supabase.

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

### 4.5 Create and Run Migration
```bash
# Create migration
npx prisma migrate dev --name init

# When prompted, name the migration: "init"
# This creates the database tables on Supabase
```

### 4.6 Generate Prisma Client
```bash
npx prisma generate
```

### 4.7 View Database (Optional)
```bash
# Open Prisma Studio to view/edit data
npx prisma studio

# Opens http://localhost:5555 with database explorer
```

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

Create the following files in your project root:

**`.env.local`** (for local development):
```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/postgres"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Authentication (will set up in Phase 3)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Payment (will set up in Phase 4)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""

# Email (will set up in Phase 4)
BREVO_API_KEY=""

# Analytics (will set up in Phase 5)
NEXT_PUBLIC_GA_ID=""

# Sentry (will set up in Phase 5)
NEXT_PUBLIC_SENTRY_DSN=""
```

**`.env.production`** (for production):
```bash
# Database
DATABASE_URL="postgresql://prod-user:prod-password@prod-host:5432/postgres"

# App
NEXT_PUBLIC_APP_URL="https://renofitness.com"
NEXT_PUBLIC_API_URL="https://api.renofitness.com"

# Authentication
NEXTAUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://renofitness.com"

# Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."

# Email
BREVO_API_KEY="prod-brevo-key"

# Analytics
NEXT_PUBLIC_GA_ID="prod-ga-id"

# Sentry
NEXT_PUBLIC_SENTRY_DSN="prod-sentry-dsn"
```

**`.env.staging`** (for staging):
```bash
# Similar to production but with staging credentials
```

### 5.2 Update .env.local
Replace placeholder values with your actual Supabase connection string:
```bash
DATABASE_URL="postgresql://your_user:your_password@your_supabase_host:5432/postgres"
```

### 5.3 Generate NextAuth Secret
For local development, generate a random secret:
```bash
# On Windows PowerShell
[guid]::NewGuid().ToString()

# On Mac/Linux
openssl rand -base64 32
```

Copy the output and set it in `.env.local`:
```bash
NEXTAUTH_SECRET="your-generated-secret-here"
```

### 5.4 Create Environment Validation
Create `src/lib/env.ts`:
```typescript
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
})

export const env = envSchema.parse(process.env)
```

### 5.5 Update package.json Scripts
Add validation script to `package.json`:
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

### 5.6 Add Zod for Validation
```bash
npm install zod
```

### 5.7 Update .gitignore
Ensure sensitive files are ignored:
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

### 5.8 Commit Environment Setup
```bash
git add .
git commit -m "feat(config): setup environment variables and validation

- Create .env.local, .env.production, .env.staging templates
- Add Zod schema for environment variable validation
- Add validation to build pipeline
- Document all environment variables

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Verification Checklist

After completing all 5 steps, verify:

- ✅ **Next.js**: `npm run dev` runs without errors
- ✅ **TypeScript**: `npm run type-check` passes
- ✅ **Tailwind**: Home page shows styled content
- ✅ **shadcn/ui**: Button component renders correctly
- ✅ **Supabase**: Can access database from Supabase dashboard
- ✅ **Prisma**: `npx prisma studio` opens without errors
- ✅ **Environment**: `.env.local` has `DATABASE_URL` set correctly
- ✅ **Git**: All changes committed with conventional commits

## Next: Phase 2

Once Phase 1 is complete, proceed to **Phase 2: Core Pages & Layout** to:
- Create responsive layout components
- Migrate existing pages from jQuery to React
- Implement SEO metadata
- Set up routing structure

See `.github/plans/website-upgrade-plan.md` for Phase 2 details.

