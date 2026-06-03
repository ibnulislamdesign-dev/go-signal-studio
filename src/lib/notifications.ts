export type Notification = {
  id: string;
  title: string;
  preview: string;
  body: string;
  time: string;
  category: "AI Assistant" | "System Update" | "Billing" | "Customer";
  priority: "high" | "medium" | "low";
  unread: boolean;
  link?: { to: string; label: string };
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "AI Assistant summary ready",
    preview: "AI Assistant successfully summarized yesterday's sales.",
    body: "Your AI phone assistant has compiled a full summary of yesterday's 47 customer interactions across calls and WhatsApp. Total confirmed orders: 12. Pending payments: 3. Most-asked product: Shadda fabric (royal blue). Tap to view the detailed report inside your insights dashboard.",
    time: "Today · 8:02 AM",
    category: "AI Assistant",
    unread: true,
    priority: "medium",
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
    link: { to: "/traffic/l3", label: "View conversation" },
  },
  {
    id: "n4",
    title: "Trial reminder",
    preview: "Your 14-day free trial ends on June 13th.",
    body: "You have 9 days remaining on your Go Signal free trial. Subscribe to the Monthly or Annual plan now to keep your AI phone assistant online and your live traffic logs flowing without interruption.",
    time: "Yesterday · 9:30 PM",
    category: "Billing",
    unread: false,
    priority: "high",
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
    link: { to: "/traffic", label: "View all traffic" },
  },
];
