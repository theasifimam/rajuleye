'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Star,
  Mail,
  BellOff,
  CheckCheck,
  ArrowRight,
  X,
  Loader2,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  useGetNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
} from '@/store/notificationApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const typeConfig = {
  order: {
    icon: ShoppingBag,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: 'Order',
  },
  review: {
    icon: Star,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    label: 'Review',
  },
  contact: {
    icon: Mail,
    color: 'text-primary',
    bg: 'bg-primary/10',
    label: 'Message',
  },
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationDialog({ open, onOpenChange }) {
  const router = useRouter();

  const { data, isLoading, refetch } = useGetNotificationsQuery(
    { page: 1, limit: 10 },
    { skip: !open, pollingInterval: open ? 30000 : 0 }
  );

  const [markRead] = useMarkReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllReadMutation();

  // Refetch when dialog opens
  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  const notifications = data?.data?.notifications ?? [];
  const unreadCount = data?.data?.unreadCount ?? 0;

  const handleNotificationClick = async (notif) => {
    // Mark as read
    if (!notif.isRead) {
      await markRead(notif._id);
    }

    onOpenChange(false);

    if (notif.type === 'order') {
      router.push(`/orders?highlight=${notif.refId}`);
    } else if (notif.type === 'review') {
      router.push(`/customers?tab=reviews&highlight=${notif.refId}`);
    } else if (notif.type === 'contact' && notif.meta) {
      // Open system mail client with pre-filled reply
      const { senderEmail, senderName, subject, message } = notif.meta;
      const body = encodeURIComponent(
        `Hi ${senderName},\n\nThank you for reaching out to Rajul Eye.\n\n---\nYour original message:\n"${message}"\n\n`
      );
      const mailtoUrl = `mailto:${senderEmail}?subject=${encodeURIComponent(`Re: ${subject}`)}&body=${body}`;
      window.location.href = mailtoUrl;
    }
  };

  const handleMarkAll = async () => {
    await markAllRead();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 rounded-[2rem] overflow-hidden border border-border/60 shadow-2xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/40 bg-card/80 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest leading-none">
                  Notifications
                </p>
                {unreadCount > 0 && (
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                    {unreadCount} unread
                  </p>
                )}
              </div>
            </DialogTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAll}
                disabled={isMarkingAll}
                className="text-[10px] font-black uppercase tracking-widest h-8 px-3 rounded-xl hover:bg-primary/5 hover:text-primary gap-1.5"
              >
                {isMarkingAll ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCheck className="h-3 w-3" />
                )}
                Mark all read
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Notification List */}
        <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-8">
              <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <BellOff className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                All caught up!
              </p>
              <p className="text-[10px] font-medium text-muted-foreground/60 mt-1 uppercase tracking-widest">
                No new notifications
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {notifications.map((notif) => {
                const cfg = typeConfig[notif.type] || typeConfig.order;
                const Icon = cfg.icon;
                return (
                  <button
                    key={notif._id}
                    id={`notif-item-${notif._id}`}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      'w-full text-left px-5 py-4 flex items-start gap-4 transition-all duration-300 hover:bg-muted/30 group relative',
                      !notif.isRead && 'bg-primary/3'
                    )}
                  >
                    {/* Unread indicator */}
                    {!notif.isRead && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}

                    <div
                      className={cn(
                        'h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110',
                        cfg.bg
                      )}
                    >
                      <Icon className={cn('h-5 w-5', cfg.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={cn(
                            'text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-full',
                            cfg.bg,
                            cfg.color
                          )}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-widest ml-auto shrink-0">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p
                        className={cn(
                          'text-[12px] font-black leading-snug mb-0.5 truncate',
                          !notif.isRead ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {notif.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 font-medium leading-relaxed line-clamp-2">
                        {notif.body}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border/40 bg-muted/20">
          <Button
            id="view-all-notifications-btn"
            variant="ghost"
            className="w-full h-10 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/5 hover:text-primary justify-between group"
            onClick={() => {
              onOpenChange(false);
              router.push('/notifications');
            }}
          >
            View All Notifications
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
