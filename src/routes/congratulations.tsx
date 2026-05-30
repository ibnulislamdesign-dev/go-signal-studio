import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import { ChevronLeft } from "lucide-react";
import logo from "@/assets/go-signal-logo.png";

export const Route = createFileRoute("/congratulations")({
  head: () => ({
    meta: [
      { title: "You're in — Go Signal" },
      { name: "description", content: "Registration successful. Welcome to your brand future with Go Signal." },
    ],
  }),
  component: CongratsPage,
});

function CongratsPage() {
  return (
    <MobileShell>
      <StatusBar />
      <div className="px-6 pt-4 pb-12 flex flex-col min-h-[780px] animate-fade-up">
        <Link to="/password" className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium">
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="flex-1 flex flex-col items-center justify-center text-center -mt-6">
          <img src={logo} alt="Go Signal" className="w-28 h-28 object-contain" />
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--brand-forest)]">GO SIGNAL</h1>
          <p className="mt-1 text-sm font-medium text-[var(--brand-lime)]">The Brand Future</p>

          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-[var(--brand-forest)] tracking-tight">CONGRATULATIONS</h2>
            <p className="mt-3 text-sm text-[var(--brand-lime)] max-w-[260px]">
              You have successfully registered for your brand future
            </p>
          </div>
        </div>

        <Link
          to="/dashboard"
          className="w-full inline-flex items-center justify-center rounded-2xl bg-[var(--brand-lime)] text-white font-semibold py-4 shadow-[0_8px_24px_-8px_rgba(139,195,74,0.6)] hover:translate-y-[-1px] transition-premium"
        >
          Continue to Dashboard
        </Link>
      </div>
      <HomeIndicator />
    </MobileShell>
  );
}