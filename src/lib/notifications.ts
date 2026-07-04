import { useSyncExternalStore } from "react";

export type NotificationType = "chat" | "system" | "complaint" | "billing";

export type Notification = {
  id: string;
  title: string;
  preview: string;
  body: string;
  time: string;
  category: "AI Assistant" | "System Update" | "Billing" | "Customer";
  priority: "high" | "medium" | "low";
  unread: boolean;
  type: NotificationType;
  targetId: string;
  /** Optional index of the specific message within a chat thread */
  messageIndex?: number;
  link?: { to: string; label: string };
};

const INITIAL: Notification[] = [
  {
    id: "n1",
    title: "AI Assistant summary ready",
    preview: "AI Assistant successfully summarized yesterday's sales.",
    body: "Your AI phone assistant just closed the books on yesterday's activity across every channel. Highlights: 47 customer interactions handled end-to-end, 12 confirmed orders totalling ₦186,400, 3 payments still pending, and 4 hot leads flagged for personal follow-up. Your top-asked product was Shadda fabric in royal blue (mentioned in 9 conversations) — worth restocking before Friday. Average response time held steady at 1.8 seconds, and 96% of customers received an answer without your involvement. Open the AI Assistant to walk through the flagged threads, edit the auto-drafted replies, and lock in today's priority list before 10am.",
    time: "Today · 8:02 AM",
    category: "AI Assistant",
    unread: true,
    priority: "medium",
    type: "system",
    targetId: "n1",
    link: { to: "/dashboard", label: "Open dashboard" },
  },
  {
    id: "n2",
    title: "System Update",
    preview: "New regional textile tags added to your catalog.",
    body: "We've added 14 new regional textile tags (Aso-Oke, Adire, Akwete, Ankara variants, and more) so your AI assistant can recognise and respond to local product names with higher accuracy. No action needed — your store is already updated.",
    time: "Today · 7:15 AM",
    category: "System Update",
    unread: true,
    priority: "low",
    type: "system",
    targetId: "n2",
    link: { to: "/profile", label: "Open profile" },
  },
  {
    id: "n3",
    title: "New booking via WhatsApp",
    preview: "07033445566 booked a consultation for Friday 2:00 PM.",
    body: "A new consultation booking was locked in over WhatsApp by 07033445566 for Friday at 2:00 PM. The customer asked about bulk Shea butter pricing. A confirmation message has been sent automatically and the slot is now marked in your calendar.",
    time: "Today · 6:48 AM",
    category: "Customer",
    unread: true,
    priority: "high",
    type: "chat",
    targetId: "l3",
    messageIndex: 3,
    link: { to: "/traffic/l3", label: "View conversation" },
  },
  {
    id: "n4",
    title: "Trial reminder",
    preview: "Your 14-day free trial ends on June 13th.",
    body: "Your 14-day Go Signal free trial ends in 9 days (June 13th). Once it lapses, your AI phone assistant goes offline, inbound calls fall back to voicemail, and WhatsApp auto-replies pause — every one of the 1,240 monthly interactions your assistant handles will land back on your plate. Lock in the Annual plan today to save ₦12,000 versus monthly billing, keep every live traffic log flowing, and unlock priority support plus the new revenue forecasting dashboard. Complete your subscription in under 60 seconds — your card is never charged during trial.",
    time: "Yesterday · 9:30 PM",
    category: "Billing",
    unread: false,
    priority: "high",
    type: "billing",
    targetId: "n4",
    link: { to: "/subscription", label: "Manage subscription" },
  },
  {
    id: "n5",
    title: "Missed call recovered",
    preview: "AI Assistant followed up with 08098765432 after missed call.",
    body: "A missed call from 08098765432 was automatically followed up by your AI assistant within 30 seconds. The customer was asking about Shea Butter stock availability — the interaction is now closed and logged.",
    time: "Yesterday · 4:12 PM",
    category: "AI Assistant",
    unread: false,
    priority: "medium",
    type: "chat",
    targetId: "l4",
    messageIndex: 1,
    link: { to: "/traffic/l4", label: "Open traffic log" },
  },
  {
    id: "n6",
    title: "Weekly performance digest",
    preview: "1,240 calls handled this week — up 18% from last week.",
    body: "Your assistant handled 1,240 total customer interactions this week, up 18% from the previous week. Average response time stayed under 2 seconds. Top traffic window: Wednesday 11:00 AM – 1:00 PM.",
    time: "Mon · 8:00 AM",
    category: "AI Assistant",
    unread: false,
    priority: "low",
    type: "system",
    targetId: "n6",
    link: { to: "/traffic", label: "View all traffic" },
  },
  {
    id: "n7",
    title: "System API disconnected",
    preview: "WhatsApp Business sync paused — reconnect required.",
    body: "Your WhatsApp Business API connection was interrupted at 7:42 AM. New inbound messages are temporarily queued and your AI assistant cannot reply on that channel until the integration is reconnected. Open Profile › Platform Sync to re-authenticate the integration in one tap.",
    time: "Today · 7:42 AM",
    category: "System Update",
    unread: true,
    priority: "high",
    type: "complaint",
    targetId: "n7",
    link: { to: "/profile", label: "Reconnect WhatsApp" },
  },
  {
    id: "n8",
    title: "Daily triage report ready",
    preview: "AI ranked 18 conversations by urgency for your morning review.",
    body: "Your AI assistant has finished ranking today's 18 open threads by urgency, revenue potential, and customer sentiment. 4 threads are marked high-priority and need your input before 12:00 PM. Tap to open the assistant and walk through the triage list.",
    time: "Today · 6:05 AM",
    category: "AI Assistant",
    unread: true,
    priority: "high",
    type: "system",
    targetId: "n8",
    link: { to: "/assistant", label: "Open AI Assistant" },
  },
  {
    id: "n9",
    title: "Customer chat pending reply",
    preview: "08123456701 is waiting on a WhatsApp reply about Ankara bulk order.",
    body: "A WhatsApp customer (08123456701) has been waiting 12 minutes for a reply on their Ankara bulk order enquiry (25 yards, mixed prints). Your AI assistant suggested a draft response. Open the thread to review, edit, and send.",
    time: "Today · 9:24 AM",
    category: "Customer",
    unread: true,
    priority: "high",
    type: "chat",
    targetId: "l3",
    link: { to: "/traffic/l3", label: "Reply on WhatsApp" },
  },
  {
    id: "n10",
    title: "API connection stable",
    preview: "All channels (Voice, WhatsApp, SMS) reporting healthy uptime.",
    body: "System health check completed. Voice gateway, WhatsApp Business, and SMS relay all report 99.98% uptime over the last 24 hours. No action required — everything is running smoothly.",
    time: "Today · 5:00 AM",
    category: "System Update",
    unread: false,
    priority: "low",
    type: "system",
    targetId: "n10",
    link: { to: "/dashboard", label: "View dashboard" },
  },
  {
    id: "n11",
    title: "Subscription renewed",
    preview: "Your Annual Pro plan renewed successfully — ₦48,000 charged.",
    body: "Your Go Signal Annual Pro subscription has renewed successfully. ₦48,000 was charged to your card ending in 4421. Your next renewal date is July 2, 2027. A receipt has been emailed to john@gosignal.app.",
    time: "Yesterday · 11:02 PM",
    category: "Billing",
    unread: false,
    priority: "low",
    type: "billing",
    targetId: "n11",
    link: { to: "/subscription", label: "Manage subscription" },
  },
  {
    id: "n12",
    title: "Voice message transcribed",
    preview: "07011223344 left a 42-second voice note — transcript ready.",
    body: "Customer 07011223344 left a 42-second voice message while your line was busy. Full AI transcript: 'Good afternoon, this is Bola. I'd like to reorder 6 yards of the navy Shadda I bought last month — same quality. Also, can you confirm delivery to Wuse 2, Abuja by Friday? Please call me back today, I'm ready to pay on confirmation.' Sentiment: positive, high purchase intent. Estimated order value: ₦21,600. Recommended action: initiate a callback now while the intent is warm — customers who receive a callback within 2 hours of leaving a voice note convert at 74%.",
    time: "Today · 10:15 AM",
    category: "AI Assistant",
    unread: true,
    priority: "medium",
    type: "chat",
    targetId: "l4",
    link: { to: "/traffic/l4", label: "Open traffic log" },
  },
];

let state: Notification[] = INITIAL.map((n) => ({ ...n }));
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const NOTIFICATIONS = state;

function getSnapshot() {
  return state;
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function markRead(id: string) {
  let changed = false;
  state = state.map((n) => {
    if (n.id === id && n.unread) {
      changed = true;
      return { ...n, unread: false };
    }
    return n;
  });
  if (changed) emit();
}

export function findNotification(id: string) {
  return state.find((n) => n.id === id);
}

export function useNotifications() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useUnreadCount() {
  return useNotifications().filter((n) => n.unread).length;
}
