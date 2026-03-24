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
