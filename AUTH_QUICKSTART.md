# 🚀 Quick Start Guide - Admin Authentication

## ✅ What's Been Set Up

Your admin authentication system is now fully configured with:

- ✅ **NextAuth.js** - Industry-standard authentication
- ✅ **Secure password hashing** - bcrypt with 12 rounds
- ✅ **JWT sessions** - 24-hour token expiry
- ✅ **Protected routes** - Middleware guards admin pages
- ✅ **Role-based access** - ADMIN & SUPER_ADMIN roles
- ✅ **Audit logging** - Track all authentication events
- ✅ **Beautiful login UI** - Modern, responsive design

## 📋 Prerequisites

Before you can use the authentication system, you need:

1. **Docker** installed (for PostgreSQL database)

   - macOS: Download from https://www.docker.com/products/docker-desktop/
   - Or install via Homebrew: `brew install --cask docker`

2. **PostgreSQL** running on port 5432

## 🎯 Getting Started

### Step 1: Start the Database

```bash
# Start PostgreSQL with Docker
docker compose up -d

# Verify it's running
docker compose ps
```

### Step 2: Set Up the Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with initial admin user
npm run db:seed
```

### Step 3: Start the Development Server

```bash
npm run dev
```

### Step 4: Login

1. Navigate to: **http://localhost:3000/admin/login**

2. Use default credentials:

   - **Email:** `admin@example.com`
   - **Password:** `Admin@123`

3. You'll be redirected to: **http://localhost:3000/admin/dashboard**

## 🔑 Default Admin Credentials

⚠️ **IMPORTANT:** Change these immediately after first login!

```
Email: admin@example.com
Password: Admin@123
Role: SUPER_ADMIN
```

## 🛠️ Common Commands

```bash
# Create a new admin user (interactive)
npm run create-admin

# View database in browser UI
npm run db:studio

# Reset database (WARNING: deletes all data)
npm run db:reset

# Stop database
docker compose down

# Stop database and remove volumes
docker compose down -v
```

## 📁 Key Files Created

```
lib/
  ├── auth.ts              # NextAuth configuration
  └── auth-utils.ts        # Helper functions

app/
  ├── api/auth/[...nextauth]/route.ts   # Auth API endpoint
  ├── admin/login/page.tsx               # Login page
  └── admin/dashboard/page.tsx           # Protected dashboard

components/
  └── auth-provider.tsx    # Session provider

middleware.ts              # Route protection
scripts/create-admin.ts    # CLI admin creation tool
AUTH_SETUP.md             # Detailed documentation
```

## 🔐 Environment Variables

Your `.env` file has been configured with:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-min-32-chars
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/career_db
```

⚠️ **For production:** Generate a new secret:

```bash
openssl rand -base64 32
```

## 🚦 Testing the Setup

1. **Check health endpoint:**

   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Try accessing protected route (should redirect):**

   ```
   http://localhost:3000/admin/dashboard
   ```

3. **Login and access dashboard:**
   - Login at `/admin/login`
   - Should redirect to `/admin/dashboard`
   - Should see your user info and role

## 🎨 Features Included

### Login Page (`/admin/login`)

- Beautiful, responsive design
- Form validation
- Error handling
- Loading states
- Dark mode support

### Dashboard (`/admin/dashboard`)

- User information display
- Role badges
- Quick action cards
- Sign out functionality
- Protected by authentication

### Protected Routes

- `/admin/*` - All admin pages
- `/api/v1/applications/*` - Application APIs
- `/api/v1/analytics/*` - Analytics APIs

### Security Features

- Password hashing (bcrypt, 12 rounds)
- JWT tokens (24-hour expiry)
- Secure session management
- Audit logging
- Last login tracking
- Active/inactive user flags

## 🧪 Usage Examples

### Server Component (Protected Page)

```typescript
import { requireAuth } from "@/lib/auth-utils";

export default async function MyPage() {
  const session = await requireAuth();

  return (
    <div>
      <h1>Welcome {session.user.name}!</h1>
      <p>Your role: {session.user.role}</p>
    </div>
  );
}
```

### Client Component

```typescript
"use client";
import { useSession, signOut } from "next-auth/react";

export function UserMenu() {
  const { data: session } = useSession();

  return (
    <div>
      <p>{session?.user.email}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
```

### API Route

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Your API logic
}
```

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check if Docker is running
docker ps

# Start the database
docker compose up -d

# Check logs
docker compose logs postgres
```

### "Invalid credentials" Error

- Verify database has been seeded: `npm run db:seed`
- Check user exists: `npm run db:studio`
- Ensure correct password: `Admin@123`

### Session Not Persisting

- Check NEXTAUTH_SECRET is set in `.env`
- Clear browser cookies
- Restart dev server

### TypeScript Errors

```bash
# Regenerate Prisma client
npm run db:generate

# Restart TypeScript server in VS Code
```

## 📚 Additional Resources

- Full documentation: `AUTH_SETUP.md`
- Database docs: `DATABASE_COMPLETE.md`
- API docs: `API_COMPLETE.md`

## 🎉 Next Steps

1. ✅ Start Docker and database
2. ✅ Run migrations and seed
3. ✅ Test login at `/admin/login`
4. ✅ Change default admin password
5. ✅ Create additional admin users: `npm run create-admin`
6. ✅ Build your admin features!

## 💡 Tips

- Use `requireAuth()` in server components for protected pages
- Use `useSession()` in client components for user data
- Check `session.user.role` for role-based features
- All auth events are logged in `AuditLog` table
- View logs with: `npm run db:studio`

---

**Ready to go!** Start with `docker compose up -d` and `npm run dev` 🚀
