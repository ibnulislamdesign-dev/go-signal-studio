import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { COUNTRIES, type Country } from "@/lib/countries";

export function PhoneInput({
  dial, number, onChange, placeholder = "801 234 5678",
}: {
  dial: string;
  number: string;
  onChange: (v: { dial: string; number: string }) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = useMemo<Country>(
    () => COUNTRIES.find((c) => c.dial === dial) ?? COUNTRIES[0],
    [dial],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [query]);

  const format = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 15);
    return digits.replace(/(\d{3})(\d{3})(\d{0,4})/, (_m, a, b, c) =>
      c ? `${a} ${b} ${c}` : b ? `${a} ${b}` : a,
    );
  };

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 h-12 rounded-xl bg-white border border-[var(--brand-forest)]/10 px-3 text-sm font-semibold text-[var(--brand-forest)] transition-premium hover:border-[var(--brand-lime)]"
        >
          <span className="text-base leading-none">{selected.flag}</span>
          <span>{selected.dial}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[var(--brand-forest)]/50" />
        </button>
        <input
          ref={inputRef}
          inputMode="tel"
          value={format(number)}
          onChange={(e) =>
            onChange({ dial, number: e.target.value.replace(/\D/g, "").slice(0, 15) })
          }
          placeholder={placeholder}
          className="flex-1 h-12 rounded-xl bg-white border border-[var(--brand-forest)]/10 px-3 text-sm text-[var(--brand-forest)] outline-none focus:border-[var(--brand-lime)] focus:ring-4 focus:ring-[var(--brand-lime)]/15 transition-premium placeholder:text-[var(--brand-forest)]/30"
        />
      </div>

      {open && (
        <div
          className="absolute inset-0 z-50 flex items-end md:items-center md:justify-center"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-h-[70%] glass rounded-t-3xl md:rounded-3xl md:max-w-sm border border-white/40 shadow-2xl flex flex-col animate-fade-up"
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="text-sm font-bold text-[var(--brand-forest)]">Select country</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-white/60 text-[var(--brand-forest)] transition-premium hover:bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--brand-forest)]/40" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search country or code…"
                  className="w-full h-11 rounded-xl bg-white/80 border border-white/60 pl-9 pr-3 text-sm text-[var(--brand-forest)] outline-none focus:border-[var(--brand-lime)] transition-premium"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center text-xs text-[var(--brand-forest)]/50">
                  No matches
                </div>
              )}
              {filtered.map((c) => {
                const active = c.dial === selected.dial && c.code === selected.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onChange({ dial: c.dial, number });
                      setOpen(false);
                      setQuery("");
                      requestAnimationFrame(() => inputRef.current?.focus());
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-premium ${
                      active ? "bg-[var(--brand-lime)]/15" : "hover:bg-white/60"
                    }`}
                  >
                    <span className="text-xl leading-none">{c.flag}</span>
                    <span className="flex-1 text-sm font-medium text-[var(--brand-forest)] truncate">
                      {c.name}
                    </span>
                    <span className="text-xs font-semibold text-[var(--brand-forest)]/60">
                      {c.dial}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
