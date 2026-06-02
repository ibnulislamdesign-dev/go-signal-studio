import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import { ChevronLeft, Check, CheckCircle2, ArrowUpRight } from "lucide-react";
import { NOTIFICATIONS } from "@/lib/notifications";

export const Route = createFileRoute("/notifications/$id")({
  loader: ({ params }) => {
    const n = NOTIFICATIONS.find((x) => x.id === params.id);
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
      <StatusBar />
      <div className="px-6 pt-10 text-center">
        <p className="text-sm text-[var(--brand-forest)]/70">Notification not found.</p>
        <Link to="/notifications" className="mt-4 inline-block text-sm font-semibold text-[var(--brand-lime)]">
          Back to notifications
        </Link>
      </div>
      <HomeIndicator />
    </MobileShell>
  ),
  errorComponent: ({ error }) => (
    <MobileShell>
      <StatusBar />
      <div className="px-6 pt-10 text-center text-sm text-[var(--brand-forest)]/70">
        Something went wrong. {String(error)}
      </div>
      <HomeIndicator />
    </MobileShell>
  ),
  component: SingleMessage,
});

function SingleMessage() {
  const { n } = Route.useLoaderData();
  const [read, setRead] = useState(!n.unread);

  return (
    <MobileShell>
      <StatusBar />
      <div className="px-5 pt-2 pb-10 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link
            to="/notifications"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-bold text-[var(--brand-forest)]">Message</span>
          <span className="w-9" />
        </div>

        <div className="mt-5 rounded-2xl glass border border-white/40 p-5 shadow-[var(--shadow-card)]">
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[var(--brand-lime)] bg-[var(--brand-lime)]/15 px-2.5 py-1 rounded-full">
            {n.category}
          </span>
          <h1 className="mt-3 text-xl font-extrabold text-[var(--brand-forest)] leading-snug">{n.title}</h1>
          <p className="mt-1 text-xs text-[var(--brand-forest)]/50">{n.time}</p>

          <div className="mt-5 h-px bg-[var(--brand-forest)]/10" />

          <p className="mt-4 text-sm leading-relaxed text-[var(--brand-forest)]/85">{n.body}</p>
        </div>

        <button
          type="button"
          onClick={() => setRead(true)}
          disabled={read}
          className={`mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl py-4 font-semibold transition-premium ${
            read
              ? "bg-[var(--brand-forest)]/5 text-[var(--brand-forest)]/60 cursor-default"
              : "bg-[var(--brand-lime)] text-white shadow-[0_8px_24px_-8px_rgba(139,195,74,0.6)] hover:translate-y-[-1px]"
          }`}
        >
          {read ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Marked as read
            </>
          ) : (
            <>
              <Check className="w-4 h-4" /> Mark as Read
            </>
          )}
        </button>

        {n.link && (
          <Link
            to={n.link.to}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-[var(--brand-forest)] bg-white border border-[var(--brand-forest)]/10 transition-premium hover:border-[var(--brand-lime)] hover:translate-y-[-1px]"
          >
            {n.link.label} <ArrowUpRight className="w-4 h-4" />
          </Link>
        )}

        <Link
          to="/notifications"
          className="mt-3 block text-center text-xs font-semibold text-[var(--brand-forest)]/60 hover:text-[var(--brand-forest)] transition-premium"
        >
          Back to all notifications
        </Link>
      </div>
      <HomeIndicator />
    </MobileShell>
  );
}
