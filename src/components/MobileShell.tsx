import type { ReactNode } from "react";

/**
 * Constrains the entire app UI to a 390x844 mobile chassis on desktop,
 * with deep drop shadow and rounded borders. On mobile, fills the screen.
 */
export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1d1f] md:p-8">
      <div
        className="relative w-full md:w-[390px] md:h-[844px] min-h-screen md:min-h-0 overflow-hidden bg-[var(--canvas)] md:rounded-[44px] md:border md:border-white/5"
        style={{ boxShadow: "var(--shadow-chassis)" }}
      >
        <div className="absolute inset-0 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[13px] font-semibold text-[var(--brand-forest)]">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <span className="text-xs">●●●</span>
        <span className="text-xs">📶</span>
        <span className="text-xs">🔋</span>
      </div>
    </div>
  );
}

export function HomeIndicator() {
  return (
    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-32 rounded-full bg-black/80" />
  );
}