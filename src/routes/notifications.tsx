import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import { ChevronLeft, Bell, Sparkles, Settings, Wallet, MessageSquare, X } from "lucide-react";
import { useNotifications, useUnreadCount, markRead, type Notification } from "@/lib/notifications";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [active, setActive] = useState<Notification | null>(null);

  const handleClick = (n: Notification) => {
    markRead(n.id);
    setActive(n);
  };

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <MobileShell>
      <StatusBar />
      <div className="px-5 pt-2 pb-16 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 text-[var(--brand-forest)]">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-bold">Notifications</span>
          </div>
          {unreadCount > 0 ? (
            <span className="text-[10px] font-semibold text-[var(--brand-lime)] bg-[var(--brand-lime)]/15 px-2 py-0.5 rounded-full transition-premium">
              {unreadCount} new
            </span>
          ) : (
            <span className="w-9" />
          )}
        </div>

        <h1 className="mt-5 text-lg font-bold text-[var(--brand-forest)]">Recent activity</h1>
        <p className="text-xs text-[var(--brand-forest)]/60">Latest signals from your assistant and customers</p>

        <ul className="mt-4 space-y-2.5">
          {notifications.map((n, i) => (
            <li key={n.id} style={{ animationDelay: `${i * 40}ms` }} className="animate-fade-up">
              <button
                type="button"
                onClick={() => handleClick(n)}
                className={`relative block w-full text-left rounded-2xl border p-3.5 transition-[background,border,transform,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:translate-y-[-1px] hover:border-[var(--brand-lime)]/40 shadow-[var(--shadow-card)] ${
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
                      <span className="text-[13px] font-bold text-[var(--brand-forest)] truncate">{n.title}</span>
                      <span className="text-[10px] text-[var(--brand-forest)]/50 whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--brand-forest)]/70 line-clamp-2">{n.preview}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-forest)]/50">
                        {n.category} · {n.type}
                      </span>
                      {n.unread && (
                        <span className="w-2 h-2 rounded-full bg-[var(--brand-lime)] shadow-[0_0_0_4px_rgba(139,195,74,0.2)]" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <HomeIndicator />
      <NotificationOverlay
        notification={active}
        isMobile={isMobile}
        onClose={() => setActive(null)}
      />
    </MobileShell>
  );
}

const PRIORITY_STYLES: Record<Notification["priority"], string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-[var(--brand-lime)]/20 text-[var(--brand-forest)]",
};

function NotificationOverlay({
  notification,
  isMobile,
  onClose,
}: {
  notification: Notification | null;
  isMobile: boolean;
  onClose: () => void;
}) {
  const open = !!notification;
  return (
    <div
      className={`absolute inset-0 z-50 transition-premium ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      {isMobile ? (
        <div
          className={`absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl px-5 pt-3 pb-8 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mx-auto w-10 h-1.5 rounded-full bg-[var(--brand-forest)]/15" />
          {notification && <OverlayBody n={notification} onClose={onClose} />}
        </div>
      ) : (
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md bg-white rounded-3xl shadow-2xl p-6 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            open ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {notification && <OverlayBody n={notification} onClose={onClose} />}
        </div>
      )}
    </div>
  );
}

function OverlayBody({ n, onClose }: { n: Notification; onClose: () => void }) {
  return (
    <div className="relative pt-2">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-0 right-0 w-8 h-8 rounded-full bg-[var(--brand-forest)]/5 inline-flex items-center justify-center transition-premium hover:bg-[var(--brand-forest)]/10"
      >
        <X className="w-4 h-4 text-[var(--brand-forest)]" />
      </button>
      <div className="flex items-center gap-2 pr-10">
        <span className="w-9 h-9 rounded-xl bg-[var(--brand-forest)]/5 text-[var(--brand-forest)] inline-flex items-center justify-center">
          {ICONS[n.category]}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-forest)]/60 bg-[var(--brand-forest)]/5 px-2 py-1 rounded-full">
          {n.category}
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${PRIORITY_STYLES[n.priority]}`}>
          {n.priority}
        </span>
      </div>
      <h2 className="mt-3 text-base font-extrabold text-[var(--brand-forest)] leading-snug pr-6">
        {n.title}
      </h2>
      <div className="mt-1 text-[11px] text-[var(--brand-forest)]/50">{n.time}</div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--brand-forest)]/80 whitespace-pre-wrap">
        {n.body}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full rounded-full bg-[var(--brand-forest)] text-white text-xs font-bold py-3 transition-premium hover:scale-[1.01]"
      >
        Close
      </button>
    </div>
  );
}
