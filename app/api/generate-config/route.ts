import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        response_format: { type: "json_object" }, 
        messages: [
          {
            role: "system",
            content: `You are an expert SaaS product architect. Analyze the user's prompt and generate an MVP design plan containing exactly 3 screen structures.
            Return ONLY a raw JSON object matching this exact structure:
            {
              "projectName": "Name of the app",
              "projectVisualDescription": "style details",
              "screens": [
                {
                  "screenId": "unique-slug-1",
                  "name": "Screen Name",
                  "purpose": "What this screen achieves",
                  "layoutDescription": "visual blueprint spatial-wise"
                }
              ]
            }`
          },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      return NextResponse.json({ error: "AI Planner failed to respond" }, { status: 500 });
    }

    const configData = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(configData);

  } catch (error) {
    console.error("Layout planning error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}