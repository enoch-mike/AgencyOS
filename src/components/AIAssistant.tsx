import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Loader2, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIAssistantProps {
  open: boolean
  onClose: () => void
}

export function AIAssistant({ open, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "👋 Hey! I'm your AI agency assistant. I know everything about your clients, projects, tasks, and meetings.\n\nHere's what I can do:\n• 🔍 Analyze client health and flag risks\n• 📊 Summarize project status and budgets\n• ✅ Prioritize your tasks for the day\n• 📋 Generate meeting summaries and action items\n• 💡 Suggest next steps based on your data\n\nJust ask me anything!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (!open) return null

  const send = async () => {
    const msg = input.trim()
    if (!msg || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: messages.slice(-6),
        }),
      })
      const data = await res.json()

      if (res.ok && data.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${data.error || 'Something went wrong. The AI proxy may not be configured.'}` }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Failed to reach the AI service. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const suggestions = [
    'Which clients are at risk?',
    'Summarize today\'s priorities',
    'Show me project budget status',
    'What came out of the last meeting?',
    'Help me prep for the Meridian call',
    'Generate a weekly report',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-end sm:justify-end p-0 sm:p-4 md:p-6">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative w-full sm:max-w-md h-full sm:h-[500px] sm:rounded-lg rounded-t-2xl flex flex-col shadow-2xl border-violet-200 z-10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="w-5 h-5" />
            AgencyOS AI
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:text-white/80 h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 px-4">
            <div ref={scrollRef} className="py-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.role === 'assistant' && (
                      <Bot className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5 text-violet-500" />
                    )}
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-400 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-xs px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="p-3 border-t">
            <form
              onSubmit={(e) => { e.preventDefault(); send() }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your agency..."
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" size="sm" disabled={!input.trim() || loading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
