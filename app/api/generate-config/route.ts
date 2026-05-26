import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { Projects, ScreenConfig } from "@/configs/schema";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // 1. Grab environment keys and validate immediately inside the edge worker block
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("❌ CRITICAL CONFIG ERROR: OPENROUTER_API_KEY is undefined in Vercel.");
      return NextResponse.json(
        { error: "OpenRouter configuration key missing on backend instance." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { prompt, deviceType } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt value string." }, { status: 400 });
    }

    // 2. Process secure external fetch connection over the Edge web pipeline
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are an expert SaaS software platform product architect. Analyze the user's software prompt and generate an MVP board. Return ONLY a raw JSON object matching the requested structure.",
          },
          {
            role: "user",
            content: `Prompt: ${prompt}`,
          },
        ],
      }),
    });

    // 3. Gracefully intercept upstream proxy server rejections
    if (!response.ok) {
      const errorResponseText = await response.text();
      console.error("❌ Upstream AI Proxy Server Error Output:", errorResponseText);
      return NextResponse.json(
        { error: "The AI generation engine rejected the payload parameters.", details: errorResponseText },
        { status: response.status }
      );
    }

    const aiPayload = await response.json();
    
    if (!aiPayload.choices || aiPayload.choices.length === 0) {
      console.error("❌ Edge Function received an empty array response from model.");
      return NextResponse.json({ error: "Empty completion response matrix." }, { status: 500 });
    }

    const rawJsonText = aiPayload.choices[0].message.content;
    const cleanConfigData = JSON.parse(rawJsonText);

    // Everything checks out perfectly! Return clean structured parameters back onto the canvas
    return NextResponse.json(cleanConfigData);

  } catch (crashException: any) {
    console.error("❌ Edge Runtime Exception Caught Logged Successfully:", crashException);
    return NextResponse.json(
      { error: "Internal Server Processing Exception", details: crashException.message || crashException },
      { status: 500 }
    );
  }
}