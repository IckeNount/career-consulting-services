# Database Setup Guide

## Overview

This project uses **Prisma ORM** with **PostgreSQL** for data persistence.

## Database Schema

### Models

- **Application** - User career applications
- **Language** - Language proficiency (relation to Application)
- **StatusHistory** - Application status change tracking
- **AdminUser** - Admin dashboard users
- **AuditLog** - System audit trail

## Setup Options

### Option 1: Supabase (Recommended for Production)

1. **Create a Supabase project**

   - Go to https://supabase.com
   - Create a new project
   - Wait for the database to initialize

2. **Get your database URL**

   - Go to Project Settings > Database
   - Copy the Connection String (URI)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

3. **Update .env file**

   ```bash
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

4. **Run migrations**

   ```bash
   npm run db:migrate
   ```

5. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

### Option 2: Local PostgreSQL

1. **Install PostgreSQL**

   ```bash
   # macOS
   brew install postgresql@14
   brew services start postgresql@14

   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql

   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create a database**

   ```bash
   createdb career_applications
   ```

3. **Update .env file**

   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/career_applications"
   ```

4. **Run migrations**

   ```bash
   npm run db:migrate
   ```

5. **Seed the database**
   ```bash
   npm run db:seed
   ```

### Option 3: Docker PostgreSQL

1. **Create docker-compose.yml** (already in project root)

2. **Start PostgreSQL**

   ```bash
   docker-compose up -d
   ```

3. **Update .env file**

   ```bash
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/career_db"
   ```

4. **Run migrations**
   ```bash
   npm run db:migrate
   ```

## Available NPM Scripts

```bash
# Generate Prisma Client (run after schema changes)
npm run db:generate

# Create and run migrations
npm run db:migrate

# Push schema changes without migration (dev only)
npm run db:push

# Seed the database
npm run db:seed

# Open Prisma Studio (visual database editor)
npm run db:studio

# Reset database (WARNING: deletes all data)
npm run db:reset
```

## Default Admin Credentials

After seeding, you can log in with:

- **Email:** admin@example.com
- **Password:** Admin@123

**⚠️ IMPORTANT:** Change this password in production!

## Database Schema Visualization

```
┌─────────────────────────────────────┐
│         Application                 │
├─────────────────────────────────────┤
│ - id (PK)                           │
│ - firstName, lastName, email        │
│ - phone, dateOfBirth                │
│ - nationality, currentLocation      │
│ - desiredCountry, desiredPosition   │
│ - yearsExperience, salaries         │
│ - resumeUrl, coverLetterUrl         │
│ - skills[], notes                   │
│ - status (enum)                     │
│ - reviewedBy (FK)                   │
└───────────┬─────────────────────────┘
            │
            ├── has many ──> Language
            │                 - language
            │                 - proficiency
            │
            └── has many ──> StatusHistory
                              - status
                              - changedAt
                              - changedBy
                              - notes

┌─────────────────────────────────────┐
│         AdminUser                   │
├─────────────────────────────────────┤
│ - id (PK)                           │
│ - email (unique)                    │
│ - passwordHash                      │
│ - name, role                        │
│ - lastLogin, isActive               │
└───────────┬─────────────────────────┘
            │
            └── has many ──> AuditLog
                              - action
                              - entityType
                              - entityId
                              - changes
                              - timestamp
```

## Troubleshooting

### Error: Can't reach database server

**Solution:** Make sure your database is running and the connection string is correct.

```bash
# Test connection
npx prisma db pull
```

### Error: P3009 - Migration failed

**Solution:** Drop and recreate the database or use db push for development.

```bash
npm run db:push
```

### Error: Module not found '@prisma/client'

**Solution:** Generate Prisma Client.

```bash
npm run db:generate
```

## Production Deployment

### Vercel + Supabase

1. Add `DATABASE_URL` to Vercel environment variables
2. Run migrations in build command:
   ```json
   {
     "buildCommand": "prisma migrate deploy && next build"
   }
   ```

### Connection Pooling (Recommended)

For serverless environments, use connection pooling:

**Supabase:**

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
```

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
