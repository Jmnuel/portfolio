import Anthropic from "@anthropic-ai/sdk";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chatPrompt";

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = "claude-opus-5-5";
const MAX_MESSAGES = 12; // most recent turns sent to the model
const MAX_CHARS = 800; // per visitor message
const RATE_LIMIT = 15; // messages per visitor per window
const RATE_WINDOW_MS = 10 * 60 * 1000;

// Best-effort, per-instance limiter. The real spend cap is the Anthropic Console limit.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

function parseMessages(body: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    const role = (m as { role?: unknown })?.role;
    const content = (m as { content?: unknown })?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, role === "user" ? MAX_CHARS : 4000);
    if (!text) return null;
    messages.push({ role, content: text });
  }
  // The conversation must start with the visitor and end with their newest question.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

const json = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return json(503, "not_configured");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return json(429, "rate_limited");

  let messages: Anthropic.Beta.BetaMessageParam[] | null = null;
  try {
    messages = parseMessages(await req.json());
  } catch {}
  if (!messages) return json(400, "bad_request");

  const client = new Anthropic();
  const stream = client.beta.messages.stream(
    {
      model: MODEL,
      // Answers are a few sentences; the cap also bounds cost per message.
      max_tokens: 2048,
      output_config: { effort: "low" },
      // Re-runs the request on Anthropic's recommended model if a safety classifier declines it.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [{ type: "text", text: CHAT_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages,
    },
    { signal: req.signal },
  );

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      stream.on("text", (delta) => controller.enqueue(encoder.encode(delta)));
      try {
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\nSorry, I can't help with that one. Try asking about Manuel's projects or skills."));
        } else if (final.stop_reason === "max_tokens") {
          controller.enqueue(encoder.encode("…"));
        }
      } catch (error) {
        let note = "Sorry, something went wrong. Please try again in a moment.";
        if (error instanceof Anthropic.RateLimitError) note = "The assistant is busy right now. Please try again in a minute.";
        else if (error instanceof Anthropic.AuthenticationError) note = "The assistant isn't set up correctly yet.";
        else if (error instanceof Anthropic.APIUserAbortError) return controller.close();
        console.error("chat error", error instanceof Anthropic.APIError ? `${error.status} ${error.message}` : error);
        controller.enqueue(encoder.encode(note));
      }
      controller.close();
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
