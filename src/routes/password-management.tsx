import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { ChevronLeft, Eye, EyeOff, Loader2, ShieldCheck, KeyRound } from "lucide-react";

export const Route = createFileRoute("/password-management")({
  head: () => ({
    meta: [
      { title: "Password & Security — Go Signal" },
      { name: "description", content: "Update your Go Signal account password and manage sign-in security." },
    ],
  }),
  component: PasswordManagement,
});

function PasswordManagement() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const valid = oldPw.length >= 6 && newPw.length >= 8 && newPw === confirmPw;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      setTimeout(() => navigate({ to: "/profile" }), 1200);
    }, 1100);
  };

  return (
    <MobileShell>
      <div className="min-h-full flex flex-col bg-[var(--canvas)]">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-[var(--canvas)]/85 border-b border-[var(--brand-forest)]/10 dark:border-white/10">
          <div className="flex items-center gap-2 px-4 py-3">
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 h-10 pl-2 pr-3 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 dark:hover:bg-white/5 transition-premium"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Back to Profile</span>
            </Link>
          </div>
        </div>

        <div className="flex-1 px-5 pt-4 pb-10 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--brand-lime)]/15 text-[var(--brand-lime)] inline-flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-[var(--brand-forest)]">Password & Security</h1>
              <p className="text-xs text-[var(--brand-forest)]/60">Choose a strong password you don't reuse elsewhere.</p>
            </div>
          </div>

          {done ? (
            <div className="mt-8 rounded-2xl glass border border-white/40 dark:border-white/10 p-6 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-[var(--brand-lime)]/15 inline-flex items-center justify-center mb-2">
                <ShieldCheck className="w-7 h-7 text-[var(--brand-lime)]" />
              </div>
              <div className="text-sm font-bold text-[var(--brand-forest)]">Password updated</div>
              <p className="mt-1 text-xs text-[var(--brand-forest)]/60">Returning to profile…</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <PwdField label="Old Password" value={oldPw} onChange={setOldPw} show={show} setShow={setShow} autoComplete="current-password" />
              <PwdField label="New Password" value={newPw} onChange={setNewPw} show={show} setShow={setShow} autoComplete="new-password" />
              <PwdField label="Confirm New Password" value={confirmPw} onChange={setConfirmPw} show={show} setShow={setShow} autoComplete="new-password" />

              {confirmPw && newPw !== confirmPw && (
                <p className="text-xs font-semibold text-red-500">Passwords don't match.</p>
              )}

              <button
                type="button"
                onClick={() => alert("A reset link will be sent to your registered email.")}
                className="text-xs font-bold text-[var(--brand-lime)] hover:text-[#5a8a2a] transition-premium"
              >
                Forgot Password?
              </button>

              <button
                type="submit"
                disabled={!valid || submitting}
                className="mt-4 w-full h-12 rounded-xl bg-[var(--brand-forest)] text-white font-bold inline-flex items-center justify-center gap-2 transition-premium hover:bg-[#006053] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </MobileShell>
  );
}

function PwdField({
  label, value, onChange, show, setShow, autoComplete,
}: {
  label: string; value: string; onChange: (v: string) => void;
  show: boolean; setShow: (v: boolean) => void; autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-forest)]/60">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="w-full h-12 rounded-xl bg-[var(--surface)] border border-[var(--brand-forest)]/10 dark:border-white/10 px-3 pr-11 text-sm font-semibold text-[var(--brand-forest)] outline-none focus:border-[var(--brand-lime)] focus:ring-2 focus:ring-[var(--brand-lime)]/20 transition-premium"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 inline-flex items-center justify-center text-[var(--brand-forest)]/55 hover:text-[var(--brand-forest)]"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}