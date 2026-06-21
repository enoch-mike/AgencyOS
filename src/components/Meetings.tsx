import { useState } from 'react'
import { 
  Plus, Search, Calendar, Clock, MoreHorizontal,
  Sparkles, CheckCircle2, ArrowRight, Mic, FileText,
  Users, Video, Brain, X, ChevronRight, Circle
} from 'lucide-react'

interface ActionItem {
  text: string
  assignedTo: string
  status: 'pending' | 'completed'
  dueDate?: string
}

interface Meeting {
  id: string
  title: string
  client: string
  project: string
  date: string
  duration: string
  source: 'zoom' | 'google_meet' | 'recorded' | 'manual'
  hasRecording: boolean
  hasTranscript: boolean
  summary?: string
  keyDecisions: string[]
  actionItems: ActionItem[]
  attendees: string[]
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Discovery Call - Meridian Corp',
    client: 'Meridian Corp',
    project: 'Website Redesign',
    date: 'Today, 2:00 PM',
    duration: '45 min',
    source: 'zoom',
    hasRecording: true,
    hasTranscript: true,
    summary: 'Discussed homepage redesign requirements. Client wants modern, minimalist aesthetic with focus on mobile experience. Key deliverables: wireframes by June 20, final designs by June 28. Budget approved for premium animations.',
    keyDecisions: [
      'Mobile-first design approach approved',
      'Premium animations budget increased to $8,000',
      'Wireframes due June 20, final designs June 28'
    ],
    actionItems: [
      { text: 'Create wireframe mockups for homepage', assignedTo: 'Sarah', status: 'pending', dueDate: 'Jun 20' },
      { text: 'Research premium animation libraries', assignedTo: 'Marcus', status: 'pending', dueDate: 'Jun 18' },
      { text: 'Send revised timeline to client', assignedTo: 'Alex', status: 'completed' },
    ],
    attendees: ['Sarah Chen', 'Alex Thompson', 'Client Team']
  },
  {
    id: '2',
    title: 'Strategy Review - Nexus Studios',
    client: 'Nexus Studios',
    project: 'Brand Identity Refresh',
    date: 'Yesterday, 10:00 AM',
    duration: '60 min',
    source: 'google_meet',
    hasRecording: true,
    hasTranscript: true,
    summary: 'Reviewed brand exploration concepts. Client leaning toward option B (geometric) but wants to see color variations. Concerns about budget for photography. Need to present revised budget by Friday.',
    keyDecisions: [
      'Option B (geometric) selected as direction',
      'Color variations to be presented by Wednesday',
      'Budget revision needed for photography'
    ],
    actionItems: [
      { text: 'Create 3 color variations for option B', assignedTo: 'Marcus', status: 'completed' },
      { text: 'Prepare budget revision proposal', assignedTo: 'Alex', status: 'pending', dueDate: 'Jun 17' },
      { text: 'Source stock photography alternatives', assignedTo: 'Emily', status: 'pending', dueDate: 'Jun 19' },
    ],
    attendees: ['Marcus Williams', 'Alex Thompson', 'Client Team']
  },
  {
    id: '3',
    title: 'Weekly Sync - Brightside Marketing',
    client: 'Brightside Marketing',
    project: 'Social Media Campaign',
    date: 'Jun 12, 9:00 AM',
    duration: '30 min',
    source: 'recorded',
    hasRecording: true,
    hasTranscript: false,
    summary: 'Weekly check-in on social campaign performance. Instagram engagement up 23%. TikTok content performing well. Client wants to increase posting frequency on LinkedIn.',
    keyDecisions: [
      'Instagram engagement up 23% - continue current strategy',
      'LinkedIn posting increased to 5x/week',
      'TikTok content calendar for July to be created'
    ],
    actionItems: [
      { text: 'Increase LinkedIn posts to 5x/week', assignedTo: 'Emily', status: 'completed' },
      { text: 'Create TikTok content calendar for July', assignedTo: 'Emily', status: 'pending', dueDate: 'Jun 21' },
    ],
    attendees: ['Emily Rodriguez', 'Client Team']
  },
  {
    id: '4',
    title: 'Launch Review - Oakwood Retail',
    client: 'Oakwood Retail',
    project: 'E-Commerce Platform',
    date: 'May 11, 3:00 PM',
    duration: '55 min',
    source: 'zoom',
    hasRecording: true,
    hasTranscript: true,
    summary: 'Final launch review for the Oakwood e-commerce platform. All 36 tasks completed with zero critical bugs. Client thrilled with results — online sales up 340% in the first month. Product configurator drove a 28% increase in average order value. SEO audit scored 94/100. Client formally signed off on all deliverables.',
    keyDecisions: [
      'Project officially completed — all deliverables approved',
      'Client signed off on final payment ($58,200 total)',
      'Maintenance retainer agreed at $1,200/month',
      'Case study publication approved for June newsletter'
    ],
    actionItems: [
      { text: 'Send final deliverables package to client', assignedTo: 'Sarah', status: 'completed' },
      { text: 'Process final invoice payment', assignedTo: 'Alex', status: 'completed' },
      { text: 'Publish case study on website', assignedTo: 'Emily', status: 'pending', dueDate: 'Jun 15' },
      { text: 'Schedule monthly maintenance check-in', assignedTo: 'Alex', status: 'pending', dueDate: 'Jun 12' },
    ],
    attendees: ['Sarah Chen', 'Marcus Williams', 'David Park', 'Lisa Park', 'James Mitchell']
  },
]

const sourceConfig = {
  zoom: { icon: Video, label: 'Zoom', color: 'bg-blue-100 text-blue-700' },
  google_meet: { icon: Video, label: 'Google Meet', color: 'bg-green-100 text-green-700' },
  recorded: { icon: Mic, label: 'Recorded', color: 'bg-violet-100 text-violet-700' },
  manual: { icon: FileText, label: 'Manual', color: 'bg-gray-100 text-gray-700' }
}

export function Meetings() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(mockMeetings[0])
  const [isRecording, setIsRecording] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMeetings = mockMeetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.client.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-full">
      {/* Meeting List */}
      <div className={`w-full md:w-96 bg-white rounded-xl border border-gray-200 flex flex-col ${selectedMeeting ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Meetings</h3>
            <button className="flex items-center gap-2 bg-violet-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/25">
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search meetings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {filteredMeetings.map(meeting => {
            const source = sourceConfig[meeting.source]
            const SourceIcon = source.icon
            return (
              <div 
                key={meeting.id}
                onClick={() => setSelectedMeeting(meeting)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedMeeting?.id === meeting.id ? 'bg-violet-50 border-l-2 border-l-violet-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{meeting.title}</p>
                    <p className="text-sm text-gray-500">{meeting.project}</p>
                  </div>
                  <span className={`p-1.5 rounded-lg ${source.color}`}>
                    <SourceIcon className="w-4 h-4" />
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {meeting.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {meeting.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {meeting.hasTranscript && (
                    <span className="flex items-center gap-1 text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
                      <Sparkles className="w-3 h-3" />
                      AI Summary
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {meeting.actionItems.filter(a => a.status === 'pending').length} pending actions
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Voice Capture Button */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/25' 
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25'
            }`}
          >
            <Mic className="w-5 h-5" />
            {isRecording ? 'Recording... Tap to stop' : 'Start Voice Capture'}
          </button>
        </div>
      </div>

      {/* Meeting Detail */}
      {selectedMeeting ? (
        <div className={`flex-1 bg-white rounded-xl border border-gray-200 overflow-auto ${selectedMeeting ? '' : ''}`}>
          <div className="md:hidden p-3 border-b border-gray-100">
            <button onClick={() => setSelectedMeeting(null)} className="text-sm text-violet-600 font-medium">
              ← Back to meetings
            </button>
          </div>
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-indigo-50">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sourceConfig[selectedMeeting.source].color}`}>
                    {sourceConfig[selectedMeeting.source].label}
                  </span>
                  {selectedMeeting.hasTranscript && (
                    <span className="text-xs bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full font-medium">
                      AI Processed
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedMeeting.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedMeeting.attendees.join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>{selectedMeeting.date}</span>
                  <span>·</span>
                  <span>{selectedMeeting.duration}</span>
                  <span>·</span>
                  <span>{selectedMeeting.client}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Transcript
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Recording
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* AI Summary */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-violet-500" />
                <h3 className="font-semibold text-gray-900">AI Summary</h3>
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">Generated</span>
              </div>
              <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-4 border border-violet-100">
                <p className="text-gray-700 leading-relaxed">{selectedMeeting.summary}</p>
              </div>
            </div>

            {/* Key Decisions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-gray-900">Key Decisions</h3>
              </div>
              <div className="space-y-2">
                {selectedMeeting.keyDecisions.map((decision, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-800">{decision}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-violet-500" />
                  <h3 className="font-semibold text-gray-900">Action Items</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                    {selectedMeeting.actionItems.length} items
                  </span>
                </div>
                <button className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
                  Create tasks
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {selectedMeeting.actionItems.map((item, i) => (
                  <div 
                    key={i} 
                    className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                      item.status === 'completed' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-200 hover:border-violet-300 hover:shadow-sm'
                    }`}
                  >
                    <button className={`mt-0.5 ${
                      item.status === 'completed' ? 'text-green-500' : 'text-gray-300 hover:text-violet-500'
                    }`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {item.text}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-[10px] font-medium text-white">
                            {item.assignedTo[0]}
                          </div>
                          <span className="text-xs text-gray-500">{item.assignedTo}</span>
                        </div>
                        {item.dueDate && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-violet-300 hover:text-violet-600 transition-colors font-medium">
                + Add action item
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">Select a meeting to view details</p>
          </div>
        </div>
      )}
    </div>
  )
}
