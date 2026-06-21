import { useState, useEffect } from 'react'
import { Check, X, Sparkles, Star, CreditCard, Shield, Loader2, ExternalLink, CheckCircle2 } from 'lucide-react'
import { useSubscription, PLANS, Plan } from '../lib/subscription'

export function PricingPage() {
  const { plan: currentPlan, upgradeTo } = useSubscription()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState<Plan | null>(null)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      setShowSuccess(true)
      window.history.replaceState({}, '', '/pricing')
      setTimeout(() => setShowSuccess(false), 5000)
    }
    if (params.get('canceled') === 'true') {
      window.history.replaceState({}, '', '/pricing')
    }
    if (params.get('demo') === 'true') {
      setDemoMode(true)
      const plan = params.get('plan') as Plan
      if (plan && PLANS[plan]) {
        upgradeTo(plan)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
      window.history.replaceState({}, '', '/pricing')
    }
  }, [])

  const plans: Plan[] = ['free', 'starter', 'pro', 'enterprise']

  const features = [
    { name: 'Clients', free: '3', starter: '10', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Projects', free: '5', starter: '15', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Tasks', free: '50', starter: '500', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Meetings', free: '10/mo', starter: '100/mo', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'AI Daily Briefing', free: false, starter: true, pro: true, enterprise: true },
    { name: 'AI Meeting Summaries', free: false, starter: true, pro: true, enterprise: true },
    { name: 'AI Action Extraction', free: false, starter: true, pro: true, enterprise: true },
    { name: 'AI Client Health Scores', free: false, starter: false, pro: true, enterprise: true },
    { name: 'Voice Capture', free: false, starter: true, pro: true, enterprise: true },
    { name: 'Integrations (Slack, Gmail, Calendar)', free: false, starter: false, pro: true, enterprise: true },
    { name: 'Priority Support', free: false, starter: false, pro: true, enterprise: true },
    { name: 'Custom AI Training', free: false, starter: false, pro: false, enterprise: true },
    { name: 'API Access', free: false, starter: false, pro: false, enterprise: true },
    { name: 'SSO/SAML', free: false, starter: false, pro: false, enterprise: true },
  ]

  const handleUpgrade = async (selectedPlan: Plan) => {
    if (selectedPlan === 'free' || selectedPlan === currentPlan) return
    setLoading(selectedPlan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, billing: billingCycle, userId: 'user_demo' }),
      })
      const data = await res.json()
      if (data.ok && data.checkoutUrl) {
        if (data.demo) {
          upgradeTo(selectedPlan)
          setShowSuccess(true)
          setTimeout(() => setShowSuccess(false), 3000)
        } else {
          window.location.href = data.checkoutUrl
        }
      }
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setLoading(null)
    }
  }

  const handleManageBilling = async () => {
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user_demo' }),
      })
      const data = await res.json()
      if (data.ok && data.portalUrl) {
        if (data.demo) {
          alert('Demo mode: In production, this opens the Stripe Customer Portal.')
        } else {
          window.location.href = data.portalUrl
        }
      }
    } catch (err) {
      console.error('Portal error:', err)
    }
  }

  return (
    <div className="min-h-full">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto bg-green-500 text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-sm sm:text-base">
            {demoMode ? 'Demo upgrade successful!' : 'Plan upgraded successfully!'}
          </span>
        </div>
      )}

      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800">Demo Mode Active</p>
            <p className="text-xs text-amber-600">Stripe is not configured. Upgrades are simulated.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Simple, transparent pricing
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">Choose the plan for your agency</h1>
        <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
          Start free, upgrade when you're ready. All plans include a 14-day trial of premium features.
        </p>

        <div className="flex items-center justify-center gap-3 mt-4 sm:mt-6">
          <span className={`text-xs sm:text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className={`relative w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-colors ${billingCycle === 'annual' ? 'bg-violet-600' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${billingCycle === 'annual' ? 'left-5 sm:left-7' : 'left-0.5 sm:left-1'}`} />
          </button>
          <span className={`text-xs sm:text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
            Annual
            <span className="ml-1.5 text-[10px] sm:text-xs bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">Save 20%</span>
          </span>
        </div>

        {currentPlan !== 'free' && (
          <button
            onClick={handleManageBilling}
            className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Manage billing & subscriptions
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Pricing Cards — horizontal scroll on mobile, grid on desktop */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-4 mb-8 sm:mb-12 scrollbar-hide">
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-w-max sm:min-w-0">
          {plans.map((planId) => {
            const plan = PLANS[planId]
            const isCurrent = currentPlan === planId
            const isPopular = planId === 'pro'
            const annualPrice = Math.round(plan.price * 0.8)
            const isLoading = loading === planId

            return (
              <div
                key={planId}
                className={`relative bg-white rounded-2xl border-2 p-5 sm:p-6 transition-all w-[260px] sm:w-auto flex-shrink-0 ${
                  isPopular
                    ? 'border-violet-500 shadow-xl shadow-violet-500/10 sm:scale-105'
                    : isCurrent
                      ? 'border-violet-300 bg-violet-50'
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    MOST POPULAR
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1 rounded-full">
                    CURRENT PLAN
                  </div>
                )}

                <div className="text-center mb-5 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{plan.description}</p>
                  <div className="mt-3 sm:mt-4">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {billingCycle === 'annual' ? `$${annualPrice}` : plan.priceLabel}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-xs sm:text-sm text-gray-500">/user/mo</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleUpgrade(planId)}
                  disabled={isCurrent || isLoading}
                  className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all mb-5 sm:mb-6 flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isPopular
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : plan.price === 0 ? (
                    'Get Started'
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Upgrade
                    </>
                  )}
                </button>

                <div className="space-y-2.5 sm:space-y-3">
                  {features.slice(0, 8).map((feature, i) => {
                    const value = feature[planId]
                    return (
                      <div key={i} className="flex items-center gap-2.5">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 flex-shrink-0" />
                          )
                        ) : (
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                        )}
                        <span className={`text-xs sm:text-sm ${typeof value === 'boolean' && !value ? 'text-gray-400' : 'text-gray-700'}`}>
                          {feature.name}
                          {typeof value === 'string' && ` (${value})`}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Trust Badge */}
      <div className="text-center mb-6 sm:mb-8 px-2">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 bg-gray-50 px-3 sm:px-4 py-2 rounded-full">
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Payments secured by Stripe
          <span className="text-gray-300">·</span>
          Cancel anytime
          <span className="text-gray-300 hidden sm:inline">·</span>
          <span className="hidden sm:inline">14-day money-back guarantee</span>
        </div>
      </div>

      {/* Feature Comparison Table — horizontal scroll on mobile */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8 sm:mb-12">
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Full Feature Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Feature</th>
                {plans.map(planId => (
                  <th key={planId} className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-900">
                    {PLANS[planId].name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-700">{feature.name}</td>
                  {plans.map(planId => {
                    const value = feature[planId]
                    return (
                      <td key={planId} className="px-3 sm:px-6 py-2.5 sm:py-3 text-center">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-4 sm:w-5 h-4 sm:h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-xs sm:text-sm font-medium text-gray-700">{value}</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-8 sm:mt-12 text-center px-2 pb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Questions?</h2>
        <p className="text-sm sm:text-gray-600 mb-4 sm:mb-6">Our team is here to help you choose the right plan.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm">
            View FAQ
          </button>
          <button className="w-full sm:w-auto px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/25 text-sm">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  )
}
