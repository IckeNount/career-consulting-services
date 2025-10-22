# Quick Start: Database Setup

## 🚀 Fastest Way to Get Started

### Using Docker (Recommended for Local Development)

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Update .env (it should already have):
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/career_db"

# 3. Run migrations to create tables
npm run db:migrate

# 4. Seed with sample data
npm run db:seed

# 5. Open Prisma Studio to view data
npm run db:studio
```

**Done!** 🎉 Your database is ready.

Default admin login:

- Email: `admin@example.com`
- Password: `Admin@123`

---

## 📊 What's Created?

Your database now has:

- ✅ **5 tables** (applications, admin_users, languages, status_history, audit_logs)
- ✅ **1 admin user** (super admin)
- ✅ **2 sample applications** (for testing)
- ✅ **Proper relationships** and indexes

---

## 🛠️ Useful Commands

```bash
# View/edit data visually
npm run db:studio

# Create a new migration after schema changes
npm run db:migrate

# Reset database (deletes all data!)
npm run db:reset

# Generate Prisma Client after schema changes
npm run db:generate
```

---

## 🌐 Production Setup (Supabase)

1. Create free account at https://supabase.com
2. Create new project
3. Copy connection string from Settings > Database
4. Update `.env` with your Supabase URL
5. Run `npm run db:migrate`
6. Done!

---

For detailed instructions, see [DATABASE_SETUP.md](./DATABASE_SETUP.md)
