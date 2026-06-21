import Stripe from 'stripe'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Read .env file at runtime (handles cases where env vars weren't set at startup)
function loadEnv(): Record<string, string> {
  const env: Record<string, string> = {}
  try {
    const envPath = resolve(process.cwd(), '.env')
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex > 0) {
        const key = trimmed.slice(0, eqIndex).trim()
        const value = trimmed.slice(eqIndex + 1).trim()
        env[key] = value
      }
    }
  } catch { /* .env not found, fall back to process.env */ }
  return env
}

const envFile = loadEnv()
const getEnv = (key: string) => envFile[key] || process.env[key] || ''

const stripeKey = getEnv('STRIPE_SECRET_KEY')
if (!stripeKey || stripeKey === 'sk_test_demo') {
  console.warn('⚠️  STRIPE_SECRET_KEY not set. Using demo mode.')
}

export const stripe = new Stripe(stripeKey || 'sk_test_demo', {
  apiVersion: '2024-12-18.acacia' as any,
})

// Stripe Price IDs for each plan (create these in your Stripe Dashboard)
export const STRIPE_PRICES = {
  starter_monthly: getEnv('STRIPE_PRICE_STARTER_MONTHLY') || 'price_starter_monthly_demo',
  starter_annual: getEnv('STRIPE_PRICE_STARTER_ANNUAL') || 'price_starter_annual_demo',
  pro_monthly: getEnv('STRIPE_PRICE_PRO_MONTHLY') || 'price_pro_monthly_demo',
  pro_annual: getEnv('STRIPE_PRICE_PRO_ANNUAL') || 'price_pro_annual_demo',
  enterprise_monthly: getEnv('STRIPE_PRICE_ENTERPRISE_MONTHLY') || 'price_enterprise_monthly_demo',
  enterprise_annual: getEnv('STRIPE_PRICE_ENTERPRISE_ANNUAL') || 'price_enterprise_annual_demo',
} as const

export type StripePlanKey = keyof typeof STRIPE_PRICES

export function getStripePriceKey(plan: string, billing: 'monthly' | 'annual'): StripePlanKey {
  return `${plan}_${billing}` as StripePlanKey
}
