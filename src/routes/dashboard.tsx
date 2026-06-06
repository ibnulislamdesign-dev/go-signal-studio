import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import { Bell, ChevronDown, Home, Phone, MessageCircle, PhoneCall, AlertTriangle, Sparkles, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import logo from "@/assets/go-signal-logo.png";
import { useUnreadCount } from "@/lib/notifications";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Go Signal" },
      { name: "description", content: "Your Go Signal command center: live traffic, monthly call insights, and trial status." },
    ],
  }),
  component: Dashboard,
});

const chartData = [
  { d: "Nov 23", v: 6 }, { d: "24", v: 9 }, { d: "25", v: 13 },
  { d: "26", v: 11 }, { d: "27", v: 22 }, { d: "28", v: 30 },
  { d: "29", v: 34 }, { d: "30", v: 47 },
];

function Dashboard() {
  const [alertMode, setAlertMode] = useState<"trial" | "api" | "lead">("trial");
  const unread = useUnreadCount();
  return (
    <MobileShell>
      <StatusBar />
      <div className="px-5 pt-2 pb-28 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="w-10 h-10 object-contain" />
            <div className="leading-tight">
              <div className="text-[15px] font-extrabold text-[var(--brand-forest)] tracking-tight">GO SIGNAL</div>
              <div className="text-[10px] font-medium text-[var(--brand-lime)]">The Brand Future</div>
            </div>
          </div>
          <Link
            to="/notifications"
            className="relative w-10 h-10 inline-flex items-center justify-center rounded-full bg-white shadow-sm transition-premium hover:scale-105"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[var(--brand-forest)]" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold inline-flex items-center justify-center transition-premium animate-fade-up">
                {unread}
              </span>
            )}
          </Link>
        </div>

        <h1 className="mt-5 text-lg font-bold text-[var(--brand-forest)]">Welcome back, John</h1>

        {/* Smart alert (dynamic) */}
        <SmartAlert mode={alertMode} />

        {/* Demo mode toggle for the alert */}
        <div className="mt-2 inline-flex p-1 rounded-full bg-[var(--brand-forest)]/5 text-[10px] font-semibold">
          {(["trial", "api", "lead"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setAlertMode(m)}
              className={`px-2.5 py-1 rounded-full transition-premium ${
                alertMode === m ? "bg-white text-[var(--brand-forest)] shadow-sm" : "text-[var(--brand-forest)]/50"
              }`}
            >
              {m === "trial" ? "Trial" : m === "api" ? "API" : "Lead"}
            </button>
          ))}
        </div>

        {/* Live traffic card */}
        <div className="mt-3 rounded-2xl glass p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <div className="text-base font-bold text-[var(--brand-forest)]">Live Traffic</div>
            <Link
              to="/traffic"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-lime)] hover:text-[#5a8a2a] transition-premium"
            >
              view all <ChevronDown className="w-3 h-3" />
            </Link>
          </div>
          <ul className="mt-3 space-y-1.5">
            <TrafficRow to="l1" icon={<PhoneCall className="w-4 h-4" />} label="Ongoing: 2m 11s" detail="09040728892 › Call: Order 2 Shadda Fabric (Pending)" />
            <TrafficRow to="l3" icon={<MessageCircle className="w-4 h-4" />} label="WhatsApp: 5m ago" detail="07033445566 › Booked: Consultation (Unread)" />
            <TrafficRow to="l4" icon={<Phone className="w-4 h-4" />} label="Logged: 15m ago" detail="08098765432 › Query: Shea Butter Stock (Closed)" />
          </ul>
        </div>

        {/* Insights card */}
        <div className="mt-3 rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]">
          <div className="text-base font-bold text-[var(--brand-forest)]">Monthly Call Insights</div>
          <div className="text-xs font-semibold text-[var(--brand-lime)]">1,240 Total Calls Handled</div>
          <div className="mt-3 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 6, right: 6, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="#eef2f3" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#5b6b6a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#5b6b6a" }} axisLine={false} tickLine={false} ticks={[10, 20, 30, 40, 50]} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid #e6ebec", fontSize: 12 }}
                  labelStyle={{ color: "var(--brand-forest)", fontWeight: 600 }}
                />
                <Line
                  type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2.5} dot={false}
                  activeDot={{ r: 5, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="relative h-20 glass border-t border-white/50">
          <Link
            to="/assistant"
            aria-label="AI Assistant"
            className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white shadow-[0_8px_20px_-6px_rgba(0,77,64,0.3)] flex items-center justify-center transition-premium hover:scale-110"
          >
            <img src={logo} alt="" className="w-10 h-10 object-contain" />
          </Link>
          <div className="flex items-center justify-between h-full px-10">
            <Link to="/dashboard" className="text-[var(--brand-lime)] transition-premium hover:scale-110">
              <Home className="w-7 h-7" strokeWidth={2.5} />
            </Link>
            <Link to="/profile" aria-label="Profile" className="w-10 h-10 rounded-full ring-2 ring-transparent hover:ring-[var(--brand-lime)] overflow-hidden transition-premium hover:scale-110">
              <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-500" />
            </Link>
          </div>
        </div>
        <HomeIndicator />
      </div>
    </MobileShell>
  );
}

function TrafficRow({ icon, label, detail, to }: { icon: React.ReactNode; label: string; detail: string; to: string }) {
  return (
    <li>
      <Link
        to="/traffic/$id"
        params={{ id: to }}
        className="flex items-start gap-3 p-2 -mx-2 rounded-xl transition-premium hover:bg-white/70"
      >
        <div className="mt-0.5 w-8 h-8 rounded-full bg-[var(--brand-forest)]/5 text-[var(--brand-forest)] inline-flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-[var(--brand-forest)]">{label}</div>
          <div className="text-xs text-[var(--brand-forest)]/70 truncate">{detail}</div>
        </div>
      </Link>
    </li>
  );
}

function SmartAlert({ mode }: { mode: "trial" | "api" | "lead" }) {
  if (mode === "api") {
    return (
      <Link
        to="/notifications/$id"
        params={{ id: "n7" }}
        className="mt-3 block rounded-2xl p-4 bg-white border-2 border-red-400/60 shadow-[0_10px_28px_-12px_rgba(239,68,68,0.35)] transition-premium hover:translate-y-[-1px]"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 inline-flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-extrabold text-red-600">System API disconnected</div>
            <p className="mt-0.5 text-xs text-[var(--brand-forest)]/70 leading-relaxed">
              WhatsApp Business sync paused. Try: reconnect in Platform Sync, then refresh.
            </p>
            <span className="mt-1 inline-block text-[11px] font-bold text-red-500">Troubleshoot →</span>
          </div>
        </div>
      </Link>
    );
  }
  if (mode === "lead") {
    return (
      <Link
        to="/notifications/$id"
        params={{ id: "n3" }}
        className="mt-3 block rounded-2xl p-4 bg-[var(--brand-forest)] text-white shadow-[0_12px_32px_-12px_rgba(0,77,64,0.7)] transition-premium hover:translate-y-[-1px]"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--brand-lime)]/25 text-[var(--brand-lime)] inline-flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-extrabold">3 leads captured today 🎉</div>
            <p className="mt-0.5 text-xs text-white/85 leading-relaxed">
              +₦42,500 in confirmed orders. Tap to view today's traffic feed.
            </p>
          </div>
          <ChevronDown className="w-4 h-4 -rotate-90 mt-1" />
        </div>
      </Link>
    );
  }
  return (
    <Link
      to="/notifications/$id"
      params={{ id: "n4" }}
      className="mt-3 block rounded-2xl p-4 bg-gradient-to-br from-[var(--brand-lime)] to-[#7cb342] text-white shadow-[0_14px_36px_-12px_rgba(139,195,74,0.8)] transition-premium hover:translate-y-[-1px] active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 inline-flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-extrabold">Complete your setup</div>
          <p className="mt-0.5 text-xs text-white/90 leading-relaxed">
            Your 14-day free trial ends June 13th. Subscribe to keep your AI assistant active.
          </p>
        </div>
        <ChevronDown className="w-4 h-4 -rotate-90 mt-1" />
      </div>
    </Link>
  );
}