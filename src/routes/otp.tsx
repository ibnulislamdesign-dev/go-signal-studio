import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { z } from "zod";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import { ChevronLeft } from "lucide-react";

const searchSchema = z.object({ email: z.string().email().optional() });

export const Route = createFileRoute("/otp")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Verify code — Go Signal" },
      { name: "description", content: "Enter your 6-digit verification code." },
    ],
  }),
  component: OtpPage,
});

function mask(email?: string) {
  if (!email) return "**********@gmail.com";
  const [u, d] = email.split("@");
  return `${"*".repeat(Math.max(3, u.length))}@${d ?? "gmail.com"}`;
}

function OtpPage() {
  const navigate = useNavigate();
  const { email } = Route.useSearch();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const filled = digits.every((d) => d !== "");

  const onChange = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => { const copy = [...prev]; copy[i] = clean; return copy; });
    if (clean && i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <MobileShell>
      <StatusBar />
      <form
        onSubmit={(e) => { e.preventDefault(); if (filled) navigate({ to: "/business-category" }); }}
        className="px-6 pt-4 pb-10 min-h-[780px] flex flex-col animate-fade-up"
      >
        <Link to="/signup" className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium">
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="mt-16 text-center">
          <p className="text-sm font-bold text-[var(--brand-forest)] leading-relaxed">
            Enter the 6-digit code sent to you at<br />
            <span className="text-[var(--brand-forest)]">{mask(email)}</span>
          </p>
        </div>

        <div className="mt-7 flex items-center justify-center gap-2.5">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              className="w-12 h-14 rounded-xl bg-white border border-[var(--brand-forest)]/15 text-center text-xl font-bold text-[var(--brand-forest)] outline-none focus:border-[var(--brand-lime)] focus:ring-4 focus:ring-[var(--brand-lime)]/15 transition-premium"
            />
          ))}
        </div>

        <button type="button" className="mt-5 mx-auto block text-sm font-semibold text-[var(--brand-lime)] hover:underline transition-premium">
          Didn't Get Code?
        </button>

        <div className="mt-auto pt-8">
          <button
            type="submit"
            disabled={!filled}
            className="w-full inline-flex items-center justify-center rounded-2xl bg-[var(--brand-lime)] text-white font-semibold py-4 shadow-[0_8px_24px_-8px_rgba(139,195,74,0.6)] transition-premium disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:translate-y-[-1px]"
          >
            Continue
          </button>
        </div>
      </form>
      <HomeIndicator />
    </MobileShell>
  );
}