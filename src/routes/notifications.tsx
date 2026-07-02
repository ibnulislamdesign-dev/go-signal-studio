import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import {
  ChevronLeft, Bell, Sparkles, Settings, Wallet, MessageSquare, ChevronRight,
} from "lucide-react";
import { useNotifications, useUnreadCount, type Notification } from "@/lib/notifications";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Go Signal" },
      { name: "description", content: "Recent system, AI assistant, and customer notifications." },
    ],
  }),
  component: Notifications,
});

const ICONS: Record<Notification["category"], React.ReactNode> = {
  "AI Assistant": <Sparkles className="w-4 h-4" />,
  "System Update": <Settings className="w-4 h-4" />,
  Billing: <Wallet className="w-4 h-4" />,
  Customer: <MessageSquare className="w-4 h-4" />,
};

function Notifications() {
  const notifications = useNotifications();
  const unreadCount = useUnreadCount();

  return (
    <MobileShell>
      <div className="min-h-full w-full bg-[var(--canvas)] text-[var(--brand-forest)]">
        <div className="px-5 pt-4 pb-24 animate-fade-up">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              aria-label="Back to dashboard"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 text-[var(--brand-forest)]">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-bold">Notifications</span>
            </div>
            {unreadCount > 0 ? (
              <span className="text-[10px] font-semibold text-[var(--brand-lime)] bg-[var(--brand-lime)]/15 px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            ) : (
              <span className="w-9" />
            )}
          </div>

          <h1 className="mt-5 text-lg font-bold text-[var(--brand-forest)]">Recent activity</h1>
          <p className="text-xs text-[var(--brand-forest)]/60">
            Latest signals from your assistant and customers
          </p>

          <ul className="mt-4 space-y-2.5">
            {notifications.map((n, i) => (
              <li
                key={n.id}
                style={{ animationDelay: `${i * 30}ms` }}
                className="animate-fade-up"
              >
                <Link
                  to="/notifications/$id"
                  params={{ id: n.id }}
                  className={`relative block rounded-2xl border p-3.5 shadow-[var(--shadow-card)] transition-[background,border,transform,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:translate-y-[-1px] hover:border-[var(--brand-lime)]/50 ${
                    n.unread
                      ? "bg-[var(--brand-lime)]/10 border-[var(--brand-lime)]/30"
                      : "glass border-white/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-9 h-9 shrink-0 rounded-xl bg-[var(--brand-forest)]/5 text-[var(--brand-forest)] inline-flex items-center justify-center">
                      {ICONS[n.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-bold text-[var(--brand-forest)] truncate">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-[var(--brand-forest)]/50 whitespace-nowrap">
                          {n.time}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--brand-forest)]/70 line-clamp-2">
                        {n.preview}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-forest)]/50">
                          {n.category} · {n.type}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {n.unread && (
                            <span className="w-2 h-2 rounded-full bg-[var(--brand-lime)] shadow-[0_0_0_4px_rgba(139,195,74,0.2)]" />
                          )}
                          <ChevronRight className="w-3.5 h-3.5 text-[var(--brand-forest)]/40" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MobileShell>
  );
}