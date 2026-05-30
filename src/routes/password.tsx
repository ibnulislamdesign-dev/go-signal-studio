import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/password")({
  head: () => ({
    meta: [
      { title: "Create password — Go Signal" },
      { name: "description", content: "Create a strong password to secure your Go Signal brand workspace." },
    ],
  }),
  component: PasswordPage,
});

function PasswordPage() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("xf45AjjO99)@nw");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const valid = pw.length >= 8 && pw === confirm;

  return (
    <MobileShell>
      <StatusBar />
      <form
        onSubmit={(e) => { e.preventDefault(); if (valid) navigate({ to: "/congratulations" }); }}
        className="px-6 pt-4 pb-12 animate-fade-up"
      >
        <Link to="/" className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium">
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="mt-10">
          <h1 className="text-2xl font-bold text-[var(--brand-forest)] tracking-tight">Create a strong password</h1>
          <p className="mt-2 text-sm text-[var(--brand-forest)]/60">Mix letters, numbers, and symbols. Minimum 8 characters.</p>
        </div>

        <div className="mt-8 space-y-5">
          <Field
            label="Password"
            value={pw}
            onChange={setPw}
            show={show}
            onToggle={() => setShow((s) => !s)}
          />
          <Field
            label="Confirm your password"
            value={confirm}
            onChange={setConfirm}
            show={show}
            onToggle={() => setShow((s) => !s)}
          />
        </div>

        <button
          type="submit"
          disabled={!valid}
          className="mt-10 w-full inline-flex items-center justify-center rounded-2xl bg-[var(--brand-lime)] text-white font-semibold py-4 shadow-[0_8px_24px_-8px_rgba(139,195,74,0.6)] transition-premium disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:translate-y-[-1px]"
        >
          Continue
        </button>
      </form>
      <HomeIndicator />
    </MobileShell>
  );
}

function Field({
  label, value, onChange, show, onToggle,
}: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[var(--brand-forest)]">{label}</span>
      <div className="mt-2 relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-14 rounded-xl bg-white border border-[var(--brand-forest)]/10 px-4 pr-12 text-[var(--brand-forest)] outline-none focus:border-[var(--brand-lime)] focus:ring-4 focus:ring-[var(--brand-lime)]/15 transition-premium"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 inline-flex items-center justify-center text-[var(--brand-forest)]/50 hover:text-[var(--brand-forest)] transition-premium"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </label>
  );
}