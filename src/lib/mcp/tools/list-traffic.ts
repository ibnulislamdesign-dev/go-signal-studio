import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { TRAFFIC } from "@/lib/traffic";

export default defineTool({
  name: "list_traffic",
  title: "List call & message traffic",
  description: "List recent Go Signal traffic logs (live calls, WhatsApp threads, missed calls) with status and summaries.",
  inputSchema: {
    channel: z.enum(["call", "whatsapp", "missed"]).optional().describe("Filter by channel."),
    status: z.enum(["Query", "Pending", "Booked", "Closed"]).optional().describe("Filter by status."),
    liveOnly: z.boolean().optional().describe("If true, only return conversations currently live."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ channel, status, liveOnly }) => {
    const items = TRAFFIC.filter(
      (t) =>
        (!channel || t.channel === channel) &&
        (!status || t.status === status) &&
        (!liveOnly || t.live),
    ).map(({ transcript: _t, ...rest }) => rest);
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items, total: items.length },
    };
  },
});