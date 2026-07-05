import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notifications } from "@/lib/notifications";

export default defineTool({
  name: "list_notifications",
  title: "List notifications",
  description: "List recent Go Signal notifications (AI summaries, WhatsApp activity, missed calls, billing, system).",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Max notifications to return (default 10)."),
    unreadOnly: z.boolean().optional().describe("If true, only return unread notifications."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ limit, unreadOnly }) => {
    const filtered = unreadOnly ? notifications.filter((n) => n.unread) : notifications;
    const sliced = filtered.slice(0, limit ?? 10);
    return {
      content: [{ type: "text", text: JSON.stringify(sliced, null, 2) }],
      structuredContent: { items: sliced, total: filtered.length },
    };
  },
});