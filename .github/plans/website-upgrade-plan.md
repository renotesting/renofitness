# RenoFitness Website Upgrade Plan

## Problem Statement
Current website uses legacy jQuery with static HTML pages, making it difficult to:
- Scale with new features (booking system, member authentication)
- Maintain code (jQuery spaghetti code, no type safety)
- Optimize performance (no SSR, poor SEO)
- Track analytics and user behavior
- Support mobile responsiveness consistently

## Solution Overview
Migrate from jQuery-based static site to a modern, full-stack Node.js application using:
- **Frontend**: Next.js with React (SSG for performance & SEO) - GitHub Pages
- **Backend**: Node.js with Express/Fastify + Free Database
- **Hosting**: GitHub Pages (frontend) + Render/Fly.io (backend) - ALL FREE
- **Features**: Booking system, member auth, analytics, admin dashboard

---

## Tech Stack Decision

### Frontend Stack

| Component       | Technology     | Purpose                              |
|:----------------|:---------------|:-------------------------------------|
| Framework       | Next.js 14+    | Static generation (SSG) for GitHub Pages |
| UI Library      | React 18+      | Component-based architecture         |
| Styling         | Tailwind CSS   | Mobile-first responsive design       |
| Components      | shadcn/ui      | Pre-built accessible UI components   |
| Data Fetching   | React Query    | API caching & state management       |
| Global State    | Zustand        | Lightweight state management         |
| SEO             | next-seo       | SEO metadata & sitemaps              |
| Type Safety     | TypeScript     | Type checking & IDE support          |
| Hosting         | GitHub Pages   | Free static site hosting             |

### Backend Stack

| Component       | Technology            | Purpose                    |
|:----------------|:----------------------|:---------------------------|
| Runtime         | Node.js 18+           | JavaScript server runtime  |
| Framework       | Express or Fastify    | HTTP server framework      |
| Database        | Supabase PostgreSQL   | Free relational database   |
| ORM             | Prisma                | Type-safe database access  |
| Auth            | NextAuth.js           | Session & user authentication |
| Payments        | Stripe                | Payment processing         |
| Hosting         | Render/Fly.io         | Free backend hosting       |

### Supporting Services

| Service           | Provider              | Free Tier        | Purpose                    |
|:------------------|:----------------------|:-----------------|:---------------------------|
| Email             | Brevo                 | 300 emails/day   | Booking confirmations & reminders |
| Analytics         | Google Analytics 4    | Unlimited        | User behavior tracking     |
| Error Tracking    | Sentry                | 5k errors/month  | Production error monitoring |
| Monitoring        | UptimeRobot           | Free             | Keep backend awake         |
| Storage           | Supabase Storage      | 1GB              | Images & documents         |
| CI/CD             | GitHub Actions        | Unlimited        | Auto-deploy on push        |

---

## Cost Breakdown (Monthly)

| Service              | Cost         | Details                                |
|:---------------------|:------------:|:---------------------------------------|
| Frontend Hosting     | **$0**       | GitHub Pages (free with GitHub Actions) |
| Backend Hosting      | **$0**       | Render/Fly.io free tier (auto-sleep if inactive) |
| Database             | **$0**       | Supabase: 500MB storage, 2M API calls/month |
| Email                | **$0**       | Brevo: 300 emails/day (9k/month)       |
| Analytics            | **$0**       | Google Analytics 4 (free forever)       |
| Error Tracking       | **$0**       | Sentry: 5k errors/month                |
| Auth                 | **$0**       | NextAuth.js (self-hosted, free)        |
| Storage              | **$0**       | Supabase Storage: 1GB free or GitHub LFS |
| Payment Processing   | *Variable*   | Stripe: 2.9% + $0.30 per transaction   |
| Domain               | **$0-12/yr** | Optional (using GitHub Pages domain for free) |
| **TOTAL MONTHLY**    | **$0**       | Only pay per Stripe transaction        |

**Key Advantages:**
- ✅ Zero fixed costs - truly free-to-start
- ✅ Pay-as-you-grow model with Stripe
- ✅ Easy upgrade path if you exceed free tier limits
- ✅ All data stays on your own database (Supabase)
- ✅ Open-source tech stack (no vendor lock-in)

## Important Notes on Free Tier Limitations & Mitigations

### Backend Hosting (Render/Fly.io)
- **Limitation**: Free tier services spin down after 15 min of inactivity
- **Mitigation**: Add uptime monitoring (free via UptimeRobot) to ping server every 10 min and keep it active

### Database (Supabase)
- **Limitation**: 500MB storage (sufficient for ~10k members + bookings)
- **Mitigation**: Archive old data, upgrade to paid ($10/mo) when reaching limit

### Email (Brevo - formerly Sendinblue)
- **Limitation**: 300 emails/day = 9,000/month
- **Mitigation**: Batch email sends, schedule reminders for off-peak hours, most gyms don't exceed 300/day
- **Upgrade**: €20/month for unlimited emails if needed

### Scalability Path
If you scale and hit free tier limits, upgrade costs are:
- Supabase: $10/mo for 2GB storage
- Render: $7/mo for always-on backend
- Brevo: €20/mo for unlimited emails
- **Total**: ~$37/mo for 10x more capacity

---

## Success Metrics

- ✅ Page load time < 2 seconds (Core Web Vitals)
- ✅ Lighthouse score > 90
- ✅ Mobile responsiveness (100% on all devices)
- ✅ User sign-up flow < 2 minutes
- ✅ Booking completion rate > 80%
- ✅ Zero upfront costs, pay-as-you-grow
- ✅ Zero security vulnerabilities

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Next.js project with TypeScript
- [ ] Configure Tailwind CSS + shadcn/ui
- [ ] Set up PostgreSQL database
- [ ] Configure Prisma ORM
- [ ] Set up environment variables & secrets management

### Phase 2: Core Pages & Layout (Week 2-3)
- [ ] Create responsive layout components (Header, Footer, Nav)
- [ ] Migrate existing pages (Home, About, Services)
- [ ] Set up routing structure
- [ ] Implement SEO metadata for all pages

### Phase 3: User Authentication (Week 3-4)
- [ ] Set up user database schema (members, profiles)
- [ ] Implement NextAuth.js or Clerk
- [ ] Create sign-up/login pages
- [ ] Add password reset flow
- [ ] Implement session management

### Phase 4: Booking System (Week 4-6)
- [ ] Design booking data model (classes, slots, bookings)
- [ ] Create admin dashboard for schedule management
- [ ] Build member booking UI
- [ ] Implement Stripe/Square payment integration
- [ ] Add booking confirmation & email notifications

### Phase 5: Analytics & Admin Dashboard (Week 6-7)
- [ ] Set up Google Analytics 4
- [ ] Create admin dashboard (members, bookings, revenue)
- [ ] Add basic reporting features
- [ ] Set up error tracking with Sentry

### Phase 6: Performance & Deployment (Week 7-8)
- [ ] Optimize images & assets
- [ ] Set up caching strategies
- [ ] Configure CDN (via Vercel)
- [ ] Deploy to Vercel (frontend)
- [ ] Deploy backend to Railway/AWS
- [ ] Set up monitoring & alerts

### Phase 7: Testing & Launch (Week 8-9)
- [ ] Write integration tests
- [ ] Load testing
- [ ] Security audit
- [ ] User acceptance testing (UAT)
- [ ] Go-live

---

## Database Schema (High-Level)

```sql
-- Users & Auth
users (id, email, password_hash, role, created_at)

-- Member Profiles
members (id, user_id, name, phone, join_date, status)

-- Fitness Classes
classes (id, name, description, instructor_id, max_capacity)

-- Class Schedules
class_schedules (id, class_id, date, start_time, end_time, available_slots)

-- Member Bookings
bookings (id, member_id, class_schedule_id, booking_date, status, payment_id)

-- Payments
payments (id, booking_id, amount, status, stripe_transaction_id)
```

---

## Migration Strategy

### Data Migration
1. Export existing website data (if any)
2. Migrate images to Supabase Storage (free, 1GB) or GitHub LFS
3. Set up Supabase database with historical data if needed

### Gradual Rollout
1. Deploy to staging environment first (GitHub Pages staging branch)
2. Test all features thoroughly with Supabase sandbox data
3. Run parallel with old site for 2 weeks (keep old GitHub Pages URL)
4. Set up 301 redirects from old GitHub Pages URLs to new ones
5. Update DNS/CNAME records if using custom domain

### URL Structure Preservation
- Maintain existing URLs for SEO (avoid broken links)
- Set up 301 redirects where URLs change
- Generate sitemap.xml for search engines

---

## Cost Breakdown (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| **Frontend Hosting** | **$0** | GitHub Pages (free with GitHub Actions) |
| **Backend Hosting** | **$0** | Render/Fly.io free tier (auto-sleep if inactive) |
| **Database** | **$0** | Supabase free: 500MB storage, 2M API calls/month |
| **Email** | **$0** | Brevo free: 300 emails/day (9k/month) |
| **Analytics** | **$0** | Google Analytics 4 (free forever) |
| **Error Tracking** | **$0** | Sentry free: 5k errors/month |
| **Payment Processing** | **Variable** | Stripe: 2.9% + $0.30 per transaction (only when booking) |
| **Auth** | **$0** | NextAuth.js (self-hosted, free) |
| **Storage** | **$0** | Supabase Storage: 1GB free or GitHub LFS |
| **Domain** | **$0-12/yr** | Optional custom domain (currently using GitHub Pages domain) |
| **TOTAL** | **$0-0.50/booking** | Only pay per transaction, everything else FREE |

**Key Advantages:**
- ✅ Zero fixed costs - truly free-to-start
- ✅ Pay-as-you-grow model with Stripe
- ✅ Easy upgrade path if you exceed free tier limits
- ✅ All data stays on your own database (Supabase)
- ✅ Open-source tech stack (no vendor lock-in)

---

## Risk Mitigation

| Risk                              | Impact      | Mitigation Strategy                                    |
|:----------------------------------|:------------|:-------------------------------------------------------|
| Free tier service downtime        | 🔴 High     | Use UptimeRobot (free) to ping backend every 10 min to keep it awake |
| Database storage limit (500MB)    | 🟡 Medium   | Monitor monthly, archive old data, upgrade to $10/mo if needed |
| Email rate limit (300/day)        | 🟡 Medium   | Batch send emails, schedule off-peak hours, upgrade if needed |
| Supabase API rate limits          | 🟡 Medium   | Implement caching, optimize queries, rate limit on frontend |
| Data loss during migration        | 🔴 High     | Backup before migration, test on staging first, gradual rollout |
| User authentication issues        | 🔴 High     | Thorough NextAuth.js testing, gradual rollout, test edge cases |
| Payment integration bugs          | 🔴 High     | Use Stripe sandbox mode, test all scenarios, handle edge cases |

---

## Dependencies & Prerequisites

- Node.js 18+ installed
- Git repository set up
- GitHub account (for Pages hosting & Actions)
- Supabase account (free tier)
- Stripe account (free tier)
- Render or Fly.io account (free tier)
- Brevo account (free tier) - for email
- Google Analytics account (free)
- UptimeRobot account (free monitoring)

---

## Next Steps

1. **Approve Tech Stack** - Confirm choices with team
2. **Set Up Development Environment** - Install dependencies, initialize projects
3. **Create Detailed Sprint Plan** - Break down into 2-week sprints
4. **Begin Phase 1: Foundation** - Start Next.js project setup

