
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }

  // Add a system prompt for health domain restriction
  const systemPrompt = {
    text: "You are a helpful assistant that only answers health-related questions. If the question is not about health, politely refuse to answer."
  };

  // Map messages to Gemini's 'parts' format (use only user messages for simplicity)
  const userParts = messages
    .filter((m: any) => m.role === "user")
    .map((m: any) => ({ text: m.content }));

  const body = {
    contents: [
      {
        parts: [systemPrompt, ...userParts.length > 0 ? userParts : [{ text: "Hello!" }]],
      },
    ],
  };

  try {
    const apiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY || "",
        },
        body: JSON.stringify(body),
      }
    );

    if (!apiRes.ok) {
      const error = await apiRes.text();
      return NextResponse.json({ error }, { status: apiRes.status });
    }

    const data = await apiRes.json();
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";
    return NextResponse.json({ answer });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
