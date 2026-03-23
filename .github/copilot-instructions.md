# Copilot Instructions for RenoFitness

This repository is a **planning hub** for the RenoFitness website modernization project. It contains implementation plans, AI agent instructions, and workflow standards that guide the development of the actual RenoFitness application.

## Repository Purpose

- **Not**: The actual application code
- **Is**: The blueprint, architecture, planning documents, and AI agent configurations for building the RenoFitness booking platform

The actual application will be built in a separate repository following the guidance in `.github/plans/website-upgrade-plan.md`.

## Tech Stack (Planned Application)

### Frontend
- Next.js 14+ with App Router
- React 18+ with TypeScript
- Tailwind CSS + shadcn/ui components
- React Query (data fetching & caching)
- Zustand (state management)
- next-seo (SEO optimization)
- Static generation (SSG) for GitHub Pages hosting

### Backend
- Node.js 18+ runtime
- Express or Fastify (HTTP framework)
- Prisma ORM with PostgreSQL
- Supabase (free-tier database)
- NextAuth.js (authentication)
- Stripe (payment processing)

### Supporting Services
- **Email**: Brevo (300 emails/day free)
- **Analytics**: Google Analytics 4
- **Error Tracking**: Sentry (5k errors/month free)
- **Monitoring**: UptimeRobot (keeps backend awake)
- **CI/CD**: GitHub Actions
- **Storage**: Supabase Storage (1GB free)

## Key Architecture Principles

### Zero-Cost Model
- All infrastructure on free tiers: $0/month fixed costs
- Only pay for Stripe transactions (2.9% + $0.30)
- Scalable: upgrade to $37/mo if hitting free tier limits

### Gradual Migration Strategy
- Run parallel with old site for 2 weeks
- Preserve all existing URLs with 301 redirects
- Generate sitemap.xml for SEO
- Test thoroughly in staging before going live

### Backend Hosting Consideration
- Free tier services (Render/Fly.io) spin down after 15 min inactivity
- Mitigation: Use UptimeRobot to ping every 10 min and keep alive

### Database Schema (Simplified)
```
users (id, email, password_hash, role)
members (id, user_id, name, phone, join_date, status)
classes (id, name, description, max_capacity)
class_schedules (id, class_id, date, start_time, end_time, available_slots)
bookings (id, member_id, class_schedule_id, booking_date, status, payment_id)
payments (id, booking_id, amount, status, stripe_transaction_id)
```

## Development Conventions

### Code Organization (Next.js App Router)
- **`app/(public)/`**: Public-facing pages (home, about, services)
- **`app/(auth)/`**: Authentication pages (login, signup, password reset)
- **`app/(dashboard)/`**: Member dashboard (protected routes)
- **`app/(admin)/`**: Admin panel (protected admin routes)
- **`app/api/`**: Backend API routes
- **`app/components/`**: Shared React components

### Frontend Patterns
- **Server Components by default**: Use Client Components only for interactivity
- **Async params**: `params` and `searchParams` must be `await`ed (Next.js v16+)
- **Colocation**: Keep components, types, and utilities close to usage
- **Type Safety**: Comprehensive TypeScript throughout
- **Progressive Enhancement**: Build features that work without JavaScript first

### Engineering Principles (from Principal Engineer Mode)
- **SOLID Principles**: Applied pragmatically, not dogmatically
- **Gang of Four Patterns**: Use when they reduce complexity
- **DRY/YAGNI/KISS**: Maintain code clarity first
- **Clean Code**: Readable code that tells a story, minimizes cognitive load
- **Test Pyramid**: Unit (40%) → Integration (40%) → E2E (20%)

### Technical Debt Management
- Document all technical debt as GitHub Issues
- Clearly mark TODOs with context and impact
- Assess long-term consequences before incurring debt
- Use principal engineer mode for comprehensive reviews

## Git & Commit Conventions

### Conventional Commits Format
```
<type>[scope]: <description>

[optional body]

[optional footer: BREAKING CHANGE: <details>]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Scope**: Identifies affected area (e.g., `auth`, `booking`, `api`, `ui`)

**Examples**:
```
feat(booking): add class reminder email notifications
fix(auth): prevent password reset token reuse
refactor(api): optimize booking query performance
docs(readme): update setup instructions
```

**Breaking Changes**: Mark with `!` suffix or `BREAKING CHANGE:` footer
```
feat(api)!: remove legacy booking v1 endpoint
```

### Co-authored Commits
All commits should include Copilot co-author trailer:
```
Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- Next.js project setup with TypeScript
- Tailwind CSS + shadcn/ui configuration
- Prisma ORM + Supabase database connection
- Environment variable management

### Phase 2: Core Pages & Layout (Week 2-3)
- Responsive layout components (Header, Footer, Nav)
- Migrate existing pages to React components
- Implement SEO metadata and sitemaps
- Set up routing structure

### Phase 3: Authentication (Week 3-4)
- NextAuth.js implementation
- User database schema
- Sign-up, login, password reset flows
- Session management

### Phase 4: Booking System (Week 4-6)
- Database schema for classes/schedules/bookings
- Admin dashboard for schedule management
- Member booking interface with calendar
- Stripe payment integration
- Booking confirmation emails (Brevo)

### Phase 5: Analytics & Reporting (Week 6-7)
- Google Analytics 4 setup and tracking
- Admin reporting dashboard
- Error tracking with Sentry

### Phase 6: Performance & Deployment (Week 7-8)
- Image optimization
- Caching strategies
- Deploy to GitHub Pages (frontend)
- Deploy to Render/Fly.io (backend)

### Phase 7: Testing & Launch (Week 8-9)
- Integration tests (Jest/Playwright)
- Load testing
- Security audit
- User acceptance testing
- Go-live

## Existing Agent Instructions

This repository includes pre-configured AI agents for specialized tasks:

### Principal Software Engineer
Located: `.github/agents/principal-software-engineer.agent.md`
- Engineering excellence guidance
- SOLID principles and design patterns
- Clean code and testing strategies
- Technical debt management
- Code review mentoring

### Expert Next.js Developer
Located: `.github/agents/expert-nextjs-developer.agent.md`
- Next.js 16 App Router expertise
- React 19 patterns (Server Components, use hooks)
- TypeScript best practices
- Turbopack bundler knowledge
- Deployment and optimization patterns

### GitHub Actions Node Upgrade
Located: `.github/agents/github-actions-node-upgrade.agent.md`
- GitHub Actions workflow optimization
- Node runtime updates
- CI/CD pipeline patterns

## Reference Documents

- **Implementation Plan**: `.github/plans/website-upgrade-plan.md` - Complete 9-phase roadmap with costs, risks, and success metrics
- **Git Workflow**: `.github/skills/git-commit/SKILL.md` - Conventional commits specification

## Working with This Codebase

### For Planning Sessions
1. Reference `.github/plans/website-upgrade-plan.md` for architecture and phasing
2. Use SQL todo tracking to manage implementation phases
3. Document assumptions and design decisions explicitly

### For Code Reviews
1. Activate "Principal software engineer" agent mode for comprehensive reviews
2. Check for SOLID principles, clean code practices, and test coverage
3. Create GitHub Issues for identified technical debt

### For Next.js Development
1. Activate "Expert Next.js developer" agent mode
2. Use App Router exclusively, never Pages Router
3. Default to Server Components, Client Components only for interactivity
4. Ensure `params` and `searchParams` are `await`ed in route handlers

### For CI/CD
1. Reference existing agent for GitHub Actions patterns
2. Ensure Node 18+ runtime for all workflows
3. Use conventional commits to auto-generate changelogs

## MCP Servers

This repository is configured with the following MCP (Model Context Protocol) servers to enhance Copilot capabilities:

### npm Package Explorer
**Location**: `.mcp.json`

Enables inspection and management of Node.js dependencies:
- View installed packages and versions
- Check dependency trees and conflicts
- Review vulnerability reports
- Explore package metadata and changelogs

**Usage**: Activate automatically during dependency management tasks like:
- Updating package versions
- Resolving dependency conflicts
- Auditing packages for vulnerabilities
- Reviewing release notes before upgrades

### Playwright Browser Testing
**Location**: `.mcp.json`

Enables web automation, browser testing, and end-to-end testing capabilities:
- Create and run E2E tests for booking flows
- Test authentication scenarios (login, signup, password reset)
- Validate responsive design across devices
- Perform visual regression testing
- Test payment integration with Stripe
- Verify email notification flows
- Automate user acceptance testing (UAT)

**Usage**: Ideal for:
- Writing E2E tests in Phase 7 (Testing & Launch)
- Testing booking system interactions
- Validating authentication flows
- Performance testing with multiple concurrent users
- Cross-browser compatibility testing
- Accessibility testing

**Common Test Scenarios for RenoFitness**:
```typescript
// Booking flow test
test('member can book a fitness class', async ({ page }) => {
  await page.goto('https://example.com/booking');
  await page.click('button:has-text("Browse Classes")');
  // Select class, add to cart, checkout with Stripe
});

// Auth flow test
test('user can sign up and verify email', async ({ page }) => {
  await page.goto('https://example.com/signup');
  // Fill form, submit, verify confirmation email
});

// Admin dashboard test
test('admin can manage class schedules', async ({ page }) => {
  await page.goto('https://example.com/admin/schedule');
  // Add new class, verify it appears in member booking
});
```

## Important Notes

- **No Application Code Yet**: This repository contains only planning and instructions. The actual app will be built following these guidelines.
- **Free-First Architecture**: All infrastructure decisions prioritize cost ($0/month). Understand free tier limitations before implementing.
- **Gradual Rollout**: Plan for 2-week parallel operation with old site to ensure smooth migration.
- **SEO Preservation**: Existing URLs must be maintained with 301 redirects to avoid search ranking loss.

