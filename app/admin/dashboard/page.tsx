"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Shield, User } from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='max-w-6xl mx-auto space-y-8'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-4xl font-bold'>Admin Dashboard</h1>
            <p className='text-muted-foreground mt-2'>
              Welcome back, {session.user.name}
            </p>
          </div>
          <Button
            variant='outline'
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut className='mr-2 h-4 w-4' />
            Sign Out
          </Button>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Account Information
            </CardTitle>
            <CardDescription>Your current session details</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Name
                </p>
                <p className='text-lg font-semibold'>{session.user.name}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Email
                </p>
                <p className='text-lg font-semibold'>{session.user.email}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Role
                </p>
                <div className='mt-1'>
                  <Badge
                    variant={
                      session.user.role === "SUPER_ADMIN"
                        ? "default"
                        : "secondary"
                    }
                    className='text-sm'
                  >
                    <Shield className='mr-1 h-3 w-3' />
                    {session.user.role}
                  </Badge>
                </div>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  User ID
                </p>
                <p className='text-sm font-mono'>{session.user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Applications</CardTitle>
              <CardDescription>Manage job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className='w-full' variant='outline' asChild>
                <a href='/admin/applications'>View Applications</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Analytics</CardTitle>
              <CardDescription>View statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className='w-full' variant='outline'>
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Settings</CardTitle>
              <CardDescription>Configure system</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className='w-full' variant='outline'>
                Open Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* API Status */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Useful resources and endpoints</CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='flex justify-between items-center p-2 hover:bg-muted rounded-md'>
              <span className='text-sm'>API Documentation</span>
              <Button variant='ghost' size='sm' asChild>
                <a href='/api/v1/applications' target='_blank'>
                  View
                </a>
              </Button>
            </div>
            <div className='flex justify-between items-center p-2 hover:bg-muted rounded-md'>
              <span className='text-sm'>Database Studio</span>
              <Button variant='ghost' size='sm'>
                Open Prisma Studio
              </Button>
            </div>
            <div className='flex justify-between items-center p-2 hover:bg-muted rounded-md'>
              <span className='text-sm'>Health Check</span>
              <Button variant='ghost' size='sm' asChild>
                <a href='/api/health' target='_blank'>
                  Check
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
