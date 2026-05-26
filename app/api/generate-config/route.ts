import { NextResponse } from "next/server";
import { db } from "@/configs/db"; 
import { Projects, ScreenConfig } from "@/configs/schema";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt, deviceType } = await req.json();

    // 1. Fetch the multi-screen layout plan from OpenRouter
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
            content: `You are an expert SaaS software platform product architect. Analyze the user's software prompt and generate an MVP configuration plan containing exactly 3 core application screen components structures.
            Return ONLY a raw JSON object matching this exact structure:
            {
              "projectName": "Name of the software platform",
              "projectVisualDescription": "Global style details regarding theme look and feel templates color variables guidelines",
              "screens": [
                {
                  "screenId": "unique-lowercase-slug-id-string",
                  "name": "Screen Component Name Layout",
                  "purpose": "What this screen panel interface achieves functionally",
                  "layoutDescription": "Detailed visual layout blueprint instructing where items sit spatial-wise"
                }
              ]
            }`
          },
          { role: "user", content: `Platform Prompt Idea: ${prompt}` }
        ]
      })
    });

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      return NextResponse.json({ error: "AI failed to respond" }, { status: 500 });
    }

    const configData = JSON.parse(data.choices[0].message.content);
    const generatedProjectId = "proj_" + Math.random().toString(36).substring(2, 11);

    // 2. Insert master metadata row into your custom 'Projects' table
    await db.insert(Projects).values({
      projectId: generatedProjectId,
      name: configData.projectName || configData.name || "Untitled Blueprint Platform",
      device: deviceType || "mobile",
      visualDesc: configData.projectVisualDescription || configData.visualDesc || "Minimalist aesthetic styling guidelines", 
      userId: "bypass_user_mode" 
    });

    // 3. Batch insert individual screens into your custom 'ScreenConfig' table
    if (configData.screens && configData.screens.length > 0) {
      const operationsArray = configData.screens.map((screen: any, idx: number) => ({
        projectId: generatedProjectId,
        screenId: idx + 1, 
        screenName: screen.name || "Untitled Screen Container",
        purpose: screen.purpose || "Functional interface component module",
        screenDesc: screen.layoutDescription || screen.screenDesc || "Layout structural guidelines blueprint",
        code: null
      }));

      await db.insert(ScreenConfig).values(operationsArray);
    }

    // Return payload context back to client application state
    return NextResponse.json({
      projectId: generatedProjectId,
      ...configData
    });

  } catch (error) {
    console.error("Layout pipeline backend error:", error);
    return NextResponse.json({ error: "Internal Database Server Error" }, { status: 500 });
  }
}