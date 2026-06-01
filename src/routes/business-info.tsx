import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { PhoneInput } from "@/components/PhoneInput";

export const Route = createFileRoute("/business-info")({
  head: () => ({
    meta: [
      { title: "Business info — Go Signal" },
      { name: "description", content: "Tell us about your business to complete setup." },
    ],
  }),
  component: BusinessInfo,
});

function BusinessInfo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", businessName: "",
    waCode: "+234", whatsapp: "",
    phoneCode: "+234", phone: "",
    platform: "Tik Tok", username: "", address: "",
  });
  const valid = form.fullName.trim() && form.businessName.trim() && form.whatsapp.trim() && form.phone.trim() && form.address.trim();
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <MobileShell>
      <StatusBar />
      <form
        onSubmit={(e) => { e.preventDefault(); if (valid) navigate({ to: "/congratulations" }); }}
        className="px-6 pt-4 pb-10 animate-fade-up"
      >
        <Link to="/business-category" className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium">
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <h1 className="mt-6 text-xl font-bold text-[var(--brand-forest)] leading-snug">
          Fill in the following information<br />to continue
        </h1>

        <div className="mt-6 space-y-4">
          <Field label="Full Name" value={form.fullName} onChange={set("fullName")} maxLength={80} />
          <Field label="Business Name" value={form.businessName} onChange={set("businessName")} maxLength={80} />

          <div>
            <Label>Whatsapp NO</Label>
            <div className="mt-2">
              <PhoneInput
                dial={form.waCode}
                number={form.whatsapp}
                onChange={(v) => setForm((f) => ({ ...f, waCode: v.dial, whatsapp: v.number }))}
              />
            </div>
          </div>

          <div>
            <Label>Phone NO</Label>
            <div className="mt-2">
              <PhoneInput
                dial={form.phoneCode}
                number={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phoneCode: v.dial, phone: v.number }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Choose Platform</Label>
              <div className="relative mt-2">
                <select
                  value={form.platform}
                  onChange={(e) => set("platform")(e.target.value)}
                  className="appearance-none w-full h-12 rounded-xl bg-white border border-[var(--brand-forest)]/10 px-3 pr-8 text-sm text-[var(--brand-forest)] outline-none focus:border-[var(--brand-lime)] transition-premium"
                >
                  {["Tik Tok", "Instagram", "Facebook", "X", "YouTube"].map((p) => <option key={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--brand-forest)]/50 pointer-events-none" />
              </div>
            </div>
            <Field label="User Name" value={form.username} onChange={set("username")} placeholder="Optional" maxLength={40} />
          </div>

          <Field label="Address" value={form.address} onChange={set("address")} maxLength={120} />
        </div>

        <button
          type="submit"
          disabled={!valid}
          className="mt-8 w-full inline-flex items-center justify-center rounded-2xl bg-[var(--brand-lime)] text-white font-semibold py-4 shadow-[0_8px_24px_-8px_rgba(139,195,74,0.6)] transition-premium disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:translate-y-[-1px]"
        >
          Continue
        </button>
      </form>
      <HomeIndicator />
    </MobileShell>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-semibold text-[var(--brand-forest)]">{children}</span>;
}

function Field({
  label, value, onChange, placeholder, inputMode, maxLength,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; inputMode?: "text" | "tel" | "email" | "numeric"; maxLength?: number;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className="mt-2 w-full h-12 rounded-xl bg-white border border-[var(--brand-forest)]/10 px-3 text-sm text-[var(--brand-forest)] outline-none focus:border-[var(--brand-lime)] focus:ring-4 focus:ring-[var(--brand-lime)]/15 transition-premium placeholder:text-[var(--brand-forest)]/30"
      />
    </label>
  );
}