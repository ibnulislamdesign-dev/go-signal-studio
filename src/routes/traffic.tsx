import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import { ChevronLeft, PhoneCall, MessageCircle, Phone, Search } from "lucide-react";

export const Route = createFileRoute("/traffic")({
  head: () => ({
    meta: [
      { title: "All Traffic Logs — Go Signal" },
      { name: "description", content: "Every call, WhatsApp message, and customer interaction handled by your AI assistant." },
    ],
  }),
  component: Traffic,
});

type Status = "Query" | "Pending" | "Booked" | "Closed";
type Channel = "call" | "whatsapp" | "missed";
type Log = { id: string; channel: Channel; number: string; summary: string; status: Status; time: string };

const LOGS: Log[] = [
  { id: "l1",  channel: "call",     number: "09040728892", summary: "Asked about Shadda fabric royal blue availability", status: "Query",   time: "2m ago" },
  { id: "l2",  channel: "call",     number: "08123456701", summary: "Order: 2 yards Aso-Oke, awaiting transfer confirmation", status: "Pending", time: "11m ago" },
  { id: "l3",  channel: "whatsapp", number: "07033445566", summary: "Consultation booked for Friday 2:00 PM", status: "Booked",  time: "23m ago" },
  { id: "l4",  channel: "call",     number: "08098765432", summary: "Shea butter 500g stock query — restock Friday", status: "Closed",  time: "41m ago" },
  { id: "l5",  channel: "whatsapp", number: "08144112233", summary: "Asked for delivery rates to Ibadan", status: "Query",   time: "1h ago" },
  { id: "l6",  channel: "call",     number: "07087654321", summary: "3 yards Adire ordered, payment pending", status: "Pending", time: "1h ago" },
  { id: "l7",  channel: "whatsapp", number: "09011224455", summary: "Pickup time locked for Saturday 11:00 AM", status: "Booked",  time: "2h ago" },
  { id: "l8",  channel: "missed",   number: "08029988776", summary: "Missed call — AI follow-up scheduled in 5m", status: "Pending", time: "2h ago" },
  { id: "l9",  channel: "call",     number: "07012345678", summary: "Bulk Ankara enquiry resolved, quote sent", status: "Closed",  time: "3h ago" },
  { id: "l10", channel: "whatsapp", number: "08155667788", summary: "Customer asked about return policy", status: "Query",   time: "4h ago" },
  { id: "l11", channel: "call",     number: "09099887766", summary: "Wedding fabric package booked, deposit received", status: "Booked",  time: "5h ago" },
  { id: "l12", channel: "whatsapp", number: "08177665544", summary: "Order #1042 delivered, customer satisfied", status: "Closed",  time: "6h ago" },
  { id: "l13", channel: "call",     number: "07055443322", summary: "Asked about Akwete weave variants", status: "Query",   time: "8h ago" },
  { id: "l14", channel: "whatsapp", number: "08188776655", summary: "Order placed, awaiting POS confirmation", status: "Pending", time: "9h ago" },
  { id: "l15", channel: "call",     number: "09022113344", summary: "Tailoring consultation booked, Mon 10:00 AM", status: "Booked",  time: "11h ago" },
  { id: "l16", channel: "whatsapp", number: "08066778899", summary: "Shipping confirmation closed and logged", status: "Closed",  time: "12h ago" },
];

const FILTERS: ("All" | Status)[] = ["All", "Query", "Pending", "Booked", "Closed"];

function Traffic() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [q, setQ] = useState("");
  const filtered = LOGS.filter(
    (l) =>
      (filter === "All" || l.status === filter) &&
      (q.trim() === "" ||
        l.number.includes(q.trim()) ||
        l.summary.toLowerCase().includes(q.trim().toLowerCase())),
  );

  return (
    <MobileShell>
      <StatusBar />
      <div className="px-5 pt-2 pb-12 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-bold text-[var(--brand-forest)]">All Traffic Logs</span>
          <span className="w-9" />
        </div>

        <h1 className="mt-4 text-lg font-bold text-[var(--brand-forest)]">{LOGS.length} interactions today</h1>
        <p className="text-xs text-[var(--brand-forest)]/60">Live feed across calls and WhatsApp</p>

        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--brand-forest)]/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search number or summary…"
            maxLength={80}
            className="w-full h-11 rounded-xl bg-white border border-[var(--brand-forest)]/10 pl-9 pr-3 text-sm text-[var(--brand-forest)] outline-none focus:border-[var(--brand-lime)] transition-premium"
          />
        </div>

        <div className="mt-3 flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-1 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-premium ${
                filter === f
                  ? "bg-[var(--brand-forest)] text-white shadow-sm"
                  : "bg-white text-[var(--brand-forest)]/70 border border-[var(--brand-forest)]/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="mt-3 space-y-2">
          {filtered.length === 0 && (
            <li className="text-center text-xs text-[var(--brand-forest)]/50 py-8">No logs match your filter.</li>
          )}
          {filtered.map((l, i) => (
            <li
              key={l.id}
              style={{ animationDelay: `${i * 25}ms` }}
              className="animate-fade-up rounded-2xl bg-white border border-[var(--brand-forest)]/5 p-3.5 shadow-[var(--shadow-card)] transition-premium hover:border-[var(--brand-lime)]/40"
            >
              <div className="flex items-start gap-3">
                <ChannelIcon channel={l.channel} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-bold text-[var(--brand-forest)] truncate">{l.number}</span>
                    <StatusBadge status={l.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--brand-forest)]/70 line-clamp-2">{l.summary}</p>
                  <div className="mt-1.5 text-[10px] uppercase tracking-wider font-semibold text-[var(--brand-forest)]/40">
                    {l.channel === "whatsapp" ? "WhatsApp" : l.channel === "missed" ? "Missed call" : "Voice call"} · {l.time}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <HomeIndicator />
    </MobileShell>
  );
}

function ChannelIcon({ channel }: { channel: Channel }) {
  const map = {
    call: { icon: <PhoneCall className="w-4 h-4" />, cls: "bg-[var(--brand-forest)]/5 text-[var(--brand-forest)]" },
    whatsapp: { icon: <MessageCircle className="w-4 h-4" />, cls: "bg-[var(--brand-lime)]/15 text-[var(--brand-lime)]" },
    missed: { icon: <Phone className="w-4 h-4" />, cls: "bg-red-500/10 text-red-500" },
  } as const;
  const { icon, cls } = map[channel];
  return <div className={`mt-0.5 w-9 h-9 shrink-0 rounded-xl inline-flex items-center justify-center ${cls}`}>{icon}</div>;
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    Query: "bg-blue-500/10 text-blue-600",
    Pending: "bg-amber-500/10 text-amber-600",
    Booked: "bg-[var(--brand-lime)]/15 text-[#5a8a2a]",
    Closed: "bg-[var(--brand-forest)]/10 text-[var(--brand-forest)]",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  );
}
