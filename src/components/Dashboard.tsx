import { useState, useEffect } from 'react'
import {
  AlertTriangle, Clock, Calendar, Users, FolderKanban, CheckSquare,
  TrendingUp, TrendingDown, Sparkles, Brain, Target,
  Activity, Loader2, RefreshCw, DollarSign,
  Video, FileText, Zap, ArrowUpRight, CheckCircle2, Play, MessageSquare
} from 'lucide-react'
import type { View } from '../App'
import { useTheme } from './ThemeProvider'

interface DashboardProps {
  onNavigate: (view: View) => void
}

interface Stats {
  activeClients: number
  activeProjects: number
  pendingTasks: number
  totalMeetings: number
  completedTasks: number
  urgentTasks: number
}

interface BriefingData {
  briefing: string | null
  greeting?: string
  generatedAt?: string
  fallback?: boolean
  urgentTasks?: any[]
  todayMeetings?: any[]
  clientStats?: any[]
}

function BriefingRenderer({ text }: { text: string }) {
  const clean = (s: string) => s.replace(/\*\*/g, '').replace(/^[•\-]\s*/, '').trim()
  const sections: { title: string; icon: string; items: string[] }[] = []
  const lines = text.split('\n').filter(l => l.trim())
  let current: { title: string; icon: string; items: string[] } | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    const numberedMatch = trimmed.match(/^(\d+)\.\s*\*?\*?(.+?)[\*:]*\s*$/)
    const isNumbered = numberedMatch && numberedMatch[2].length < 60
    const isHeader = /^#{1,3}\s/.test(trimmed) || isNumbered

    if (isHeader || (numberedMatch && numberedMatch[2])) {
      const iconMap: Record<string, string> = {
        'top priority': '🔥', 'priority': '🔥', 'urgent': '🔴',
        'alert': '⚠️', 'at risk': '⚠️', 'risk': '⚠️',
        'today': '📅', 'focus': '🎯', 'insight': '💡', 'action': '⚡',
        'meeting': '📋', 'client': '👥', 'task': '✅', 'summary': '📊',
      }
      const title = clean(numberedMatch ? numberedMatch[2] : trimmed.replace(/^#{1,3}\s*/, ''))
      const titleLower = title.toLowerCase()
      let icon = '📌'
      for (const [key, val] of Object.entries(iconMap)) {
        if (titleLower.includes(key)) { icon = val; break }
      }
      if (current) sections.push(current)
      current = { title, icon, items: [] }
    } else {
      const item = clean(trimmed)
      if (item && current) current.items.push(item)
      else if (item && !current) current = { title: 'Overview', icon: '📊', items: [item] }
    }
  }
  if (current) sections.push(current)

  if (sections.length === 0 && text.trim()) {
    return <p className="mt-3 text-[var(--muted-foreground)] text-sm leading-relaxed">{clean(text).substring(0, 200)}{clean(text).length > 200 ? '…' : ''}</p>
  }

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {sections.map((section, i) => (
        <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm">{section.icon}</span>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{section.title}</span>
          </div>
          {section.items.length === 1 ? (
            <p className="text-xs text-slate-400 pl-7">{section.items[0]}</p>
          ) : (
            <ul className="space-y-0.5 pl-7">
              {section.items.slice(0, 3).map((item, j) => (
                <li key={j} className="text-xs text-slate-400 list-disc marker:text-slate-600">{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

const mockActivity = [
  { icon: CheckCircle2, color: 'bg-emerald-500', text: 'Emily completed "Increase LinkedIn posts"', time: '12 min ago', entity: 'Social Media Campaign' },
  { icon: MessageSquare, color: 'bg-blue-500', text: 'Meeting summary generated for Meridian Corp', time: '1 hour ago', entity: 'Website Redesign' },
  { icon: AlertTriangle, color: 'bg-red-500', text: 'Budget alert: Nexus Studios at 68%', time: '2 hours ago', entity: 'Brand Identity' },
  { icon: FileText, color: 'bg-violet-500', text: 'AI extracted 3 action items from weekly sync', time: '3 hours ago', entity: 'Brightside Marketing' },
  { icon: Users, color: 'bg-amber-500', text: 'New contact added: David Park (Verdant Health)', time: '5 hours ago', entity: 'Client Update' },
  { icon: CheckCircle2, color: 'bg-emerald-500', text: 'Milestone reached: Frontend Development (75%)', time: 'Yesterday', entity: 'Website Redesign' },
  { icon: Play, color: 'bg-blue-500', text: 'Voice capture uploaded: Sprint planning notes', time: 'Yesterday', entity: 'Product Launch' },
  { icon: DollarSign, color: 'bg-emerald-500', text: 'Payment received: $29.00 (Starter Plan)', time: 'Jun 1', entity: 'Billing' },
]

const mockUpcomingMeetings = [
  { title: 'Discovery Call — Meridian Corp', time: 'Today, 2:00 PM', duration: '45 min', source: 'Zoom', attendees: ['Sarah', 'Alex'], hasAI: true },
  { title: 'Strategy Review — Nexus Studios', time: 'Tomorrow, 10:00 AM', duration: '60 min', source: 'Google Meet', attendees: ['Marcus', 'Alex'], hasAI: true },
  { title: 'Weekly Sync — Brightside Marketing', time: 'Jun 20, 9:00 AM', duration: '30 min', source: 'Recorded', attendees: ['Emily'], hasAI: false },
]

const mockAtRiskItems = [
  { type: 'client', label: 'Verdant Health', detail: 'Health score dropped to 45 — no contact in 7 days', urgency: 'high' as const },
  { type: 'budget', label: 'Nexus Studios', detail: 'Brand Identity at 68% budget — 40% through project', urgency: 'high' as const },
  { type: 'task', label: '2 tasks overdue', detail: 'Wireframe mockups + Photography research', urgency: 'medium' as const },
]

const mockRevenue = [
  { month: 'Feb', amount: 18000 },
  { month: 'Mar', amount: 32000 },
  { month: 'Apr', amount: 45000 },
  { month: 'May', amount: 58000 },
  { month: 'Jun', amount: 38000 },
]

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [briefing, setBriefing] = useState<BriefingData | null>(null)
  const [briefingLoading, setBriefingLoading] = useState(true)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const load = async () => {
      try {
        const statsRes = await fetch('/api/dashboard/stats').then(r => r.json())
        setStats(statsRes)
      } catch {
        setStats({ activeClients: 8, activeProjects: 4, pendingTasks: 42, totalMeetings: 23, completedTasks: 156, urgentTasks: 5 })
      }
    }
    load()
  }, [])

  const fetchBriefing = async () => {
    setBriefingLoading(true)
    try {
      const res = await fetch('/api/ai/briefing')
      const data = await res.json()
      setBriefing(data)
    } catch { /* fallback */ } finally {
      setBriefingLoading(false)
    }
  }

  useEffect(() => { fetchBriefing() }, [])

  const greeting = briefing?.greeting || "Good morning"
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const maxRevenue = Math.max(...mockRevenue.map(r => r.amount))

  return (
    <div className="space-y-5" role="main" aria-label="Dashboard">
      {/* AI Briefing */}
      <div className="rounded-2xl overflow-hidden shadow-lg shadow-black/10 dark:shadow-black/30 border border-[var(--border)]">
        <div className="relative p-5 sm:p-7" style={{ background: 'var(--hero-gradient)' }}>
          <div className="absolute inset-0 gradient-mesh opacity-50" />
          <div className="relative flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">{greeting}</h2>
                  <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider mt-0.5">AI Briefing · {timeStr}</p>
                </div>
                <button onClick={fetchBriefing} disabled={briefingLoading} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10" aria-label="Refresh briefing">
                  <RefreshCw className={`w-4 h-4 text-slate-400 ${briefingLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {briefingLoading ? (
                <div className="mt-4 flex items-center gap-2 text-blue-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Generating your briefing...</span>
                </div>
              ) : briefing?.briefing ? (
                <BriefingRenderer text={briefing.briefing} />
              ) : (
                <p className="mt-4 text-slate-400 text-sm">Welcome to your agency dashboard.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Clients', value: stats?.activeClients ?? 0, icon: Users, change: '+2 this month', gradient: 'from-blue-500/10 to-blue-600/5' },
          { label: 'Active Projects', value: stats?.activeProjects ?? 0, icon: FolderKanban, change: '1 due soon', gradient: 'from-violet-500/10 to-violet-600/5' },
          { label: 'Completed Tasks', value: stats?.completedTasks ?? 0, icon: CheckSquare, change: '+18 this week', gradient: 'from-emerald-500/10 to-emerald-600/5' },
          { label: 'Revenue (MTD)', value: '$38K', icon: DollarSign, change: '+12% vs last month', gradient: 'from-amber-500/10 to-amber-600/5' },
        ].map((stat) => (
          <div key={stat.label} className="card-elevated p-5 group cursor-pointer" role="article" aria-label={`${stat.label}: ${stat.value}`}>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
              <stat.icon className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">{stat.value}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{stat.label}</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] text-emerald-500 font-semibold">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card-elevated p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">Revenue</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">$38K</span>
              <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">+12%</span>
            </div>
          </div>
          <div className="flex items-baseline gap-5 text-right">
            <div>
              <p className="text-[10px] text-[var(--muted-foreground)] font-medium uppercase tracking-wider">Lifetime</p>
              <p className="text-sm font-bold text-[var(--foreground)]">$191K</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--muted-foreground)] font-medium uppercase tracking-wider">Outstanding</p>
              <p className="text-sm font-bold text-amber-500">$4.2K</p>
            </div>
          </div>
        </div>
        <div className="flex items-end gap-2 h-36 sm:h-44 border-b border-[var(--border)] pb-2">
          {mockRevenue.map((r, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-[var(--muted-foreground)] font-mono font-medium">${(r.amount / 1000).toFixed(0)}k</span>
              <div
                className={`w-full rounded-t-lg transition-all duration-300 ${i === mockRevenue.length - 1 ? 'bg-[var(--primary)]' : 'bg-[var(--primary)]/20 hover:bg-[var(--primary)]/30'}`}
                style={{ height: `${(r.amount / maxRevenue) * 100}%` }}
              />
              <span className="text-[10px] text-[var(--muted-foreground)] font-medium">{r.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two-col: Meetings + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Meetings */}
        <div className="card-elevated p-5 sm:p-6" role="section" aria-label="Upcoming meetings">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[var(--primary)]" />
              <h3 className="font-semibold text-[var(--foreground)] text-sm">Upcoming Meetings</h3>
            </div>
            <button onClick={() => onNavigate('meetings')} className="text-xs text-[var(--primary)] hover:text-[var(--primary)]/80 font-medium cursor-pointer">
              View all →
            </button>
          </div>
          <div className="space-y-2.5">
            {mockUpcomingMeetings.map((m, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 transition-colors cursor-pointer border border-transparent hover:border-[var(--border)]">
                <div className="flex items-start justify-between mb-1.5">
                  <p className="text-sm font-medium text-[var(--foreground)] flex-1 pr-2">{m.title}</p>
                  {m.hasAI && <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />{m.time}
                  </span>
                  <span className="text-[10px] text-[var(--border)]">·</span>
                  <span className="text-[10px] text-[var(--muted-foreground)]">{m.duration}</span>
                  <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded-md font-medium">{m.source}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {m.attendees.map((a, j) => (
                    <div key={j} className="w-5 h-5 bg-[var(--border)] rounded-full flex items-center justify-center text-[9px] font-bold text-[var(--muted-foreground)]">
                      {a[0]}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="card-elevated p-5 sm:p-6" role="section" aria-label="Alerts">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold text-[var(--foreground)] text-sm">Needs Attention</h3>
            </div>
            <span className="text-[10px] font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">{mockAtRiskItems.length} alerts</span>
          </div>
          <div className="space-y-2.5">
            {mockAtRiskItems.map((item, i) => (
              <div key={i} className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                item.urgency === 'high'
                  ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                  : 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
              }`}>
                <div className="flex items-start gap-2.5">
                  {item.urgency === 'high' ? (
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${item.urgency === 'high' ? 'text-red-400' : 'text-amber-400'}`}>{item.label}</p>
                    <p className={`text-xs mt-0.5 ${item.urgency === 'high' ? 'text-red-400/60' : 'text-amber-400/60'}`}>{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate('tasks')} className="w-full mt-3 p-3 border-2 border-dashed border-[var(--border)] rounded-xl text-xs font-medium text-[var(--muted-foreground)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-colors cursor-pointer">
            View all tasks →
          </button>
        </div>
      </div>

      {/* Bottom row: Activity + Quick Actions + Client Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity */}
        <div className="card-elevated p-5 sm:p-6" role="section" aria-label="Activity feed">
          <div className="flex items-center gap-2.5 mb-4">
            <Activity className="w-4 h-4 text-violet-500" />
            <h3 className="font-semibold text-[var(--foreground)] text-sm">Activity</h3>
          </div>
          <div className="space-y-3">
            {mockActivity.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-2.5 group cursor-pointer">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug">{item.text}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-[var(--muted-foreground)] font-mono">{item.time}</span>
                      <span className="text-[10px] text-[var(--border)]">·</span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">{item.entity}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions + Client Health */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Actions */}
          <div className="card-elevated p-5 sm:p-6" role="section" aria-label="Quick actions">
            <div className="flex items-center gap-2.5 mb-4">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-[var(--foreground)] text-sm">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Users, label: 'Add Client', color: 'from-blue-500 to-blue-600', view: 'clients' as View },
                { icon: FolderKanban, label: 'New Project', color: 'from-violet-500 to-violet-600', view: 'projects' as View },
                { icon: CheckSquare, label: 'Add Task', color: 'from-emerald-500 to-emerald-600', view: 'tasks' as View },
                { icon: Video, label: 'New Meeting', color: 'from-amber-500 to-amber-600', view: 'meetings' as View },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(action.view)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 transition-all duration-200 cursor-pointer border border-[var(--border)] hover:border-[var(--primary)]/30 group"
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--foreground)]">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Client Health */}
          <div className="card-elevated p-5 sm:p-6" role="section" aria-label="Client health scores">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Target className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="font-semibold text-[var(--foreground)] text-sm">Client Health</h3>
              </div>
              <button onClick={() => onNavigate('clients')} className="text-xs text-[var(--primary)] hover:text-[var(--primary)]/80 font-medium cursor-pointer">
                View all →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Meridian Corp', score: 92, trend: 'stable' as const, barColor: 'bg-emerald-500' },
                { name: 'Brightside', score: 88, trend: 'improving' as const, barColor: 'bg-emerald-500' },
                { name: 'Nexus Studios', score: 68, trend: 'declining' as const, barColor: 'bg-amber-500' },
                { name: 'Verdant Health', score: 45, trend: 'declining' as const, barColor: 'bg-red-500' },
              ].map((client, i) => (
                <div key={i} className="p-3 rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 transition-colors cursor-pointer border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-[var(--foreground)] truncate">{client.name}</p>
                    <span className="text-lg font-bold text-[var(--foreground)] font-mono">{client.score}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full">
                      <div className={`h-1.5 rounded-full ${client.barColor}`} style={{ width: `${client.score}%` }} />
                    </div>
                    {client.trend === 'declining' && <TrendingDown className="w-3 h-3 text-red-500" />}
                    {client.trend === 'improving' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                    {client.trend === 'stable' && <span className="text-[8px] text-[var(--muted-foreground)]">—</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
