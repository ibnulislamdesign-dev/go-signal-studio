import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { ChevronLeft, Loader2, Smartphone, Copy, Check, Info, Link2 } from "lucide-react";
import { PhoneInput } from "@/components/PhoneInput";

export const Route = createFileRoute("/whatsapp-link")({
  head: () => ({
    meta: [
      { title: "Link WhatsApp — Go Signal" },
      { name: "description", content: "Connect your WhatsApp Business number to Go Signal." },
    ],
  }),
  component: WhatsAppLink,
});

function WhatsAppLink() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"input" | "code">("input");
  const [waPhone, setWaPhone] = useState({ dial: "+234", number: "9040728892" });
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const accountId = "GS-7X9A2B";
  const verificationMsg = `Verify my Go Signal account ${accountId}. I confirm this WhatsApp number belongs to me.`;

  const generate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setStep("code"); }, 900);
  };

  const copyAndFinish = () => {
    navigator.clipboard?.writeText(verificationMsg);
    setCopied(true);
    setTimeout(() => navigate({ to: "/profile" }), 900);
  };

  return (
    <MobileShell>
      <div className="min-h-full flex flex-col bg-[var(--canvas)] text-[var(--brand-forest)]">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-[var(--canvas)]/85 border-b border-[var(--brand-forest)]/10 dark:border-white/10">
          <div className="flex items-center gap-2 px-4 py-3">
            <Link to="/profile" className="inline-flex items-center gap-1.5 h-10 pl-2 pr-3 rounded-full hover:bg-[var(--brand-forest)]/5 dark:hover:bg-white/5 transition-premium">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Back to Profile</span>
            </Link>
          </div>
        </div>

        <div className="flex-1 px-5 pt-4 pb-10 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#25D366] inline-flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold">Link WhatsApp Business</h1>
              <p className="text-xs text-[var(--brand-forest)]/60">Verify ownership of your business number.</p>
            </div>
          </div>

          {step === "input" ? (
            <div className="mt-6 space-y-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-forest)]/55 mb-1.5">
                  WhatsApp Phone Number
                </div>
                <PhoneInput dial={waPhone.dial} number={waPhone.number} onChange={setWaPhone} placeholder="801 234 5678" />
              </div>
              <button
                type="button"
                disabled={!waPhone.number || generating}
                onClick={generate}
                className="w-full h-12 rounded-xl bg-[var(--brand-forest)] text-white font-bold inline-flex items-center justify-center gap-2 transition-premium hover:bg-[#006053] disabled:opacity-50"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                Generate Verification Message
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-[var(--surface)] border border-[var(--brand-forest)]/10 dark:border-white/10 p-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-forest)]/55">
                  <Link2 className="w-3.5 h-3.5" /> Verification String
                </div>
                <p className="text-sm font-semibold leading-relaxed">{verificationMsg}</p>
                <div className="flex items-start gap-2 text-[11px] text-[var(--brand-forest)]/60">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Copy and send this exact message from the number above to +234 700-GO-SIGNAL.
                </div>
              </div>
              <button
                type="button"
                onClick={copyAndFinish}
                className="w-full h-12 rounded-xl bg-[var(--brand-lime)] text-white font-bold inline-flex items-center justify-center gap-2 transition-premium hover:bg-[#7cb342]"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied — returning…" : "Copy & Mark as Sent"}
              </button>
              <button
                type="button"
                onClick={() => setStep("input")}
                className="w-full text-xs font-semibold text-[var(--brand-forest)]/60 hover:text-[var(--brand-forest)] transition-premium"
              >
                Back to number input
              </button>
            </div>
          )}
        </div>
      </div>
    </MobileShell>
  );
}