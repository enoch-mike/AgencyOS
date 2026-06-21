# AgencyOS - AI-Powered Agency Workspace
## Complete Build Prompt for App Builder

---

## 🎯 Product Vision

**AgencyOS** is an AI-native project management and client management platform designed specifically for digital agencies and consultancies (5-20 person teams). It replaces Notion + Asana + Calendly with a single intelligent workspace that captures, connects, and executes automatically.

### Tagline
> "Notion helps you organize your work. AgencyOS helps you *do* your work."

### Core Value Proposition
- **Auto-Capture**: AI listens to your meetings, Slack, email, and calendar → auto-creates notes, tasks, and decisions
- **Smart Briefings**: Morning digest of what matters today, powered by AI analysis of all your work tools
- **Action Engine**: Turn any meeting note into tasks, emails, and follow-ups with one click
- **Client Intelligence**: AI tracks client health, identifies churn risk, and suggests upsell opportunities

---

## 👥 Ideal Customer Profile (ICP)

### Primary: Agency Owners & Consultants (5-20 person teams)

**Demographics:**
- Age: 28-45
- Role: Agency owner, managing director, operations lead
- Company size: 5-20 employees
- Industry: Digital marketing, creative, consulting, development agencies
- Revenue: $500K-$5M annually
- Tech stack: Currently using Notion/Asana + Slack + Gmail + Calendly + Google Docs

**Pain Points:**
1. Tool fragmentation - using 5+ apps that don't talk to each other
2. Meeting follow-up - action items fall through the cracks
3. Client visibility - hard to see project health across all clients
4. Context switching - constant app switching kills productivity
5. Mobile experience - current tools are clunky on mobile

**Goals:**
1. Consolidate tools into one intelligent workspace
2. Never miss a meeting action item again
3. See client health at a glance
4. Work from anywhere (mobile-first)
5. Reduce admin overhead by 50%

---

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State**: React Query for server state, Zustand for client state
- **Charts**: Recharts for analytics
- **Icons**: Lucide React
- **Build**: Vite

### Backend Stack
- **Runtime**: Node.js/Bun with Hono framework
- **Database**: SQLite (dev) → PostgreSQL (prod)
- **ORM**: Prisma 7
- **Auth**: Session-based with JWT
- **AI**: OpenAI GPT-4 / Claude for summarization and insights

### Key Integrations (Phase 1)
- Google Calendar (meeting detection)
- Zoom (recording and transcript)
- Slack (message capture)
- Gmail (email capture)
- Google Drive (document sync)

---

## 📊 Database Schema

### Core Models

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  role      String   @default("member") // owner, admin, member
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  clients   Client[]
  projects  Project[]
  tasks     Task[]
  meetings  Meeting[]
}

model Client {
  id          String   @id @default(cuid())
  name        String
  email       String?
  company     String?
  industry    String?
  status      String   @default("active") // active, archived, churned
  notes       String?
  aiInsights  Json?    // AI-generated insights
  healthScore Int?     // 1-100 AI-calculated health
  lastContact DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  projects    Project[]
  meetings    Meeting[]
  contacts    Contact[]
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      String   @default("planning") // planning, active, paused, completed
  priority    String   @default("medium") // low, medium, high, urgent
  deadline    DateTime?
  budget      Float?
  spent       Float?   @default(0)
  progress    Int?     @default(0) // 0-100
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id])
  clientId    String
  client      Client   @relation(fields: [clientId], references: [id])

  tasks       Task[]
  meetings    Meeting[]
  milestones  Milestone[]
  files       File[]
}

model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      String   @default("todo") // todo, in_progress, review, done
  priority    String   @default("medium") // low, medium, high, urgent
  dueDate     DateTime?
  assignedTo  String?
  source      String   @default("manual") // manual, meeting, ai_captured
  sourceId    String?  // meeting ID or other source
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id])
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  meetingId   String?
  meeting     Meeting? @relation(fields: [meetingId], references: [id])
  tags        Tag[]
}

model Meeting {
  id          String   @id @default(cuid())
  title       String
  date        DateTime
  duration    Int?     // minutes
  notes       String?  // raw notes/transcript
  summary     String?  // AI-generated summary
  actionItems Json?    // AI-extracted action items
  source      String?  // zoom, google_meet, recorded, manual
  recordingUrl String?
  transcript  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id])
  clientId    String
  client      Client   @relation(fields: [clientId], references: [id])
  projectId   String?
  project     Project? @relation(fields: [projectId], references: [id])

  tasks       Task[]
  attendees   Attendee[]
}

model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String?
  phone     String?
  role      String?
  isPrimary Boolean  @default(false)
  createdAt DateTime @default(now())

  clientId  String
  client    Client   @relation(fields: [clientId], references: [id])
}

model Milestone {
  id          String   @id @default(cuid())
  name        String
  dueDate     DateTime?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())

  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
}

model Tag {
  id    String @id @default(cuid())
  name  String
  color String?

  taskId String
  task   Task   @relation(fields: [taskId], references: [id])
}

model Attendee {
  id     String @id @default(cuid())
  name   String
  email  String?
  role   String? // client, team, external

  meetingId String
  meeting   Meeting @relation(fields: [meetingId], references: [id])
}

model File {
  id        String   @id @default(cuid())
  name      String
  url       String
  type      String?
  size      Int?
  createdAt DateTime @default(now())

  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
}

model ActivityLog {
  id        String   @id @default(cuid())
  action    String   // created, updated, completed, etc.
  entityType String  // task, project, meeting, client
  entityId  String
  details   Json?
  createdAt DateTime @default(now())

  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## 🖥️ UI Components

### 1. Dashboard
**AI Briefing Card**
- Personalized greeting with AI-generated summary
- Top 3 priorities for today
- Key metrics (clients, projects, tasks, meetings)
- AI insights (warnings, opportunities, action items)
- Recent activity feed
- Upcoming deadlines

**Stats Grid**
- Active Clients (with trend)
- Active Projects (with due this week)
- Tasks Completed (vs target)
- Meetings This Week

### 2. Client CRM
**Client List**
- Searchable, filterable client list
- Client cards with avatar, company, revenue, AI insights count
- Quick actions (call, email, schedule)

**Client Detail Panel**
- Contact info and company details
- AI Insights panel (health score, churn risk, upsell opportunities)
- Related projects and meetings
- Activity timeline
- Notes and documents

### 3. Projects
**Project Grid/List View**
- Toggle between grid (cards) and list (table) views
- Filter by status, priority, client
- Project cards with progress bar, budget, deadline, tasks

**Project Detail**
- Overview with description and status
- Task board (Kanban)
- Budget tracking (planned vs actual)
- Milestones timeline
- Files and documents
- Meeting history

### 4. Tasks
**Kanban Board**
- Columns: To Do, In Progress, Review, Done
- Drag-and-drop task cards
- Filter by priority, assignee, source
- AI-captured tasks highlighted with violet accent

**Task Cards**
- Title, project, client
- Due date, priority, assignee
- Source indicator (manual, meeting, AI)
- Quick status change

### 5. Meetings
**Meeting List**
- Searchable meeting history
- Source indicators (Zoom, Google Meet, Recorded, Manual)
- AI summary preview
- Action items count

**Meeting Detail**
- AI-generated summary
- Action items list with checkboxes
- Assignee avatars
- "Create Tasks" button to convert actions to tasks
- Transcript and recording links

**Voice Capture**
- One-tap recording button
- Real-time transcription
- Auto-extract action items with AI

---

## 🤖 AI Features

### 1. Smart Briefing (Daily Digest)
**Input**: All meetings, tasks, emails, Slack messages from last 24 hours
**Output**: 
- Top 3 priorities for today
- Items needing attention (overdue, blocked, urgent)
- Client health updates
- Suggested actions

### 2. Meeting Intelligence
**Input**: Meeting transcript/recording
**Output**:
- 3-5 sentence summary
- Key decisions made
- Action items with suggested assignees
- Follow-up reminders

### 3. Client Health Scoring
**Input**: Meeting frequency, email response time, project progress, payment history
**Output**:
- Health score (1-100)
- Risk factors (churn, budget overrun, scope creep)
- Opportunities (upsell, expansion, referral)

### 4. Task Auto-Capture
**Input**: Meeting notes, Slack messages, emails
**Output**:
- Identified action items
- Suggested task title and description
- Suggested assignee based on context
- Due date estimation

### 5. Smart Connections
**Input**: All workspace data
**Output**:
- Related tasks across projects
- Similar past meetings
- Connected documents
- Cross-project insights

---

## 📱 Mobile-First Features

### Voice Capture
- One-tap to start recording
- Real-time transcription
- Auto-create meeting note
- Extract action items immediately

### Quick Actions
- Swipe to complete tasks
- Tap to call client
- Quick note capture
- Status updates

### Smart Notifications
- Morning briefing push notification
- Meeting reminders with prep notes
- Task due alerts
- Client health warnings

---

## 🔌 Integrations (Phase 1)

### Calendar
- Google Calendar sync
- Auto-detect meetings
- Pre-meeting briefing
- Post-meeting follow-up

### Communication
- Zoom: Recording and transcript capture
- Google Meet: Recording and transcript capture
- Slack: Message and thread capture
- Gmail: Email capture and threading

### Storage
- Google Drive: Document sync
- Dropbox: File attachments
- OneDrive: Document sync

### Payments
- Stripe: Invoice tracking
- QuickBooks: Financial data

---

## 🚀 Go-to-Market Strategy

### Phase 1: Beta (Month 1-3)
- Build core features (CRM, Projects, Tasks, Meetings)
- Onboard 50 beta agencies (free for 3 months)
- Gather feedback and iterate

### Phase 2: Launch (Month 4-6)
- Launch with pricing: $29/user/month
- Content marketing: "We replaced Notion + Asana for our agency"
- Case studies from beta users
- Product Hunt launch

### Phase 3: Growth (Month 7-12)
- Referral program (1 month free per referral)
- Integration marketplace
- API for custom workflows
- Enterprise tier for 20+ person teams

---

## 💰 Pricing

### Starter: $19/user/month
- 5 clients
- 10 projects
- Basic AI features
- Email support

### Pro: $29/user/month (Most Popular)
- Unlimited clients
- Unlimited projects
- Full AI features
- Priority support
- Integrations

### Enterprise: $49/user/month
- Everything in Pro
- Custom AI training
- SSO/SAML
- Dedicated account manager
- SLA guarantee

---

## 📈 Success Metrics

### User Engagement
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Session duration
- Feature adoption rate

### Business Impact
- Time saved per user per week
- Tasks completed per week
- Meeting follow-up rate
- Client satisfaction score

### Growth
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rate

---

## 🔧 Implementation Checklist

### Week 1-2: Foundation
- [ ] Set up React + Vite + Tailwind project
- [ ] Configure Prisma with SQLite
- [ ] Build authentication (signup/login)
- [ ] Create database schema
- [ ] Build sidebar navigation

### Week 3-4: Core Features
- [ ] Dashboard with AI briefing UI
- [ ] Client CRM (list + detail)
- [ ] Project management (grid/list view)
- [ ] Task Kanban board

### Week 5-6: Intelligence
- [ ] Meeting capture UI
- [ ] AI summary integration (OpenAI/Claude)
- [ ] Action item extraction
- [ ] Voice capture prototype

### Week 7-8: Polish & Launch
- [ ] Mobile responsive design
- [ ] Integration stubs (Calendar, Zoom, Slack)
- [ ] Beta user onboarding
- [ ] Documentation and help center

---

## 🎨 Design System

### Colors
- Primary: Violet (#7C3AED)
- Secondary: Indigo (#4F46E5)
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Error: Red (#EF4444)
- Neutral: Gray scale

### Typography
- Headings: Inter Bold
- Body: Inter Regular
- Mono: JetBrains Mono

### Components
- Buttons: Primary, Secondary, Ghost, Danger
- Cards: Default, Interactive, Stat
- Forms: Input, Select, Textarea, Checkbox, Switch
- Navigation: Sidebar, TopBar, Breadcrumbs
- Data: Table, Kanban, Calendar, Timeline

---

## 📝 User Stories

### As an agency owner, I want to...
1. See all my clients and their health at a glance
2. Never miss a meeting action item
3. Get a daily briefing of what matters today
4. Track project progress and budget in real-time
5. Work from my phone when I'm away from desk

### As a project manager, I want to...
1. See all tasks across projects in one view
2. Drag and drop tasks between status columns
3. Know which tasks came from meetings vs manual
4. Track time and budget per project
5. Generate client reports in one click

### As a team member, I want to...
1. See my assigned tasks across all projects
2. Get reminders for upcoming deadlines
3. Capture meeting notes on mobile
4. Update task status from anywhere
5. Know the context behind every task

---

## 🎯 Competitive Advantages vs Notion

| Feature | Notion | AgencyOS |
|---------|--------|----------|
| Setup time | Hours/days | Minutes (AI sets it up) |
| Maintenance | Manual | Automatic (AI organizes) |
| Intelligence | Reactive | Proactive |
| Mobile | Frustrating | Voice-first, built for mobile |
| Target | Everyone | Agencies specifically |
| Pricing | Free → $10/user | $29/user (premium) |
| Meeting → Tasks | Manual | Automatic |
| Client health | None | AI-scored |
| Daily briefing | None | AI-generated |

---

## 🚦 Launch Checklist

- [ ] Landing page with clear value prop
- [ ] Product demo video (2 minutes)
- [ ] Beta signup form
- [ ] Onboarding flow (5 minutes to value)
- [ ] Help center with FAQs
- [ ] Support email/chat
- [ ] Analytics tracking (Mixpanel/Amplitude)
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring (Vercel Analytics)

---

## 📚 Resources

- Design: Figma file with all components
- API: OpenAPI/Swagger documentation
- SDK: JavaScript/TypeScript client library
- Tutorials: Video walkthroughs for common tasks
- Community: Discord server for beta users

---

**Build this app and you'll have a product that can genuinely take market share from Notion by solving the specific pain points of agency owners and consultants.**
