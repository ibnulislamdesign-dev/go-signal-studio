import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, StatusBar, HomeIndicator } from "@/components/MobileShell";
import {
  ChevronLeft, Pencil, User, Mail, Phone, Building2, MapPin, Tag,
  Sun, Moon, Languages, Fingerprint, ScanFace, KeyRound, LifeBuoy,
  MessageCircle, PhoneCall, Home,
} from "lucide-react";
import { PhoneInput } from "@/components/PhoneInput";
import logo from "@/assets/go-signal-logo.png";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Go Signal" },
      { name: "description", content: "Your Go Signal workspace: personal, business, security, and platform settings." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("English (US)");
  const [faceId, setFaceId] = useState(true);
  const [fingerprint, setFingerprint] = useState(false);
  const [waOn, setWaOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);
  const [phone, setPhone] = useState({ dial: "+234", number: "9040728892" });
  const [whatsapp, setWhatsapp] = useState({ dial: "+234", number: "8123456701" });

  return (
    <MobileShell>
      <StatusBar />
      <div className="relative px-5 pt-2 pb-28 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-bold text-[var(--brand-forest)]">Profile</span>
          <span className="w-9" />
        </div>

        {/* Avatar */}
        <div className="mt-4 flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-br from-[var(--brand-lime)] to-[var(--brand-forest)] shadow-[0_12px_28px_-12px_rgba(0,77,64,0.5)]">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-amber-200 to-amber-500" />
            </div>
            <button
              type="button"
              aria-label="Edit photo"
              className="absolute bottom-0.5 right-0.5 w-8 h-8 rounded-full bg-[var(--brand-lime)] text-white inline-flex items-center justify-center shadow-md transition-premium hover:scale-110"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <h1 className="mt-3 text-base font-extrabold text-[var(--brand-forest)]">John Adekunle</h1>
          <p className="text-xs text-[var(--brand-forest)]/60">Owner · Go Signal Textiles</p>
        </div>

        {/* Personal details */}
        <SectionCard title="Personal details">
          <Row icon={<User className="w-4 h-4" />} label="Full Name" value="John Adekunle" />
          <Divider />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-forest)]/50">
              <Phone className="w-3.5 h-3.5" /> Phone Number
            </div>
            <PhoneInput dial={phone.dial} number={phone.number} onChange={setPhone} />
          </div>
          <Divider />
          <Row icon={<Mail className="w-4 h-4" />} label="Email Address" value="john@gosignal.app" />
        </SectionCard>

        {/* Business details */}
        <SectionCard title="Business details">
          <Row icon={<Building2 className="w-4 h-4" />} label="Business Name" value="Go Signal Textiles" />
          <Divider />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-forest)]/50">
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Number
            </div>
            <PhoneInput dial={whatsapp.dial} number={whatsapp.number} onChange={setWhatsapp} />
          </div>
          <Divider />
          <Row icon={<MapPin className="w-4 h-4" />} label="Physical Address" value="12 Adeniyi Jones, Ikeja, Lagos" />
          <Divider />
          <Row icon={<Tag className="w-4 h-4" />} label="Business Category" value="Fashion & Textiles" />
        </SectionCard>

        {/* Platform sync */}
        <SectionCard title="Platform sync" subtitle="Channels your AI assistant is connected to">
          <PlatformRow
            name="WhatsApp Business"
            sub="Replies, bookings & catalog"
            badge="WA"
            badgeClass="bg-[#25D366] text-white"
            on={waOn}
            onChange={setWaOn}
          />
          <Divider />
          <PlatformRow
            name="Cellular Voice"
            sub="Inbound calls & missed-call recovery"
            icon={<PhoneCall className="w-4 h-4" />}
            badgeClass="bg-[var(--brand-forest)] text-white"
            on={voiceOn}
            onChange={setVoiceOn}
          />
        </SectionCard>

        {/* Display */}
        <SectionCard title="Display">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBubble>{dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}</IconBubble>
              <div>
                <div className="text-sm font-bold text-[var(--brand-forest)]">Dark / Light mode</div>
                <div className="text-[11px] text-[var(--brand-forest)]/60">{dark ? "Dark" : "Light"} theme active</div>
              </div>
            </div>
            <Toggle on={dark} onChange={setDark} />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBubble><Languages className="w-4 h-4" /></IconBubble>
              <div>
                <div className="text-sm font-bold text-[var(--brand-forest)]">Language</div>
                <div className="text-[11px] text-[var(--brand-forest)]/60">Interface language</div>
              </div>
            </div>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="h-10 rounded-xl bg-white border border-[var(--brand-forest)]/10 px-3 text-xs font-semibold text-[var(--brand-forest)] outline-none focus:border-[var(--brand-lime)] transition-premium"
            >
              {["English (US)", "English (UK)", "Mandarin", "Hindi", "Spanish", "French", "Arabic", "Portuguese", "Yoruba", "Igbo", "Hausa", "Swahili"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security & biometrics">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBubble><ScanFace className="w-4 h-4" /></IconBubble>
              <div>
                <div className="text-sm font-bold text-[var(--brand-forest)]">Face Verification</div>
                <div className="text-[11px] text-[var(--brand-forest)]/60">Unlock with your face</div>
              </div>
            </div>
            <Toggle on={faceId} onChange={setFaceId} />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBubble><Fingerprint className="w-4 h-4" /></IconBubble>
              <div>
                <div className="text-sm font-bold text-[var(--brand-forest)]">Fingerprint Sign-in</div>
                <div className="text-[11px] text-[var(--brand-forest)]/60">Faster, secure logins</div>
              </div>
            </div>
            <Toggle on={fingerprint} onChange={setFingerprint} />
          </div>
          <Divider />
          <Link to="/password" className="flex items-center justify-between py-1 transition-premium hover:translate-x-0.5">
            <div className="flex items-center gap-3">
              <IconBubble><KeyRound className="w-4 h-4" /></IconBubble>
              <div className="text-sm font-bold text-[var(--brand-forest)]">Change Login Password</div>
            </div>
            <ChevronLeft className="w-4 h-4 rotate-180 text-[var(--brand-forest)]/40" />
          </Link>
          <Divider />
          <Link to="/password" className="flex items-center justify-between py-1 transition-premium hover:translate-x-0.5">
            <div className="flex items-center gap-3">
              <IconBubble><LifeBuoy className="w-4 h-4" /></IconBubble>
              <div className="text-sm font-bold text-[var(--brand-forest)]">Forgot Password</div>
            </div>
            <ChevronLeft className="w-4 h-4 rotate-180 text-[var(--brand-forest)]/40" />
          </Link>
        </SectionCard>
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="relative h-20 glass border-t border-white/50">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white shadow-[0_8px_20px_-6px_rgba(0,77,64,0.3)] flex items-center justify-center">
            <img src={logo} alt="" className="w-10 h-10 object-contain" />
          </div>
          <div className="flex items-center justify-between h-full px-10">
            <Link to="/dashboard" className="text-[var(--brand-forest)]/50 transition-premium hover:scale-110">
              <Home className="w-7 h-7" strokeWidth={2.5} />
            </Link>
            <Link to="/profile" className="w-10 h-10 rounded-full ring-2 ring-[var(--brand-lime)] overflow-hidden transition-premium hover:scale-110">
              <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-500" />
            </Link>
          </div>
        </div>
        <HomeIndicator />
      </div>
    </MobileShell>
  );
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-2xl glass border border-white/40 p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-bold text-[var(--brand-forest)]">{title}</div>
          {subtitle && <div className="text-[11px] text-[var(--brand-forest)]/55">{subtitle}</div>}
        </div>
        <button type="button" className="text-[11px] font-semibold text-[var(--brand-lime)] hover:text-[#5a8a2a] transition-premium">
          Edit
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <IconBubble>{icon}</IconBubble>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-forest)]/50">{label}</div>
        <div className="text-sm font-bold text-[var(--brand-forest)] truncate">{value}</div>
      </div>
    </div>
  );
}

function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-9 h-9 shrink-0 rounded-xl bg-[var(--brand-forest)]/5 text-[var(--brand-forest)] inline-flex items-center justify-center">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[var(--brand-forest)]/8" />;
}

function PlatformRow({
  name, sub, badge, icon, badgeClass, on, onChange,
}: {
  name: string; sub: string; badge?: string; icon?: React.ReactNode;
  badgeClass: string; on: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl inline-flex items-center justify-center text-sm font-extrabold ${badgeClass}`}>
          {icon ?? badge}
        </div>
        <div>
          <div className="text-sm font-bold text-[var(--brand-forest)]">{name}</div>
          <div className="text-[11px] text-[var(--brand-forest)]/60">{sub}</div>
        </div>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative w-12 h-7 rounded-full transition-premium ${on ? "bg-[var(--brand-lime)]" : "bg-[var(--brand-forest)]/15"}`}
    >
      <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-premium ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}