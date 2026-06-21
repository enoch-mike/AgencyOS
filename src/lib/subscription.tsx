import { useState, createContext, useContext, type ReactNode } from 'react'

export type Plan = 'free' | 'starter' | 'pro' | 'enterprise'

export interface PlanFeatures {
  maxClients: number
  maxProjects: number
  maxTasks: number
  maxMeetings: number
  aiBriefings: boolean
  aiMeetingSummary: boolean
  aiActionExtraction: boolean
  aiClientHealth: boolean
  voiceCapture: boolean
  integrations: boolean
  prioritySupport: boolean
  customAI: boolean
  apiAccess: boolean
}

export const PLANS: Record<Plan, { name: string; price: number; priceLabel: string; features: PlanFeatures; description: string }> = {
  free: {
    name: 'Free',
    price: 0,
    priceLabel: '$0',
    description: 'Perfect for trying out AgencyOS',
    features: {
      maxClients: 3,
      maxProjects: 5,
      maxTasks: 50,
      maxMeetings: 10,
      aiBriefings: false,
      aiMeetingSummary: false,
      aiActionExtraction: false,
      aiClientHealth: false,
      voiceCapture: false,
      integrations: false,
      prioritySupport: false,
      customAI: false,
      apiAccess: false,
    },
  },
  starter: {
    name: 'Starter',
    price: 19,
    priceLabel: '$19',
    description: 'For solo consultants and freelancers',
    features: {
      maxClients: 10,
      maxProjects: 15,
      maxTasks: 500,
      maxMeetings: 100,
      aiBriefings: true,
      aiMeetingSummary: true,
      aiActionExtraction: true,
      aiClientHealth: false,
      voiceCapture: true,
      integrations: false,
      prioritySupport: false,
      customAI: false,
      apiAccess: false,
    },
  },
  pro: {
    name: 'Pro',
    price: 29,
    priceLabel: '$29',
    description: 'For growing agencies (most popular)',
    features: {
      maxClients: -1, // unlimited
      maxProjects: -1,
      maxTasks: -1,
      maxMeetings: -1,
      aiBriefings: true,
      aiMeetingSummary: true,
      aiActionExtraction: true,
      aiClientHealth: true,
      voiceCapture: true,
      integrations: true,
      prioritySupport: true,
      customAI: false,
      apiAccess: false,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 49,
    priceLabel: '$49',
    description: 'For large teams with custom needs',
    features: {
      maxClients: -1,
      maxProjects: -1,
      maxTasks: -1,
      maxMeetings: -1,
      aiBriefings: true,
      aiMeetingSummary: true,
      aiActionExtraction: true,
      aiClientHealth: true,
      voiceCapture: true,
      integrations: true,
      prioritySupport: true,
      customAI: true,
      apiAccess: true,
    },
  },
}

interface SubscriptionContextType {
  plan: Plan
  features: PlanFeatures
  canUse: (feature: keyof PlanFeatures) => boolean
  isWithinLimit: (resource: string, current: number) => boolean
  upgradeTo: (plan: Plan) => void
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Plan>('free')
  const features = PLANS[plan].features

  const canUse = (feature: keyof PlanFeatures): boolean => {
    const value = features[feature]
    return typeof value === 'boolean' ? value : true
  }

  const isWithinLimit = (resource: string, current: number): boolean => {
    const limitKey = `max${resource.charAt(0).toUpperCase() + resource.slice(1)}` as keyof PlanFeatures
    const limit = features[limitKey]
    if (typeof limit === 'number' && limit === -1) return true // unlimited
    if (typeof limit === 'number') return current < limit
    return true
  }

  const upgradeTo = (newPlan: Plan) => {
    setPlan(newPlan)
  }

  return (
    <SubscriptionContext.Provider value={{ plan, features, canUse, isWithinLimit, upgradeTo }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) throw new Error('useSubscription must be used within SubscriptionProvider')
  return context
}
