#!/bin/bash
# AgencyOS — Railway Deployment Script
# Run this locally to deploy to Railway
set -e

echo "🚀 AgencyOS — Railway Deployment"
echo "================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install it:"
    echo "   curl -fsSL https://railway.app/install.sh | sh"
    echo "   or: brew install railway"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please log in to Railway..."
    railway login
fi

# Check if project exists
echo ""
echo "📋 Step 1: Create Railway project (if needed)"
railway init agencyos || echo "Using existing project..."

# Step 2: Add PostgreSQL database
echo ""
echo "🐘 Step 2: Adding PostgreSQL database..."
railway add --database postgresql || echo "PostgreSQL may already exist..."

# Step 3: Set environment variables
echo ""
echo "⚙️  Step 3: Setting environment variables..."
echo "You'll be prompted for each variable. Press Enter to skip optional ones."

echo ""
echo "Required: DATABASE_URL (auto-set by PostgreSQL addon)"
echo "Optional: Add your Stripe keys, OpenAI key, etc."

# Prompt for keys
read -p "OpenAI API Key (optional, press Enter to skip): " OPENAI_KEY
if [ -n "$OPENAI_KEY" ]; then
    railway variables set OPENAI_API_KEY="$OPENAI_KEY"
fi

read -p "Stripe Secret Key (optional, press Enter to skip): " STRIPE_KEY
if [ -n "$STRIPE_KEY" ]; then
    railway variables set STRIPE_SECRET_KEY="$STRIPE_KEY"
fi

read -p "Stripe Publishable Key (optional, press Enter to skip): " STRIPE_PUB
if [ -n "$STRIPE_PUB" ]; then
    railway variables set STRIPE_PUBLISHABLE_KEY="$STRIPE_PUB"
fi

# Step 4: Generate Prisma migrations for PostgreSQL
echo ""
echo "🔄 Step 4: Deploying..."
echo "Railway will build the Dockerfile, which automatically:"
echo "  - Swaps SQLite → PostgreSQL in schema"
echo "  - Generates Prisma client"
echo "  - Builds the frontend"
echo "  - Starts the server"
echo ""

railway up

echo ""
echo "✅ Deployed! Check your app:"
railway open
echo ""
echo "📝 Post-deploy steps:"
echo "  1. Run database migrations in Railway's dashboard"
echo "  2. Add a custom domain (Settings → Networking)"
echo "  3. Set up Stripe webhook URL in Stripe dashboard"
echo ""
