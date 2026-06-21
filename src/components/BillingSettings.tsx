import { useState } from 'react'
import {
  CreditCard, Check, ArrowRight, Shield, Calendar,
  AlertTriangle, ExternalLink, Loader2, Sparkles
} from 'lucide-react'
import { useSubscription, PLANS, Plan } from '../lib/subscription'

export function BillingSettings() {
  const { plan: currentPlan, upgradeTo } = useSubscription()
  const [loading, setLoading] = useState(false)

  const planDetails = PLANS[currentPlan]

  const usage = {
    clients: { current: 8, limit: currentPlan === 'free' ? 3 : currentPlan === 'starter' ? 10 : -1 },
    projects: { current: 12, limit: currentPlan === 'free' ? 5 : currentPlan === 'starter' ? 15 : -1 },
    tasks: { current: 156, limit: currentPlan === 'free' ? 50 : currentPlan === 'starter' ? 500 : -1 },
    meetings: { current: 23, limit: currentPlan === 'free' ? 10 : currentPlan === 'starter' ? 100 : -1 },
  }

  const handleManageBilling = async () => {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-4 sm:space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Current Plan</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your subscription and billing</p>
          </div>
          {currentPlan !== 'free' && (
            <button
              onClick={handleManageBilling}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors self-start"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Manage Billing
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Plan Banner — stacks on mobile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25 flex-shrink-0">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{planDetails.name} Plan</h3>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium self-start">
                Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{planDetails.description}</p>
            <p className="text-base sm:text-lg font-bold text-violet-600 mt-2">
              {planDetails.price === 0 ? 'Free forever' : `$${planDetails.price}/user/month`}
            </p>
          </div>
          {currentPlan !== 'enterprise' && (
            <button
              onClick={() => window.location.href = '/pricing'}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 text-sm"
            >
              Upgrade Plan
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Usage */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Usage This Month</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {Object.entries(usage).map(([key, data]) => {
            const isUnlimited = data.limit === -1
            const isOverLimit = !isUnlimited && data.current >= data.limit
            const usagePercent = isUnlimited ? 0 : Math.min((data.current / data.limit) * 100, 100)

            return (
              <div key={key} className={`p-3 sm:p-4 rounded-xl border ${isOverLimit ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize">{key}</span>
                  {isOverLimit && (
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs text-red-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span className="hidden sm:inline">Limit reached</span>
                      <span className="sm:hidden">Full</span>
                    </span>
                  )}
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">{data.current}</span>
                  <span className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
                    / {isUnlimited ? '∞' : data.limit}
                  </span>
                </div>
                {!isUnlimited && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 sm:mt-3">
                    <div
                      className={`h-1.5 rounded-full ${isOverLimit ? 'bg-red-500' : usagePercent > 80 ? 'bg-amber-500' : 'bg-violet-500'}`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment Method */}
      {currentPlan !== 'free' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Payment Method</h3>
          <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 sm:w-12 h-6 sm:h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] sm:text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Expires 12/2027</p>
              </div>
            </div>
            <button
              onClick={handleManageBilling}
              className="text-xs sm:text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 flex-shrink-0"
            >
              Update
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Invoice History */}
      {currentPlan !== 'free' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Invoice History</h3>
            <button
              onClick={handleManageBilling}
              className="text-xs sm:text-sm text-violet-600 hover:text-violet-700 font-medium"
            >
              View all
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {[
              { date: 'Jun 1, 2026', amount: '$29.00', status: 'paid' },
              { date: 'May 1, 2026', amount: '$29.00', status: 'paid' },
              { date: 'Apr 1, 2026', amount: '$29.00', status: 'paid' },
            ].map((invoice, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700">{invoice.date}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">{invoice.amount}</span>
                  <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div className="text-center py-3 sm:py-4">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          All payments encrypted & processed by Stripe
        </div>
      </div>
    </div>
  )
}
