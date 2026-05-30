import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useRef, type ReactNode } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import { ChevronLeft } from "lucide-react";
import w1 from "@/assets/welcome-1.jpg";
import w2 from "@/assets/welcome-2.jpg";
import w3 from "@/assets/welcome-3.jpg";
import w4 from "@/assets/welcome-4.jpg";
import w5 from "@/assets/welcome-5.jpg";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — Go Signal" },
      { name: "description", content: "Discover how Go Signal turns calls and signals into brand growth." },
    ],
  }),
  component: WelcomeCarousel,
});

type Slide = { img: string; alt: string; text: ReactNode; speaker?: boolean };

const lime = "text-[var(--brand-lime)] font-semibold";

const slides: Slide[] = [
  {
    img: w1, alt: "Boutique storefront",
    text: <>See what's working at your <span className={lime}>competitor's shop</span> — instantly. Go Signal listens to the market so you never miss a trend.</>,
  },
  {
    img: w2, alt: "Creative entrepreneur",
    text: <>Every conversation becomes a <span className={lime}>creative spark</span>. Turn raw customer calls into ideas that grow your brand.</>,
  },
  {
    img: w3, alt: "Smart speaker", speaker: true,
    text: <>Activate Go Signal on the <span className={lime}>speakers you already own</span>. No new hardware. Just smarter, hands-free brand intelligence.</>,
  },
  {
    img: w4, alt: "Shop owner with phone",
    text: <>We don't just answer phones; we <span className={lime}>analyze your future</span>. Predict peak hours so you never run out of stock again.</>,
  },
  {
    img: w5, alt: "Happy shoppers",
    text: <>Ready to <span className={lime}>boost your brand</span>? Turn on your Go Signal and let your business work for you.</>,
  },
];

function WelcomeCarousel() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);

  const goTo = (n: number) => setI(Math.max(0, Math.min(slides.length - 1, n)));
  const next = () => (i === slides.length - 1 ? navigate({ to: "/signup" }) : goTo(i + 1));

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx < -40) next();
    else if (dx > 40) goTo(i - 1);
    startX.current = null;
  };

  const isLast = i === slides.length - 1;

  return (
    <MobileShell>
      <StatusBar />
      <div
        className="flex flex-col px-6 pt-2 pb-10 min-h-[780px]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex items-center">
          {i > 0 ? (
            <button
              onClick={() => goTo(i - 1)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium"
              aria-label="Home"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
          )}
        </div>

        {/* Image with soft rounded base clip */}
        <div
          key={i}
          className="relative mt-2 mx-auto w-full max-w-[320px] aspect-[4/5] overflow-hidden animate-fade-up"
          style={{ borderRadius: "24px 24px 160px 160px" }}
        >
          <img
            src={slides[i].img}
            alt={slides[i].alt}
            className="w-full h-full object-cover"
            width={1024}
            height={1024}
            loading={i === 0 ? "eager" : "lazy"}
          />
          {slides[i].speaker && <AudioWaves />}
        </div>

        {/* Text */}
        <p
          key={`t-${i}`}
          className="mt-7 text-center text-[15px] leading-relaxed text-[var(--brand-forest)] px-1 animate-fade-up"
        >
          {slides[i].text}
        </p>

        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Slide ${idx + 1}`}
              className="transition-premium h-2 rounded-full"
              style={{
                width: idx === i ? 22 : 8,
                backgroundColor: idx === i ? "var(--brand-lime)" : "rgba(0,77,64,0.15)",
              }}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-8">
          <button
            onClick={next}
            className="w-full inline-flex items-center justify-center rounded-2xl bg-[var(--brand-lime)] text-white font-semibold py-4 shadow-[0_8px_24px_-8px_rgba(139,195,74,0.6)] transition-premium hover:translate-y-[-1px] active:scale-[0.99]"
          >
            {isLast ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
      <HomeIndicator />
    </MobileShell>
  );
}

function AudioWaves() {
  return (
    <svg
      className="absolute inset-x-0 bottom-[18%] mx-auto"
      width="70%" height="80" viewBox="0 0 200 80" fill="none"
      style={{ filter: "drop-shadow(0 0 12px rgba(139,195,74,0.85))" }}
      aria-hidden
    >
      {Array.from({ length: 18 }).map((_, idx) => {
        const h = 12 + Math.abs(Math.sin(idx * 0.9)) * 50;
        return (
          <rect
            key={idx}
            x={idx * 11 + 4}
            y={40 - h / 2}
            width={4}
            height={h}
            rx={2}
            fill="#8bc34a"
            opacity={0.85}
          >
            <animate
              attributeName="height"
              values={`${h};${h * 0.4};${h}`}
              dur={`${1.2 + (idx % 5) * 0.18}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values={`${40 - h / 2};${40 - h * 0.2};${40 - h / 2}`}
              dur={`${1.2 + (idx % 5) * 0.18}s`}
              repeatCount="indefinite"
            />
          </rect>
        );
      })}
    </svg>
  );
}