import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import {
  ChevronLeft,
  PhoneCall,
  MessageCircle,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Grid3x3,
  Volume2,
  UserPlus,
  Video,
  User,
  Hand,
  Send,
  Paperclip,
  Smile,
  Bot,
} from "lucide-react";
import { findTraffic, type TranscriptLine, type TrafficLog } from "@/lib/traffic";

export const Route = createFileRoute("/traffic/$id")({
  validateSearch: (s: Record<string, unknown>): { msg?: number } => {
    const raw = s.msg;
    const n = typeof raw === "number" ? raw : typeof raw === "string" ? parseInt(raw, 10) : NaN;
    return Number.isFinite(n) ? { msg: n } : {};
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

  if (log.channel === "whatsapp") {
    return <WhatsAppView log={log} />;
  }
  if (log.channel === "call") {
    return <InCallView log={log} />;
  }
  return <LegacyView log={log} msg={msg} />;
}

function LegacyView({ log, msg }: { log: TrafficLog; msg?: number }) {
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

function ChatThread({ lines, focusIndex }: { lines: TranscriptLine[]; focusIndex?: number }) {
  useEffect(() => {
    if (focusIndex === undefined) return;
    const el = document.querySelector<HTMLElement>(`[data-msg="${focusIndex}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("animate-flash");
    }
  }, [focusIndex]);
  return (
    <div className="mt-4 space-y-2">
      {lines.map((l, i) => {
        const isAI = l.speaker === "AI";
        return (
          <div key={i} data-msg={i} className={`flex ${isAI ? "justify-start" : "justify-end"} animate-fade-up rounded-2xl`} style={{ animationDelay: `${i * 40}ms` }}>
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

function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function initialsFrom(name?: string, number?: string) {
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  }
  return number?.slice(-2) ?? "GS";
}

function InCallView({ log }: { log: TrafficLog }) {
  const [seconds, setSeconds] = useState(log.durationSec ?? 0);
  const [muted, setMuted] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [speakerOpen, setSpeakerOpen] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [liveMode, setLiveMode] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (ended) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [ended]);

  const displayName = log.customer ?? log.number;

  return (
    <MobileShell>
      <div className="relative min-h-full h-full w-full overflow-hidden text-white">
        {/* Blurred backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1f1a] via-[#0e2a24] to-[#04120f]" />
        <div className="absolute inset-0 opacity-40" style={{
          background:
            "radial-gradient(60% 40% at 20% 10%, rgba(139,195,74,0.35), transparent 60%), radial-gradient(50% 40% at 90% 90%, rgba(0,150,136,0.45), transparent 60%)",
        }} />
        <div className="absolute inset-0 backdrop-blur-3xl" />

        <div className="relative z-10 flex flex-col h-full min-h-[100dvh] md:min-h-[844px] px-6 pt-10 pb-8">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <Link
              to="/traffic"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/15 transition-premium"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md ${
                liveMode
                  ? "bg-red-500/25 text-red-200 border border-red-400/40"
                  : "bg-white/10 text-white/85 border border-white/15"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${liveMode ? "bg-red-400 animate-pulse" : "bg-[var(--brand-lime)]"}`} />
              {liveMode ? "Live Mode" : "AI Speaking"}
            </span>
            <span className="w-10" />
          </div>

          {/* Avatar + name */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[var(--brand-lime)]/25 blur-2xl scale-125" />
              <div className="relative w-32 h-32 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-4xl font-extrabold tracking-wide">
                {initialsFrom(log.customer, log.number).toUpperCase()}
              </div>
            </div>
            <h1 className="mt-6 text-2xl font-bold">{displayName}</h1>
            <p className="mt-1 text-sm text-white/60">{log.number}</p>
            <p className="mt-3 text-lg font-mono tabular-nums text-white/85">
              {ended ? "Call ended" : formatTime(seconds)}
            </p>
          </div>

          {/* 6-button grid */}
          <div className="grid grid-cols-3 gap-y-6 gap-x-2 mt-6 mb-8">
            <CallAction label={muted ? "Unmute" : "Mute"} active={muted} onClick={() => setMuted((m) => !m)}>
              {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </CallAction>
            <CallAction label="Keypad" active={showKeypad} onClick={() => setShowKeypad((v) => !v)}>
              <Grid3x3 className="w-6 h-6" />
            </CallAction>
            <div className="relative flex flex-col items-center">
              <CallAction
                label={speakerOn ? "Speaker" : "Earpiece"}
                active={speakerOpen || speakerOn}
                onClick={() => setSpeakerOpen((v) => !v)}
              >
                <Volume2 className="w-6 h-6" />
              </CallAction>
              {speakerOpen && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 rounded-2xl bg-white/15 backdrop-blur-2xl border border-white/25 shadow-2xl p-1.5 z-20 animate-fade-up">
                  <button
                    type="button"
                    onClick={() => { setSpeakerOn((v) => !v); setSpeakerOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-left transition-premium"
                  >
                    <Volume2 className="w-4 h-4 text-[var(--brand-lime)]" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Speaker Audio</div>
                      <div className="text-[10px] text-white/60">{speakerOn ? "On" : "Off"} · route to loudspeaker</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLiveMode(true); setSpeakerOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-left transition-premium"
                  >
                    <Hand className="w-4 h-4 text-red-300" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Take Over Live</div>
                      <div className="text-[10px] text-white/60">Intercept and speak to caller</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
            <CallAction label="Add call">
              <UserPlus className="w-6 h-6" />
            </CallAction>
            <CallAction label="FaceTime">
              <Video className="w-6 h-6" />
            </CallAction>
            <CallAction label="Contacts">
              <User className="w-6 h-6" />
            </CallAction>
          </div>

          {/* End call */}
          <div className="flex items-center justify-center pb-2">
            <button
              type="button"
              onClick={() => setEnded(true)}
              className="relative w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 transition-all flex items-center justify-center shadow-[0_10px_40px_-6px_rgba(220,38,38,0.75)]"
              aria-label="End call"
            >
              <span className="absolute inset-0 rounded-full bg-red-500/50 blur-xl -z-10" />
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

function CallAction({
  label,
  children,
  active,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 group"
    >
      <span
        className={`w-16 h-16 rounded-full backdrop-blur-md border flex items-center justify-center transition-premium ${
          active
            ? "bg-white text-[var(--brand-forest)] border-white shadow-lg"
            : "bg-white/10 text-white border-white/15 group-hover:bg-white/15"
        }`}
      >
        {children}
      </span>
      <span className="text-[11px] font-medium text-white/85">{label}</span>
    </button>
  );
}

/* -------- WhatsApp chat view -------- */

type ChatMsg = { id: string; from: "them" | "me" | "ai"; text: string; t: string };

function WhatsAppView({ log }: { log: TrafficLog }) {
  const seed = useMemo<ChatMsg[]>(
    () =>
      log.transcript.map((l, i) => ({
        id: `s${i}`,
        from: l.speaker === "AI" ? "ai" : "them",
        text: l.text,
        t: l.t === "—" ? "" : l.t,
      })),
    [log.transcript],
  );
  const [messages, setMessages] = useState<ChatMsg[]>(seed);
  const [draft, setDraft] = useState("");
  const [aiAuto, setAiAuto] = useState(true);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `m${Date.now()}`, from: "me", text, t: "now" },
    ]);
    setDraft("");
  };

  return (
    <MobileShell>
      <div className="min-h-full h-full flex flex-col bg-[#e5ddd5] dark:bg-[#0b141a] text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#075e54] text-white px-3 py-2.5 flex items-center gap-2 shadow-md">
          <Link to="/traffic" className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-premium">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="w-9 h-9 rounded-full bg-[#25D366]/25 flex items-center justify-center text-sm font-bold">
            {initialsFrom(log.customer, log.number).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{log.customer ?? log.number}</div>
            <div className="text-[11px] text-white/70 truncate">{log.number} · online</div>
          </div>
          <MessageCircle className="w-5 h-5 opacity-80" />
        </div>

        {/* AI Auto-Reply toggle bar */}
        <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${aiAuto ? "bg-[var(--brand-lime)]/20 text-[var(--brand-lime)]" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">AI Auto-Reply</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {aiAuto ? "AI is handling this thread automatically" : "Manual mode — replies won't be sent by AI"}
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={aiAuto}
            onClick={() => setAiAuto((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors ${aiAuto ? "bg-[var(--brand-lime)]" : "bg-slate-300 dark:bg-slate-700"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${aiAuto ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {messages.map((m) => {
            const mine = m.from === "me" || (m.from === "ai" && aiAuto);
            const isAi = m.from === "ai";
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[78%] px-3 py-2 rounded-lg text-sm leading-relaxed shadow-sm ${
                    mine
                      ? "bg-[#dcf8c6] dark:bg-[#005c4b] text-slate-900 dark:text-slate-50 rounded-br-none"
                      : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-bl-none"
                  }`}
                >
                  {isAi && (
                    <div className="text-[9px] uppercase tracking-wider font-bold text-[var(--brand-lime)] mb-0.5 flex items-center gap-1">
                      <Bot className="w-2.5 h-2.5" /> AI Reply
                    </div>
                  )}
                  <div>{m.text}</div>
                  {m.t && <div className="text-[9px] text-slate-500 dark:text-slate-400 text-right mt-0.5">{m.t}</div>}
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* Composer */}
        <div className="p-2 bg-[#f0f0f0] dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
          <button type="button" className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800">
            <Smile className="w-5 h-5" />
          </button>
          <button type="button" className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder={aiAuto ? "Type to override AI…" : "Type a message"}
            className="flex-1 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 text-sm outline-none focus:border-[var(--brand-lime)]"
          />
          <button
            type="button"
            onClick={send}
            disabled={!draft.trim()}
            className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </MobileShell>
  );
}