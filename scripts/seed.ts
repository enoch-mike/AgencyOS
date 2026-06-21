import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Create a user
  const user = await prisma.user.create({
    data: {
      email: 'alex@agency.com',
      name: 'Alex Thompson',
      role: 'owner',
    },
  })
  console.log('✅ Created user:', user.name)

  // Create clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'Sarah Chen',
        email: 'sarah@meridian.com',
        company: 'Meridian Corp',
        industry: 'Technology',
        status: 'active',
        healthScore: 92,
        lastContact: new Date(),
        userId: user.id,
      },
    }),
    prisma.client.create({
      data: {
        name: 'Marcus Williams',
        email: 'marcus@nexusstudios.com',
        company: 'Nexus Studios',
        industry: 'Creative Agency',
        status: 'active',
        healthScore: 68,
        lastContact: new Date(Date.now() - 86400000), // 1 day ago
        userId: user.id,
      },
    }),
    prisma.client.create({
      data: {
        name: 'Emily Rodriguez',
        email: 'emily@brightside.com',
        company: 'Brightside Marketing',
        industry: 'Marketing',
        status: 'active',
        healthScore: 88,
        lastContact: new Date(Date.now() - 10800000), // 3 hours ago
        userId: user.id,
      },
    }),
    prisma.client.create({
      data: {
        name: 'David Park',
        email: 'david@verdant.com',
        company: 'Verdant Health',
        industry: 'Healthcare',
        status: 'active',
        healthScore: 45,
        lastContact: new Date(Date.now() - 604800000), // 1 week ago
        userId: user.id,
      },
    }),
  ])
  console.log('✅ Created', clients.length, 'clients')

  // Create projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Website Redesign',
        description: 'Complete website redesign with modern UI/UX, mobile-first approach, and CMS integration.',
        status: 'active',
        priority: 'high',
        deadline: new Date('2026-06-28'),
        budget: 45000,
        spent: 28500,
        progress: 65,
        userId: user.id,
        clientId: clients[0].id,
      },
    }),
    prisma.project.create({
      data: {
        name: 'Brand Identity Refresh',
        description: 'Brand exploration, logo design, color palette, typography, and brand guidelines.',
        status: 'active',
        priority: 'urgent',
        deadline: new Date('2026-06-21'),
        budget: 32000,
        spent: 22000,
        progress: 40,
        userId: user.id,
        clientId: clients[1].id,
      },
    }),
    prisma.project.create({
      data: {
        name: 'Social Media Campaign',
        description: 'Multi-platform social media campaign including content creation, scheduling, and analytics.',
        status: 'active',
        priority: 'medium',
        deadline: new Date('2026-06-30'),
        budget: 28000,
        spent: 18500,
        progress: 80,
        userId: user.id,
        clientId: clients[2].id,
      },
    }),
    prisma.project.create({
      data: {
        name: 'Product Launch Strategy',
        description: 'Complete product launch strategy including market research, positioning, and go-to-market plan.',
        status: 'planning',
        priority: 'medium',
        deadline: new Date('2026-07-15'),
        budget: 55000,
        spent: 4500,
        progress: 15,
        userId: user.id,
        clientId: clients[3].id,
      },
    }),
  ])
  console.log('✅ Created', projects.length, 'projects')

  // Create tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Finalize homepage wireframes',
        description: 'Complete wireframes for all homepage sections including hero, features, and CTA.',
        status: 'review',
        priority: 'high',
        dueDate: new Date(),
        assignedTo: 'Sarah',
        source: 'manual',
        userId: user.id,
        projectId: projects[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Update brand color palette',
        description: 'Revise color palette based on client feedback from yesterday meeting.',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(),
        assignedTo: 'Marcus',
        source: 'meeting',
        userId: user.id,
        projectId: projects[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Create Instagram content calendar',
        description: 'Plan and schedule 30 days of Instagram content for July.',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000), // tomorrow
        assignedTo: 'Emily',
        source: 'manual',
        userId: user.id,
        projectId: projects[2].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Review competitor analysis',
        description: 'Analyze top 5 competitors and identify key differentiators.',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 172800000), // 2 days
        assignedTo: 'Alex',
        source: 'ai_captured',
        userId: user.id,
        projectId: projects[3].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Fix mobile navigation bug',
        description: 'Navigation menu not closing properly on iOS devices.',
        status: 'in_progress',
        priority: 'urgent',
        dueDate: new Date(),
        assignedTo: 'David',
        source: 'manual',
        userId: user.id,
        projectId: projects[0].id,
      },
    }),
  ])
  console.log('✅ Created', tasks.length, 'tasks')

  // Create meetings
  const meetings = await Promise.all([
    prisma.meeting.create({
      data: {
        title: 'Discovery Call - Meridian Corp',
        date: new Date(),
        duration: 45,
        notes: 'Discussed homepage redesign requirements. Client wants modern, minimalist aesthetic with focus on mobile experience.',
        summary: 'Discussed homepage redesign requirements. Client wants modern, minimalist aesthetic with focus on mobile experience. Key deliverables: wireframes by June 20, final designs by June 28. Budget approved for premium animations.',
        source: 'zoom',
        userId: user.id,
        clientId: clients[0].id,
        projectId: projects[0].id,
      },
    }),
    prisma.meeting.create({
      data: {
        title: 'Strategy Review - Nexus Studios',
        date: new Date(Date.now() - 86400000), // yesterday
        duration: 60,
        notes: 'Reviewed brand exploration concepts. Client leaning toward option B (geometric) but wants to see color variations.',
        summary: 'Reviewed brand exploration concepts. Client leaning toward option B (geometric) but wants to see color variations. Concerns about budget for photography. Need to present revised budget by Friday.',
        source: 'google_meet',
        userId: user.id,
        clientId: clients[1].id,
        projectId: projects[1].id,
      },
    }),
    prisma.meeting.create({
      data: {
        title: 'Weekly Sync - Brightside Marketing',
        date: new Date(Date.now() - 172800000), // 2 days ago
        duration: 30,
        notes: 'Weekly check-in on social campaign performance. Instagram engagement up 23%.',
        summary: 'Weekly check-in on social campaign performance. Instagram engagement up 23%. TikTok content performing well. Client wants to increase posting frequency on LinkedIn.',
        source: 'recorded',
        userId: user.id,
        clientId: clients[2].id,
        projectId: projects[2].id,
      },
    }),
  ])
  console.log('✅ Created', meetings.length, 'meetings')

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
