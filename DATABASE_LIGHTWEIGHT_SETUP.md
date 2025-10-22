# 🪶 Lightweight Database Setup (No Docker Desktop)

If you don't want to install Docker Desktop, here are **lightweight alternatives** to run PostgreSQL for your app.

---

## ✨ Option 1: Postgres.app (Easiest - GUI)

### What is it?

A simple, native macOS app that runs PostgreSQL in the menu bar.

### Installation

1. **Download:** https://postgresapp.com/
2. **Drag to Applications folder**
3. **Open Postgres.app**
4. **Click "Initialize"** to create a PostgreSQL server

### Setup Database

Once Postgres.app is running:

```bash
# Add psql to PATH (add to ~/.zshrc or ~/.bash_profile)
echo 'export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Create the database
psql -U postgres -c "CREATE DATABASE career_db;"

# Test connection
psql -U postgres -d career_db -c "SELECT 1;"
```

### Update .env

No changes needed! The default `.env` should work:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/career_db?schema=public"
```

**Note:** Postgres.app default user is `postgres` with no password. If you need a password:

```bash
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

### Pros & Cons

✅ **Pros:**

- Zero configuration
- Native macOS app
- Lightweight (menu bar only)
- GUI to manage databases
- Multiple PostgreSQL versions

❌ **Cons:**

- macOS only
- Manual start/stop

---

## ✨ Option 2: Homebrew PostgreSQL (Most Lightweight)

### What is it?

Native PostgreSQL installation without any containers.

### Installation

1. **Install Homebrew** (if not installed):

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install PostgreSQL:**

   ```bash
   brew install postgresql@15
   ```

3. **Start PostgreSQL:**

   ```bash
   # Start now
   brew services start postgresql@15

   # Or start manually (won't auto-start on boot)
   pg_ctl -D /opt/homebrew/var/postgresql@15 start
   ```

### Setup Database

```bash
# Create user (if needed)
createuser -s postgres

# Set password
psql postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# Create database
createdb career_db

# Test connection
psql postgresql://postgres:postgres@localhost:5432/career_db -c "SELECT 1;"
```

### Manage Service

```bash
# Start
brew services start postgresql@15

# Stop
brew services stop postgresql@15

# Restart
brew services restart postgresql@15

# Status
brew services info postgresql@15
```

### Pros & Cons

✅ **Pros:**

- Most lightweight option
- Native performance
- No containerization overhead
- Auto-starts on boot
- Full PostgreSQL features

❌ **Cons:**

- Command line only (no GUI)
- Requires Homebrew

---

## ✨ Option 3: Colima (Docker Alternative)

### What is it?

Lightweight Docker Desktop replacement using Lima VM.

### Installation

```bash
# Install Homebrew first (see Option 2)

# Install Colima and Docker CLI
brew install colima docker docker-compose

# Start Colima (this starts a minimal VM)
colima start --cpu 2 --memory 4

# Verify Docker is working
docker ps
```

### Use Your docker-compose.yml

Now your existing setup works:

```bash
cd /Users/troy/Desktop/Landing/shadcn-landing-page
docker compose up -d
```

### Manage Colima

```bash
# Stop
colima stop

# Start
colima start

# Status
colima status

# Delete VM (to free space)
colima delete
```

### Pros & Cons

✅ **Pros:**

- Works with existing Docker Compose files
- Lighter than Docker Desktop (~300MB vs 2GB+)
- Same Docker commands
- Free for commercial use

❌ **Cons:**

- Still uses virtualization
- Requires CLI management
- More setup than Postgres.app

---

## ✨ Option 4: Cloud Database (Free Tier)

### Neon (Serverless PostgreSQL)

Free tier: https://neon.tech

```bash
# 1. Sign up at neon.tech
# 2. Create a project
# 3. Get connection string
# 4. Update .env
```

**Example .env:**

```env
DATABASE_URL="postgresql://user:pass@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Supabase (PostgreSQL + Auth + Storage)

Free tier: https://supabase.com

### Railway (PostgreSQL)

Free tier: https://railway.app

### Pros & Cons

✅ **Pros:**

- No local installation
- Always running
- Managed backups
- Free tier available

❌ **Cons:**

- Requires internet
- Free tier limits
- Slower for development

---

## 🎯 Recommended Setup

### For Development: **Postgres.app**

**Why?**

- Click and go
- Native macOS
- No terminal needed
- Super lightweight

**Steps:**

1. Download from https://postgresapp.com/
2. Open app, click "Initialize"
3. Run setup commands above
4. Run `npm run db:migrate && npm run db:seed`
5. Done! ✅

### For Production: **Cloud Database**

Use Neon, Supabase, or Railway for production deployment.

---

## 📝 After Installing PostgreSQL

Once PostgreSQL is running (any method), run these commands:

```bash
cd /Users/troy/Desktop/Landing/shadcn-landing-page

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data (creates admin user)
npm run db:seed

# Start dev server
npm run dev
```

### Verify It's Working

1. Check database connection:

   ```bash
   psql postgresql://postgres:postgres@localhost:5432/career_db -c "\dt"
   ```

2. Open Prisma Studio:

   ```bash
   npm run db:studio
   ```

3. Test login:
   - Go to: http://localhost:3000/admin/login
   - Email: `admin@example.com`
   - Password: `Admin@123`

---

## 🐛 Troubleshooting

### Can't connect to PostgreSQL

```bash
# Check if PostgreSQL is running
# For Postgres.app: Check menu bar icon
# For Homebrew:
brew services list | grep postgresql

# Check port 5432
lsof -i :5432
```

### "role postgres does not exist"

```bash
# Create postgres user
createuser -s postgres

# Set password
psql postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

### Database doesn't exist

```bash
# Create database
createdb career_db

# Or with psql
psql postgres -c "CREATE DATABASE career_db;"
```

---

## 💡 My Recommendation

**Go with Postgres.app** if you want:

- ✅ Simple setup (5 minutes)
- ✅ GUI interface
- ✅ Native performance
- ✅ Lightweight

**Download:** https://postgresapp.com/

After installing, just run:

```bash
psql -U postgres -c "CREATE DATABASE career_db;"
npm run db:migrate
npm run db:seed
npm run dev
```

That's it! No Docker needed. 🎉
