import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import { ChevronLeft, Sparkles, Clock, Check, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/subscription")({
  head: () => ({
    meta: [
      { title: "Subscription — Go Signal" },
      { name: "description", content: "Manage your Go Signal plan, billing, and renewal." },
    ],
  }),
  component: Subscription,
});

function Subscription() {
  const [state, setState] = useState<"trial" | "active">("trial");
  const [plan, setPlan] = useState<"monthly" | "annual">("annual");
  const [autoRenew, setAutoRenew] = useState(true);
  const daysRemaining = 9;

  return (
    <MobileShell>
      <StatusBar />
      <div className="px-5 pt-2 pb-12 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-bold text-[var(--brand-forest)]">Subscription</span>
          <span className="w-9" />
        </div>

        {/* Demo state toggle */}
        <div className="mt-4 inline-flex p-1 rounded-full bg-[var(--brand-forest)]/5 text-[11px] font-semibold">
          {(["trial", "active"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={`px-3 py-1.5 rounded-full transition-premium ${
                state === s ? "bg-white text-[var(--brand-forest)] shadow-sm" : "text-[var(--brand-forest)]/50"
              }`}
            >
              {s === "trial" ? "Trial preview" : "Active preview"}
            </button>
          ))}
        </div>

        {/* State card */}
        {state === "trial" ? (
          <div className="mt-4 rounded-2xl p-5 bg-gradient-to-br from-[var(--brand-lime)] to-[#7cb342] text-white shadow-[0_16px_40px_-16px_rgba(139,195,74,0.8)]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Free trial</span>
            </div>
            <h2 className="mt-2 text-xl font-extrabold leading-snug">
              You're on the 14-Day Free Trial
            </h2>
            <p className="mt-1 text-sm text-white/90">
              <span className="font-bold">{daysRemaining} days remaining.</span> Subscribe now to ensure your AI phone assistant stays online.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl p-5 glass border border-white/40 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 text-[var(--brand-lime)]">
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Premium active</span>
            </div>
            <h2 className="mt-2 text-xl font-extrabold leading-snug text-[var(--brand-forest)]">
              Thank you for empowering your brand's future with Go Signal!
            </h2>
            <p className="mt-1 text-sm text-[var(--brand-forest)]/70">
              Your Premium Plan is active. Your AI assistant is online 24/7.
            </p>
          </div>
        )}

        {/* Plans */}
        <h3 className="mt-6 text-sm font-bold text-[var(--brand-forest)]">Choose a plan</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <PlanCard
            label="Monthly"
            price="₦7,500"
            cadence="/ month"
            usd="$5.00"
            selected={plan === "monthly"}
            onClick={() => setPlan("monthly")}
          />
          <PlanCard
            label="Annual"
            price="₦75,000"
            cadence="/ year"
            usd="$50.00"
            badge="Save 20%"
            selected={plan === "annual"}
            onClick={() => setPlan("annual")}
          />
        </div>

        {/* Controls */}
        <div className="mt-6 rounded-2xl glass border border-white/40 p-4 shadow-[var(--shadow-card)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-[var(--brand-forest)]">Auto-Renew Subscription</div>
              <div className="text-[11px] text-[var(--brand-forest)]/60">Never lose service. Renews at end of cycle.</div>
            </div>
            <Toggle on={autoRenew} onChange={setAutoRenew} />
          </div>
          <div className="h-px bg-[var(--brand-forest)]/10" />
          <div className="flex items-center gap-2 text-[11px] text-[var(--brand-forest)]/70">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-lime)]" />
            Secured by Lovable Cloud · Cancel anytime
          </div>
        </div>

        <button
          type="button"
          className="mt-6 w-full rounded-2xl bg-[var(--brand-forest)] text-white font-semibold py-4 shadow-[0_10px_28px_-10px_rgba(0,77,64,0.55)] transition-premium hover:translate-y-[-1px] active:scale-[0.99]"
        >
          Renew Now · {plan === "annual" ? "₦75,000/yr" : "₦7,500/mo"}
        </button>

        <button
          type="button"
          className="mt-5 w-full text-center text-[11px] font-medium text-red-500/80 hover:text-red-600 transition-premium"
        >
          Cancel Subscription
        </button>
      </div>
      <HomeIndicator />
    </MobileShell>
  );
}

function PlanCard({
  label, price, cadence, usd, badge, selected, onClick,
}: {
  label: string; price: string; cadence: string; usd: string;
  badge?: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left rounded-2xl p-4 border transition-premium ${
        selected
          ? "bg-white border-[var(--brand-lime)] shadow-[0_12px_28px_-14px_rgba(139,195,74,0.55)]"
          : "bg-white/70 border-white/60 hover:border-[var(--brand-lime)]/40"
      }`}
    >
      {badge && (
        <span className="absolute -top-2 right-3 text-[9px] font-bold uppercase tracking-wider bg-[var(--brand-lime)] text-white px-2 py-0.5 rounded-full shadow-sm">
          {badge}
        </span>
      )}
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-forest)]/60">{label}</div>
      <div className="mt-1 text-xl font-extrabold text-[var(--brand-forest)] leading-none">{price}</div>
      <div className="text-[11px] text-[var(--brand-forest)]/60">{cadence}</div>
      <div className="mt-2 text-[11px] font-semibold text-[var(--brand-forest)]/80">{usd}</div>
      {selected && (
        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--brand-lime)] text-white inline-flex items-center justify-center">
          <Check className="w-3 h-3" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative w-12 h-7 rounded-full transition-premium ${
        on ? "bg-[var(--brand-lime)]" : "bg-[var(--brand-forest)]/15"
      }`}
    >
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-premium ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
