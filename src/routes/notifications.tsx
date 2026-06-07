import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import {
  ChevronLeft, Bell, Sparkles, Settings, Wallet, MessageSquare, X,
  Sparkle, MessageCircle, CreditCard, PhoneCall, ArrowRight,
} from "lucide-react";
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
          className={`absolute inset-0 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {notification && <OverlayBody n={notification} onClose={onClose} fullScreen />}
        </div>
      ) : (
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg bg-white rounded-3xl shadow-2xl p-6 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            open ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {notification && <OverlayBody n={notification} onClose={onClose} />}
        </div>
      )}
    </div>
  );
}

type PrimaryAction = {
  label: string;
  icon: React.ReactNode;
  className: string;
  onClick: () => void;
};

function extractPhoneNumber(text: string): string | null {
  const m = text.match(/0\d{10}/);
  return m ? m[0] : null;
}

function useNotificationAction(n: Notification, onClose: () => void): PrimaryAction {
  const navigate = useNavigate();
  const go = (to: string) => {
    onClose();
    navigate({ to });
  };

  const isMissedCall = /missed call/i.test(n.title) || /missed call/i.test(n.preview);
  const phone = extractPhoneNumber(`${n.preview} ${n.body}`);

  if (isMissedCall && phone) {
    return {
      label: `Call back ${phone}`,
      icon: <PhoneCall className="w-4 h-4" />,
      className: "bg-[var(--brand-forest)] text-white hover:scale-[1.01]",
      onClick: () => { window.location.href = `tel:${phone}`; },
    };
  }

  if (n.category === "Billing") {
    return {
      label: "Complete subscription",
      icon: <CreditCard className="w-4 h-4" />,
      className: "bg-gradient-to-r from-[var(--brand-forest)] to-[#00695c] text-white hover:scale-[1.01]",
      onClick: () => go("/subscription"),
    };
  }

  if (n.type === "chat") {
    const isWhatsApp = /whatsapp/i.test(n.title) || /whatsapp/i.test(n.preview) || /whatsapp/i.test(n.body);
    return {
      label: isWhatsApp ? "Reply on WhatsApp" : "Open chat",
      icon: <MessageCircle className="w-4 h-4" />,
      className: isWhatsApp
        ? "bg-[#25D366] text-white hover:scale-[1.01]"
        : "bg-[var(--brand-forest)] text-white hover:scale-[1.01]",
      onClick: () => go(`/traffic/${n.targetId}`),
    };
  }

  if (n.category === "AI Assistant") {
    return {
      label: "Open AI Assistant",
      icon: <Sparkle className="w-4 h-4" />,
      className: "bg-[var(--brand-forest)] text-white hover:scale-[1.01]",
      onClick: () => go("/assistant"),
    };
  }

  if (n.link) {
    const to = n.link.to;
    return {
      label: n.link.label,
      icon: <ArrowRight className="w-4 h-4" />,
      className: "bg-[var(--brand-forest)] text-white hover:scale-[1.01]",
      onClick: () => go(to),
    };
  }

  return {
    label: "Got it",
    icon: <ArrowRight className="w-4 h-4" />,
    className: "bg-[var(--brand-forest)] text-white hover:scale-[1.01]",
    onClick: onClose,
  };
}

function OverlayBody({
  n,
  onClose,
  fullScreen = false,
}: {
  n: Notification;
  onClose: () => void;
  fullScreen?: boolean;
}) {
  const action = useNotificationAction(n, onClose);

  if (fullScreen) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-[var(--brand-forest)]/5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-[var(--brand-forest)]">Activity detail</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-6">
          <DetailBlock n={n} />
        </div>
        <div className="px-5 pt-3 pb-7 border-t border-[var(--brand-forest)]/5 bg-white">
          <button
            type="button"
            onClick={action.onClick}
            className={`w-full rounded-full text-sm font-bold py-3.5 transition-premium inline-flex items-center justify-center gap-2 shadow-[var(--shadow-card)] ${action.className}`}
          >
            {action.icon}
            {action.label}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full text-[11px] font-semibold text-[var(--brand-forest)]/60 py-2 transition-premium hover:text-[var(--brand-forest)]"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

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
      <DetailBlock n={n} />
      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={action.onClick}
          className={`w-full rounded-full text-sm font-bold py-3 transition-premium inline-flex items-center justify-center gap-2 ${action.className}`}
        >
          {action.icon}
          {action.label}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full bg-[var(--brand-forest)]/5 text-[var(--brand-forest)] text-xs font-bold py-2.5 transition-premium hover:bg-[var(--brand-forest)]/10"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function DetailBlock({ n }: { n: Notification }) {
  return (
    <>
      <div className="flex items-center gap-2 pr-10 flex-wrap">
        <span className="w-10 h-10 rounded-xl bg-[var(--brand-forest)]/5 text-[var(--brand-forest)] inline-flex items-center justify-center">
          {ICONS[n.category]}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-forest)]/60 bg-[var(--brand-forest)]/5 px-2 py-1 rounded-full">
          {n.category}
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${PRIORITY_STYLES[n.priority]}`}>
          {n.priority}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-forest)]/50 bg-[var(--brand-forest)]/5 px-2 py-1 rounded-full">
          {n.type}
        </span>
      </div>
      <h2 className="mt-4 text-lg font-extrabold text-[var(--brand-forest)] leading-snug">
        {n.title}
      </h2>
      <div className="mt-1 text-[11px] text-[var(--brand-forest)]/50">{n.time}</div>
      <p className="mt-4 text-sm leading-relaxed text-[var(--brand-forest)]/80 whitespace-pre-wrap">
        {n.body}
      </p>
      <div className="mt-5 rounded-2xl bg-[var(--brand-forest)]/5 p-3.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-forest)]/50">
          Reference
        </div>
        <div className="mt-1 text-[12px] font-mono text-[var(--brand-forest)]/80 break-all">
          {n.targetId}
        </div>
      </div>
    </>
  );
}
