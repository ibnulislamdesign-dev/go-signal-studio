export type TrafficStatus = "Query" | "Pending" | "Booked" | "Closed";
export type TrafficChannel = "call" | "whatsapp" | "missed";

export type TranscriptLine = { speaker: "AI" | "Caller"; text: string; t: string };

export type TrafficLog = {
  id: string;
  channel: TrafficChannel;
  number: string;
  customer?: string;
  summary: string;
  status: TrafficStatus;
  time: string;
  live: boolean;
  durationSec?: number;
  transcript: TranscriptLine[];
};

export const TRAFFIC: TrafficLog[] = [
  {
    id: "l1",
    channel: "call",
    number: "09040728892",
    customer: "Amaka O.",
    summary: "Asked about Shadda fabric royal blue availability",
    status: "Query",
    time: "Live · 2m 11s",
    live: true,
    durationSec: 131,
    transcript: [
      { speaker: "AI", text: "Hello, welcome to Go Signal Textiles. How can I help you today?", t: "0:02" },
      { speaker: "Caller", text: "Hi, do you have the Shadda fabric in royal blue?", t: "0:08" },
      { speaker: "AI", text: "Yes, we currently have 14 yards of royal blue Shadda in stock.", t: "0:14" },
      { speaker: "Caller", text: "Great. How much per yard?", t: "0:22" },
      { speaker: "AI", text: "Royal blue Shadda is ₦12,500 per yard. Bulk orders above 10 yards get a 7% discount.", t: "0:28" },
    ],
  },
  {
    id: "l2",
    channel: "call",
    number: "08123456701",
    customer: "Tunde A.",
    summary: "Order: 2 yards Aso-Oke, awaiting transfer confirmation",
    status: "Pending",
    time: "11m ago",
    live: false,
    transcript: [
      { speaker: "Caller", text: "I want to order 2 yards of Aso-Oke.", t: "0:02" },
      { speaker: "AI", text: "Sure. Cream or gold trim?", t: "0:06" },
      { speaker: "Caller", text: "Gold trim please.", t: "0:09" },
      { speaker: "AI", text: "Total comes to ₦18,000. I'll send our transfer details by SMS now.", t: "0:13" },
      { speaker: "Caller", text: "Okay, I'll send it shortly.", t: "0:20" },
    ],
  },
  {
    id: "l3",
    channel: "whatsapp",
    number: "07033445566",
    customer: "Bisi K.",
    summary: "Consultation booked for Friday 2:00 PM",
    status: "Booked",
    time: "23m ago",
    live: false,
    transcript: [
      { speaker: "Caller", text: "Can I book a consultation this week?", t: "—" },
      { speaker: "AI", text: "Of course. Friday 2:00 PM works. Shall I lock it in?", t: "—" },
      { speaker: "Caller", text: "Yes please.", t: "—" },
      { speaker: "AI", text: "Booked. You'll receive a reminder 1 hour before.", t: "—" },
    ],
  },
  {
    id: "l4",
    channel: "call",
    number: "08098765432",
    customer: "Ngozi I.",
    summary: "Shea butter 500g stock query — restock Friday",
    status: "Closed",
    time: "41m ago",
    live: false,
    transcript: [
      { speaker: "Caller", text: "Do you still have the 500g shea butter jar?", t: "0:03" },
      { speaker: "AI", text: "Currently out of stock. New batch arrives Friday morning.", t: "0:08" },
      { speaker: "Caller", text: "Okay, I'll check back. Thank you.", t: "0:14" },
    ],
  },
];

export function findTraffic(id: string) {
  return TRAFFIC.find((t) => t.id === id);
}