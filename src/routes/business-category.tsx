import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import { ChevronLeft } from "lucide-react";

const CATEGORIES = [
  "Clothing & Fashion", "Cosmetics & Beauty",
  "Supermarket", "Gadgets & Phones",
  "Bakeries & Cafés", "Pharmacies",
  "Shoes & Footwear", "Restaurants",
  "Hardware Stores", "Jewelry & Luxury",
  "Baby & Kids", "Spare Parts",
  "Furniture & Home", "Salons & Spas",
];

export const Route = createFileRoute("/business-category")({
  head: () => ({
    meta: [
      { title: "Business category — Go Signal" },
      { name: "description", content: "Tell us what kind of business you run." },
    ],
  }),
  component: BusinessCategory,
});

function BusinessCategory() {
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string | null>(null);
  const [other, setOther] = useState("");

  const canContinue = picked !== null || other.trim().length > 0;

  return (
    <MobileShell>
      <StatusBar />
      <form
        onSubmit={(e) => { e.preventDefault(); if (canContinue) navigate({ to: "/business-info" }); }}
        className="px-5 pt-4 pb-10 animate-fade-up"
      >
        <Link to="/otp" className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium">
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <h1 className="mt-8 text-xl font-bold text-[var(--brand-forest)] leading-snug">
          Which type of business do you run?
        </h1>

        <div className="mt-6 grid grid-cols-2 gap-2.5">
          {CATEGORIES.map((c) => {
            const active = picked === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setPicked(active ? null : c)}
                className="rounded-xl border bg-white text-xs font-semibold py-3 px-2 text-center transition-premium hover:translate-y-[-1px] active:scale-[0.98]"
                style={{
                  borderColor: active ? "var(--brand-lime)" : "rgba(0,77,64,0.12)",
                  background: active ? "rgba(139,195,74,0.12)" : "#fff",
                  color: "var(--brand-forest)",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-sm font-semibold text-[var(--brand-lime)]">Other? write it down</p>
        <textarea
          value={other}
          onChange={(e) => setOther(e.target.value.slice(0, 200))}
          rows={3}
          className="mt-2 w-full rounded-xl bg-white border border-[var(--brand-forest)]/10 px-4 py-3 text-sm text-[var(--brand-forest)] outline-none focus:border-[var(--brand-lime)] focus:ring-4 focus:ring-[var(--brand-lime)]/15 transition-premium resize-none"
        />

        <button
          type="submit"
          disabled={!canContinue}
          className="mt-6 w-full inline-flex items-center justify-center rounded-2xl bg-[var(--brand-lime)] text-white font-semibold py-4 shadow-[0_8px_24px_-8px_rgba(139,195,74,0.6)] transition-premium disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:translate-y-[-1px]"
        >
          Continue
        </button>
      </form>
      <HomeIndicator />
    </MobileShell>
  );
}