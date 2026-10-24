import { ApiError, FinishReason, GoogleGenAI, ThinkingLevel, type Content } from "@google/genai";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chatPrompt";

export const runtime = "nodejs";
export const maxDuration = 30;

// Free-tier Gemini model (Google AI Studio). Free-tier prompts may be used by Google to
// improve its products, which is fine here: the assistant only sees public portfolio info.
const MODEL = "gemini-3.8-flash";
const MAX_MESSAGES = 12; // most recent turns sent to the model
const MAX_CHARS = 800; // per visitor message
const RATE_LIMIT = 15; // messages per visitor per window
const RATE_WINDOW_MS = 10 * 60 * 1000;

// Best-effort, per-instance limiter that keeps one visitor from using up the free daily quota.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

function parseMessages(body: unknown): Content[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const contents: Content[] = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    const role = (m as { role?: unknown })?.role;
    const content = (m as { content?: unknown })?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, role === "user" ? MAX_CHARS : 4000);
    if (!text) return null;
    contents.push({ role: role === "user" ? "user" : "model", parts: [{ text }] });
  }
  // The conversation must start with the visitor and end with their newest question.
  while (contents.length && contents[0].role !== "user") contents.shift();
  if (!contents.length || contents[contents.length - 1].role !== "user") return null;
  return contents;
}

const json = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json(503, "not_configured");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return json(429, "rate_limited");

  let contents: Content[] | null = null;
  try {
    contents = parseMessages(await req.json());
  } catch {}
  if (!contents) return json(400, "bad_request");

  const ai = new GoogleGenAI({ apiKey });
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = await ai.models.generateContentStream({
          model: MODEL,
          contents,
          config: {
            systemInstruction: CHAT_SYSTEM_PROMPT,
            // Answers are a few sentences; the cap also leaves room for thinking.
            maxOutputTokens: 2048,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            abortSignal: req.signal,
          },
        });
        let finish: FinishReason | undefined;
        for await (const chunk of stream) {
          if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
          finish = chunk.candidates?.[0]?.finishReason ?? finish;
        }
        if (finish === FinishReason.SAFETY || finish === FinishReason.PROHIBITED_CONTENT) {
          controller.enqueue(encoder.encode("\n\nSorry, I can't help with that one. Try asking about Manuel's projects or skills."));
        } else if (finish === FinishReason.MAX_TOKENS) {
          controller.enqueue(encoder.encode("…"));
        }
      } catch (error) {
        if (req.signal.aborted) return controller.close();
        let note = "Sorry, something went wrong. Please try again in a moment.";
        if (error instanceof ApiError && error.status === 429) note = "The assistant has reached its free limit for now. Please try again later.";
        else if (error instanceof ApiError && (error.status === 400 || error.status === 403)) note = "The assistant isn't set up correctly yet.";
        console.error("chat error", error instanceof ApiError ? `${error.status} ${error.message}` : error);
        controller.enqueue(encoder.encode(note));
      }
      controller.close();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
