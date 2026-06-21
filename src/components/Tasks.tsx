import { useState } from 'react'
import { 
  Plus, Filter, Search, MoreHorizontal, Calendar,
  CheckCircle2, Circle, Clock, AlertTriangle, User,
  Sparkles, ChevronDown, GripVertical, ArrowRight, X
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  project: string
  client: string
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string
  assignedTo: string
  source: 'manual' | 'meeting' | 'ai_captured'
  tags: string[]
  createdAt: string
}

const mockTasks: Task[] = [
  { id: '1', title: 'Finalize homepage wireframes', description: 'Complete wireframes for all homepage sections including hero, features, and CTA.', project: 'Website Redesign', client: 'Meridian Corp', status: 'review', priority: 'high', dueDate: 'Today', assignedTo: 'Sarah', source: 'manual', tags: ['Design', 'Urgent'], createdAt: '2 hours ago' },
  { id: '2', title: 'Update brand color palette', description: 'Revise color palette based on client feedback from yesterday meeting.', project: 'Brand Identity Refresh', client: 'Nexus Studios', status: 'in_progress', priority: 'high', dueDate: 'Today', assignedTo: 'Marcus', source: 'meeting', tags: ['Design'], createdAt: '1 hour ago' },
  { id: '3', title: 'Create Instagram content calendar', description: 'Plan and schedule 30 days of Instagram content for July.', project: 'Social Media Campaign', client: 'Brightside Marketing', status: 'todo', priority: 'medium', dueDate: 'Tomorrow', assignedTo: 'Emily', source: 'manual', tags: ['Content', 'Social'], createdAt: '3 hours ago' },
  { id: '4', title: 'Review competitor analysis', description: 'Analyze top 5 competitors and identify key differentiators.', project: 'Product Launch Strategy', client: 'Verdant Health', status: 'todo', priority: 'medium', dueDate: 'Jun 18', assignedTo: 'Alex', source: 'ai_captured', tags: ['Research'], createdAt: '5 hours ago' },
  { id: '5', title: 'Draft case study for Q1', description: 'Write case study highlighting Q1 results for Meridian Corp.', project: 'Website Redesign', client: 'Meridian Corp', status: 'todo', priority: 'low', dueDate: 'Jun 20', assignedTo: 'Sarah', source: 'manual', tags: ['Content'], createdAt: '1 day ago' },
  { id: '6', title: 'Fix mobile navigation bug', description: 'Navigation menu not closing properly on iOS devices.', project: 'Website Maintenance', client: 'Brightside Marketing', status: 'in_progress', priority: 'urgent', dueDate: 'Today', assignedTo: 'David', source: 'manual', tags: ['Bug', 'Mobile'], createdAt: '4 hours ago' },
  { id: '7', title: 'Prepare pitch deck slides', description: 'Create 15-slide pitch deck for product launch presentation.', project: 'Product Launch Strategy', client: 'Verdant Health', status: 'todo', priority: 'high', dueDate: 'Jun 19', assignedTo: 'Marcus', source: 'meeting', tags: ['Design', 'Presentation'], createdAt: '6 hours ago' },
  { id: '8', title: 'Send campaign performance report', description: 'Monthly performance report for social media campaign.', project: 'Social Media Campaign', client: 'Brightside Marketing', status: 'done', priority: 'medium', dueDate: 'Jun 14', assignedTo: 'Emily', source: 'manual', tags: ['Report'], createdAt: '2 days ago' },
]

const columns = [
  { id: 'todo', label: 'To Do', color: 'bg-gray-500', lightColor: 'bg-gray-100' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-500', lightColor: 'bg-blue-100' },
  { id: 'review', label: 'Review', color: 'bg-amber-500', lightColor: 'bg-amber-100' },
  { id: 'done', label: 'Done', color: 'bg-green-500', lightColor: 'bg-green-100' },
]

const priorityColors = {
  low: 'text-gray-500 bg-gray-100',
  medium: 'text-blue-600 bg-blue-100',
  high: 'text-orange-600 bg-orange-100',
  urgent: 'text-red-600 bg-red-100'
}

const sourceConfig = {
  manual: { icon: null, label: null, color: '' },
  meeting: { icon: Calendar, label: 'From Meeting', color: 'bg-violet-100 text-violet-700' },
  ai_captured: { icon: Sparkles, label: 'AI Captured', color: 'bg-violet-100 text-violet-700' }
}

export function Tasks() {
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterSource, setFilterSource] = useState<string>('all')
  const [showNewTask, setShowNewTask] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const filteredTasks = mockTasks.filter(task => {
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesSource = filterSource === 'all' || task.source === filterSource
    return matchesPriority && matchesSource
  })

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Sources</option>
            <option value="manual">Manual</option>
            <option value="meeting">From Meetings</option>
            <option value="ai_captured">AI Captured</option>
          </select>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 bg-violet-50 px-3 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span>AI-captured tasks have violet accent</span>
          </div>
        </div>
        <button
          onClick={() => setShowNewTask(true)}
          className="flex items-center justify-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/25"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Kanban Board — desktop */}
      <div className="flex-1 hidden md:grid grid-cols-4 gap-4">
        {columns.map(column => {
          const columnTasks = filteredTasks.filter(task => task.status === column.id)
          return (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                <h3 className="text-sm font-semibold text-gray-700">{column.label}</h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                  {columnTasks.length}
                </span>
              </div>
              <div className="flex-1 space-y-2 overflow-auto">
                {columnTasks.map(task => {
                  const sourceConfig_ = sourceConfig[task.source]
                  const SourceIcon = sourceConfig_.icon
                  return (
                    <div 
                      key={task.id} 
                      onClick={() => setSelectedTask(task)}
                      className={`bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-violet-300 hover:shadow-md transition-all ${
                        task.source !== 'manual' ? 'border-l-4 border-l-violet-500' : ''
                      } ${selectedTask?.id === task.id ? 'ring-2 ring-violet-500' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900 flex-1 pr-2">{task.title}</p>
                        <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {task.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {task.dueDate}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-[10px] font-medium text-white">
                            {task.assignedTo[0]}
                          </div>
                          <span className="text-xs text-gray-600">{task.assignedTo}</span>
                        </div>
                        {SourceIcon && (
                          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${sourceConfig_.color}`}>
                            <SourceIcon className="w-3 h-3" />
                            {sourceConfig_.label}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile Task List */}
      <div className="flex-1 md:hidden space-y-2 overflow-auto">
        {filteredTasks.map(task => {
          const sourceConfig_ = sourceConfig[task.source]
          const SourceIcon = sourceConfig_.icon
          return (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`bg-white rounded-xl border border-gray-200 p-4 cursor-pointer active:bg-gray-50 transition-colors ${
                task.source !== 'manual' ? 'border-l-4 border-l-violet-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900 flex-1 pr-2">{task.title}</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />{task.dueDate}
                </span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-500">{task.client}</span>
                {SourceIcon && (
                  <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full ml-auto ${sourceConfig_.color}`}>
                    <SourceIcon className="w-2.5 h-2.5" />{sourceConfig_.label}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedTask.source !== 'manual' && (
                      <span className="flex items-center gap-1 text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        {selectedTask.source === 'meeting' ? 'From Meeting' : 'AI Captured'}
                      </span>
                    )}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[selectedTask.priority]}`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedTask.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedTask.client} · {selectedTask.project}</p>
                </div>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600">{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Due Date</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {selectedTask.dueDate}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Assigned To</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-[10px] font-medium text-white">
                      {selectedTask.assignedTo[0]}
                    </div>
                    <span className="text-sm text-gray-600">{selectedTask.assignedTo}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.tags.map((tag, i) => (
                    <span key={i} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button 
                onClick={() => setSelectedTask(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
                Edit Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">New Task</h3>
                <button 
                  onClick={() => setShowNewTask(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Enter task title..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Enter task description..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent">
                  <option>Website Redesign - Meridian Corp</option>
                  <option>Brand Identity Refresh - Nexus Studios</option>
                  <option>Social Media Campaign - Brightside Marketing</option>
                  <option>Product Launch Strategy - Verdant Health</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Team member name..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button 
                onClick={() => setShowNewTask(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowNewTask(false)}
                className="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
