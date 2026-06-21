# AgencyOS — Railway Deployment Guide

## Quick Start (5 minutes)

### 1. Install Railway CLI
```bash
# macOS / Linux
curl -fsSL https://railway.app/install.sh | sh

# Or via Homebrew
brew install railway
```

### 2. Login & Initialize
```bash
railway login
railway init agencyos
```

### 3. Add PostgreSQL Database
```bash
railway add --database postgresql
```
This automatically creates a `DATABASE_URL` variable.

### 4. Deploy
```bash
railway up
```

### 5. Open Your App
```bash
railway open
```

---

## What Happens During Build

The Dockerfile handles everything automatically:

1. **Provider Detection** — If `DATABASE_URL` starts with `postgresql`, the schema provider swaps from SQLite to PostgreSQL
2. **Prisma Generate** — Generates the database client
3. **Frontend Build** — Compiles the React app
4. **Production Server** — Starts the Hono API + serves the SPA

---

## Environment Variables

### Required (auto-set by Railway)
| Variable | Source |
|----------|--------|
| `DATABASE_URL` | PostgreSQL addon (auto) |
| `PORT` | Railway default (3001) |

### Optional (add in Railway Dashboard → Variables)
| Variable | Description | How to Get |
|----------|-------------|------------|
| `STRIPE_SECRET_KEY` | Stripe API key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | Same page as above |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Stripe Dashboard → Webhooks |
| `OPENAI_API_KEY` | OpenAI API key | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `ELEVENLABS_API_KEY` | ElevenLabs for voice | [ElevenLabs](https://elevenlabs.io) |

---

## Post-Deploy Checklist

### Database
- [ ] Run `railway run bun x prisma db push` to create tables
- [ ] Or run it from Railway Shell: Railway Dashboard → Your Service → Shell

### Custom Domain
- [ ] Go to Railway Dashboard → Your Service → Settings → Networking
- [ ] Click "Generate Domain" for a free `.railway.app` URL
- [ ] Or add a custom domain (e.g., `agencyos.app`)

### Stripe Webhook
- [ ] Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
- [ ] Add endpoint: `https://your-app.railway.app/api/stripe/webhook`
- [ ] Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] Copy the webhook signing secret → add to Railway as `STRIPE_WEBHOOK_SECRET`

### OpenAI (optional)
- [ ] Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- [ ] Add to Railway as `OPENAI_API_KEY`
- [ ] AI briefings and chat will use real GPT-4o-mini

---

## Architecture

```
Railway Project
├── agencyos-service (this app)
│   ├── Dockerfile (multi-stage build)
│   ├── server.tsx (Hono API)
│   ├── dist/ (React SPA)
│   └── prisma/ (database schema)
│
└── postgresql-database (Railway addon)
    └── DATABASE_URL (connection string)
```

---

## Troubleshooting

### Build fails with "DATABASE_URL invalid"
- The PostgreSQL addon should auto-set this. Check Railway Dashboard → Variables.

### "P1013: The provided database string is invalid"
- Make sure `DATABASE_URL` starts with `postgresql://`, not `file:`

### Server starts but database tables don't exist
- Run: `railway run bun x prisma db push`

### Health check fails
- Check logs: `railway logs`
- Default port is 3001, Railway should auto-detect this

---

## Manual Deployment (alternative)

If you prefer not to use the CLI:

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add PostgreSQL: "New" → "Database" → "PostgreSQL"
6. Set environment variables in the dashboard
7. Railway auto-deploys on push
