import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY; 
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key missing on backend." }, { status: 500 });
    }

    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt value string." }, { status: 400 });
    }

    // Connect directly to Google's free developer endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert SaaS platform product architect. Analyze this prompt and generate an MVP board. Return ONLY a raw JSON object matching your standard layout structure: ${prompt}`
          }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Google AI Studio Error:", errText);
      return NextResponse.json({ error: "Google AI engine rejected request.", details: errText }, { status: response.status });
    }

    const aiPayload = await response.json();
    const rawJsonText = aiPayload.candidates[0].content.parts[0].text;
    const cleanConfigData = JSON.parse(rawJsonText);

    return NextResponse.json(cleanConfigData);

  } catch (crashException: any) {
    console.error("❌ Runtime Exception:", crashException);
    return NextResponse.json({ error: "Internal Server Error", details: crashException.message }, { status: 500 });
  }
}