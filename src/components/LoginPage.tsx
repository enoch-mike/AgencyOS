import { useState } from 'react'
import { Zap, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../lib/auth'

export function LoginPage({ onBackToLanding }: { onBackToLanding?: () => void }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = mode === 'login'
        ? await login(email, password)
        : await register(email, password, name)

      if (result.error) {
        setError(result.error)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Panel — Branding (hidden on mobile, full-height on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AgencyOS</span>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            The AI-powered workspace built for agencies.
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Manage clients, projects, meetings, and tasks — with AI that captures, connects, and executes automatically.
          </p>
          <div className="space-y-4">
            {[
              'AI daily briefings that tell you what matters',
              'Meeting → action items extracted automatically',
              'Client health scores so nothing falls through the cracks',
              'One tool instead of five — Notion + Asana + Calendly + Slack',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm text-white/50">
          © 2026 AgencyOS. Built with ❤️ for agencies everywhere.
        </p>
      </div>

      {/* Mobile Header — only visible on mobile */}
      <div className="lg:hidden bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">AgencyOS</span>
        </div>
        {onBackToLanding && (
          <button onClick={onBackToLanding} className="text-sm text-gray-500 hover:text-violet-600">
            ← Home
          </button>
        )}
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Desktop back button */}
          {onBackToLanding && (
            <button onClick={onBackToLanding} className="hidden lg:flex text-sm text-gray-500 hover:text-violet-600 mb-6 items-center gap-1">
              ← Back to home
            </button>
          )}

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              {mode === 'login'
                ? 'Sign in to your AgencyOS workspace'
                : 'Start your 14-day free trial — no credit card required'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Thompson"
                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@agency.com"
                  required
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3 sm:py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-gray-400 mt-1.5">Must be at least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
                className="text-violet-600 hover:text-violet-700 font-semibold"
              >
                {mode === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </div>

          {mode === 'login' && (
            <div className="mt-6 sm:mt-8 p-4 bg-gray-100 rounded-xl">
              <p className="text-xs font-medium text-gray-500 mb-2">Demo Account:</p>
              <button
                onClick={async () => {
                  setEmail('alex@agency.com')
                  setPassword('demo123')
                  setLoading(true)
                  await register('alex@agency.com', 'demo123', 'Alex Thompson')
                  await login('alex@agency.com', 'demo123')
                  setLoading(false)
                }}
                className="w-full text-left text-sm text-gray-700 hover:text-violet-600 transition-colors"
              >
                <span className="font-medium">alex@agency.com</span> / <span className="font-medium">demo123</span>
                <span className="text-gray-400 ml-2">→ tap to auto-fill & login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
