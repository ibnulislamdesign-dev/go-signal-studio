import { defineMcp } from "@lovable.dev/mcp-js";
import listNotifications from "./tools/list-notifications";
import listTraffic from "./tools/list-traffic";
import getTranscript from "./tools/get-transcript";

export default defineMcp({
  name: "go-signal-mcp",
  title: "Go Signal MCP",
  version: "0.1.0",
  instructions:
    "Tools for the Go Signal AI phone-assistant app. Use `list_notifications` to see recent alerts (AI summaries, WhatsApp, missed calls, billing), `list_traffic` to inspect call/message logs, and `get_call_transcript` to pull the full AI/caller transcript for a specific log id.",
  tools: [listNotifications, listTraffic, getTranscript],
});