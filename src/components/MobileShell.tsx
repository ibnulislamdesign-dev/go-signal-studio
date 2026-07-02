import { createContext, useContext, useRef, type ReactNode, type RefObject } from "react";

type ScrollRef = RefObject<HTMLDivElement | null>;
const MobileScrollContext = createContext<ScrollRef | null>(null);

export function useMobileScrollRef(): ScrollRef | null {
  return useContext(MobileScrollContext);
}

/**
 * Constrains the entire app UI to a 390x844 mobile chassis on desktop.
 * Accepts an optional `bottomNav` slot that renders fixed to the chassis
 * bottom (outside the scroll container) so it never drifts with content.
 */
export function MobileShell({
  children,
  bottomNav,
}: {
  children: ReactNode;
  bottomNav?: ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a1d1f] md:p-8">
      <div
        className="relative w-full md:w-[390px] md:h-[844px] min-h-screen md:min-h-0 overflow-hidden bg-[var(--canvas)] md:rounded-[44px] md:border md:border-white/5"
        style={{ boxShadow: "var(--shadow-chassis)" }}
      >
        <MobileScrollContext.Provider value={scrollRef}>
          <div
            ref={scrollRef}
            className={
              "absolute inset-0 overflow-y-auto overscroll-contain " +
              (bottomNav ? "pb-24" : "")
            }
          >
            {children}
          </div>
          {bottomNav ? (
            <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
              <div className="pointer-events-auto">{bottomNav}</div>
            </div>
          ) : null}
        </MobileScrollContext.Provider>
      </div>
    </div>
  );
}

// Deprecated device-frame mocks — kept as no-ops so existing imports don't
// need to be edited across every route. Do not use in new code.
export function StatusBar() {
  return null;
}

export function HomeIndicator() {
  return null;
}