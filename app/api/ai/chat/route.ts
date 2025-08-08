import { NextRequest } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { groq } from "@ai-sdk/groq"

// Note: Do not export `runtime = 'edge'` with the AI SDK in this project.

type ChatMessage = { role: "system" | "user" | "assistant"; content: string }

function toPrompt(messages: ChatMessage[]): { system?: string; prompt: string } {
  let system: string | undefined
  const lines: string[] = []
  for (const m of messages) {
    if (m.role === "system") system = m.content
    else if (m.role === "user") lines.push(`User: ${m.content}`)
    else lines.push(`Assistant: ${m.content}`)
  }
  return { system, prompt: lines.join("\n") }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const messages: ChatMessage[] =
      body?.messages || [{ role: "user", content: String(body?.prompt || "") }]
    const provider: "xai" | "groq" = (body?.provider as "xai" | "groq") || "xai"

    const { system, prompt } = toPrompt(messages)

    const model = provider === "groq" ? groq("llama-3.1-70b-versatile") : xai("grok-3")

    const { text } = await generateText({
      model,
      system:
        system ||
        "You are Legal Eagle, a careful, helpful legal copilot. Be concise and include a short disclaimer that this is not legal advice.",
      prompt,
    })

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  } catch (err: any) {
    console.error("AI chat error:", err)
    return new Response(
      JSON.stringify({ error: "AI chat failed", details: err?.message || String(err) }),
      { status: 500, headers: { "content-type": "application/json" } },
    )
  }
}
