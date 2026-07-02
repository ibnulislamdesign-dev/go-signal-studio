import { Link } from "@tanstack/react-router";
import { Home, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/go-signal-logo.png";
import { useMobileScrollRef } from "@/components/MobileShell";

type Active = "home" | "profile" | "assistant" | null;

/**
 * Fixed bottom navigation for the mobile chassis. When `autoHide` is true,
 * the bar slides down on scroll-down and back up on scroll-up (Safari-style).
 */
export function AppBottomNav({
  active = null,
  autoHide = false,
}: {
  active?: Active;
  autoHide?: boolean;
}) {
  const scrollRef = useMobileScrollRef();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (!autoHide) return;
    const el = scrollRef?.current;
    if (!el) return;
    lastY.current = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 6) return;
      if (y < 24) setHidden(false);
      else if (delta > 0) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [autoHide, scrollRef]);

  const homeCls =
    active === "home"
      ? "text-[var(--brand-lime)]"
      : "text-[var(--brand-forest)]/70 hover:text-[var(--brand-forest)]";
  const profileRing =
    active === "profile" ? "ring-[var(--brand-lime)]" : "ring-transparent hover:ring-[var(--brand-lime)]";

  return (
    <div
      className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform"
      style={{ transform: hidden ? "translateY(100%)" : "translateY(0)" }}
    >
      <div className="relative h-20 glass border-t border-white/50">
        <Link
          to="/assistant"
          aria-label="AI Assistant"
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white shadow-[0_8px_20px_-6px_rgba(0,77,64,0.3)] flex items-center justify-center transition-premium hover:scale-110"
        >
          <img src={logo} alt="" className="w-10 h-10 object-contain" />
        </Link>
        <div className="flex items-center justify-between h-full px-10">
          <Link
            to="/dashboard"
            aria-label="Home"
            className={`transition-premium hover:scale-110 ${homeCls}`}
          >
            <Home className="w-7 h-7" strokeWidth={2.5} />
          </Link>
          <Link
            to="/profile"
            aria-label="Profile"
            className={`w-10 h-10 rounded-full ring-2 ${profileRing} inline-flex items-center justify-center bg-[var(--brand-forest)]/5 text-[var(--brand-forest)] overflow-hidden transition-premium hover:scale-110`}
          >
            <UserRound className="w-6 h-6" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}