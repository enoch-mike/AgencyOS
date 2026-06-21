// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Shogo Technologies, Inc.
import { useState, useEffect } from 'react'
import { Dashboard } from './components/Dashboard'
import { Clients } from './components/Clients'
import { Projects } from './components/Projects'
import { Tasks } from './components/Tasks'
import { Meetings } from './components/Meetings'
import { PricingPage } from './components/PricingPage'
import { BillingSettings } from './components/BillingSettings'
import { Integrations } from './components/Integrations'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { SubscriptionProvider, useSubscription } from './lib/subscription'
import { AuthProvider, useAuth } from './lib/auth'
import { LoginPage } from './components/LoginPage'
import { LandingPage } from './components/LandingPage'
import { AIAssistant } from './components/AIAssistant'
import { ThemeProvider, useTheme } from './components/ThemeProvider'
import { Loader2, Menu, LayoutDashboard, Users, FolderKanban, CheckSquare, Calendar, Sparkles } from 'lucide-react'
import { cn } from './lib/cn'

export type View = 'dashboard' | 'clients' | 'projects' | 'tasks' | 'meetings' | 'pricing' | 'billing' | 'integrations'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return isMobile
}

const mobileNavItems: { id: View; icon: typeof LayoutDashboard; label: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { id: 'clients', icon: Users, label: 'Clients' },
  { id: 'projects', icon: FolderKanban, label: 'Projects' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
  { id: 'meetings', icon: Calendar, label: 'Meetings' },
]

function MobileBottomNav({ currentView, onNavigate, onOpenAI }: { currentView: View; onNavigate: (v: View) => void; onOpenAI: () => void }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--sidebar-bg)] border-t border-[var(--border)] px-2 py-1 z-40 safe-area-bottom">
      <div className="flex items-center justify-around">
        {mobileNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-2 transition-colors min-w-[52px]",
              currentView === item.id
                ? "text-[var(--primary)]"
                : "text-[var(--muted-foreground)]"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-semibold">{item.label}</span>
          </button>
        ))}
        <button
          onClick={onOpenAI}
          className="flex flex-col items-center gap-0.5 px-2 py-2 text-[var(--accent)] min-w-[52px]"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[9px] font-semibold">AI</span>
        </button>
      </div>
    </nav>
  )
}

function MobileDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className={cn("fixed inset-0 z-50 md:hidden", open ? "pointer-events-auto" : "pointer-events-none")}>
      <div className={cn("absolute inset-0 bg-black/50 transition-opacity duration-200", open ? "opacity-100" : "opacity-0")} onClick={onClose} />
      <div className={cn("absolute left-0 top-0 bottom-0 w-64 transition-transform duration-300 ease-in-out", open ? "translate-x-0" : "-translate-x-full")}>
        {children}
      </div>
    </div>
  )
}

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { plan } = useSubscription()
  const isMobile = useIsMobile()

  const handleNavigate = (view: View) => {
    setCurrentView(view)
    setMobileMenuOpen(false)
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-[var(--page-bg)] font-sans">
        <header className="bg-[var(--sidebar-bg)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors cursor-pointer">
            <Menu className="w-5 h-5 text-[var(--foreground)]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="font-bold text-sm text-[var(--foreground)] tracking-tight">AgencyOS</span>
          </div>
          <button onClick={() => setAiOpen(true)} className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors cursor-pointer">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
          </button>
        </header>

        <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          <Sidebar
            currentView={currentView}
            onNavigate={handleNavigate}
            collapsed={false}
            onToggleCollapse={() => setMobileMenuOpen(false)}
            currentPlan={plan}
            onOpenAI={() => { setAiOpen(true); setMobileMenuOpen(false); }}
          />
        </MobileDrawer>

        <main className="flex-1 overflow-auto pb-20 px-4 py-4">
          {currentView === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {currentView === 'clients' && <Clients />}
          {currentView === 'projects' && <Projects />}
          {currentView === 'tasks' && <Tasks />}
          {currentView === 'meetings' && <Meetings />}
          {currentView === 'pricing' && <PricingPage />}
          {currentView === 'billing' && <BillingSettings />}
          {currentView === 'integrations' && <Integrations />}
        </main>

        <MobileBottomNav currentView={currentView} onNavigate={handleNavigate} onOpenAI={() => setAiOpen(true)} />
        <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[var(--page-bg)] font-sans">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPlan={plan}
        onOpenAI={() => setAiOpen(true)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentView={currentView} />
        <main className="flex-1 overflow-auto p-6">
          {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
          {currentView === 'clients' && <Clients />}
          {currentView === 'projects' && <Projects />}
          {currentView === 'tasks' && <Tasks />}
          {currentView === 'meetings' && <Meetings />}
          {currentView === 'pricing' && <PricingPage />}
          {currentView === 'billing' && <BillingSettings />}
          {currentView === 'integrations' && <Integrations />}
        </main>
      </div>
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  )
}

function AuthGate() {
  const { user, loading } = useAuth()
  const [showLanding, setShowLanding] = useState(true)

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
          <p className="text-sm font-medium text-[var(--muted-foreground)]">Loading AgencyOS...</p>
        </div>
      </div>
    )
  }

  if (user) return <AppContent />

  if (showLanding) return <LandingPage onNavigateToApp={() => setShowLanding(false)} />

  return <LoginPage onBackToLanding={() => setShowLanding(true)} />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <AuthGate />
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
