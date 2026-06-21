import { useState } from 'react'
import {
  Zap, Brain, Users, FolderKanban, CheckSquare, Calendar,
  ArrowRight, Star, Sparkles, MessageSquare,
  Video, ChevronRight, Check, Rocket, Menu, X, Quote, Moon, Sun
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from './ThemeProvider'

interface LandingPageProps {
  onNavigateToApp: () => void
}

const features = [
  { icon: Brain, title: 'AI Daily Briefings', description: 'Wake up to a prioritized briefing of what matters most — overdue tasks, at-risk clients, and today\'s focus areas.', color: 'from-blue-500 to-blue-600' },
  { icon: Users, title: 'Client Health Scores', description: 'AI-powered health monitoring for every client relationship. Never let a high-value account slip through the cracks.', color: 'from-emerald-500 to-emerald-600' },
  { icon: FolderKanban, title: 'Smart Project Tracking', description: 'Budget tracking, milestone management, and AI-suggested next steps for every active project.', color: 'from-violet-500 to-violet-600' },
  { icon: Calendar, title: 'Meeting Intelligence', description: 'Auto-summarize meetings, extract action items, and track follow-ups. Never lose context.', color: 'from-amber-500 to-amber-600' },
  { icon: MessageSquare, title: 'Slack Integration', description: 'Monitor team channels, track mentions, and keep projects aligned without switching tabs.', color: 'from-pink-500 to-pink-600' },
  { icon: Video, title: 'Zoom Sync', description: 'Automatic meeting scheduling, recording management, and post-meeting action items.', color: 'from-cyan-500 to-cyan-600' },
]

type CompValue = boolean | string
const comparisons: { feature: string; agencyOS: CompValue; notion: CompValue; asana: CompValue; hubspot: CompValue }[] = [
  { feature: 'AI-Powered Briefings', agencyOS: true, notion: false, asana: false, hubspot: false },
  { feature: 'Client Health Scores', agencyOS: true, notion: false, asana: false, hubspot: 'limited' },
  { feature: 'Meeting → Action Items', agencyOS: true, notion: false, asana: false, hubspot: false },
  { feature: 'Slack + Zoom Integration', agencyOS: true, notion: false, asana: false, hubspot: 'partial' },
  { feature: 'Project Budget Tracking', agencyOS: true, notion: false, asana: true, hubspot: true },
  { feature: 'Real-Time Data Sync', agencyOS: true, notion: true, asana: true, hubspot: true },
  { feature: 'Client Portal', agencyOS: true, notion: false, asana: false, hubspot: 'paid' },
  { feature: 'Built for Agencies', agencyOS: true, notion: false, asana: false, hubspot: false },
]

const testimonials = [
  { name: 'Sarah Chen', role: 'CEO, Pixel Studio', quote: 'AgencyOS replaced our Notion, Asana, and part of our HubSpot. The AI briefings alone save me 2 hours every morning.', rating: 5 },
  { name: 'Marcus Johnson', role: 'Director, Bright Digital', quote: 'We went from 4 tools to 1. The client health scores have helped us reduce churn by 40%.', rating: 5 },
  { name: 'Priya Patel', role: 'Head of Ops, Catalyst Agency', quote: 'Meeting summaries that actually capture what matters. Our follow-up rate went from 60% to 95%.', rating: 5 },
]

const pricingTiers = [
  { name: 'Free', price: '$0', period: 'forever', features: ['3 clients', '5 projects', '10 tasks', 'Basic AI'], cta: 'Start Free', popular: false },
  { name: 'Starter', price: '$19', period: '/month', features: ['15 clients', '25 projects', '100 tasks', 'AI Briefings', 'Calendar sync'], cta: 'Start Trial', popular: false },
  { name: 'Pro', price: '$29', period: '/month', features: ['Unlimited clients', 'Unlimited projects', 'Unlimited tasks', 'Full AI Suite', 'All Integrations', 'Meeting Intelligence'], cta: 'Start Trial', popular: true },
  { name: 'Enterprise', price: '$49', period: '/month', features: ['Everything in Pro', 'Custom AI training', 'SSO & SAML', 'Dedicated support', 'API Access', 'White-label'], cta: 'Contact Sales', popular: false },
]

export function LandingPage({ onNavigateToApp }: LandingPageProps) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-[var(--border)]" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-[var(--foreground)] tracking-tight">AgencyOS</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors font-medium">Features</a>
              <a href="#compare" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors font-medium">Compare</a>
              <a href="#pricing" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors font-medium">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggle} className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors cursor-pointer border border-[var(--border)]" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--muted-foreground)]" /> : <Moon className="w-4 h-4 text-[var(--muted-foreground)]" />}
              </button>
              <button onClick={onNavigateToApp} className="hidden sm:block text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors cursor-pointer">Log In</button>
              <button onClick={onNavigateToApp} className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--primary)]/90 transition-all duration-200 cursor-pointer shadow-sm">
                <span className="hidden sm:inline">Get Started Free</span>
                <span className="sm:hidden">Start Free</span>
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors cursor-pointer" aria-label="Menu">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border)] bg-[var(--card)] px-4 py-3 space-y-2">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[var(--foreground)]">Features</a>
            <a href="#compare" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[var(--foreground)]">Compare</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-[var(--foreground)]">Pricing</a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }} />
        <div className="absolute inset-0 gradient-mesh" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 text-sm text-blue-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Agency Management
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight">
              Notion helps you organize.{' '}
              <span className="text-gradient">
                AgencyOS helps you do.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed px-2 max-w-2xl mx-auto">
              The all-in-one workspace built for digital agencies. Manage clients, projects, and meetings — with AI that turns your data into actions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={onNavigateToApp} className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 shadow-xl shadow-[var(--primary)]/25 px-8 py-6 text-sm sm:text-base w-full sm:w-auto cursor-pointer">
                Start Free — No Card Required
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={onNavigateToApp} className="border-slate-600 text-slate-300 hover:bg-white/5 px-8 py-6 text-sm sm:text-base w-full sm:w-auto cursor-pointer">
                See it in action
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate-500">Free forever for small agencies. Upgrade anytime.</p>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl shadow-black/40">
              <div className="bg-slate-800/80 px-4 py-2.5 flex items-center gap-2 border-b border-slate-700/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-slate-500 ml-2 font-mono">agencyos.app/dashboard</span>
              </div>
              <div className="bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#0B1120] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm text-white font-semibold">Good morning, Sarah</h3>
                    <p className="text-slate-500 text-xs">Your AI briefing for today</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  {[
                    { label: 'Top Priority', text: '3 overdue tasks need attention', sub: '2 in Acme Corp project', color: 'text-red-400' },
                    { label: 'At Risk', text: 'TechStart health dropped to 45', sub: 'No contact in 12 days', color: 'text-amber-400' },
                    { label: 'Today', text: '4 meetings scheduled', sub: 'First at 10:00 AM', color: 'text-blue-400' },
                  ].map((card) => (
                    <div key={card.label} className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <p className={`text-[10px] font-semibold mb-1 uppercase tracking-wider ${card.color}`}>{card.label}</p>
                      <p className="text-white text-sm font-medium">{card.text}</p>
                      <p className="text-slate-500 text-xs mt-1">{card.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-10 border-b border-[var(--border)]" aria-label="Trusted by agencies">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-medium text-[var(--muted-foreground)] mb-5 uppercase tracking-wider">Trusted by leading digital agencies</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-40">
            {['Pixel Studio', 'Bright Digital', 'Catalyst Agency', 'Nova Creative', 'Pulse Media'].map(name => (
              <span key={name} className="text-sm sm:text-base font-bold text-[var(--foreground)] tracking-tight">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 text-xs text-blue-500 font-semibold uppercase tracking-wider">
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight">Everything your agency needs</h2>
            <p className="mt-4 text-base sm:text-lg text-[var(--muted-foreground)]">
              Purpose-built tools that understand how agencies actually work.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card-elevated p-6 sm:p-7 cursor-pointer group"
                role="article"
                tabIndex={0}
                aria-label={feature.title}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" className="py-16 sm:py-24 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 text-xs text-blue-500 font-semibold uppercase tracking-wider">
              Why AgencyOS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight">See how we compare</h2>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[500px]" role="table">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left p-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider" scope="col">Feature</th>
                  <th className="p-4 text-center" scope="col">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)]">
                      <Zap className="w-3.5 h-3.5" /> AgencyOS
                    </div>
                  </th>
                  <th className="p-4 text-center text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider" scope="col">Notion</th>
                  <th className="p-4 text-center text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider" scope="col">Asana</th>
                  <th className="p-4 text-center text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider" scope="col">HubSpot</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--secondary)]/50 transition-colors`}>
                    <td className="p-4 text-sm text-[var(--foreground)] font-medium">{row.feature}</td>
                    <td className="p-4 text-center">
                      {row.agencyOS === true ? <Check className="w-5 h-5 text-[var(--primary)] mx-auto" /> :
                       row.agencyOS === 'limited' ? <span className="text-xs text-[var(--muted-foreground)]">Limited</span> :
                       <span className="text-xs text-[var(--muted-foreground)]/50">—</span>}
                    </td>
                    <td className="p-4 text-center">
                      {row.notion === true ? <Check className="w-5 h-5 text-[var(--muted-foreground)]/40 mx-auto" /> :
                       row.notion === 'limited' ? <span className="text-xs text-[var(--muted-foreground)]">Limited</span> :
                       <span className="text-xs text-[var(--muted-foreground)]/30">—</span>}
                    </td>
                    <td className="p-4 text-center">
                      {row.asana === true ? <Check className="w-5 h-5 text-[var(--muted-foreground)]/40 mx-auto" /> :
                       row.asana === 'limited' ? <span className="text-xs text-[var(--muted-foreground)]">Limited</span> :
                       <span className="text-xs text-[var(--muted-foreground)]/30">—</span>}
                    </td>
                    <td className="p-4 text-center">
                      {row.hubspot === true ? <Check className="w-5 h-5 text-[var(--muted-foreground)]/40 mx-auto" /> :
                       row.hubspot === 'partial' || row.hubspot === 'paid' ? <span className="text-xs text-[var(--muted-foreground)]">{row.hubspot}</span> :
                       <span className="text-xs text-[var(--muted-foreground)]/30">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24" aria-label="Testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4 text-xs text-amber-500 font-semibold uppercase tracking-wider">
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight">Loved by agency teams</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="card-elevated p-6 sm:p-7">
                <div className="flex gap-0.5 mb-3" role="img" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-5">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{t.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 bg-[var(--card)] border-y border-[var(--border)]" aria-label="Pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 text-xs text-emerald-500 font-semibold uppercase tracking-wider">
              Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] tracking-tight">Simple, transparent pricing</h2>
            <p className="mt-4 text-base sm:text-lg text-[var(--muted-foreground)]">Start free. Upgrade when you need more.</p>
          </div>
          <div className="flex items-center justify-center gap-2 mb-10">
            <button onClick={() => setBilling('monthly')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${billing === 'monthly' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--secondary)]'}`}>Monthly</button>
            <button onClick={() => setBilling('annual')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${billing === 'annual' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--secondary)]'}`}>
              Annual
              <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-1.5 py-0.5 rounded font-semibold">Save 20%</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {pricingTiers.map((tier) => (
              <div key={tier.name} className={`rounded-2xl p-6 sm:p-7 ${tier.popular ? 'bg-[var(--primary)] text-white ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--background)] shadow-xl shadow-[var(--primary)]/20' : 'bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary)]/30'} transition-all duration-200`}>
                {tier.popular && <span className="inline-block px-2.5 py-0.5 rounded-md bg-white/20 text-xs font-semibold mb-3">Most Popular</span>}
                <h3 className={`text-lg font-bold ${tier.popular ? '' : 'text-[var(--foreground)]'}`}>{tier.name}</h3>
                <div className="mt-3 mb-5 flex items-baseline gap-1">
                  <span className={`text-4xl sm:text-5xl font-bold tracking-tight ${tier.popular ? '' : 'text-[var(--foreground)]'}`}>{tier.price}</span>
                  <span className={`text-sm ${tier.popular ? 'text-white/60' : 'text-[var(--muted-foreground)]'}`}>{tier.period}</span>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${tier.popular ? 'text-white/70' : 'text-[var(--primary)]'}`} />
                      <span className={tier.popular ? 'text-white/80' : 'text-[var(--muted-foreground)]'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onNavigateToApp}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ${tier.popular ? 'bg-white text-[var(--primary)] hover:bg-white/90' : 'bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90'}`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }} />
        <div className="absolute inset-0 gradient-mesh" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Rocket className="w-10 h-10 text-blue-400 mx-auto mb-5" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">Ready to transform your agency?</h2>
          <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-xl mx-auto">
            Join hundreds of agencies using AI to work smarter. Free forever for small teams.
          </p>
          <Button size="lg" onClick={onNavigateToApp} className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 shadow-xl shadow-[var(--primary)]/25 px-8 py-6 text-sm sm:text-base font-semibold cursor-pointer">
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-[var(--border)]" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-[var(--foreground)] tracking-tight">AgencyOS</span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">© 2026 AgencyOS</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Privacy</a>
              <a href="#" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
