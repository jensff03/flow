import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { meldinger, kontekst } = await req.json();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: kontekst,
      messages: meldinger.map((m: { rolle: string; tekst: string }) => ({
        role: m.rolle === "bruker" ? "user" : "assistant",
        content: m.tekst,
      })),
    }),
  });

  const data = await response.json();
  console.log("API SVAR:", JSON.stringify(data));
  
  const svar = data.content?.[0]?.text ?? "Beklager, noe gikk galt.";
  return NextResponse.json({ svar });
}
