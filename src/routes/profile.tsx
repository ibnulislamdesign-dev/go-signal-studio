import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { AppBottomNav } from "@/components/BottomNav";
import {
  ChevronLeft, Check, User, Mail, Phone, Building2, MapPin, Tag,
  Sun, Moon, Languages, Fingerprint, ScanFace, KeyRound, LifeBuoy,
  MessageCircle, PhoneCall, ShieldCheck, Loader2,
  Copy, CheckCircle2, Info, Camera,
} from "lucide-react";
import { PhoneInput } from "@/components/PhoneInput";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Go Signal" },
      { name: "description", content: "Your Go Signal workspace: personal, business, security, and platform settings." },
    ],
  }),
  component: Profile,
});

// ---------- tiny i18n ----------
const DICT: Record<string, Record<string, string>> = {
  "English (US)": {
    profile: "Profile", personal: "Personal details", business: "Business details",
    platform: "Platform sync", platformSub: "Channels your AI assistant is connected to",
    display: "Display", security: "Security & biometrics",
    edit: "Edit", save: "Save", cancel: "Cancel",
    fullName: "Full Name", phone: "Phone Number", email: "Email Address",
    businessName: "Business Name", whatsapp: "WhatsApp Number",
    address: "Physical Address", category: "Business Category",
    theme: "Dark / Light mode", themeSub: "Theme preference",
    language: "Language", languageSub: "Interface language",
    face: "Face Verification", faceSub: "Unlock with your face",
    finger: "Fingerprint Sign-in", fingerSub: "Faster, secure logins",
    changePwd: "Change Login Password", forgotPwd: "Forgot Password",
    owner: "Owner",
  },
  "Español": {
    profile: "Perfil", personal: "Datos personales", business: "Datos del negocio",
    platform: "Sincronización", platformSub: "Canales conectados a tu asistente",
    display: "Pantalla", security: "Seguridad y biometría",
    edit: "Editar", save: "Guardar", cancel: "Cancelar",
    fullName: "Nombre completo", phone: "Teléfono", email: "Correo electrónico",
    businessName: "Nombre del negocio", whatsapp: "Número de WhatsApp",
    address: "Dirección", category: "Categoría",
    theme: "Modo oscuro / claro", themeSub: "Preferencia de tema",
    language: "Idioma", languageSub: "Idioma de la interfaz",
    face: "Verificación facial", faceSub: "Desbloquea con tu rostro",
    finger: "Inicio con huella", fingerSub: "Acceso rápido y seguro",
    changePwd: "Cambiar contraseña", forgotPwd: "Olvidé mi contraseña",
    owner: "Propietario",
  },
  "Français": {
    profile: "Profil", personal: "Informations personnelles", business: "Informations professionnelles",
    platform: "Synchronisation", platformSub: "Canaux connectés à votre assistant",
    display: "Affichage", security: "Sécurité & biométrie",
    edit: "Modifier", save: "Enregistrer", cancel: "Annuler",
    fullName: "Nom complet", phone: "Téléphone", email: "Adresse e-mail",
    businessName: "Nom de l'entreprise", whatsapp: "Numéro WhatsApp",
    address: "Adresse", category: "Catégorie",
    theme: "Mode sombre / clair", themeSub: "Préférence de thème",
    language: "Langue", languageSub: "Langue de l'interface",
    face: "Reconnaissance faciale", faceSub: "Déverrouillez avec votre visage",
    finger: "Empreinte digitale", fingerSub: "Connexion rapide et sûre",
    changePwd: "Changer le mot de passe", forgotPwd: "Mot de passe oublié",
    owner: "Propriétaire",
  },
  "Yoruba": {
    profile: "Profaili", personal: "Alaye ti ara ẹni", business: "Alaye iṣowo",
    platform: "Asopọ ohun elo", platformSub: "Awọn ikanni AI rẹ ti sopọ",
    display: "Iṣafihan", security: "Aabo ati biometiriki",
    edit: "Ṣatunṣe", save: "Fipamọ", cancel: "Fagilee",
    fullName: "Orukọ kikun", phone: "Nọmba foonu", email: "Adirẹsi imeeli",
    businessName: "Orukọ iṣowo", whatsapp: "Nọmba WhatsApp",
    address: "Adirẹsi", category: "Ẹka iṣowo",
    theme: "Dudu / Imọlẹ", themeSub: "Ààyò awọ",
    language: "Èdè", languageSub: "Èdè wiwo",
    face: "Ìmúdájú ojú", faceSub: "Ṣii pẹlu ojú rẹ",
    finger: "Ìka ìka", fingerSub: "Wiwọle yara, ailewu",
    changePwd: "Yi ọrọìgbáni padà", forgotPwd: "Gbàgbé ọrọìgbáni",
    owner: "Olówó",
  },
};
const LANGS = Object.keys(DICT);

// ---------- theme hook ----------
function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem("gs-theme") : null;
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = (v: boolean) => {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    try { localStorage.setItem("gs-theme", v ? "dark" : "light"); } catch {}
  };
  return [dark, toggle] as const;
}

function useLang() {
  const [lang, setLang] = useState<string>("English (US)");
  useEffect(() => {
    const s = typeof localStorage !== "undefined" ? localStorage.getItem("gs-lang") : null;
    if (s && DICT[s]) setLang(s);
  }, []);
  const set = (v: string) => {
    setLang(v);
    try { localStorage.setItem("gs-lang", v); } catch {}
  };
  return [lang, set] as const;
}

function Profile() {
  const [dark, setDark] = useTheme();
  const [lang, setLang] = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("gs-avatar");
      if (s) setAvatarUrl(s);
    } catch {}
  }, []);

  const handlePickAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setAvatarUrl(url);
      try { localStorage.setItem("gs-avatar", url); } catch {}
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const t = useMemo(() => DICT[lang] ?? DICT["English (US)"], [lang]);

  // edit modes per section
  const [editPersonal, setEditPersonal] = useState(false);
  const [editBusiness, setEditBusiness] = useState(false);

  // personal data
  const [personal, setPersonal] = useState({
    fullName: "John Adekunle",
    phoneDial: "+234",
    phoneNumber: "9040728892",
    email: "john@gosignal.app",
  });
  const [personalDraft, setPersonalDraft] = useState(personal);

  // business data
  const [business, setBusiness] = useState({
    businessName: "Go Signal Textiles",
    waDial: "+234",
    waNumber: "8123456701",
    address: "12 Adeniyi Jones, Ikeja, Lagos",
    category: "Fashion & Textiles",
  });
  const [businessDraft, setBusinessDraft] = useState(business);

  // biometrics
  const [faceId, setFaceId] = useState(true);
  const [fingerprint, setFingerprint] = useState(false);
  const [verifying, setVerifying] = useState<null | { kind: "face" | "finger"; phase: "running" | "success" }>(null);
  const verifyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (verifyTimer.current) clearTimeout(verifyTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const startVerify = (kind: "face" | "finger") => {
    setVerifying({ kind, phase: "running" });
    verifyTimer.current = setTimeout(() => {
      setVerifying({ kind, phase: "success" });
      if (kind === "face") setFaceId(true); else setFingerprint(true);
      closeTimer.current = setTimeout(() => setVerifying(null), 900);
    }, 1500);
  };

  const onFace = (v: boolean) => v ? startVerify("face") : setFaceId(false);
  const onFinger = (v: boolean) => v ? startVerify("finger") : setFingerprint(false);

  // platforms
  const [waOn, setWaOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);

  // channels & integration
  const [waConnected, setWaConnected] = useState(false);

  const savePersonal = () => { setPersonal(personalDraft); setEditPersonal(false); };
  const cancelPersonal = () => { setPersonalDraft(personal); setEditPersonal(false); };
  const saveBusiness = () => { setBusiness(businessDraft); setEditBusiness(false); };
  const cancelBusiness = () => { setBusinessDraft(business); setEditBusiness(false); };

  return (
    <MobileShell bottomNav={<AppBottomNav active="profile" autoHide />}>
      <div className="min-h-full flex flex-col">
        <div className="flex-1 px-5 pt-4 pb-6 animate-fade-up">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--brand-forest)] hover:bg-[var(--brand-forest)]/5 transition-premium"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <span className="text-sm font-bold text-[var(--brand-forest)]">{t.profile}</span>
            <span className="w-9" />
          </div>

          {/* Avatar */}
          <div className="mt-4 flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-br from-[var(--brand-lime)] to-[var(--brand-forest)] shadow-[0_12px_28px_-12px_rgba(0,77,64,0.5)]">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-amber-200 to-amber-500">
                  {avatarUrl && (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
              <button
                type="button"
                aria-label="Change profile photo"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0.5 right-0.5 w-8 h-8 rounded-full bg-[var(--brand-lime)] text-white inline-flex items-center justify-center shadow-md transition-premium hover:scale-110"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePickAvatar}
              />
            </div>
            <h1 className="mt-3 text-base font-extrabold text-[var(--brand-forest)]">{personal.fullName}</h1>
            <p className="text-xs text-[var(--brand-forest)]/60">{t.owner} · {business.businessName}</p>
          </div>

          {/* Personal details */}
          <SectionCard
            title={t.personal}
            editing={editPersonal}
            onEdit={() => { setPersonalDraft(personal); setEditPersonal(true); }}
            onSave={savePersonal}
            onCancel={cancelPersonal}
            tEdit={t.edit} tSave={t.save} tCancel={t.cancel}
          >
            {editPersonal ? (
              <>
                <Field label={t.fullName} icon={<User className="w-3.5 h-3.5" />}>
                  <TextInput
                    value={personalDraft.fullName}
                    onChange={(v) => setPersonalDraft({ ...personalDraft, fullName: v })}
                  />
                </Field>
                <Divider />
                <Field label={t.phone} icon={<Phone className="w-3.5 h-3.5" />}>
                  <PhoneInput
                    dial={personalDraft.phoneDial}
                    number={personalDraft.phoneNumber}
                    onChange={(v) => setPersonalDraft({ ...personalDraft, phoneDial: v.dial, phoneNumber: v.number })}
                  />
                </Field>
                <Divider />
                <Field label={t.email} icon={<Mail className="w-3.5 h-3.5" />}>
                  <TextInput
                    value={personalDraft.email}
                    onChange={(v) => setPersonalDraft({ ...personalDraft, email: v })}
                    type="email"
                  />
                </Field>
              </>
            ) : (
              <>
                <ReadRow icon={<User className="w-4 h-4" />} label={t.fullName} value={personal.fullName} />
                <Divider />
                <ReadRow icon={<Phone className="w-4 h-4" />} label={t.phone} value={`${personal.phoneDial} ${personal.phoneNumber}`} />
                <Divider />
                <ReadRow icon={<Mail className="w-4 h-4" />} label={t.email} value={personal.email} />
              </>
            )}
          </SectionCard>

          {/* Business details */}
          <SectionCard
            title={t.business}
            editing={editBusiness}
            onEdit={() => { setBusinessDraft(business); setEditBusiness(true); }}
            onSave={saveBusiness}
            onCancel={cancelBusiness}
            tEdit={t.edit} tSave={t.save} tCancel={t.cancel}
          >
            {editBusiness ? (
              <>
                <Field label={t.businessName} icon={<Building2 className="w-3.5 h-3.5" />}>
                  <TextInput
                    value={businessDraft.businessName}
                    onChange={(v) => setBusinessDraft({ ...businessDraft, businessName: v })}
                  />
                </Field>
                <Divider />
                <Field label={t.whatsapp} icon={<MessageCircle className="w-3.5 h-3.5" />}>
                  <PhoneInput
                    dial={businessDraft.waDial}
                    number={businessDraft.waNumber}
                    onChange={(v) => setBusinessDraft({ ...businessDraft, waDial: v.dial, waNumber: v.number })}
                  />
                </Field>
                <Divider />
                <Field label={t.address} icon={<MapPin className="w-3.5 h-3.5" />}>
                  <TextInput
                    value={businessDraft.address}
                    onChange={(v) => setBusinessDraft({ ...businessDraft, address: v })}
                  />
                </Field>
                <Divider />
                <Field label={t.category} icon={<Tag className="w-3.5 h-3.5" />}>
                  <TextInput
                    value={businessDraft.category}
                    onChange={(v) => setBusinessDraft({ ...businessDraft, category: v })}
                  />
                </Field>
              </>
            ) : (
              <>
                <ReadRow icon={<Building2 className="w-4 h-4" />} label={t.businessName} value={business.businessName} />
                <Divider />
                <ReadRow icon={<MessageCircle className="w-4 h-4" />} label={t.whatsapp} value={`${business.waDial} ${business.waNumber}`} />
                <Divider />
                <ReadRow icon={<MapPin className="w-4 h-4" />} label={t.address} value={business.address} />
                <Divider />
                <ReadRow icon={<Tag className="w-4 h-4" />} label={t.category} value={business.category} />
              </>
            )}
          </SectionCard>

          {/* Platform sync */}
          <SectionCard title={t.platform} subtitle={t.platformSub}>
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
          <SectionCard title={t.display}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconBubble>{dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}</IconBubble>
                <div>
                  <div className="text-sm font-bold text-[var(--brand-forest)]">{t.theme}</div>
                  <div className="text-[11px] text-[var(--brand-forest)]/60">{dark ? "Dark" : "Light"} · {t.themeSub}</div>
                </div>
              </div>
              <Toggle on={dark} onChange={setDark} />
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IconBubble><Languages className="w-4 h-4" /></IconBubble>
                <div>
                  <div className="text-sm font-bold text-[var(--brand-forest)]">{t.language}</div>
                  <div className="text-[11px] text-[var(--brand-forest)]/60">{t.languageSub}</div>
                </div>
              </div>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="h-10 rounded-xl bg-[var(--surface)] border border-[var(--brand-forest)]/10 px-3 text-xs font-semibold text-[var(--brand-forest)] outline-none focus:border-[var(--brand-lime)] transition-premium"
              >
                {LANGS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </SectionCard>

          {/* Security */}
          <SectionCard title={t.security}>
            <BiometricRow
              icon={<ScanFace className="w-4 h-4" />}
              name={t.face} sub={t.faceSub}
              on={faceId} onChange={onFace}
            />
            <Divider />
            <BiometricRow
              icon={<Fingerprint className="w-4 h-4" />}
              name={t.finger} sub={t.fingerSub}
              on={fingerprint} onChange={onFinger}
            />
            <Divider />
            <Link
              to="/password-management"
              className="w-full flex items-center justify-between py-1 transition-premium hover:translate-x-0.5"
            >
              <div className="flex items-center gap-3">
                <IconBubble><KeyRound className="w-4 h-4" /></IconBubble>
                <div className="text-sm font-bold text-[var(--brand-forest)] text-left">{t.changePwd}</div>
              </div>
              <ChevronLeft className="w-4 h-4 rotate-180 text-[var(--brand-forest)]/40" />
            </Link>
            <Divider />
            <Link
              to="/password-management"
              className="w-full flex items-center justify-between py-1 transition-premium hover:translate-x-0.5"
            >
              <div className="flex items-center gap-3">
                <IconBubble><LifeBuoy className="w-4 h-4" /></IconBubble>
                <div className="text-sm font-bold text-[var(--brand-forest)] text-left">{t.forgotPwd}</div>
              </div>
              <ChevronLeft className="w-4 h-4 rotate-180 text-[var(--brand-forest)]/40" />
            </Link>
          </SectionCard>

          {/* Channels & Integration */}
          <SectionCard title="Channels & Integration" subtitle="Link your communication lines">
            {/* WhatsApp Integration */}
            <Link
              to="/whatsapp-link"
              className="w-full flex items-center justify-between py-1 transition-premium hover:translate-x-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] inline-flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-[var(--brand-forest)]">WhatsApp Integration</div>
                  <div className="text-[11px] text-[var(--brand-forest)]/60">Business messaging & catalog</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {waConnected ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--brand-lime)] bg-[var(--brand-lime)]/15 px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[var(--brand-forest)]/50 bg-[var(--brand-forest)]/5 px-2 py-1 rounded-full">
                    Not Connected
                  </span>
                )}
                <ChevronLeft className="w-4 h-4 rotate-180 text-[var(--brand-forest)]/40" />
              </div>
            </Link>
            <Divider />
            {/* Inbound Voice Routing */}
            <div className="rounded-xl bg-[var(--canvas)] border border-[var(--brand-forest)]/10 dark:border-white/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <PhoneCall className="w-4 h-4 text-[var(--brand-forest)]" />
                <div className="text-sm font-bold text-[var(--brand-forest)]">Inbound Voice Routing</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[var(--brand-forest)]/70">System Gateway Number</div>
                  <div className="text-sm font-extrabold text-[var(--brand-forest)]">+234 700-GO-SIGNAL</div>
                </div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText("+2347004674453")}
                  className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--brand-forest)]/10 inline-flex items-center justify-center text-[var(--brand-forest)]/60 hover:text-[var(--brand-forest)] transition-premium"
                  aria-label="Copy gateway number"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 flex items-start gap-2 rounded-lg bg-[var(--brand-forest)]/5 px-3 py-2">
                <Info className="w-3.5 h-3.5 text-[var(--brand-forest)]/50 mt-0.5 shrink-0" />
                <p className="text-[11px] text-[var(--brand-forest)]/60 leading-relaxed">
                  Your incoming phone calls are automatically routed securely to your account profile using your registered mobile Caller ID mapping.
                </p>
              </div>
            </div>
          </SectionCard>

        </div>
      </div>

      {/* Biometric verification modal */}
      {verifying && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-up">
          <div className="w-72 rounded-3xl bg-[var(--surface)] p-6 text-center shadow-2xl border border-[var(--brand-forest)]/10 dark:border-white/10">
            <div className="mx-auto w-16 h-16 rounded-full bg-[var(--brand-forest)]/5 inline-flex items-center justify-center mb-3">
              {verifying.phase === "running" ? (
                <Loader2 className="w-8 h-8 text-[var(--brand-forest)] animate-spin" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-[var(--brand-lime)]" />
              )}
            </div>
            <div className="text-base font-extrabold text-[var(--brand-forest)]">
              {verifying.phase === "running" ? "Verifying Identity…" : "Verified"}
            </div>
            <p className="mt-1 text-xs text-[var(--brand-forest)]/65">
              {verifying.kind === "face" ? "Hold steady — scanning your face." : "Press your registered finger on the sensor."}
            </p>
            {verifying.phase === "success" && (
              <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--brand-lime)] bg-[var(--brand-lime)]/10 px-2.5 py-1 rounded-full">
                <Check className="w-3 h-3" /> Active
              </div>
            )}
          </div>
        </div>
      )}
    </MobileShell>
  );
}

// ---------- subcomponents ----------

function SectionCard({
  title, subtitle, editing, onEdit, onSave, onCancel, tEdit, tSave, tCancel, children,
}: {
  title: string; subtitle?: string;
  editing?: boolean;
  onEdit?: () => void; onSave?: () => void; onCancel?: () => void;
  tEdit?: string; tSave?: string; tCancel?: string;
  children: React.ReactNode;
}) {
  const editable = !!onEdit;
  return (
    <div className="mt-5 rounded-2xl glass border border-white/40 p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-bold text-[var(--brand-forest)]">{title}</div>
          {subtitle && <div className="text-[11px] text-[var(--brand-forest)]/55">{subtitle}</div>}
        </div>
        {editable && (
          editing ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button" onClick={onCancel}
                className="text-[11px] font-semibold text-[var(--brand-forest)]/60 px-2 py-1 rounded-lg hover:bg-[var(--brand-forest)]/5 transition-premium"
              >
                {tCancel}
              </button>
              <button
                type="button" onClick={onSave}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[var(--brand-lime)] hover:bg-[#7cb342] px-2.5 py-1 rounded-lg transition-premium"
              >
                <Check className="w-3 h-3" /> {tSave}
              </button>
            </div>
          ) : (
            <button
              type="button" onClick={onEdit}
              className="text-[11px] font-semibold text-[var(--brand-lime)] hover:text-[#5a8a2a] transition-premium"
            >
              {tEdit}
            </button>
          )
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ReadRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-forest)]/50">
        {icon} {label}
      </div>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, type = "text" }: { value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-11 rounded-xl bg-[var(--surface)] border border-[var(--brand-forest)]/10 px-3 text-sm font-semibold text-[var(--brand-forest)] outline-none focus:border-[var(--brand-lime)] focus:ring-2 focus:ring-[var(--brand-lime)]/20 transition-premium"
    />
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
  return <div className="h-px bg-[var(--brand-forest)]/10" />;
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

function BiometricRow({
  icon, name, sub, on, onChange,
}: { icon: React.ReactNode; name: string; sub: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <IconBubble>{icon}</IconBubble>
        <div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-bold text-[var(--brand-forest)]">{name}</div>
            {on && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--brand-lime)] bg-[var(--brand-lime)]/15 px-1.5 py-0.5 rounded-full">
                <Check className="w-2.5 h-2.5" /> Active
              </span>
            )}
          </div>
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
      type="button" role="switch" aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative w-12 h-7 rounded-full transition-premium ${on ? "bg-[var(--brand-lime)]" : "bg-[var(--brand-forest)]/20"}`}
    >
      <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-premium ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}


/* ─── WhatsApp inline icon ─── */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.36-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

