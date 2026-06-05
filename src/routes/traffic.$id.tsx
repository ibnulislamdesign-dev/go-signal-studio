import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import { ChevronLeft, PhoneCall, MessageCircle, Mic, Phone } from "lucide-react";
import { findTraffic, type TranscriptLine } from "@/lib/traffic";

export const Route = createFileRoute("/traffic/$id")({
  validateSearch: (s: Record<string, unknown>) => {
    const raw = s.msg;
    const n = typeof raw === "number" ? raw : typeof raw === "string" ? parseInt(raw, 10) : NaN;
    return { msg: Number.isFinite(n) ? n : undefined };
  },
  loader: ({ params }) => {
    const log = findTraffic(params.id);
    if (!log) throw notFound();
    return { log };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.log.number ?? "Call"} — Go Signal` },
      { name: "description", content: loaderData?.log.summary ?? "Traffic log detail" },
    ],
  }),
  notFoundComponent: () => (
    <MobileShell>
      <StatusBar />
      <div className="px-6 pt-10 text-center text-sm text-[var(--brand-forest)]/70">
        Log not found.
        <div className="mt-3">
          <Link to="/traffic" className="text-[var(--brand-lime)] font-semibold">Back to logs</Link>
        </div>
      </div>
      <HomeIndicator />
    </MobileShell>
  ),
  errorComponent: ({ error }) => (
    <MobileShell>
      <StatusBar />
      <div className="px-6 pt-10 text-center text-sm text-[var(--brand-forest)]/70">
        Something went wrong. {String(error)}
      </div>
      <HomeIndicator />
    </MobileShell>
  ),
  component: TrafficDetail,
});

function TrafficDetail() {
  const { log } = Route.useLoaderData();
  const { msg } = Route.useSearch();
  return (
    <MobileShell>
      <StatusBar />
      <div className="px-5 pt-2 pb-10 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link
            to="/traffic"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-bold text-[var(--brand-forest)]">
            {log.live ? "Live transcript" : "Conversation"}
          </span>
          <span className="w-9" />
        </div>

        <div className="mt-4 rounded-2xl glass border border-white/40 p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl inline-flex items-center justify-center ${
              log.channel === "whatsapp"
                ? "bg-[var(--brand-lime)]/15 text-[var(--brand-lime)]"
                : log.channel === "missed"
                ? "bg-red-500/10 text-red-500"
                : "bg-[var(--brand-forest)]/5 text-[var(--brand-forest)]"
            }`}>
              {log.channel === "whatsapp" ? <MessageCircle className="w-5 h-5" /> : log.channel === "missed" ? <Phone className="w-5 h-5" /> : <PhoneCall className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-[var(--brand-forest)] truncate">{log.customer ?? "Unknown caller"}</div>
              <div className="text-xs text-[var(--brand-forest)]/60 truncate">{log.number} · {log.time}</div>
            </div>
            {log.live && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live
              </span>
            )}
          </div>
          <p className="mt-3 text-xs text-[var(--brand-forest)]/70">{log.summary}</p>
        </div>

        {log.live ? (
          <LiveTranscript seed={log.transcript} />
        ) : (
          <ChatThread lines={log.transcript} focusIndex={msg} />
        )}
      </div>
      <HomeIndicator />
    </MobileShell>
  );
}

function LiveTranscript({ seed }: { seed: TranscriptLine[] }) {
  const [lines, setLines] = useState<TranscriptLine[]>(seed);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const pool: TranscriptLine[] = [
      { speaker: "Caller", text: "Do you accept bank transfer?", t: "live" },
      { speaker: "AI", text: "Yes, both transfer and card. I'll send our account number now.", t: "live" },
      { speaker: "Caller", text: "Can you deliver to Lekki tomorrow morning?", t: "live" },
      { speaker: "AI", text: "Yes, Lekki delivery before 11 AM is available for ₦2,500.", t: "live" },
      { speaker: "Caller", text: "Great, let's go ahead.", t: "live" },
      { speaker: "AI", text: "Booking confirmed. You'll get an SMS receipt shortly.", t: "live" },
    ];
    let i = 0;
    const id = setInterval(() => {
      if (i >= pool.length) {
        setTyping(false);
        clearInterval(id);
        return;
      }
      setLines((prev) => [...prev, pool[i]]);
      i++;
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-4 rounded-2xl bg-white border border-[var(--brand-forest)]/5 p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2">
        <Mic className="w-4 h-4 text-[var(--brand-lime)]" />
        <span className="text-xs font-bold text-[var(--brand-forest)]">Real-time transcription</span>
      </div>
      <ul className="mt-3 space-y-2.5">
        {lines.map((l, i) => (
          <li key={i} className="animate-fade-up">
            <div className="text-[10px] uppercase tracking-wider font-bold text-[var(--brand-forest)]/40">
              {l.speaker} {l.t !== "live" && `· ${l.t}`}
            </div>
            <div className={`mt-0.5 text-sm leading-relaxed ${
              l.speaker === "AI" ? "text-[var(--brand-forest)]" : "text-[var(--brand-forest)]/85"
            }`}>
              {l.text}
            </div>
          </li>
        ))}
        {typing && (
          <li className="flex items-center gap-1.5 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-lime)] animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-lime)] animate-pulse [animation-delay:120ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-lime)] animate-pulse [animation-delay:240ms]" />
            <span className="ml-2 text-[11px] text-[var(--brand-forest)]/50">listening…</span>
          </li>
        )}
      </ul>
    </div>
  );
}

function ChatThread({ lines }: { lines: TranscriptLine[] }) {
  return (
    <div className="mt-4 space-y-2">
      {lines.map((l, i) => {
        const isAI = l.speaker === "AI";
        return (
          <div key={i} className={`flex ${isAI ? "justify-start" : "justify-end"} animate-fade-up`} style={{ animationDelay: `${i * 40}ms` }}>
            <div
              className={`max-w-[78%] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                isAI
                  ? "bg-white border border-[var(--brand-forest)]/5 text-[var(--brand-forest)] rounded-2xl rounded-bl-md"
                  : "bg-[var(--brand-lime)] text-white rounded-2xl rounded-br-md"
              }`}
            >
              <div className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 ${isAI ? "text-[var(--brand-forest)]/50" : "text-white/80"}`}>
                {l.speaker} · {l.t}
              </div>
              {l.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}