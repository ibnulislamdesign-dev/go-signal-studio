import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import logo from "@/assets/go-signal-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Go Signal — The Brand Future" },
      { name: "description", content: "Go Signal is your AI brand assistant. Track live customer signals and grow your brand future." },
      { property: "og:title", content: "Go Signal — The Brand Future" },
      { property: "og:description", content: "AI-powered brand signals, calls, and insights — all in one beautifully simple mobile workspace." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <MobileShell>
      <StatusBar />
      <div className="flex flex-col items-center justify-between px-8 pt-16 pb-12 min-h-[780px] animate-fade-up">
        <div className="flex flex-col items-center gap-5">
          <img src={logo} alt="Go Signal" className="w-32 h-32 object-contain" />
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--brand-forest)]">GO SIGNAL</h1>
            <p className="mt-1 text-sm font-medium text-[var(--brand-lime)]">The Brand Future</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 mt-12">
          <p className="text-center text-sm text-[var(--brand-forest)]/70 mb-2">
            Your AI brand assistant — always listening, always growing.
          </p>
          <Link
            to="/password"
            className="w-full inline-flex items-center justify-center rounded-2xl bg-[var(--brand-lime)] text-white font-semibold py-4 shadow-[0_8px_24px_-8px_rgba(139,195,74,0.6)] hover:translate-y-[-1px] transition-premium"
          >
            Get Started
          </Link>
          <Link
            to="/dashboard"
            className="w-full inline-flex items-center justify-center rounded-2xl bg-white text-[var(--brand-forest)] font-semibold py-4 border border-[var(--brand-forest)]/10 transition-premium hover:bg-[var(--brand-forest)]/5"
          >
            I already have an account
          </Link>
        </div>
      </div>
      <HomeIndicator />
    </MobileShell>
  );
}
