import { useState } from 'react'
import { Search, Bell, Mic, Plus, Moon, Sun } from 'lucide-react'
import type { View } from '../App'
import { useTheme } from './ThemeProvider'

interface TopBarProps {
  currentView: View
}

const viewTitles: Record<View, string> = {
  dashboard: 'Dashboard',
  clients: 'Clients',
  projects: 'Projects',
  tasks: 'Tasks',
  meetings: 'Meetings',
  pricing: 'Pricing',
  billing: 'Billing',
  integrations: 'Integrations',
}

const viewDescriptions: Record<View, string> = {
  dashboard: "What's happening across your agency right now.",
  clients: "All client relationships in one view.",
  projects: "Active projects, budgets, and timelines.",
  tasks: "Everything that needs to get done.",
  meetings: "Notes, transcripts, and action items.",
  pricing: "Choose your plan.",
  billing: "Manage your subscription.",
  integrations: "Connect your tools.",
}

export function TopBar({ currentView }: TopBarProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, toggle } = useTheme()

  return (
    <header className="glass border-b border-[var(--border)] px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-4">
        {/* Left */}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
            {viewTitles[currentView]}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5 hidden sm:block">{viewDescriptions[currentView]}</p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-10 py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all duration-200 placeholder:text-[var(--muted-foreground)]"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted-foreground)] bg-[var(--background)] border border-[var(--border)] px-1.5 py-0.5 rounded font-medium">
              ⌘K
            </kbd>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] transition-all duration-200 cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[var(--muted-foreground)]" /> : <Moon className="w-4 h-4 text-[var(--muted-foreground)]" />}
          </button>

          {/* Voice */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border ${
              isRecording
                ? 'bg-[var(--destructive)] text-white border-[var(--destructive)] animate-pulse'
                : 'bg-[var(--primary)] text-white border-[var(--primary)] hover:bg-[var(--primary)]/90'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isRecording ? 'Recording...' : 'Voice'}</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] transition-all duration-200 cursor-pointer">
            <Bell className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--destructive)] rounded-full flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">3</span>
            </span>
          </button>

          {/* Add New */}
          <button className="flex items-center gap-1.5 bg-[var(--primary)] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[var(--primary)]/90 transition-all duration-200 cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-3 flex items-center gap-2 text-xs overflow-x-auto pb-1 scrollbar-hide">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] font-semibold shrink-0">
          <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse" />
          3 AI Insights
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--destructive)]/10 text-[var(--destructive)] font-semibold shrink-0">
          2 deadlines today
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-semibold shrink-0">
          5 tasks done this week
        </span>
      </div>
    </header>
  )
}
