import { useState, useEffect } from 'react'
import {
  Calendar, Video, MessageSquare, CheckCircle2, XCircle,
  ExternalLink, Loader2, RefreshCw, Plug, ArrowRight,
  Clock, Users, Hash
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const iconMap: Record<string, any> = {
  calendar: Calendar,
  video: Video,
  'message-square': MessageSquare,
}

interface IntegrationDef {
  id: string
  name: string
  icon: string
  description: string
  category: string
}

interface CalendarEvent {
  id: string
  summary: string
  start: { dateTime?: string; date?: string }
  end: { dateTime?: string; date?: string }
  htmlLink?: string
}

interface ZoomMeeting {
  id: string
  topic: string
  start_time: string
  duration: number
  join_url: string
  status: string
}

interface SlackChannel {
  id: string
  name: string
  num_members?: number
  topic?: { value: string }
  is_private: boolean
}

export function Integrations() {
  const [integrations, setIntegrations] = useState<IntegrationDef[]>([])
  const [calEvents, setCalEvents] = useState<CalendarEvent[]>([])
  const [zoomMeetings, setZoomMeetings] = useState<ZoomMeeting[]>([])
  const [slackChannels, setSlackChannels] = useState<SlackChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [connected, setConnected] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/integrations')
      .then(r => r.json())
      .then(d => setIntegrations(d.integrations || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const fetchCalendar = async () => {
    setFetching(f => ({ ...f, calendar: true }))
    setErrors(e => ({ ...e, calendar: '' }))
    try {
      const res = await fetch('/api/integrations/calendar/events')
      const data = await res.json()
      if (data.ok) {
        setCalEvents(data.events || [])
        setConnected(c => ({ ...c, calendar: true }))
      } else {
        setErrors(e => ({ ...e, calendar: data.error || 'Not connected' }))
        setConnected(c => ({ ...c, calendar: false }))
      }
    } catch {
      setErrors(e => ({ ...e, calendar: 'Failed to fetch' }))
    } finally {
      setFetching(f => ({ ...f, calendar: false }))
    }
  }

  const fetchZoom = async () => {
    setFetching(f => ({ ...f, zoom: true }))
    setErrors(e => ({ ...e, zoom: '' }))
    try {
      const res = await fetch('/api/integrations/zoom/meetings')
      const data = await res.json()
      if (data.ok) {
        setZoomMeetings(data.meetings || [])
        setConnected(c => ({ ...c, zoom: true }))
      } else {
        setErrors(e => ({ ...e, zoom: data.error || 'Not connected' }))
        setConnected(c => ({ ...c, zoom: false }))
      }
    } catch {
      setErrors(e => ({ ...e, zoom: 'Failed to fetch' }))
    } finally {
      setFetching(f => ({ ...f, zoom: false }))
    }
  }

  const fetchSlack = async () => {
    setFetching(f => ({ ...f, slack: true }))
    setErrors(e => ({ ...e, slack: '' }))
    try {
      const res = await fetch('/api/integrations/slack/channels')
      const data = await res.json()
      if (data.ok) {
        setSlackChannels(data.channels || [])
        setConnected(c => ({ ...c, slack: true }))
      } else {
        setErrors(e => ({ ...e, slack: data.error || 'Not connected' }))
        setConnected(c => ({ ...c, slack: false }))
      }
    } catch {
      setErrors(e => ({ ...e, slack: 'Failed to fetch' }))
    } finally {
      setFetching(f => ({ ...f, slack: false }))
    }
  }

  const fetchAll = () => {
    fetchCalendar()
    fetchZoom()
    fetchSlack()
  }

  const connectedCount = Object.values(connected).filter(Boolean).length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plug className="w-6 h-6 text-violet-600" />
            Integrations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Connect your tools to unlock real-time data across AgencyOS
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={connectedCount > 0 ? 'default' : 'secondary'}>
            {connectedCount}/{integrations.length || 3} connected
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchAll}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Google Calendar */}
        <Card className={`transition-all ${connected.calendar ? 'border-green-300 bg-green-50/50' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Google Calendar</CardTitle>
                  <CardDescription className="text-xs">Calendar sync</CardDescription>
                </div>
              </div>
              {connected.calendar ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-300" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">View upcoming events, check availability, and sync meetings.</p>
            <Button
              variant={connected.calendar ? 'outline' : 'default'}
              size="sm"
              onClick={fetchCalendar}
              disabled={fetching.calendar}
              className="w-full"
            >
              {fetching.calendar ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : connected.calendar ? (
                <RefreshCw className="w-4 h-4 mr-1" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-1" />
              )}
              {connected.calendar ? 'Refresh' : 'Connect'}
            </Button>
          </CardContent>
        </Card>

        {/* Zoom */}
        <Card className={`transition-all ${connected.zoom ? 'border-green-300 bg-green-50/50' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Video className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Zoom</CardTitle>
                  <CardDescription className="text-xs">Video meetings</CardDescription>
                </div>
              </div>
              {connected.zoom ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-300" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">List meetings, create new ones, and access recordings.</p>
            <Button
              variant={connected.zoom ? 'outline' : 'default'}
              size="sm"
              onClick={fetchZoom}
              disabled={fetching.zoom}
              className="w-full"
            >
              {fetching.zoom ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : connected.zoom ? (
                <RefreshCw className="w-4 h-4 mr-1" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-1" />
              )}
              {connected.zoom ? 'Refresh' : 'Connect'}
            </Button>
          </CardContent>
        </Card>

        {/* Slack */}
        <Card className={`transition-all ${connected.slack ? 'border-green-300 bg-green-50/50' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Slack</CardTitle>
                  <CardDescription className="text-xs">Team communication</CardDescription>
                </div>
              </div>
              {connected.slack ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-300" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">Monitor channels, track mentions, and manage workspace.</p>
            <Button
              variant={connected.slack ? 'outline' : 'default'}
              size="sm"
              onClick={fetchSlack}
              disabled={fetching.slack}
              className="w-full"
            >
              {fetching.slack ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : connected.slack ? (
                <RefreshCw className="w-4 h-4 mr-1" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-1" />
              )}
              {connected.slack ? 'Refresh' : 'Connect'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Connected Data Tabs */}
      {(connected.calendar || connected.zoom || connected.slack) && (
        <Tabs defaultValue={connected.calendar ? 'calendar' : connected.zoom ? 'zoom' : 'slack'}>
          <TabsList>
            <TabsTrigger value="calendar">
              <Calendar className="w-4 h-4 mr-1" /> Calendar
            </TabsTrigger>
            <TabsTrigger value="zoom">
              <Video className="w-4 h-4 mr-1" /> Zoom
            </TabsTrigger>
            <TabsTrigger value="slack">
              <MessageSquare className="w-4 h-4 mr-1" /> Slack
            </TabsTrigger>
          </TabsList>

          {/* Calendar Events */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
                <CardDescription>Next 7 days from your Google Calendar</CardDescription>
              </CardHeader>
              <CardContent>
                {errors.calendar && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-3">{errors.calendar}</div>
                )}
                {calEvents.length > 0 ? (
                  <div className="space-y-2">
                    {calEvents.map((event) => {
                      const start = event.start.dateTime || event.start.date
                      return (
                        <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{event.summary || 'Untitled'}</p>
                            <p className="text-xs text-gray-500">{start ? new Date(start).toLocaleString() : 'All day'}</p>
                          </div>
                          {event.htmlLink && (
                            <a href={event.htmlLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-6">No upcoming events this week</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Zoom Meetings */}
          <TabsContent value="zoom">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Zoom Meetings</CardTitle>
                <CardDescription>Your scheduled meetings from Zoom</CardDescription>
              </CardHeader>
              <CardContent>
                {errors.zoom && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-3">{errors.zoom}</div>
                )}
                {zoomMeetings.length > 0 ? (
                  <div className="space-y-2">
                    {zoomMeetings.map((meeting) => (
                      <div key={meeting.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Video className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{meeting.topic || 'Untitled Meeting'}</p>
                          <p className="text-xs text-gray-500">
                            {meeting.start_time ? new Date(meeting.start_time).toLocaleString() : 'TBD'} · {meeting.duration || 0}min
                          </p>
                        </div>
                        {meeting.join_url && (
                          <a href={meeting.join_url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-700">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-6">No upcoming meetings</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Slack Channels */}
          <TabsContent value="slack">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Slack Channels</CardTitle>
                <CardDescription>Channels from your connected workspace</CardDescription>
              </CardHeader>
              <CardContent>
                {errors.slack && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-3">{errors.slack}</div>
                )}
                {slackChannels.length > 0 ? (
                  <div className="space-y-2">
                    {slackChannels.map((channel) => (
                      <div key={channel.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Hash className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {channel.is_private ? '🔒 ' : '#'}{channel.name}
                          </p>
                          {channel.topic?.value && (
                            <p className="text-xs text-gray-500 truncate">{channel.topic.value}</p>
                          )}
                        </div>
                        {channel.num_members && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users className="w-3 h-3" />
                            {channel.num_members}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-6">No channels found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Help text */}
      {!connected.calendar && !connected.zoom && !connected.slack && !loading && (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <Plug className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No integrations connected yet</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Click "Connect" on any integration above to authorize access. Once connected,
              your real calendar events, meetings, and channels will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
