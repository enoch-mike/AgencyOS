import { Lock, Sparkles, ArrowRight } from 'lucide-react'
import { useSubscription, Plan, PLANS } from '../lib/subscription'

interface PaywallGuardProps {
  feature: string
  requiredPlan?: Plan
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PaywallGuard({ feature, requiredPlan = 'starter', children, fallback }: PaywallGuardProps) {
  const { canUse, plan } = useSubscription()
  
  // Check if the feature requires a specific plan
  const featureKey = feature as any
  const isAvailable = canUse(featureKey)
  
  if (isAvailable) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  const planDetails = PLANS[requiredPlan]

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="blur-[2px] pointer-events-none opacity-50">
        {children}
      </div>
      
      {/* Paywall overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
        <div className="text-center p-6 max-w-sm">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/25">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Upgrade to {planDetails.name}</h3>
          <p className="text-sm text-gray-600 mb-4">
            {feature} is available on the {planDetails.name} plan ({planDetails.priceLabel}/user/month).
          </p>
          <button className="inline-flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/25">
            <Sparkles className="w-4 h-4" />
            Upgrade Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface UpgradeBannerProps {
  feature: string
  requiredPlan?: Plan
}

export function UpgradeBanner({ feature, requiredPlan = 'starter' }: UpgradeBannerProps) {
  const { plan } = useSubscription()
  const planDetails = PLANS[requiredPlan]
  
  return (
    <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
          <Lock className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{feature} requires {planDetails.name}</p>
          <p className="text-xs text-gray-600">Upgrade to unlock this feature ({planDetails.priceLabel}/user/month)</p>
        </div>
      </div>
      <button className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
        Upgrade
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
