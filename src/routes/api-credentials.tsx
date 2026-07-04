import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { ChevronLeft, Copy, Check, KeyRound, RefreshCw, ShieldCheck, Terminal, Webhook } from "lucide-react";

export const Route = createFileRoute("/api-credentials")({
  head: () => ({
    meta: [
      { title: "Developer API — Go Signal" },
      { name: "description", content: "Manage Go Signal API keys, webhooks, and integration credentials." },
    ],
  }),
  component: ApiCredentials,
});

function ApiCredentials() {
  const [copied, setCopied] = useState<string | null>(null);
  const publicKey = "gs_pk_live_7X9A2B4C8D1E3F5G";
  const secretKey = "gs_sk_live_••••••••••••4421";
  const webhookUrl = "https://api.gosignal.app/hooks/inbound";

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1400);
  };

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
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold">Developer API Credentials</h1>
              <p className="text-xs text-[var(--brand-forest)]/60">Wire Go Signal into your own stack.</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl glass border border-white/40 dark:border-white/10 p-4 shadow-[var(--shadow-card)] space-y-4">
            <KeyRow label="Publishable Key" value={publicKey} icon={<KeyRound className="w-4 h-4" />} onCopy={() => copy("pub", publicKey)} copied={copied === "pub"} />
            <div className="h-px bg-[var(--brand-forest)]/10 dark:bg-white/10" />
            <KeyRow label="Secret Key" value={secretKey} icon={<ShieldCheck className="w-4 h-4" />} onCopy={() => copy("sec", secretKey)} copied={copied === "sec"} mono />
            <div className="h-px bg-[var(--brand-forest)]/10 dark:bg-white/10" />
            <KeyRow label="Inbound Webhook" value={webhookUrl} icon={<Webhook className="w-4 h-4" />} onCopy={() => copy("hook", webhookUrl)} copied={copied === "hook"} />
          </div>

          <button
            type="button"
            className="mt-4 w-full h-12 rounded-xl bg-[var(--brand-forest)] text-white font-bold inline-flex items-center justify-center gap-2 transition-premium hover:bg-[#006053]"
          >
            <RefreshCw className="w-4 h-4" /> Rotate Secret Key
          </button>
          <p className="mt-3 text-[11px] text-[var(--brand-forest)]/55 leading-relaxed">
            Rotating invalidates any live integrations using the previous secret. Update your environment variables immediately after rotating.
          </p>
        </div>
      </div>
    </MobileShell>
  );
}

function KeyRow({ label, value, icon, onCopy, copied, mono }: { label: string; value: string; icon: React.ReactNode; onCopy: () => void; copied: boolean; mono?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-forest)]/55">
        {icon} {label}
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <div className={`flex-1 min-w-0 truncate rounded-xl bg-[var(--surface)] border border-[var(--brand-forest)]/10 dark:border-white/10 px-3 py-2.5 text-xs ${mono ? "font-mono" : "font-semibold"} text-[var(--brand-forest)]`}>
          {value}
        </div>
        <button onClick={onCopy} className="w-10 h-10 shrink-0 rounded-xl bg-[var(--brand-forest)]/5 dark:bg-white/5 inline-flex items-center justify-center text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/10 transition-premium">
          {copied ? <Check className="w-4 h-4 text-[var(--brand-lime)]" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}