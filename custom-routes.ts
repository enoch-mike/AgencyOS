import { Hono } from 'hono'
import { prisma } from './src/lib/db'
import { stripe, getStripePriceKey } from './src/lib/stripe-server'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import bcrypt from 'bcryptjs'

const app = new Hono()

// Simple session store (in production, use JWT or session middleware)
const sessions = new Map<string, { userId: string; email: string }>()

function generateToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// ─── Auth Routes ─────────────────────────────────────────────────────────────

// Register
app.post('/auth/register', async (c) => {
  const { email, password, name } = await c.req.json()
  if (!email || !password) return c.json({ error: 'Email and password are required' }, 400)

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return c.json({ error: 'An account with this email already exists' }, 409)

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name: name || email.split('@')[0] },
    select: { id: true, email: true, name: true, plan: true, role: true },
  })

  const token = generateToken()
  sessions.set(token, { userId: user.id, email: user.email })

  return c.json({ ok: true, user, token })
})

// Login
app.post('/auth/login', async (c) => {
  const { email, password } = await c.req.json()
  if (!email || !password) return c.json({ error: 'Email and password are required' }, 400)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return c.json({ error: 'Invalid email or password' }, 401)

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return c.json({ error: 'Invalid email or password' }, 401)

  const token = generateToken()
  sessions.set(token, { userId: user.id, email: user.email })

  return c.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role },
    token,
  })
})

// Get current user
app.get('/auth/me', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return c.json({ error: 'Not authenticated' }, 401)

  const session = sessions.get(token)
  if (!session) return c.json({ error: 'Invalid session' }, 401)

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, plan: true, role: true, avatar: true, createdAt: true },
  })
  if (!user) return c.json({ error: 'User not found' }, 404)

  return c.json({ ok: true, user })
})

// Logout
app.post('/auth/logout', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (token) sessions.delete(token)
  return c.json({ ok: true })
})

// Update profile
app.patch('/auth/profile', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return c.json({ error: 'Not authenticated' }, 401)

  const session = sessions.get(token)
  if (!session) return c.json({ error: 'Invalid session' }, 401)

  const { name, avatar } = await c.req.json()
  const user = await prisma.user.update({
    where: { id: session.userId },
    data: { ...(name && { name }), ...(avatar && { avatar }) },
    select: { id: true, email: true, name: true, plan: true, role: true, avatar: true },
  })

  return c.json({ ok: true, user })
})

function getEnvFromDisk(key: string): string {
  try {
    const envPath = resolve(process.cwd(), '.env')
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex > 0 && trimmed.slice(0, eqIndex).trim() === key) {
        return trimmed.slice(eqIndex + 1).trim()
      }
    }
  } catch { /* ignore */ }
  return ''
}

const isDemo = (() => {
  const key = getEnvFromDisk('STRIPE_SECRET_KEY') || process.env.STRIPE_SECRET_KEY || ''
  return !key || key === 'sk_test_demo'
})()

// ─── Create Checkout Session ─────────────────────────────────────────────────
app.post('/stripe/checkout', async (c) => {
  const body = await c.req.json()
  const { plan, billing = 'monthly', userId } = body

  if (!plan) {
    return c.json({ error: 'plan is required' }, 400)
  }

  if (isDemo || userId === 'user_demo') {
    // Demo mode: return a simulated checkout URL
    return c.json({
      ok: true,
      checkoutUrl: `/pricing?demo=true&plan=${plan}&billing=${billing}`,
      sessionId: `cs_demo_${Date.now()}`,
      demo: true,
    })
  }

  // Production: create a real Stripe Checkout Session
  try {
    const priceKey = getStripePriceKey(plan, billing)

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return c.json({ error: 'User not found' }, 404)

    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      })
      customerId = customer.id
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceKey,
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_URL || `http://localhost:${process.env.RUNTIME_PORT}`}/pricing?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.APP_URL || `http://localhost:${process.env.RUNTIME_PORT}`}/pricing?canceled=true`,
      metadata: { userId: user.id, plan },
    })

    return c.json({
      ok: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return c.json({ error: err.message }, 500)
  }
})

// ─── Webhook Handler ─────────────────────────────────────────────────────────
app.post('/stripe/webhook', async (c) => {
  const body = await c.req.text()
  const sig = c.req.header('stripe-signature')

  if (isDemo) {
    return c.json({ ok: true, demo: true })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig || '',
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return c.json({ error: 'Webhook signature verification failed' }, 400)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan

        if (userId && plan) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan,
              subscriptionStatus: 'active',
              stripeCustomerId: session.customer,
              subscriptionEndsAt: null,
            },
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        const customerId = subscription.customer

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          const status = subscription.status === 'active' ? 'active' :
                         subscription.status === 'past_due' ? 'past_due' : 'canceled'

          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: status,
              subscriptionEndsAt: subscription.cancel_at
                ? new Date(subscription.cancel_at * 1000)
                : null,
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        const customerId = subscription.customer

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: 'free',
              subscriptionStatus: 'canceled',
              subscriptionEndsAt: new Date(subscription.canceled_at * 1000),
            },
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any
        const customerId = invoice.customer

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { subscriptionStatus: 'past_due' },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return c.json({ ok: true })
  } catch (err: any) {
    console.error('Webhook handler error:', err)
    return c.json({ error: err.message }, 500)
  }
})

// ─── Customer Portal ─────────────────────────────────────────────────────────
app.post('/stripe/portal', async (c) => {
  const body = await c.req.json()
  const { userId } = body

  if (isDemo) {
    return c.json({
      ok: true,
      portalUrl: `/pricing?demo=true&portal=true`,
      demo: true,
    })
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user?.stripeCustomerId) {
      return c.json({ error: 'No active subscription' }, 400)
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.APP_URL || `http://localhost:${process.env.RUNTIME_PORT}`}/settings`,
    })

    return c.json({
      ok: true,
      portalUrl: session.url,
    })
  } catch (err: any) {
    console.error('Portal error:', err)
    return c.json({ error: err.message }, 500)
  }
})

// ─── Get Subscription Status ─────────────────────────────────────────────────
app.get('/stripe/subscription/:userId', async (c) => {
  const { userId } = c.req.param()

  if (isDemo) {
    return c.json({
      ok: true,
      subscription: {
        plan: 'free',
        status: 'active',
        currentPeriodEnd: null,
        cancelAt: null,
      },
      demo: true,
    })
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user?.stripeCustomerId) {
      return c.json({
        ok: true,
        subscription: {
          plan: user?.plan || 'free',
          status: 'active',
          currentPeriodEnd: null,
          cancelAt: null,
        },
      })
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'all',
      limit: 1,
    })

    const sub = subscriptions.data[0]

    return c.json({
      ok: true,
      subscription: {
        plan: user.plan,
        status: sub?.status || 'active',
        currentPeriodEnd: sub?.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null,
        cancelAt: sub?.cancel_at
          ? new Date(sub.cancel_at * 1000).toISOString()
          : null,
      },
    })
  } catch (err: any) {
    console.error('Subscription lookup error:', err)
    return c.json({ error: err.message }, 500)
  }
})

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
app.get('/dashboard/stats', async (c) => {
  const [clientCount, projectCount, taskCount, meetingCount] = await Promise.all([
    prisma.client.count({ where: { status: 'active' } }),
    prisma.project.count({ where: { status: 'active' } }),
    prisma.task.count({ where: { status: { in: ['todo', 'in_progress', 'review'] } } }),
    prisma.meeting.count(),
  ])

  const completedTasks = await prisma.task.count({ where: { status: 'done' } })
  const urgentTasks = await prisma.task.count({ where: { priority: 'urgent', status: { not: 'done' } } })

  return c.json({
    activeClients: clientCount,
    activeProjects: projectCount,
    pendingTasks: taskCount,
    totalMeetings: meetingCount,
    completedTasks,
    urgentTasks,
  })
})

// ─── Client Health Scores ────────────────────────────────────────────────────
app.get('/clients/health', async (c) => {
  const clients = await prisma.client.findMany({
    where: { status: 'active' },
    select: {
      id: true,
      name: true,
      company: true,
      healthScore: true,
      lastContact: true,
      aiInsights: true,
    },
    orderBy: { healthScore: 'asc' },
  })

  return c.json({ clients })
})

// ─── AI Helper ───────────────────────────────────────────────────────────────
const OPENAI_PROXY_URL = process.env.OPENAI_PROXY_URL || process.env.AI_PROXY_URL
const AUTH_SECRET = process.env.RUNTIME_AUTH_SECRET

async function callLLM(systemPrompt: string, userMessage: string, maxTokens = 1024): Promise<string> {
  if (!OPENAI_PROXY_URL || !AUTH_SECRET) {
    throw new Error('AI proxy not configured')
  }
  const resp = await fetch(`${OPENAI_PROXY_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AUTH_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  })
  if (!resp.ok) {
    const err = await resp.text()
    throw new Error(`LLM call failed: ${resp.status} ${err}`)
  }
  const data = await resp.json()
  return data.choices?.[0]?.message?.content || ''
}

// ─── AI Briefing ─────────────────────────────────────────────────────────────
app.get('/ai/briefing', async (c) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [urgentTasks, todayMeetings, overdueTasks, activeProjects, recentActivity, clientStats] = await Promise.all([
    prisma.task.findMany({
      where: {
        priority: { in: ['urgent', 'high'] },
        status: { not: 'done' },
        dueDate: { lte: tomorrow },
      },
      include: { project: { include: { client: true } } },
      take: 10,
    }),
    prisma.meeting.findMany({
      where: { date: { gte: today, lt: tomorrow } },
      include: { client: true },
      take: 10,
    }),
    prisma.task.findMany({
      where: {
        status: { not: 'done' },
        dueDate: { lt: today },
      },
      include: { project: { include: { client: true } } },
      take: 10,
    }),
    prisma.project.findMany({
      where: { status: 'active' },
      include: { client: true, tasks: true },
      take: 10,
    }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15,
    }),
    prisma.client.findMany({
      where: { status: 'active' },
      select: { id: true, name: true, healthScore: true, lastContact: true },
      orderBy: { healthScore: 'asc' },
      take: 5,
    }),
  ])

  const context = `
## Current Data Snapshot

### Urgent/High Priority Tasks (Due Soon)
${urgentTasks.map(t => `- "${t.title}" [${t.priority}] — Project: ${t.project?.name || 'N/A'} (${t.project?.client?.name || 'N/A'}) — Due: ${t.dueDate?.toLocaleDateString() || 'No date'} — Status: ${t.status}`).join('\n') || 'None'}

### Overdue Tasks
${overdueTasks.map(t => `- "${t.title}" — Project: ${t.project?.name || 'N/A'} — Was due: ${t.dueDate?.toLocaleDateString() || 'No date'} — Status: ${t.status}`).join('\n') || 'None'}

### Today's Meetings
${todayMeetings.map(m => `- "${m.title}" at ${m.date.toLocaleTimeString()} — Client: ${m.client?.name || 'N/A'} — ${m.duration || '?'}min`).join('\n') || 'No meetings today'}

### Active Projects
${activeProjects.map(p => `- "${p.name}" — Client: ${p.client?.name || 'N/A'} — Budget: $${p.budget || 0} — Tasks: ${p.tasks.length} (${p.tasks.filter(t => t.status === 'done').length} done)`).join('\n') || 'None'}

### At-Risk Clients (Lowest Health Scores)
${clientStats.map(cl => `- ${cl.name}: Health ${cl.healthScore}/100 — Last contact: ${cl.lastContact?.toLocaleDateString() || 'Unknown'}`).join('\n') || 'None'}

### Recent Activity
${recentActivity.map(a => `- ${a.action} — ${a.entityType} ${(a as any).entityName || a.details || ''} (${a.createdAt.toLocaleTimeString()})`).join('\\n') || 'None'}
`

  try {
    const briefing = await callLLM(
      `You are an AI operations assistant for a digital agency. Analyze the data and provide a concise, actionable daily briefing. Format it as:

1. **🔥 Top Priorities** — The 3 most critical things to address today, with specific reasons
2. **⚠️ Alerts** — Any overdue items, at-risk clients, or problems that need immediate attention
3. **📋 Today's Focus** — A suggested plan for the day based on meetings and deadlines
4. **💡 Insight** — One strategic observation or recommendation

Be specific, use real data from the snapshot, and be concise. Use bullet points. Do NOT use generic filler.`,
      context,
      800
    )
    return c.json({ briefing, greeting: getGreeting(), generatedAt: new Date().toISOString() })
  } catch (err: any) {
    console.error('AI briefing error:', err.message)
    return c.json({
      briefing: null,
      fallback: true,
      greeting: getGreeting(),
      urgentTasks,
      todayMeetings,
      overdueTasks,
      clientStats,
      generatedAt: new Date().toISOString(),
    })
  }
})

// ─── Meeting AI Summary ──────────────────────────────────────────────────────
app.post('/meetings/:id/summarize', async (c) => {
  const { id } = c.req.param()

  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: { client: true, project: true },
  })
  if (!meeting) return c.json({ error: 'Meeting not found' }, 404)

  if (!meeting.notes && !(meeting as any).transcript) {
    return c.json({ error: 'No notes or transcript available for summarization' }, 400)
  }

  try {
    const summary = await callLLM(
      `You are an AI meeting assistant. Summarize this meeting concisely. Include:
1. **Key Points** — Main topics discussed (3-5 bullets)
2. **Decisions Made** — Any conclusions reached
3. **Open Questions** — Unresolved items
4. **Next Steps** — What should happen after this meeting

Be concise and professional.`,
      `Meeting: "${meeting.title}"
Date: ${meeting.date.toLocaleDateString()}
Client: ${meeting.client?.name || 'N/A'}
Project: ${meeting.project?.name || 'N/A'}
Duration: ${meeting.duration || 'Unknown'} minutes

Notes:
${meeting.notes || 'No notes'}

${(meeting as any).transcript ? `Transcript:\n${(meeting as any).transcript}` : ''}`,
      600
    )

    await prisma.meeting.update({
      where: { id },
      data: { summary },
    })

    return c.json({ ok: true, summary })
  } catch (err: any) {
    console.error('Meeting summary error:', err.message)
    return c.json({ error: err.message }, 500)
  }
})

// ─── Extract Action Items ────────────────────────────────────────────────────
app.post('/meetings/:id/extract-actions', async (c) => {
  const { id } = c.req.param()

  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: { client: true, project: true },
  })
  if (!meeting) return c.json({ error: 'Meeting not found' }, 404)

  if (!meeting.notes && !(meeting as any).transcript) {
    return c.json({ error: 'No notes or transcript available' }, 400)
  }

  try {
    const result = await callLLM(
      `Extract actionable items from this meeting. Return ONLY a JSON array of objects with these fields:
- text: the action item description
- assignedTo: who should do it (or "Unassigned" if not specified)
- priority: "urgent", "high", "medium", or "low"
- dueHint: suggested timeframe (e.g. "today", "this week", "next sprint")

Return ONLY the JSON array, no other text. Example:
[{"text":"Send proposal to client","assignedTo":"Sarah","priority":"high","dueHint":"tomorrow"}]`,
      `Meeting: "${meeting.title}"
Client: ${meeting.client?.name || 'N/A'}
Notes: ${meeting.notes || 'No notes'}
${(meeting as any).transcript ? `Transcript:\n${(meeting as any).transcript}` : ''}`,
      600
    )

    let actionItems
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/)
      actionItems = jsonMatch ? JSON.parse(jsonMatch[0]) : []
    } catch {
      actionItems = [{ text: result.substring(0, 200), assignedTo: 'Unassigned', priority: 'medium' }]
    }

    return c.json({ ok: true, actionItems })
  } catch (err: any) {
    console.error('Extract actions error:', err.message)
    return c.json({ error: err.message }, 500)
  }
})

// ─── AI Chat Assistant ──────────────────────────────────────────────────────
app.post('/ai/chat', async (c) => {
  const { message, history } = await c.req.json()
  if (!message) return c.json({ error: 'Message is required' }, 400)

  const [clients, projects, tasks, meetings] = await Promise.all([
    prisma.client.findMany({ select: { id: true, name: true, company: true, healthScore: true, status: true }, take: 20 }),
    prisma.project.findMany({ select: { id: true, name: true, status: true, budget: true, spent: true, deadline: true }, take: 20 }),
    prisma.task.findMany({ select: { id: true, title: true, status: true, priority: true, dueDate: true }, take: 20 }),
    prisma.meeting.findMany({ select: { id: true, title: true, date: true, source: true }, orderBy: { date: 'desc' }, take: 10 }),
  ])

  const context = `You are AgencyOS AI, an intelligent assistant for a digital agency. You have access to the agency's real data:

**Clients (${clients.length}):**
${clients.map(cl => `- ${cl.name} (${cl.company || 'N/A'}) — Health: ${cl.healthScore}/100 — Status: ${cl.status}`).join('\n')}

**Projects (${projects.length}):**
${projects.map(p => `- ${p.name} — Status: ${p.status} — Budget: $${p.budget || 0} — Spent: $${p.spent || 0} — Deadline: ${p.deadline?.toLocaleDateString() || 'N/A'}`).join('\n')}

**Tasks (${tasks.length}):**
${tasks.map(t => `- ${t.title} — Status: ${t.status} — Priority: ${t.priority} — Due: ${t.dueDate?.toLocaleDateString() || 'N/A'}`).join('\n')}

**Recent Meetings (${meetings.length}):**
${meetings.map(m => `- ${m.title} — ${m.date.toLocaleDateString()} — ${m.source || 'manual'}`).join('\\n')}

Be helpful, specific, and reference real data when answering questions.`

  try {
    const reply = await callLLM(context, message, 1024)
    return c.json({ ok: true, reply })
  } catch (err: any) {
    console.error('AI chat error:', err.message)
    return c.json({ error: err.message }, 500)
  }
})

// ─── Upgrade plan (demo shortcut) ────────────────────────────────────────────
app.post('/auth/upgrade', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return c.json({ error: 'Not authenticated' }, 401)

  const session = sessions.get(token)
  if (!session) return c.json({ error: 'Invalid session' }, 401)

  const { plan } = await c.req.json()
  if (!plan) return c.json({ error: 'plan is required' }, 400)

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: { plan, subscriptionStatus: 'active' },
    select: { id: true, email: true, name: true, plan: true, role: true },
  })

  return c.json({ ok: true, user })
})

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Integrations ────────────────────────────────────────────────────────────
import { getServerToolsClient } from '@shogo-ai/sdk/tools'

// List connected integrations status
app.get('/integrations', async (c) => {
  const integrations = [
    { id: 'googlecalendar', name: 'Google Calendar', icon: 'calendar', description: 'Sync meetings, view schedules, and check availability', category: 'calendar' },
    { id: 'zoom', name: 'Zoom', icon: 'video', description: 'Create meetings, get recordings, and manage webinars', category: 'meetings' },
    { id: 'slack', name: 'Slack', icon: 'message-square', description: 'Monitor channels, send messages, and track team activity', category: 'communication' },
  ]
  return c.json({ integrations })
})

// Google Calendar — list upcoming events
app.get('/integrations/calendar/events', async (c) => {
  try {
    const tools = getServerToolsClient()

    const now = new Date()
    const endOfWeek = new Date(now)
    endOfWeek.setDate(endOfWeek.getDate() + 7)

    const result = await tools.execute('GOOGLECALENDAR_EVENTS_LIST', {
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: endOfWeek.toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    })

    if (!result.ok) {
      return c.json({ error: result.error ?? 'Failed to fetch calendar events', connected: false }, 200)
    }

    const items = (result.data as any)?.items || (result.data as any)?.data?.items || []
    return c.json({ ok: true, events: items, connected: true })
  } catch (err: any) {
    console.error('Calendar events error:', err.message)
    return c.json({ error: err.message, connected: false }, 200)
  }
})

// Google Calendar — list calendars
app.get('/integrations/calendar/list', async (c) => {
  try {
    const tools = getServerToolsClient()
    const result = await tools.execute('GOOGLECALENDAR_CALENDAR_LIST_LIST', {})

    if (!result.ok) {
      return c.json({ error: result.error ?? 'Failed to list calendars', connected: false }, 200)
    }

    const items = (result.data as any)?.items || (result.data as any)?.data?.items || []
    return c.json({ ok: true, calendars: items, connected: true })
  } catch (err: any) {
    console.error('Calendar list error:', err.message)
    return c.json({ error: err.message, connected: false }, 200)
  }
})

// Zoom — list upcoming meetings
app.get('/integrations/zoom/meetings', async (c) => {
  try {
    const tools = getServerToolsClient()
    const result = await tools.execute('ZOOM_LIST_MEETINGS', {
      userId: 'me',
      type: 'upcoming',
    })

    if (!result.ok) {
      return c.json({ error: result.error ?? 'Failed to fetch Zoom meetings', connected: false }, 200)
    }

    const items = (result.data as any)?.meetings || (result.data as any)?.data?.meetings || []
    return c.json({ ok: true, meetings: items, connected: true })
  } catch (err: any) {
    console.error('Zoom meetings error:', err.message)
    return c.json({ error: err.message, connected: false }, 200)
  }
})

// Slack — list channels
app.get('/integrations/slack/channels', async (c) => {
  try {
    const tools = getServerToolsClient()
    const result = await tools.execute('SLACK_LIST_ALL_CHANNELS', {
      types: 'public_channel,private_channel',
      limit: 50,
    })

    if (!result.ok) {
      return c.json({ error: result.error ?? 'Failed to fetch Slack channels', connected: false }, 200)
    }

    const items = (result.data as any)?.channels || (result.data as any)?.data?.channels || []
    return c.json({ ok: true, channels: items, connected: true })
  } catch (err: any) {
    console.error('Slack channels error:', err.message)
    return c.json({ error: err.message, connected: false }, 200)
  }
})

// Slack — get workspace info
app.get('/integrations/slack/info', async (c) => {
  try {
    const tools = getServerToolsClient()
    const result = await tools.execute('SLACK_FETCH_TEAM_INFO', {})

    if (!result.ok) {
      return c.json({ error: result.error ?? 'Failed to fetch workspace info', connected: false }, 200)
    }

    return c.json({ ok: true, workspace: (result.data as any)?.team || (result.data as any)?.data?.team || result.data, connected: true })
  } catch (err: any) {
    console.error('Slack info error:', err.message)
    return c.json({ error: err.message, connected: false }, 200)
  }
})

export default app
