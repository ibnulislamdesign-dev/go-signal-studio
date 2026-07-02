import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MobileShell } from "@/components/MobileShell";
import {
  ChevronLeft, Clock, AlertTriangle, Info, Flame,
  Sparkles, Settings, Wallet, MessageSquare, MessageCircle,
  CreditCard, PhoneCall, Sparkle, ArrowRight,
} from "lucide-react";
import { findNotification, markRead, type Notification } from "@/lib/notifications";

export const Route = createFileRoute("/notifications/$id")({
  loader: ({ params }) => {
    const n = findNotification(params.id);
    if (!n) throw notFound();
    return { n };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.n.title ?? "Message"} — Go Signal` },
      { name: "description", content: loaderData?.n.preview ?? "Notification detail" },
    ],
  }),
  notFoundComponent: () => (
    <MobileShell>
      <div className="min-h-full w-full bg-[var(--canvas)] px-6 pt-10 text-center">
        <p className="text-sm text-[var(--brand-forest)]/70">Notification not found.</p>
        <Link
          to="/notifications"
          className="mt-4 inline-block text-sm font-semibold text-[var(--brand-lime)]"
        >
          Back to notifications
        </Link>
      </div>
    </MobileShell>
  ),
  errorComponent: ({ error }) => (
    <MobileShell>
      <div className="min-h-full w-full bg-[var(--canvas)] px-6 pt-10 text-center text-sm text-[var(--brand-forest)]/70">
        Something went wrong. {String(error)}
      </div>
    </MobileShell>
  ),
  component: NotificationDetail,
});

const CATEGORY_ICONS: Record<Notification["category"], React.ReactNode> = {
  "AI Assistant": <Sparkles className="w-4 h-4" />,
  "System Update": <Settings className="w-4 h-4" />,
  Billing: <Wallet className="w-4 h-4" />,
  Customer: <MessageSquare className="w-4 h-4" />,
};

const PRIORITY_STYLES: Record<Notification["priority"], string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-[var(--brand-lime)]/20 text-[var(--brand-forest)]",
};

function extractPhoneNumber(text: string): string | null {
  const m = text.match(/0\d{10}/);
  return m ? m[0] : null;
}

type PrimaryAction = {
  label: string;
  icon: React.ReactNode;
  className: string;
  onClick: () => void;
};

function useNotificationAction(n: Notification): PrimaryAction {
  const navigate = useNavigate();
  const go = (to: string) => navigate({ to });

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
    const isRenewed = /renewed/i.test(n.title);
    return {
      label: isRenewed ? "Manage billing plan" : "Complete subscription",
      icon: <CreditCard className="w-4 h-4" />,
      className: "bg-gradient-to-r from-[var(--brand-forest)] to-[#00695c] text-white hover:scale-[1.01]",
      onClick: () => go("/subscription"),
    };
  }

  if (n.type === "chat") {
    const isWhatsApp =
      /whatsapp/i.test(n.title) ||
      /whatsapp/i.test(n.preview) ||
      /whatsapp/i.test(n.body);
    return {
      label: isWhatsApp ? "Reply on WhatsApp" : "Open chat thread",
      icon: <MessageCircle className="w-4 h-4" />,
      className: isWhatsApp
        ? "bg-[#25D366] text-white hover:scale-[1.01]"
        : "bg-[var(--brand-forest)] text-white hover:scale-[1.01]",
      onClick: () => go(`/traffic/${n.targetId}`),
    };
  }

  if (n.category === "AI Assistant") {
    return {
      label: "Open AI Assistant Interface",
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
    onClick: () => go("/notifications"),
  };
}

function NotificationDetail() {
  const { n } = Route.useLoaderData();
  const action = useNotificationAction(n);

  useEffect(() => {
    if (n.unread) markRead(n.id);
  }, [n.id, n.unread]);

  const priorityMeta =
    n.priority === "high"
      ? { Icon: Flame, label: "High priority" }
      : n.priority === "medium"
        ? { Icon: AlertTriangle, label: "Medium priority" }
        : { Icon: Info, label: "Low priority" };
  const PriorityIcon = priorityMeta.Icon;

  return (
    <MobileShell>
      <div className="min-h-full w-full bg-[var(--canvas)] text-[var(--brand-forest)] flex flex-col animate-fade-up">
        {/* Sticky back header */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-[var(--canvas)]/85 border-b border-[var(--brand-forest)]/5">
          <div className="px-4 py-3 flex items-center justify-between">
            <Link
              to="/notifications"
              className="inline-flex items-center gap-1.5 pl-1 pr-3 py-1.5 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium text-xs font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Notifications
            </Link>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-forest)]/50">
              Activity detail
            </span>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-40">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-[var(--brand-forest)]/5 text-[var(--brand-forest)] inline-flex items-center justify-center">
              {CATEGORY_ICONS[n.category]}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-forest)]/60 bg-[var(--brand-forest)]/5 px-2 py-1 rounded-full">
              {n.category}
            </span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${PRIORITY_STYLES[n.priority]}`}>
              <PriorityIcon className="w-3 h-3" /> {priorityMeta.label}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-forest)]/50 bg-[var(--brand-forest)]/5 px-2 py-1 rounded-full">
              {n.type}
            </span>
          </div>

          <h1 className="mt-4 text-xl font-extrabold text-[var(--brand-forest)] leading-snug">
            {n.title}
          </h1>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--brand-forest)]/50">
            <Clock className="w-3 h-3" /> {n.time}
          </p>

          <div className="mt-5 rounded-2xl glass border border-white/40 p-4 shadow-[var(--shadow-card)]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-forest)]/50">
              Event details
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--brand-forest)]/85 whitespace-pre-wrap">
              {n.body}
            </p>
          </div>

          <div className="mt-4 rounded-2xl bg-[var(--brand-forest)]/5 p-3.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-forest)]/50">
              Reference
            </div>
            <div className="mt-1 text-[12px] font-mono text-[var(--brand-forest)]/80 break-all">
              {n.targetId}
            </div>
          </div>
        </div>

        {/* Sticky primary action */}
        <div className="sticky bottom-0 left-0 right-0 px-5 pt-3 pb-7 border-t border-[var(--brand-forest)]/5 bg-[var(--canvas)]/95 backdrop-blur-md">
          <button
            type="button"
            onClick={action.onClick}
            className={`w-full rounded-full text-sm font-bold py-3.5 transition-premium inline-flex items-center justify-center gap-2 shadow-[var(--shadow-card)] ${action.className}`}
          >
            {action.icon}
            {action.label}
          </button>
          <Link
            to="/notifications"
            className="mt-2 block text-center text-[11px] font-semibold text-[var(--brand-forest)]/60 hover:text-[var(--brand-forest)] transition-premium py-1"
          >
            Back to all notifications
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}