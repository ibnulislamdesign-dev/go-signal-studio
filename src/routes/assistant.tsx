import { createFileRoute, Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Menu,
  Mic,
  Paperclip,
  Plus,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { AppBottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Go Signal" },
      {
        name: "description",
        content:
          "Chat with your Go Signal AI assistant — brainstorm, code, analyze, and more.",
      },
    ],
  }),
  component: AssistantPage,
});

type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const HISTORY_KEY = "gosignal.assistant.threads.v1";
const ACTIVE_KEY = "gosignal.assistant.active.v1";

const SUGGESTIONS = [
  "Brainstorm ideas",
  "Code",
  "Analyze",
  "Create image",
  "Ask me anything",
];

function loadThreads(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveThreads(threads: ChatThread[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(threads));
}

function newThread(): ChatThread {
  return {
    id: `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    title: "New conversation",
    updatedAt: Date.now(),
    messages: [],
  };
}

function AssistantPage() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    if (bootstrapped) return;
    const stored = loadThreads();
    const activeStored =
      typeof window !== "undefined" ? window.localStorage.getItem(ACTIVE_KEY) : null;
    if (stored.length === 0) {
      const t = newThread();
      setThreads([t]);
      setActiveId(t.id);
      saveThreads([t]);
    } else {
      setThreads(stored);
      const found = stored.find((t) => t.id === activeStored);
      setActiveId(found ? found.id : stored[0].id);
    }
    setBootstrapped(true);
  }, [bootstrapped]);

  useEffect(() => {
    if (activeId && typeof window !== "undefined") {
      window.localStorage.setItem(ACTIVE_KEY, activeId);
    }
  }, [activeId]);

  const active = threads.find((t) => t.id === activeId) ?? null;

  function persistMessages(id: string, messages: UIMessage[]) {
    setThreads((prev) => {
      const next = prev.map((t) =>
        t.id === id
          ? {
              ...t,
              messages,
              updatedAt: Date.now(),
              title:
                t.title === "New conversation" && messages.length > 0
                  ? deriveTitle(messages[0]) || t.title
                  : t.title,
            }
          : t,
      );
      saveThreads(next);
      return next;
    });
  }

  function startNew() {
    const t = newThread();
    const next = [t, ...threads];
    setThreads(next);
    saveThreads(next);
    setActiveId(t.id);
    setDrawerOpen(false);
  }

  function selectThread(id: string) {
    setActiveId(id);
    setDrawerOpen(false);
  }

  function deleteThread(id: string) {
    const next = threads.filter((t) => t.id !== id);
    if (next.length === 0) {
      const t = newThread();
      setThreads([t]);
      saveThreads([t]);
      setActiveId(t.id);
      return;
    }
    setThreads(next);
    saveThreads(next);
    if (activeId === id) setActiveId(next[0].id);
  }

  return (
    <MobileShell bottomNav={<AppBottomNav active="assistant" autoHide />}>
      <div className="flex flex-col h-full md:h-[844px] bg-[#0b1210] dark:bg-[#0b1210] text-white animate-fade-up">
        {/* Header */}
        <div className="px-5 pt-3 pb-3 flex items-center justify-between shrink-0">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open history"
            className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-premium"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <div className="text-[15px] font-extrabold tracking-tight">Go Signal</div>
          <Link
            to="/subscription"
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full bg-[var(--brand-lime)] text-[var(--brand-forest)] text-xs font-bold shadow-[0_6px_20px_-8px_rgba(139,195,74,0.6)] hover:scale-105 transition-premium"
          >
            <Zap className="w-3.5 h-3.5" strokeWidth={2.5} /> Get Pro
          </Link>
        </div>

        {active && (
          <ChatWindow
            key={active.id}
            thread={active}
            onMessagesChange={(msgs) => persistMessages(active.id, msgs)}
          />
        )}

        <div className="h-24 shrink-0" aria-hidden />
      </div>

      <HistoryDrawer
        open={drawerOpen}
        threads={threads}
        activeId={activeId}
        onClose={() => setDrawerOpen(false)}
        onNew={startNew}
        onSelect={selectThread}
        onDelete={deleteThread}
      />
    </MobileShell>
  );
}

function deriveTitle(msg: UIMessage): string | null {
  const text = msg.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  if (!text) return null;
  return text.length > 38 ? text.slice(0, 38) + "…" : text;
}

function ChatWindow({
  thread,
  onMessagesChange,
}: {
  thread: ChatThread;
  onMessagesChange: (m: UIMessage[]) => void;
}) {
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const { messages, sendMessage, status, error } = useChat({
    id: thread.id,
    messages: thread.messages,
    transport,
  });
  const [input, setInput] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;

  useEffect(() => {
    onMessagesChange(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [thread.id, status]);

  async function submit() {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    setAttachments([]);
    await sendMessage({ text });
  }

  function pickSuggestion(s: string) {
    setInput(s);
    inputRef.current?.focus();
  }

  return (
    <>
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-4 animate-fade-up">
          <GlowingOrb />
          <h1 className="mt-10 text-2xl font-extrabold text-center tracking-tight">
            What can I help you with today?
          </h1>
          <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-sm">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => pickSuggestion(s)}
                className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/90 transition-premium hover:scale-105"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {status === "submitted" && (
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-lime)] animate-pulse" />
              Thinking…
            </div>
          )}
          {error && (
            <div className="text-xs text-red-300 bg-red-500/10 rounded-xl px-3 py-2">
              {error.message || "Something went wrong. Please try again."}
            </div>
          )}
        </div>
      )}

      {/* Composer */}
      <div className="px-4 pb-3 pt-2 shrink-0">
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {attachments.map((f, i) => (
              <span
                key={`${f.name}-${i}`}
                className="inline-flex items-center gap-1.5 max-w-[180px] bg-white/10 text-white text-[11px] font-medium px-2.5 py-1 rounded-full"
              >
                <Paperclip className="w-3 h-3 shrink-0" />
                <span className="truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachments((a) => a.filter((_, j) => j !== i))}
                  aria-label={`Remove ${f.name}`}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="rounded-full bg-white/8 border border-white/10 backdrop-blur-md p-1.5 flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.length) setAttachments((prev) => [...prev, ...files]);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach files"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white inline-flex items-center justify-center transition-premium shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Ask me anything"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-white/40 px-2 py-2 focus:outline-none max-h-32"
          />
          {input.trim() ? (
            <button
              onClick={submit}
              disabled={isLoading}
              aria-label="Send"
              className="w-9 h-9 rounded-full bg-[var(--brand-lime)] text-[var(--brand-forest)] inline-flex items-center justify-center transition-premium hover:scale-105 disabled:opacity-40 shrink-0"
            >
              <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setVoiceOpen(true)}
              aria-label="Voice"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white inline-flex items-center justify-center transition-premium shrink-0"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {voiceOpen && <VoiceOverlay onClose={() => setVoiceOpen(false)} />}
    </>
  );
}

function GlowingOrb() {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <span className="absolute inset-0 rounded-full bg-[var(--brand-lime)]/20 blur-2xl animate-pulse" />
      <span
        className="absolute inset-4 rounded-full bg-gradient-to-br from-[var(--brand-lime)]/60 via-emerald-400/40 to-teal-500/30 blur-xl"
        style={{ animation: "pulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite" }}
      />
      <span className="absolute inset-8 rounded-full bg-gradient-to-br from-white/90 via-[var(--brand-lime)]/70 to-emerald-500/50 shadow-[0_0_80px_20px_rgba(139,195,74,0.35)]" />
      <span className="absolute top-10 left-12 w-6 h-6 rounded-full bg-white/70 blur-md" />
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
  const isUser = message.role === "user";
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] rounded-2xl rounded-br-md px-4 py-2.5 bg-[var(--brand-lime)] text-[var(--brand-forest)] text-sm leading-relaxed whitespace-pre-wrap font-medium">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5">
      <div className="w-8 h-8 rounded-full bg-white/10 text-white inline-flex items-center justify-center shrink-0 text-[10px] font-black tracking-wider">
        Ai
      </div>
      <div className="flex-1 text-sm leading-relaxed text-white/90 whitespace-pre-wrap pt-1">
        {text}
      </div>
    </div>
  );
}

function HistoryDrawer({
  open,
  threads,
  activeId,
  onClose,
  onNew,
  onSelect,
  onDelete,
}: {
  open: boolean;
  threads: ChatThread[];
  activeId: string | null;
  onClose: () => void;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`absolute inset-0 z-40 transition-premium ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute top-0 bottom-0 left-0 w-[78%] max-w-[320px] bg-[#0b1210] border-r border-white/10 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white">History</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 inline-flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="px-4">
          <button
            onClick={onNew}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-lime)] text-[var(--brand-forest)] text-xs font-bold py-2.5 transition-premium hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> New conversation
          </button>
        </div>
        <ul className="mt-4 px-2 overflow-y-auto h-[calc(100%-110px)] pb-6">
          {threads
            .slice()
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((t) => (
              <li
                key={t.id}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl transition-premium ${
                  t.id === activeId ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <button
                  onClick={() => onSelect(t.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="text-xs font-bold text-white truncate">
                    {t.title}
                  </div>
                  <div className="text-[10px] text-white/50">
                    {new Date(t.updatedAt).toLocaleString()}
                  </div>
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  aria-label="Delete"
                  className="w-7 h-7 rounded-full text-white/50 hover:text-red-400 hover:bg-red-500/10 inline-flex items-center justify-center transition-premium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
        </ul>
      </aside>
    </div>
  );
}

function VoiceOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0b1210]/95 backdrop-blur-md animate-fade-up">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white inline-flex items-center justify-center"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="relative w-56 h-56 flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-[var(--brand-lime)]/20 animate-ping" />
        <span className="absolute inset-6 rounded-full bg-[var(--brand-lime)]/30 animate-pulse" />
        <span
          className="absolute inset-12 rounded-full bg-gradient-to-br from-[var(--brand-lime)] to-emerald-500 shadow-[0_0_80px_20px_rgba(139,195,74,0.45)]"
          style={{ animation: "pulse 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite" }}
        />
        <Mic className="relative w-10 h-10 text-white" />
      </div>
      <div className="mt-8 text-white text-sm font-semibold tracking-wide">Listening…</div>
      <div className="mt-1 text-white/60 text-xs">Voice input is coming soon</div>
      <button
        onClick={onClose}
        className="mt-8 px-6 py-2.5 rounded-full bg-white text-[#0b1210] text-xs font-bold transition-premium hover:scale-[1.03]"
      >
        Done
      </button>
    </div>
  );
}

// Sparkles reserved for potential future use
void Sparkles;