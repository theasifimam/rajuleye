'use client';
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetUnreadCountQuery } from '@/store/notificationApi';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const NotificationDialog = dynamic(
  () => import('./NotificationDialog').then((m) => m.NotificationDialog),
  { ssr: false }
);

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  // Poll every 30 seconds
  const { data } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000,
  });

  const count = data?.data?.count ?? 0;

  return (
    <div className="relative">
      <Button
        id="notification-bell-btn"
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-11 w-11 md:h-12 md:w-12 rounded-2xl hover:bg-primary/5 transition-colors relative shrink-0 group"
        aria-label="Open notifications"
      >
        <Bell
          className={cn(
            'h-4 w-4 md:h-5 md:w-5 transition-colors',
            count > 0 ? 'text-primary' : 'text-muted-foreground'
          )}
        />
        {count > 0 && (
          <span className="absolute top-2 right-2 h-5 w-5 flex items-center justify-center bg-destructive rounded-full border-2 border-background text-[9px] font-black text-white leading-none animate-in zoom-in-50 duration-300">
            {count > 99 ? '99+' : count}
          </span>
        )}
        {/* Pulse ring when there are unread notifications */}
        {count > 0 && (
          <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-destructive/40 animate-ping" />
        )}
      </Button>

      <NotificationDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
