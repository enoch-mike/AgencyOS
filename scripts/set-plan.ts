import { PrismaClient } from './src/generated/prisma/client'

const prisma = new PrismaClient()

const user = await prisma.user.update({
  where: { email: 'admin@agencyos.com' },
  data: { plan: 'pro', role: 'owner' },
})

console.log(`✅ Updated ${user.email} → plan: ${user.plan}, role: ${user.role}`)
process.exit(0)
