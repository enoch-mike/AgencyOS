import { useState } from 'react'
import {
  Plus, Filter, MoreHorizontal, Calendar, Users,
  AlertTriangle, CheckCircle2, Clock, ChevronDown,
  BarChart3, ArrowUpRight, DollarSign, Target, TrendingUp,
  ArrowLeft, Star, FileText, Download, ExternalLink,
  MessageSquare, Sparkles, Award, TrendingDown, Check
} from 'lucide-react'

interface Project {
  id: string
  name: string
  client: string
  status: 'planning' | 'active' | 'paused' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  deadline: string
  budget: number
  spent: number
  tasksTotal: number
  tasksCompleted: number
  team: string[]
  description: string
  completedDate?: string
  deliverables?: { name: string; status: 'delivered' | 'approved' | 'revision' }[]
  milestones?: { name: string; date: string; completed: boolean }[]
  feedback?: { author: string; role: string; rating: number; comment: string; date: string }[]
  activity?: { type: 'task' | 'meeting' | 'milestone' | 'comment' | 'file'; text: string; date: string; by: string }[]
  budgetBreakdown?: { category: string; allocated: number; spent: number }[]
  tags?: string[]
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    client: 'Meridian Corp',
    status: 'active',
    priority: 'high',
    progress: 65,
    deadline: 'Jun 28, 2026',
    budget: 45000,
    spent: 28500,
    tasksTotal: 24,
    tasksCompleted: 16,
    team: ['Sarah', 'Marcus', 'David'],
    description: 'Complete website redesign with modern UI/UX, mobile-first approach, and CMS integration.'
  },
  {
    id: '2',
    name: 'Brand Identity Refresh',
    client: 'Nexus Studios',
    status: 'active',
    priority: 'urgent',
    progress: 40,
    deadline: 'Jun 21, 2026',
    budget: 32000,
    spent: 22000,
    tasksTotal: 18,
    tasksCompleted: 7,
    team: ['Marcus', 'Emily'],
    description: 'Brand exploration, logo design, color palette, typography, and brand guidelines.'
  },
  {
    id: '3',
    name: 'Social Media Campaign',
    client: 'Brightside Marketing',
    status: 'active',
    priority: 'medium',
    progress: 80,
    deadline: 'Jun 30, 2026',
    budget: 28000,
    spent: 18500,
    tasksTotal: 32,
    tasksCompleted: 26,
    team: ['Emily', 'Sarah'],
    description: 'Multi-platform social media campaign including content creation, scheduling, and analytics.'
  },
  {
    id: '4',
    name: 'Product Launch Strategy',
    client: 'Verdant Health',
    status: 'planning',
    priority: 'medium',
    progress: 15,
    deadline: 'Jul 15, 2026',
    budget: 55000,
    spent: 4500,
    tasksTotal: 28,
    tasksCompleted: 4,
    team: ['Alex', 'Marcus', 'Emily', 'Sarah'],
    description: 'Complete product launch strategy including market research, positioning, and go-to-market plan.'
  },
  {
    id: '5',
    name: 'Website Maintenance',
    client: 'Brightside Marketing',
    status: 'active',
    priority: 'low',
    progress: 90,
    deadline: 'Ongoing',
    budget: 12000,
    spent: 10800,
    tasksTotal: 12,
    tasksCompleted: 11,
    team: ['David'],
    description: 'Monthly website maintenance, updates, and security patches.'
  },
  {
    id: '6',
    name: 'E-Commerce Platform',
    client: 'Oakwood Retail',
    status: 'completed',
    priority: 'high',
    progress: 100,
    deadline: 'May 15, 2026',
    completedDate: 'May 12, 2026',
    budget: 62000,
    spent: 58200,
    tasksTotal: 36,
    tasksCompleted: 36,
    team: ['Sarah', 'Marcus', 'David', 'Emily'],
    description: 'Full e-commerce platform build with Shopify integration, custom product configurator, and payment processing.',
    tags: ['Shopify', 'React', 'Custom'],
    deliverables: [
      { name: 'Responsive E-Commerce Website', status: 'approved' },
      { name: 'Product Configurator Component', status: 'approved' },
      { name: 'Admin Dashboard', status: 'approved' },
      { name: 'Payment Integration (Stripe)', status: 'approved' },
      { name: 'Analytics & Reporting Panel', status: 'approved' },
      { name: 'Brand Style Guide', status: 'delivered' },
      { name: 'SEO Optimization Report', status: 'delivered' },
    ],
    milestones: [
      { name: 'Discovery & Research', date: 'Feb 10, 2026', completed: true },
      { name: 'UI/UX Design Approval', date: 'Mar 5, 2026', completed: true },
      { name: 'Frontend Development', date: 'Apr 1, 2026', completed: true },
      { name: 'Backend & Integrations', date: 'Apr 20, 2026', completed: true },
      { name: 'QA & Testing', date: 'May 5, 2026', completed: true },
      { name: 'Launch & Handoff', date: 'May 12, 2026', completed: true },
    ],
    feedback: [
      {
        author: 'James Mitchell',
        role: 'CEO, Oakwood Retail',
        rating: 5,
        comment: 'AgencyOS exceeded our expectations. The e-commerce platform they built increased our online sales by 340% in the first month. The product configurator alone drove a 28% increase in average order value.',
        date: 'May 20, 2026',
      },
      {
        author: 'Lisa Park',
        role: 'Marketing Director, Oakwood Retail',
        rating: 5,
        comment: 'The team was incredibly responsive throughout the entire project. The weekly check-ins kept us aligned, and the AI-generated meeting summaries meant we never missed an action item.',
        date: 'May 18, 2026',
      },
    ],
    activity: [
      { type: 'milestone', text: 'Project completed — Launch & Handoff', date: 'May 12', by: 'Sarah' },
      { type: 'file', text: 'Final deliverables package uploaded', date: 'May 12', by: 'Sarah' },
      { type: 'task', text: 'Client sign-off received', date: 'May 12', by: 'Marcus' },
      { type: 'meeting', text: 'Launch review meeting — all KPIs exceeded', date: 'May 11', by: 'Emily' },
      { type: 'comment', text: 'QA passed on all 36 tasks — zero critical bugs', date: 'May 10', by: 'David' },
      { type: 'task', text: 'SEO audit completed — 94/100 score', date: 'May 8', by: 'Emily' },
      { type: 'milestone', text: 'QA & Testing completed', date: 'May 5', by: 'Sarah' },
      { type: 'file', text: 'Analytics dashboard screenshots shared', date: 'May 3', by: 'David' },
      { type: 'meeting', text: 'Final review meeting — 3 minor revisions', date: 'May 1', by: 'Marcus' },
      { type: 'task', text: 'Payment integration testing — all cards passing', date: 'Apr 28', by: 'David' },
      { type: 'milestone', text: 'Backend & Integrations completed', date: 'Apr 20', by: 'Marcus' },
      { type: 'comment', text: 'Client approved custom configurator design', date: 'Apr 15', by: 'Sarah' },
      { type: 'meeting', text: 'Sprint review — 22/24 tasks completed', date: 'Apr 10', by: 'Emily' },
      { type: 'file', text: 'Wireframes v2 delivered', date: 'Mar 5', by: 'Sarah' },
      { type: 'milestone', text: 'UI/UX Design Approval', date: 'Mar 5', by: 'Sarah' },
      { type: 'task', text: 'Competitive analysis completed', date: 'Feb 20', by: 'Emily' },
      { type: 'milestone', text: 'Discovery & Research completed', date: 'Feb 10', by: 'Marcus' },
    ],
    budgetBreakdown: [
      { category: 'Design', allocated: 18000, spent: 17200 },
      { category: 'Development', allocated: 28000, spent: 26800 },
      { category: 'QA & Testing', allocated: 6000, spent: 5400 },
      { category: 'Project Management', allocated: 5000, spent: 4800 },
      { category: 'Infrastructure', allocated: 5000, spent: 4000 },
    ],
  },
]

const statusColors = {
  planning: 'bg-gray-100 text-gray-700',
  active: 'bg-blue-100 text-blue-700',
  paused: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700'
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600'
}

const activityIcons: Record<string, typeof Check> = {
  task: CheckCircle2,
  meeting: MessageSquare,
  milestone: Award,
  comment: MessageSquare,
  file: FileText,
}

const activityColors: Record<string, string> = {
  task: 'bg-green-100 text-green-600',
  meeting: 'bg-blue-100 text-blue-600',
  milestone: 'bg-violet-100 text-violet-600',
  comment: 'bg-amber-100 text-amber-600',
  file: 'bg-gray-100 text-gray-600',
}

function ProjectDetailView({ project, onBack }: { project: Project; onBack: () => void }) {
  const budgetUsed = (project.spent / project.budget) * 100
  const budgetColor = budgetUsed > 95 ? 'text-red-600' : budgetUsed > 80 ? 'text-amber-600' : 'text-green-600'

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl">
      {/* Back button + Header */}
      <div>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to projects
        </button>
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-5 sm:p-8 text-white shadow-xl shadow-violet-500/20">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                <span className="text-xs sm:text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  ✓ Completed
                </span>
                {project.tags?.map(tag => (
                  <span key={tag} className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-2">{project.name}</h2>
              <p className="text-white/70 text-xs sm:text-sm mt-1">{project.client} · Delivered {project.completedDate}</p>
            </div>
            <div className="flex gap-2 self-start">
              <button className="px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs sm:text-sm font-medium backdrop-blur-sm transition-colors flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button className="px-3 sm:px-4 py-2 bg-white text-violet-600 hover:bg-white/90 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">View Site</span>
                <span className="sm:hidden">Live</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-500">Duration</span>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">92</p>
          <p className="text-xs text-gray-500 mt-0.5">days (Feb 10 → May 12)</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-500">Budget</span>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${budgetColor}`}>93.9%</p>
          <p className="text-xs text-gray-500 mt-0.5">${(project.spent / 1000).toFixed(1)}k of ${(project.budget / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-500">Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{project.tasksCompleted}/{project.tasksTotal}</p>
          <p className="text-xs text-gray-500 mt-0.5">100% completion</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-500">Client Rating</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">5.0</p>
          <div className="flex gap-0.5 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column — wider */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Deliverables */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-500" />
              Deliverables
            </h3>
            <div className="space-y-2">
              {project.deliverables?.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.status === 'approved' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {item.status === 'approved' ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Download className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-700 truncate">{item.name}</span>
                  </div>
                  <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-violet-500" />
              Budget Breakdown
            </h3>
            <div className="space-y-3">
              {project.budgetBreakdown?.map((item, i) => {
                const pct = (item.spent / item.allocated) * 100
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm text-gray-700">{item.category}</span>
                      <span className="text-xs sm:text-sm text-gray-500">${(item.spent / 1000).toFixed(1)}k / ${(item.allocated / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${pct > 95 ? 'bg-red-500' : pct > 85 ? 'bg-amber-500' : 'bg-violet-500'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">${(project.spent / 1000).toFixed(1)}k</span>
                <span className="text-xs text-gray-500 ml-1">/ ${(project.budget / 1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>

          {/* Client Feedback */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-violet-500" />
              Client Feedback
            </h3>
            <div className="space-y-4">
              {project.feedback?.map((fb, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-xs font-bold text-violet-600">
                      {fb.author[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{fb.author}</p>
                      <p className="text-[10px] text-gray-500">{fb.role}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 ml-auto hidden sm:inline">{fb.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: fb.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{fb.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — narrower */}
        <div className="space-y-4 sm:space-y-6">
          {/* Milestones */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-500" />
              Milestones
            </h3>
            <div className="relative">
              <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-green-200" />
              <div className="space-y-3">
                {project.milestones?.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      m.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {m.completed ? <Check className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{m.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">{m.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-500" />
              Team
            </h3>
            <div className="space-y-2.5">
              {project.team.map((member, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                    {member[0]}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700">{member}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-500" />
              Activity Timeline
            </h3>
            <div className="space-y-3 max-h-80 overflow-auto">
              {project.activity?.map((item, i) => {
                const Icon = activityIcons[item.type] || CheckCircle2
                const color = activityColors[item.type] || 'bg-gray-100 text-gray-600'
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${color}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-700 leading-relaxed">{item.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.by} · {item.date}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Projects() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects = filterStatus === 'all'
    ? mockProjects
    : mockProjects.filter(p => p.status === filterStatus)

  if (selectedProject) {
    return (
      <ProjectDetailView
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="hidden sm:flex bg-white border border-gray-200 rounded-lg p-0.5">
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              List
            </button>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/25">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Grid View */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`bg-white rounded-xl border border-gray-200 p-5 hover:border-violet-300 hover:shadow-lg transition-all cursor-pointer ${
                selectedProject?.id === project.id ? 'border-violet-500 ring-2 ring-violet-500/20' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{project.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{project.client}</p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[project.status]}`}>
                  {project.status}
                </span>
                <span className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-medium ${priorityColors[project.priority]}`}>
                  {project.priority}
                </span>
                {project.status === 'completed' && project.completedDate && (
                  <span className="text-[10px] sm:text-xs text-gray-500">
                    Done {project.completedDate}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-xs sm:text-sm text-gray-500">Progress</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5">
                  <div
                    className={`h-2 sm:h-2.5 rounded-full transition-all ${
                      project.progress >= 100 ? 'bg-green-500' :
                      project.progress >= 80 ? 'bg-green-500' :
                      project.progress >= 50 ? 'bg-blue-500' :
                      'bg-violet-500'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-500">Deadline</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">{project.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-500">Budget</p>
                    <p className={`text-xs sm:text-sm font-medium ${
                      project.spent / project.budget > 0.85 ? 'text-red-600' : 'text-gray-700'
                    }`}>
                      ${(project.spent / 1000).toFixed(1)}k / ${(project.budget / 1000).toFixed(1)}k
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member, i) => (
                    <div key={i} className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                      {member[0]}
                    </div>
                  ))}
                  {project.team.length > 3 && (
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500 border-2 border-white">
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {project.tasksCompleted}/{project.tasksTotal} tasks
                  </span>
                  {project.spent / project.budget > 0.85 && project.status !== 'completed' && (
                    <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3 h-3" />
                      Budget alert
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">Project</th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">Priority</th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">Progress</th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">Deadline</th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">Budget</th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-gray-600">Team</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(project => (
                <tr
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.client}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[project.status]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityColors[project.priority]}`}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-violet-500`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{project.deadline}</td>
                  <td className="px-4 py-4">
                    <p className={`text-sm font-medium ${
                      project.spent / project.budget > 0.85 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      ${(project.spent / 1000).toFixed(1)}k / ${(project.budget / 1000).toFixed(1)}k
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member, i) => (
                        <div key={i} className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                          {member[0]}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
