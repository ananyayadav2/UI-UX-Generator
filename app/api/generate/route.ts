import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // 1. Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { 
            role: "system", 
            content: "You are a specialized React and Tailwind CSS developer. Return only code for a single-file component. No prose, no markdown blocks." 
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();

    // 2. Safety Check: Ensure the AI actually returned a response
    if (!data.choices || data.choices.length === 0) {
      console.error("API Error Response:", data);
      return NextResponse.json(
        { error: "AI failed to respond. Check your API key or model availability." }, 
        { status: 500 }
      );
    }

    // 3. Extract the generated code
    const generatedCode = data.choices[0].message.content;

    return NextResponse.json({ code: generatedCode });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}