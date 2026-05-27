import { NextResponse } from "next/server";

// Using standard serverless function instead of Edge to guarantee environment variables load perfectly
export const runtime = "nodejs"; 

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY; 
    if (!apiKey) {
      console.error("❌ Key verification failed: OPENROUTER_API_KEY is missing.");
      return NextResponse.json({ error: "Gemini API key missing on backend settings." }, { status: 500 });
    }

    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt value string." }, { status: 400 });
    }

    // Standard production endpoint for Gemini 1.5 Flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert SaaS platform product architect. Analyze this prompt and generate an MVP board layout config. Return ONLY a raw JSON object matching your standard layout structure, do not include markdown code block syntax: ${prompt}`
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Google AI Studio Engine Error:", errText);
      return NextResponse.json({ error: "Google AI engine rejected request.", details: errText }, { status: response.status });
    }

    const aiPayload = await response.json();
    
    if (!aiPayload.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("❌ Unexpected Payload shape from Google:", JSON.stringify(aiPayload));
      return NextResponse.json({ error: "Invalid response shape from AI engine." }, { status: 500 });
    }

    let rawJsonText = aiPayload.candidates[0].content.parts[0].text;
    
    // Clean out markdown wrappers safely
    rawJsonText = rawJsonText.replace(/```json/g, "").replace(/```/g, "").trim();
    const cleanConfigData = JSON.parse(rawJsonText);

    return NextResponse.json(cleanConfigData);

  } catch (crashException: any) {
    console.error("❌ Runtime Crash Exception:", crashException);
    return NextResponse.json({ error: "Internal Server Error", details: crashException.message }, { status: 500 });
  }
}