import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import { ChevronLeft } from "lucide-react";
import logo from "@/assets/go-signal-logo.png";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Go Signal" },
      { name: "description", content: "Create your Go Signal account in seconds." },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  return (
    <MobileShell>
      <StatusBar />
      <form
        onSubmit={(e) => { e.preventDefault(); if (ok) navigate({ to: "/otp", search: { email } }); }}
        className="px-6 pt-4 pb-10 animate-fade-up"
      >
        <Link to="/welcome" className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium">
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="flex flex-col items-center mt-6">
          <img src={logo} alt="Go Signal" className="w-24 h-24 object-contain" />
          <h1 className="mt-2 text-2xl font-extrabold text-[var(--brand-forest)] tracking-tight">GO SIGNAL</h1>
          <p className="text-xs font-medium text-[var(--brand-lime)]">The Brand Future</p>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-lg font-bold text-[var(--brand-forest)]">Create an account</h2>
          <p className="mt-1 text-xs text-[var(--brand-forest)]/60">Enter your email to sign up for this app</p>
        </div>

        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={120}
          placeholder="email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-6 w-full h-14 rounded-xl bg-white border border-[var(--brand-forest)]/10 px-4 text-[var(--brand-forest)] outline-none focus:border-[var(--brand-lime)] focus:ring-4 focus:ring-[var(--brand-lime)]/15 transition-premium"
        />

        <button
          type="submit"
          disabled={!ok}
          className="mt-4 w-full inline-flex items-center justify-center rounded-2xl bg-[var(--brand-lime)] text-white font-semibold py-4 shadow-[0_8px_24px_-8px_rgba(139,195,74,0.6)] transition-premium disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:translate-y-[-1px]"
        >
          Continue
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-[var(--brand-forest)]/50">
          <div className="flex-1 h-px bg-[var(--brand-forest)]/10" />
          or
          <div className="flex-1 h-px bg-[var(--brand-forest)]/10" />
        </div>

        <button type="button" onClick={() => navigate({ to: "/otp", search: { email: "user@gmail.com" } })} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 border border-[var(--brand-forest)]/10 transition-premium hover:bg-[var(--brand-forest)]/5">
          <GoogleG /> <span className="text-sm font-semibold text-[var(--brand-forest)]">Continue with Google</span>
        </button>
        <button type="button" onClick={() => navigate({ to: "/otp", search: { email: "user@icloud.com" } })} className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 border border-[var(--brand-forest)]/10 transition-premium hover:bg-[var(--brand-forest)]/5">
          <AppleLogo /> <span className="text-sm font-semibold text-[var(--brand-forest)]">Continue with Apple</span>
        </button>

        <p className="mt-6 text-center text-[11px] text-[var(--brand-forest)]/60 leading-relaxed">
          By clicking continue, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
      <HomeIndicator />
    </MobileShell>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.3 2.9l5.7-5.7C33.6 6.7 29 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19 19-8.5 19-19c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.7 15.2 19 12 24 12c2.8 0 5.4 1.1 7.3 2.9l5.7-5.7C33.6 6.7 29 5 24 5 16.1 5 9.3 9.5 6.3 14.1z"/>
      <path fill="#4CAF50" d="M24 43c5 0 9.5-1.9 12.9-5l-6-4.9C29 34.7 26.6 35.5 24 35.5c-5.3 0-9.7-2.9-11.3-7l-6.6 5.1C9.2 38.5 16 43 24 43z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6 4.9c-.4.4 6.5-4.7 6.5-14.6 0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
function AppleLogo() {
  return (
    <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-[var(--brand-forest)]">
      <path d="M16.4 12.8c0-2.7 2.2-4 2.3-4-1.2-1.8-3.2-2-3.9-2-1.6-.2-3.2 1-4 1-.8 0-2.1-.9-3.5-.9-1.8 0-3.4 1-4.3 2.6-1.9 3.2-.5 8 1.3 10.6.9 1.3 1.9 2.7 3.4 2.7 1.3-.1 1.8-.9 3.4-.9 1.6 0 2.1.9 3.5.9 1.5 0 2.4-1.3 3.3-2.6 1-1.5 1.4-3 1.4-3.1-.1 0-2.9-1.1-2.9-4.3zM13.9 4.3c.7-.8 1.2-2 1-3.3-1 .1-2.3.7-3 1.6-.6.7-1.2 2-1 3.2 1.2.1 2.3-.6 3-1.5z"/>
    </svg>
  );
}