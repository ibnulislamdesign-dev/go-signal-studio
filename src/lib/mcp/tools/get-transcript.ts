import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { TRAFFIC } from "@/lib/traffic";

export default defineTool({
  name: "get_call_transcript",
  title: "Get call transcript",
  description: "Fetch the full AI/caller transcript for a specific traffic log by id (e.g. 'l1').",
  inputSchema: {
    id: z.string().min(1).describe("Traffic log id, e.g. 'l1'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const log = TRAFFIC.find((t) => t.id === id);
    if (!log) {
      return { content: [{ type: "text", text: `No traffic log found with id "${id}".` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(log, null, 2) }],
      structuredContent: { log },
    };
  },
});