import { useState } from 'react'
import {
  LayoutDashboard, Users, FolderKanban, CheckSquare, Calendar,
  Zap, ChevronLeft, ChevronRight, CreditCard, Sparkles, Plug, Moon, Sun
} from 'lucide-react'
import type { View } from '../App'
import { cn } from '../lib/cn'
import type { Plan } from '../lib/subscription'
import { useTheme } from './ThemeProvider'

interface SidebarProps {
  currentView: View
  onNavigate: (view: View) => void
  collapsed: boolean
  onToggleCollapse: () => void
  currentPlan: Plan
  onOpenAI?: () => void
}

const navItems: { id: View; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users, badge: 12 },
  { id: 'projects', label: 'Projects', icon: FolderKanban, badge: 18 },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: 7 },
  { id: 'meetings', label: 'Meetings', icon: Calendar, badge: 2 },
  { id: 'integrations', label: 'Integrations', icon: Plug },
]

const planLabels: Record<Plan, { label: string; color: string }> = {
  free: { label: 'Free', color: 'bg-[#64748B] text-white' },
  starter: { label: 'Starter', color: 'bg-[#3B82F6] text-white' },
  pro: { label: 'Pro', color: 'bg-[#818CF8] text-white' },
  enterprise: { label: 'Enterprise', color: 'bg-[#F59E0B] text-[#0F172A]' },
}

export function Sidebar({ currentView, onNavigate, collapsed, onToggleCollapse, currentPlan, onOpenAI }: SidebarProps) {
  const planInfo = planLabels[currentPlan]
  const { theme, toggle } = useTheme()

  return (
    <aside className={cn(
      "flex flex-col transition-all duration-300 border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]",
      collapsed ? "w-[68px]" : "w-60"
    )} role="navigation" aria-label="Sidebar navigation">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-[var(--sidebar-border)]">
        <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center shrink-0">
          <Zap className="w-[18px] h-[18px] text-white" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <span className="font-bold text-[15px] tracking-tight text-[var(--foreground)]">AgencyOS</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-[var(--sidebar-hover)] text-[var(--muted-foreground)] transition-all duration-200 cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2.5 space-y-0.5">
        {navItems.map(item => {
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer text-sm font-medium",
                isActive
                  ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)]"
                  : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
              )}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-md font-semibold",
                      isActive
                        ? "bg-[var(--primary)]/15 text-[var(--primary)]"
                        : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          )
        })}
      </nav>

      {/* AI Assistant */}
      <div className="px-2.5 mb-1.5">
        <button
          onClick={onOpenAI}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white transition-all duration-200 cursor-pointer text-sm font-semibold shadow-lg shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/30"
        >
          <Sparkles className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>AI Assistant</span>}
        </button>
      </div>

      {/* Theme Toggle + Plan */}
      {!collapsed && (
        <div className="px-2.5 mb-2">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)] transition-all duration-200 cursor-pointer text-sm font-medium"
          >
            {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      )}

      {/* Bottom */}
      <div className="p-2.5 border-t border-[var(--sidebar-border)] space-y-0.5">
        {!collapsed && (
          <button
            onClick={() => onNavigate('pricing')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--sidebar-hover)] transition-all duration-200 cursor-pointer"
          >
            <span className={cn("text-[10px] px-2 py-0.5 rounded-md font-semibold", planInfo.color)}>
              {planInfo.label}
            </span>
            {currentPlan === 'free' && (
              <span className="text-[10px] text-[var(--primary)] font-semibold">Upgrade</span>
            )}
          </button>
        )}
        <button
          onClick={() => onNavigate('billing')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)] transition-all duration-200 cursor-pointer text-sm font-medium"
        >
          <CreditCard className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Billing</span>}
        </button>
      </div>
    </aside>
  )
}
