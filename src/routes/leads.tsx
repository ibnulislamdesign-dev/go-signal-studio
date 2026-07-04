import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { ChevronLeft, Users, TrendingUp, PhoneCall, MessageCircle, Sparkles, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Lead Hub — Go Signal" },
      { name: "description", content: "AI-captured leads, hot prospects, and pipeline health at a glance." },
    ],
  }),
  component: Leads,
});

const LEADS = [
  { id: "l3", name: "Aisha M.", phone: "07033445566", channel: "WhatsApp", intent: "Booked consultation · Friday 2pm", score: "Hot", value: "₦18,500" },
  { id: "l1", name: "Emeka O.", phone: "09040728892", channel: "Voice", intent: "Order 2 × Shadda Fabric (Royal blue)", score: "Hot", value: "₦24,000" },
  { id: "l4", name: "Kemi A.", phone: "08098765432", channel: "Voice", intent: "Shea butter stock query", score: "Warm", value: "—" },
];

function Leads() {
  return (
    <MobileShell>
      <div className="min-h-full flex flex-col bg-[var(--canvas)] text-[var(--brand-forest)]">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-[var(--canvas)]/85 border-b border-[var(--brand-forest)]/10 dark:border-white/10">
          <div className="flex items-center gap-2 px-4 py-3">
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 h-10 pl-2 pr-3 rounded-full hover:bg-[var(--brand-forest)]/5 dark:hover:bg-white/5 transition-premium">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Back to Dashboard</span>
            </Link>
          </div>
        </div>

        <div className="flex-1 px-5 pt-4 pb-10 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--brand-lime)]/15 text-[var(--brand-lime)] inline-flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold">Lead Generation Hub</h1>
              <p className="text-xs text-[var(--brand-forest)]/60">3 fresh leads captured today · +₦42,500 pipeline</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <Stat label="Today" value="3" tint="lime" />
            <Stat label="This week" value="17" tint="forest" />
            <Stat label="Conversion" value="38%" tint="lime" />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="text-sm font-bold">Fresh prospects</div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--brand-lime)]">
              <TrendingUp className="w-3 h-3" /> AI-scored
            </div>
          </div>

          <ul className="mt-3 space-y-2.5">
            {LEADS.map((l) => (
              <li key={l.id}>
                <Link
                  to="/traffic/$id"
                  params={{ id: l.id }}
                  className="block rounded-2xl glass border border-white/40 dark:border-white/10 p-3.5 shadow-[var(--shadow-card)] transition-premium hover:translate-y-[-1px]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--brand-forest)]/5 text-[var(--brand-forest)] inline-flex items-center justify-center">
                      {l.channel === "WhatsApp" ? <MessageCircle className="w-4 h-4" /> : <PhoneCall className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-extrabold truncate">{l.name}</div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.score === "Hot" ? "bg-red-500/15 text-red-500" : "bg-amber-400/15 text-amber-500"}`}>
                          {l.score}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--brand-forest)]/60">{l.phone} · {l.channel}</div>
                      <p className="mt-1 text-xs text-[var(--brand-forest)]/85 line-clamp-2">{l.intent}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[var(--brand-forest)]">{l.value}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--brand-lime)]">
                          Open <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-[var(--brand-forest)] text-white p-4">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--brand-lime)]">
              <Sparkles className="w-3.5 h-3.5" /> AI recommendation
            </div>
            <p className="mt-1 text-sm leading-relaxed">
              Aisha's consultation slot is 42 hours away. Sending a soft confirmation message tonight lifts show-up rates by 27%.
            </p>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

function Stat({ label, value, tint }: { label: string; value: string; tint: "lime" | "forest" }) {
  return (
    <div className={`rounded-2xl p-3 border ${tint === "lime" ? "bg-[var(--brand-lime)]/10 border-[var(--brand-lime)]/25" : "bg-[var(--surface)] border-[var(--brand-forest)]/10 dark:border-white/10"}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-forest)]/60">{label}</div>
      <div className="mt-0.5 text-lg font-extrabold text-[var(--brand-forest)]">{value}</div>
    </div>
  );
}