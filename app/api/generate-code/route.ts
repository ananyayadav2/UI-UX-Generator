import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { screenName, purpose, screenDesc, projectVisualDescription } = await req.json();

    // Call OpenRouter to generate the complete code module using Gemini 2.0 Flash
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
            content: `You are an elite frontend engineer specializing in React, Tailwind CSS, and Lucide React icons.
            Your task is to generate a beautiful, production-ready single-file React component based on the structural layout blueprint provided.
            
            STRICT GUIDELINES:
            - Return ONLY valid, executable React code.
            - Do NOT wrap the code in markdown blocks (like \`\`\`jsx) or include any introductory text.
            - Use Tailwind CSS beautifully to match a clean, modern SaaS design system.
            - Ensure the component is fully responsive and interactive using basic React useState hooks where appropriate.
            - Assume lucide-react is installed for any icons you need.`
          },
          {
            role: "user",
            content: `Generate a React component for the screen: "${screenName}".
            Functional Goal: ${purpose}
            Layout Specifications: ${screenDesc}
            Global Style Guidelines: ${projectVisualDescription}`
          }
        ]
      })
    });

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      return NextResponse.json({ error: "AI failed to compile UI code" }, { status: 500 });
    }

   let generatedCode = data.choices[0].message.content;

// 🧼 Clean out any markdown fence headers and footers from the raw string
if (generatedCode.startsWith("```")) {
  generatedCode = generatedCode.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
}

return NextResponse.json({ code: generatedCode.trim() });

  } catch (error) {
    console.error("Code generation engine failure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}