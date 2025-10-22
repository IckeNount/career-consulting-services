# Admin Authentication Setup

This application uses **NextAuth.js** for admin authentication with secure credential-based login.

## 🔐 Features

- ✅ Secure credential-based authentication
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ JWT session management (24-hour expiry)
- ✅ Role-based access control (ADMIN & SUPER_ADMIN)
- ✅ Protected routes with middleware
- ✅ Audit logging for sign-in/sign-out events
- ✅ Last login tracking

## 🚀 Quick Start

### 1. Environment Setup

Make sure your `.env` file has the following variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-min-32-chars
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/career_db
```

⚠️ **Important**: Generate a secure secret for production:

```bash
openssl rand -base64 32
```

### 2. Database Setup

Generate Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

### 3. Create Initial Admin

Run the seed script to create the default admin:

```bash
npm run db:seed
```

**Default credentials:**

- Email: `admin@example.com`
- Password: `Admin@123`

⚠️ **Change these credentials immediately in production!**

## 🔧 Creating Additional Admins

Use the interactive CLI tool:

```bash
npm run create-admin
```

This will prompt you for:

- Email
- Full Name
- Password (min 8 characters)
- Role (ADMIN or SUPER_ADMIN)

## 📁 File Structure

```
lib/
  ├── auth.ts                 # NextAuth configuration
  └── auth-utils.ts           # Server-side auth utilities

app/
  ├── api/
  │   └── auth/
  │       └── [...nextauth]/
  │           └── route.ts    # NextAuth API routes
  └── admin/
      ├── login/
      │   └── page.tsx        # Login page
      └── dashboard/
          └── page.tsx        # Protected dashboard

components/
  └── auth-provider.tsx       # Client-side session provider

middleware.ts                 # Route protection middleware
```

## 🛡️ Protected Routes

The following routes require authentication:

- `/admin/*` - All admin pages
- `/api/v1/applications/*` - Application management APIs
- `/api/v1/analytics/*` - Analytics APIs

Unauthenticated users are automatically redirected to `/admin/login`.

## 🎯 Using Authentication in Your Code

### Server Components

```typescript
import { requireAuth, requireSuperAdmin } from "@/lib/auth-utils";

// Require any authenticated admin
export default async function AdminPage() {
  const session = await requireAuth();
  // Your code here
}

// Require super admin only
export default async function SuperAdminPage() {
  const session = await requireSuperAdmin();
  // Your code here
}
```

### Client Components

```typescript
"use client";
import { useSession, signOut } from "next-auth/react";

export default function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return (
    <div>
      <p>Welcome {session.user.name}!</p>
      <p>Role: {session.user.role}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### API Routes

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Your API logic here
}
```

## 👥 User Roles

### ADMIN

- View and manage applications
- Update application statuses
- View analytics
- Basic administrative tasks

### SUPER_ADMIN

- All ADMIN permissions
- Manage other admin users
- Access system settings
- View audit logs
- Full system access

## 🔒 Security Best Practices

1. **Change default credentials** immediately after first login
2. **Use strong passwords** (minimum 8 characters, mix of upper/lower/numbers/symbols)
3. **Keep NEXTAUTH_SECRET secure** and never commit it to version control
4. **Use HTTPS in production** - update NEXTAUTH_URL to https://
5. **Regularly audit user access** through the audit logs
6. **Implement rate limiting** for login attempts (recommended)
7. **Enable 2FA** for super admin accounts (future enhancement)

## 📊 Audit Logging

All authentication events are automatically logged:

- Sign-in attempts
- Sign-out events
- Password changes
- Role modifications

View audit logs in the database:

```bash
npm run db:studio
# Navigate to AuditLog table
```

## 🧪 Testing the Setup

1. Start the development server:

```bash
npm run dev
```

2. Navigate to: http://localhost:3000/admin/login

3. Login with default credentials:

   - Email: `admin@example.com`
   - Password: `Admin@123`

4. You should be redirected to: http://localhost:3000/admin/dashboard

## 🐛 Troubleshooting

### "Invalid credentials" error

- Check that the database is running
- Verify the user exists: `npm run db:studio`
- Ensure password is correct (default: `Admin@123`)

### Redirect loop

- Clear browser cookies
- Check NEXTAUTH_URL matches your domain
- Verify middleware.ts is configured correctly

### Session not persisting

- Check NEXTAUTH_SECRET is set
- Verify cookies are enabled in browser
- Check for CORS issues if using different domains

### TypeScript errors

- Run `npm run db:generate` to regenerate Prisma client
- Restart TypeScript server in VS Code

## 📝 Next Steps

- [ ] Change default admin password
- [ ] Create additional admin users
- [ ] Configure email notifications (optional)
- [ ] Set up rate limiting for login attempts
- [ ] Implement password reset flow
- [ ] Add 2FA for enhanced security
- [ ] Configure session timeout settings

## 🔗 Useful Links

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Need help?** Check the audit logs or contact your system administrator.
