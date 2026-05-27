import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Reusing your existing Vercel environment variable key name
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key missing on backend." }, { status: 500 });
    }

    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt value string." }, { status: 400 });
    }

    // Initialize the official Google SDK instance cleanly
    const ai = new GoogleGenAI({ apiKey });

    // The SDK handles model routing formats natively under the hood
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `You are an expert SaaS platform product architect. Analyze this prompt and generate an MVP board layout config. Return ONLY a raw JSON object matching your standard layout structure, do not include markdown blocks: ${prompt}`,
    });

    const rawText = response.text;
    if (!rawText) {
      return NextResponse.json({ error: "Empty generation output received from model channel." }, { status: 500 });
    }

    // Clean out any rogue markdown syntax wrapping decorators if present
    const cleanJsonText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const cleanConfigData = JSON.parse(cleanJsonText);

    return NextResponse.json(cleanConfigData);

  } catch (crashException: any) {
    console.error("❌ Runtime SDK Exception:", crashException);
    return NextResponse.json({ error: "Internal Server Error", details: crashException.message }, { status: 500 });
  }
}