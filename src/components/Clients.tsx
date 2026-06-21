import { useState } from 'react'
import { 
  Plus, Search, MoreHorizontal, Mail, Building2, 
  TrendingUp, TrendingDown, AlertCircle, Sparkles, ChevronRight,
  Phone, Globe, Calendar, DollarSign, Target, Users,
  BarChart3, Clock, FileText, ArrowUpRight, ArrowLeft, Star, ExternalLink,
  MessageSquare, CheckCircle2, Send
} from 'lucide-react'

interface Contact {
  name: string
  email: string
  role: string
  isPrimary: boolean
}

interface ClientProject {
  name: string
  status: 'completed' | 'in-progress' | 'on-hold' | 'planning'
  progress: number
  deadline: string
}

interface RevenueMonth {
  month: string
  amount: number
}

interface ActivityItem {
  type: 'email' | 'meeting' | 'task' | 'file'
  title: string
  date: string
  detail: string
}

interface Client {
  id: string
  name: string
  email: string
  company: string
  industry: string
  status: 'active' | 'archived' | 'churned'
  notes: string
  healthScore: number
  healthTrend: 'improving' | 'stable' | 'declining'
  contacts: Contact[]
  projects: number
  revenue: string
  lifetimeValue: string
  avgProjectValue: string
  paymentStatus: 'current' | 'overdue' | 'partial'
  clientProjects: ClientProject[]
  revenueHistory: RevenueMonth[]
  activities: ActivityItem[]
  lastActivity: string
  lastContact: string
  aiInsights: { text: string; type: 'opportunity' | 'risk' | 'info' }[]
  tags: string[]
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@meridian.com',
    company: 'Meridian Corp',
    industry: 'Technology',
    status: 'active',
    notes: 'Key enterprise client. Interested in expanding to mobile apps.',
    healthScore: 92,
    healthTrend: 'stable',
    contacts: [
      { name: 'Sarah Chen', email: 'sarah@meridian.com', role: 'VP of Marketing', isPrimary: true },
      { name: 'James Wilson', email: 'james@meridian.com', role: 'Product Manager', isPrimary: false },
    ],
    projects: 3,
    revenue: '$124,000',
    lifetimeValue: '$348,500',
    avgProjectValue: '$41,333',
    paymentStatus: 'current',
    clientProjects: [
      { name: 'Website Redesign', status: 'completed', progress: 100, deadline: '2024-01-15' },
      { name: 'Brand Identity Refresh', status: 'in-progress', progress: 72, deadline: '2024-03-30' },
      { name: 'Mobile App MVP', status: 'planning', progress: 10, deadline: '2024-06-15' },
    ],
    revenueHistory: [
      { month: 'Aug', amount: 18000 },
      { month: 'Sep', amount: 22000 },
      { month: 'Oct', amount: 15000 },
      { month: 'Nov', amount: 28000 },
      { month: 'Dec', amount: 19000 },
      { month: 'Jan', amount: 22000 },
    ],
    activities: [
      { type: 'email', title: 'Project update sent', date: '2 hours ago', detail: 'Shared brand refresh progress deck' },
      { type: 'meeting', title: 'Strategy sync call', date: 'Yesterday', detail: 'Discussed mobile app roadmap' },
      { type: 'task', title: 'Contract renewal draft', date: '3 days ago', detail: 'Prepared 2025 renewal proposal' },
      { type: 'file', title: 'Shared wireframes', date: '5 days ago', detail: 'Mobile app v1 wireframes.pdf' },
      { type: 'email', title: 'Invoice #1042 sent', date: '1 week ago', detail: '$22,000 for November services' },
    ],
    lastActivity: '2 hours ago',
    lastContact: '2 hours ago',
    aiInsights: [
      { text: 'High engagement - consider upsell opportunity for mobile app project', type: 'opportunity' },
      { text: 'Payment history excellent - 100% on-time payments', type: 'info' },
      { text: '续约 in 45 days - schedule renewal discussion', type: 'opportunity' },
    ],
    tags: ['Enterprise', 'Tech', 'High Value']
  },
  {
    id: '2',
    name: 'Marcus Williams',
    email: 'marcus@nexusstudios.com',
    company: 'Nexus Studios',
    industry: 'Creative Agency',
    status: 'active',
    notes: 'Creative agency looking for brand refresh. Budget-conscious.',
    healthScore: 68,
    healthTrend: 'declining',
    contacts: [
      { name: 'Marcus Williams', email: 'marcus@nexusstudios.com', role: 'Creative Director', isPrimary: true },
    ],
    projects: 2,
    revenue: '$87,500',
    lifetimeValue: '$142,000',
    avgProjectValue: '$43,750',
    paymentStatus: 'partial',
    clientProjects: [
      { name: 'Brand Campaign 360', status: 'in-progress', progress: 45, deadline: '2024-04-20' },
      { name: 'Social Media Toolkit', status: 'on-hold', progress: 30, deadline: '2024-05-10' },
    ],
    revenueHistory: [
      { month: 'Aug', amount: 12000 },
      { month: 'Sep', amount: 8000 },
      { month: 'Oct', amount: 20000 },
      { month: 'Nov', amount: 14500 },
      { month: 'Dec', amount: 18000 },
      { month: 'Jan', amount: 15000 },
    ],
    activities: [
      { type: 'meeting', title: 'Creative review session', date: '1 day ago', detail: 'Reviewed brand campaign concepts' },
      { type: 'email', title: 'Budget revision request', date: '3 days ago', detail: 'Client requested scope adjustments' },
      { type: 'task', title: 'Competitor analysis', date: '5 days ago', detail: 'Completed competitor benchmark study' },
      { type: 'file', title: 'Uploaded mood board', date: '1 week ago', detail: 'Brand-refresh-moodboard-v3.fig' },
    ],
    lastActivity: '1 day ago',
    lastContact: '1 day ago',
    aiInsights: [
      { text: 'Budget warning: 20% over on current project - discuss scope', type: 'risk' },
      { text: 'Key decision maker identified - Marcus approves all spend', type: 'info' },
      { text: 'Meeting frequency dropped - schedule check-in', type: 'risk' },
    ],
    tags: ['Creative', 'Mid-Market']
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@brightside.com',
    company: 'Brightside Marketing',
    industry: 'Marketing',
    status: 'active',
    notes: 'Long-term client. Multiple projects running simultaneously.',
    healthScore: 88,
    healthTrend: 'improving',
    contacts: [
      { name: 'Emily Rodriguez', email: 'emily@brightside.com', role: 'Marketing Director', isPrimary: true },
      { name: 'Tom Brown', email: 'tom@brightside.com', role: 'Content Lead', isPrimary: false },
    ],
    projects: 4,
    revenue: '$156,000',
    lifetimeValue: '$412,000',
    avgProjectValue: '$39,000',
    paymentStatus: 'current',
    clientProjects: [
      { name: 'E-Commerce Platform', status: 'in-progress', progress: 65, deadline: '2024-02-28' },
      { name: 'Content Strategy', status: 'in-progress', progress: 80, deadline: '2024-03-15' },
      { name: 'Email Automation Setup', status: 'completed', progress: 100, deadline: '2024-01-20' },
      { name: 'SEO Audit & Plan', status: 'planning', progress: 5, deadline: '2024-05-01' },
    ],
    revenueHistory: [
      { month: 'Aug', amount: 25000 },
      { month: 'Sep', amount: 20000 },
      { month: 'Oct', amount: 30000 },
      { month: 'Nov', amount: 28000 },
      { month: 'Dec', amount: 26000 },
      { month: 'Jan', amount: 27000 },
    ],
    activities: [
      { type: 'email', title: 'SEO proposal outline', date: '3 hours ago', detail: 'Shared initial SEO strategy overview' },
      { type: 'task', title: 'E-commerce QA testing', date: 'Yesterday', detail: 'Completed checkout flow testing' },
      { type: 'meeting', title: 'Monthly sync call', date: '2 days ago', detail: 'Reviewed all project timelines' },
      { type: 'file', title: 'Analytics report shared', date: '4 days ago', detail: 'Q4-performance-report.pdf' },
      { type: 'email', title: 'Content calendar draft', date: '6 days ago', detail: 'Sent February content calendar for review' },
    ],
    lastActivity: '3 hours ago',
    lastContact: '3 hours ago',
    aiInsights: [
      { text: 'Renewal due in 45 days - prepare proposal', type: 'opportunity' },
      { text: 'Expansion opportunity - they mentioned needing help with SEO', type: 'opportunity' },
      { text: 'Strong relationship - could be referral source', type: 'info' },
    ],
    tags: ['Marketing', 'High Value', 'Long-term']
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david@verdant.com',
    company: 'Verdant Health',
    industry: 'Healthcare',
    status: 'active',
    notes: 'New client. Healthcare industry - compliance requirements.',
    healthScore: 45,
    healthTrend: 'declining',
    contacts: [
      { name: 'David Park', email: 'david@verdant.com', role: 'CEO', isPrimary: true },
    ],
    projects: 1,
    revenue: '$42,000',
    lifetimeValue: '$42,000',
    avgProjectValue: '$42,000',
    paymentStatus: 'overdue',
    clientProjects: [
      { name: 'Patient Portal Redesign', status: 'in-progress', progress: 35, deadline: '2024-04-01' },
    ],
    revenueHistory: [
      { month: 'Aug', amount: 0 },
      { month: 'Sep', amount: 0 },
      { month: 'Oct', amount: 10000 },
      { month: 'Nov', amount: 15000 },
      { month: 'Dec', amount: 12000 },
      { month: 'Jan', amount: 5000 },
    ],
    activities: [
      { type: 'email', title: 'Follow-up on compliance docs', date: '1 week ago', detail: 'Requested HIPAA compliance checklist' },
      { type: 'meeting', title: 'Initial kickoff call', date: '2 weeks ago', detail: 'Defined project scope & requirements' },
      { type: 'task', title: 'NDA signed', date: '3 weeks ago', detail: 'Executed mutual non-disclosure agreement' },
    ],
    lastActivity: '1 week ago',
    lastContact: '1 week ago',
    aiInsights: [
      { text: 'Low engagement - hasn\'t responded in 5 days', type: 'risk' },
      { text: 'Potential churn risk - schedule urgent check-in', type: 'risk' },
      { text: 'Healthcare compliance needs - ensure all docs are HIPAA compliant', type: 'info' },
    ],
    tags: ['Healthcare', 'New Client', 'At Risk']
  },
]

const statusConfig = {
  'completed': { color: 'text-green-600 bg-green-50 border-green-200', bar: 'bg-green-500', label: 'Completed' },
  'in-progress': { color: 'text-blue-600 bg-blue-50 border-blue-200', bar: 'bg-blue-500', label: 'In Progress' },
  'on-hold': { color: 'text-amber-600 bg-amber-50 border-amber-200', bar: 'bg-amber-500', label: 'On Hold' },
  'planning': { color: 'text-purple-600 bg-purple-50 border-purple-200', bar: 'bg-purple-500', label: 'Planning' },
}

const activityConfig = {
  email: { icon: Mail, color: 'bg-blue-100 text-blue-600', dot: 'bg-blue-500' },
  meeting: { icon: Calendar, color: 'bg-violet-100 text-violet-600', dot: 'bg-violet-500' },
  task: { icon: CheckCircle2, color: 'bg-green-100 text-green-600', dot: 'bg-green-500' },
  file: { icon: FileText, color: 'bg-amber-100 text-amber-600', dot: 'bg-amber-500' },
}

const paymentConfig = {
  current: { label: 'Current', color: 'text-green-700 bg-green-50 border-green-200', icon: CheckCircle2 },
  overdue: { label: 'Overdue', color: 'text-red-700 bg-red-50 border-red-200', icon: AlertCircle },
  partial: { label: 'Partial', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Clock },
}

export function Clients() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'revenue' | 'activity'>('overview')
  const [editableNotes, setEditableNotes] = useState<string>('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client)
    setEditableNotes(client.notes)
    setIsEditingNotes(false)
    setActiveTab('overview')
  }

  const maxRevenue = selectedClient
    ? Math.max(...selectedClient.revenueHistory.map(m => m.amount))
    : 0

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-full">
      {/* Client List */}
      <div className={`flex-1 bg-white rounded-xl border border-gray-200 flex flex-col ${selectedClient ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">All Clients ({filteredClients.length})</h3>
            <button className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/25">
              <Plus className="w-4 h-4" />
              Add Client
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search clients..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="churned">Churned</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {filteredClients.map(client => (
            <div 
              key={client.id}
              onClick={() => handleSelectClient(client)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedClient?.id === client.id ? 'bg-violet-50 border-l-2 border-l-violet-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{client.name}</p>
                      <span className={`w-2 h-2 rounded-full ${
                        client.healthScore >= 80 ? 'bg-green-500' :
                        client.healthScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <p className="text-sm text-gray-500">{client.company} · {client.industry}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{client.revenue}</p>
                  <p className="text-xs text-gray-500">{client.projects} projects</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {client.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
                {client.aiInsights.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-violet-600 ml-auto">
                    <Sparkles className="w-3 h-3" />
                    {client.aiInsights.length} insights
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Detail Panel */}
      {selectedClient ? (
        <div className="flex flex-col md:block w-full md:w-[480px] flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Mobile back button */}
          <div className="md:hidden p-3 border-b border-gray-100 flex items-center gap-2">
            <button
              onClick={() => setSelectedClient(null)}
              className="flex items-center gap-1.5 text-sm text-violet-600 font-medium hover:text-violet-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to clients
            </button>
          </div>

          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-indigo-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/25">
                  {selectedClient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedClient.name}</h3>
                  <p className="text-sm text-gray-600">{selectedClient.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-white/80 text-gray-600 px-2 py-0.5 rounded-full">{selectedClient.industry}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedClient.status === 'active' ? 'bg-green-100 text-green-700' :
                      selectedClient.status === 'archived' ? 'bg-gray-100 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {selectedClient.status}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 px-2">
            {(['overview', 'projects', 'revenue', 'activity'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-medium capitalize transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-violet-500 text-violet-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* ===== OVERVIEW TAB ===== */}
            {activeTab === 'overview' && (
              <>
                {/* Health Score */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-violet-500" />
                      <h4 className="font-semibold text-gray-900">Client Health</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedClient.healthTrend === 'improving' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : selectedClient.healthTrend === 'declining' ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : null}
                      <span className={`text-2xl font-bold ${
                        selectedClient.healthScore >= 80 ? 'text-green-600' :
                        selectedClient.healthScore >= 60 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {selectedClient.healthScore}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedClient.healthScore >= 80 ? 'bg-green-500' :
                        selectedClient.healthScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${selectedClient.healthScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Last contact: {selectedClient.lastContact}</p>
                </div>

                {/* Contact Info with action buttons */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Contacts</h4>
                  <div className="space-y-2">
                    {selectedClient.contacts.map((contact, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                            <p className="text-xs text-gray-500">{contact.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {contact.isPrimary && (
                            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full mr-1">Primary</span>
                          )}
                          <button
                            title={`Email ${contact.name}`}
                            className="p-1.5 hover:bg-blue-50 rounded-md transition-colors text-blue-500"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title={`Call ${contact.name}`}
                            className="p-1.5 hover:bg-green-50 rounded-md transition-colors text-green-500"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insights */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-violet-500" />
                    <h4 className="font-semibold text-gray-900">AI Insights</h4>
                  </div>
                  <div className="space-y-2">
                    {selectedClient.aiInsights.map((insight, i) => (
                      <div key={i} className={`p-3 rounded-lg text-sm border ${
                        insight.type === 'opportunity' ? 'bg-green-50 text-green-800 border-green-200' :
                        insight.type === 'risk' ? 'bg-red-50 text-red-800 border-red-200' :
                        'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        <div className="flex items-start gap-2">
                          {insight.type === 'opportunity' ? (
                            <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          ) : insight.type === 'risk' ? (
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          )}
                          <span>{insight.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-violet-500" />
                      <h4 className="font-semibold text-gray-900">Notes</h4>
                    </div>
                    <button
                      onClick={() => setIsEditingNotes(!isEditingNotes)}
                      className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors"
                    >
                      {isEditingNotes ? 'Save' : 'Edit'}
                    </button>
                  </div>
                  {isEditingNotes ? (
                    <textarea
                      value={editableNotes}
                      onChange={(e) => setEditableNotes(e.target.value)}
                      rows={3}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                      {editableNotes || 'No notes yet.'}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <button className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Schedule Meeting
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ===== PROJECTS TAB ===== */}
            {activeTab === 'projects' && (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Project History</h4>
                  <span className="text-xs text-gray-500">{selectedClient.clientProjects.length} projects</span>
                </div>
                <div className="space-y-3">
                  {selectedClient.clientProjects.map((project, i) => {
                    const cfg = statusConfig[project.status]
                    return (
                      <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{project.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due {project.deadline}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full border ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${cfg.bar}`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600 w-9 text-right">{project.progress}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* ===== REVENUE TAB ===== */}
            {activeTab === 'revenue' && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-100">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-violet-500" />
                      <span className="text-xs text-gray-500">Lifetime Value</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{selectedClient.lifetimeValue}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-gray-500">Avg Project</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{selectedClient.avgProjectValue}</p>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Payment Status</span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${paymentConfig[selectedClient.paymentStatus].color}`}>
                    {(() => {
                      const PCfg = paymentConfig[selectedClient.paymentStatus]
                      const PCfgIcon = PCfg.icon
                      return <PCfgIcon className="w-3.5 h-3.5" />
                    })()}
                    {paymentConfig[selectedClient.paymentStatus].label}
                  </span>
                </div>

                {/* Revenue Bar Chart */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Monthly Revenue</h4>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-end justify-between gap-2 h-40">
                      {selectedClient.revenueHistory.map((item, i) => (
                        <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
                          <span className="text-[10px] font-medium text-gray-500 mb-1">
                            ${item.amount >= 1000 ? `${(item.amount / 1000).toFixed(0)}k` : item.amount}
                          </span>
                          <div
                            className="w-full max-w-[36px] bg-gradient-to-t from-violet-500 to-indigo-400 rounded-t-md transition-all hover:from-violet-600 hover:to-indigo-500 cursor-pointer"
                            style={{ height: `${maxRevenue > 0 ? (item.amount / maxRevenue) * 100 : 0}%`, minHeight: item.amount > 0 ? '4px' : '0px' }}
                            title={`${item.month}: $${item.amount.toLocaleString()}`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      {selectedClient.revenueHistory.map((item, i) => (
                        <span key={i} className="flex-1 text-center text-[10px] text-gray-400">{item.month}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Revenue Summary */}
                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Current Period</span>
                    <span className="font-semibold text-gray-900">{selectedClient.revenue}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Projects</span>
                    <span className="font-semibold text-gray-900">{selectedClient.projects}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Revenue Trend</span>
                    <span className={`flex items-center gap-1 font-semibold ${
                      selectedClient.revenueHistory[selectedClient.revenueHistory.length - 1].amount >=
                      selectedClient.revenueHistory[selectedClient.revenueHistory.length - 2].amount
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedClient.revenueHistory[selectedClient.revenueHistory.length - 1].amount >=
                       selectedClient.revenueHistory[selectedClient.revenueHistory.length - 2].amount ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      {selectedClient.revenueHistory[selectedClient.revenueHistory.length - 1].amount >=
                       selectedClient.revenueHistory[selectedClient.revenueHistory.length - 2].amount
                        ? 'Up' : 'Down'} vs last month
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* ===== ACTIVITY TAB ===== */}
            {activeTab === 'activity' && (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Activity Timeline</h4>
                  <span className="text-xs text-gray-500">{selectedClient.activities.length} recent</span>
                </div>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200" />
                  <div className="space-y-1">
                    {selectedClient.activities.map((activity, i) => {
                      const cfg = activityConfig[activity.type]
                      const Icon = cfg.icon
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors relative">
                          <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 z-10 ${cfg.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                              <span className="text-[11px] text-gray-400 whitespace-nowrap flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.date}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{activity.detail}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Log new activity */}
                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Log New Activity</p>
                  <div className="grid grid-cols-4 gap-2">
                    {(['email', 'meeting', 'task', 'file'] as const).map(type => {
                      const cfg = activityConfig[type]
                      const Icon = cfg.icon
                      return (
                        <button
                          key={type}
                          className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors ${cfg.color} hover:opacity-80`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="capitalize">{type}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Quick Actions (visible on all tabs) */}
          {activeTab === 'overview' && (
            <div className="p-4 border-t border-gray-100 md:hidden">
              <button className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Meeting
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="hidden md:flex w-[480px] bg-white rounded-xl border border-gray-200 items-center justify-center text-gray-400 flex-shrink-0">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Select a client to view details</p>
          </div>
        </div>
      )}
    </div>
  )
}
