"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  ShoppingBag,
  Star,
  Mail,
  CheckCheck,
  BellOff,
  Loader2,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { useRouter } from "next/navigation";
import {
  useGetNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
} from "@/store/notificationApi";

const typeConfig = {
  order: {
    icon: ShoppingBag,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    label: "Order",
  },
  review: {
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    label: "Review",
  },
  contact: {
    icon: Mail,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    label: "Contact",
  },
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const FILTERS = [
  { label: "All", value: undefined },
  { label: "Orders", value: "order" },
  { label: "Reviews", value: "review" },
  { label: "Messages", value: "contact" },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState(undefined);

  const { data, isLoading, refetch } = useGetNotificationsQuery(
    { page, limit: 20, type: typeFilter },
    { pollingInterval: 30000 }
  );

  const [markRead] = useMarkReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllReadMutation();

  const notifications = data?.data?.notifications ?? [];
  const unreadCount = data?.data?.unreadCount ?? 0;
  const pagination = data?.data?.pagination;

  const handleClick = async (notif) => {
    if (!notif.isRead) await markRead(notif._id);

    if (notif.type === "order") {
      router.push(`/orders?highlight=${notif.refId}`);
    } else if (notif.type === "review") {
      router.push(`/customers?tab=reviews&highlight=${notif.refId}`);
    } else if (notif.type === "contact" && notif.meta) {
      const { senderEmail, senderName, subject, message } = notif.meta;
      const body = encodeURIComponent(
        `Hi ${senderName},\n\nThank you for reaching out to Rajul Eye.\n\n---\nYour original message:\n"${message}"\n\n`
      );
      window.location.href = `mailto:${senderEmail}?subject=${encodeURIComponent(`Re: ${subject}`)}&body=${body}`;
    }
  };

  const handleMarkAll = async () => {
    await markAllRead();
    refetch();
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-10 animate-in fade-in duration-700">
      <PageHeader
        badgeIcon={Bell}
        badgeText="Notifications"
        titleMain="Notification"
        titleAccent="Center"
        description="All orders, reviews, and contact messages in one place."
        showAction={false}
      >
        {unreadCount > 0 && (
          <Button
            id="mark-all-read-btn"
            onClick={handleMarkAll}
            disabled={isMarkingAll}
            variant="outline"
            size="xl"
            className="h-16 md:h-20 w-full sm:w-auto"
          >
            <div className="flex flex-col items-center gap-0.5 md:gap-1">
              {isMarkingAll ? (
                <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4 md:h-5 md:w-5" />
              )}
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                Mark All Read
              </span>
            </div>
          </Button>
        )}
      </PageHeader>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
        {[
          { label: "Total", value: pagination?.total ?? 0, icon: Bell, color: "primary" },
          { label: "Unread", value: unreadCount, icon: Bell, color: "destructive" },
          {
            label: "Orders",
            value: (notifications.filter((n) => n.type === "order").length),
            icon: ShoppingBag,
            color: "blue",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-card border shadow-sm border-primary/5 flex items-center gap-4"
          >
            <div
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                stat.color === "primary"
                  ? "bg-primary/10 text-primary"
                  : stat.color === "destructive"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-blue-500/10 text-blue-500"
              )}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
                {stat.label}
              </p>
              <h4 className="text-xl font-black italic">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 px-4 md:px-0 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        {FILTERS.map((f) => (
          <button
            key={f.label}
            id={`notif-filter-${f.label.toLowerCase()}`}
            onClick={() => {
              setTypeFilter(f.value);
              setPage(1);
            }}
            className={cn(
              "px-5 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 shrink-0",
              typeFilter === f.value
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                : "bg-muted/20 border-transparent text-muted-foreground hover:bg-muted/40"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="rounded-[3rem] bg-card border shadow-md border-primary/5 overflow-hidden mx-4 md:mx-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-20 w-20 rounded-3xl bg-muted/30 flex items-center justify-center mb-6">
              <BellOff className="h-9 w-9 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-primary/5">
            {notifications.map((notif, index) => {
              const cfg = typeConfig[notif.type] || typeConfig.order;
              const Icon = cfg.icon;
              return (
                <motion.button
                  key={notif._id}
                  id={`notification-row-${notif._id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => handleClick(notif)}
                  className={cn(
                    "w-full text-left p-6 md:p-8 flex items-start gap-5 transition-all duration-300 hover:bg-primary/3 group relative",
                    !notif.isRead && "bg-primary/2"
                  )}
                >
                  {/* Unread dot */}
                  {!notif.isRead && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 border",
                      cfg.bg,
                      cfg.border
                    )}
                  >
                    <Icon className={cn("h-6 w-6", cfg.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            "text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border",
                            cfg.bg,
                            cfg.color,
                            cfg.border
                          )}
                        >
                          {cfg.label}
                        </span>
                        {!notif.isRead && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-widest whitespace-nowrap shrink-0">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>

                    <p
                      className={cn(
                        "text-sm font-black mb-1 leading-snug",
                        !notif.isRead ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {notif.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 font-medium leading-relaxed line-clamp-2">
                      {notif.body}
                    </p>

                    {/* Action hint */}
                    <div className="flex items-center gap-1.5 mt-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover:text-primary transition-colors">
                      <span>
                        {notif.type === "contact"
                          ? "Click to reply via email"
                          : "Click to view details"}
                      </span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="p-6 md:p-8 border-t border-primary/5 flex justify-end">
            <Pagination
              currentPage={page}
              totalPages={pagination.pages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
