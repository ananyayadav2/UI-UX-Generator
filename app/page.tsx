"use client";

import { useState } from "react";

interface ScreenBlueprint {
  screenId: string;
  name: string;
  purpose: string;
  layoutDescription: string;
}

interface ProjectConfig {
  projectName: string;
  projectVisualDescription: string;
  screens: ScreenBlueprint[];
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [deviceType, setDeviceType] = useState("mobile"); // Defaulting to mobile preview cards
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectConfig | null>(null);

  const handleCreateProjectBlueprint = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setProjectData(null);

    try {
      const response = await fetch("/api/generate-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, deviceType }),
      });

      if (!response.ok) throw new Error("Failed to plan project screens");

      const data = await response.json();
      setProjectData(data);
    } catch (error) {
      console.error("Execution error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
   
      
      {/* Hero Header Area */}
      <div className="max-w-4xl mx-auto text-center mt-16 px-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Build Your UI with{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            AI
          </span>
        </h1>
        <p className="mt-4 text-slate-500 text-lg">
          Generate complete, multi-screen functional layout blueprints in seconds.
        </p>

        {/* Workspace Controls Input Frame Card */}
        <div className="mt-10 p-6 bg-white border shadow-sm rounded-2xl text-left max-w-2xl mx-auto space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              Select Target Form Factor Device
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setDeviceType("mobile")}
                className={`flex-1 py-2 px-4 border rounded-xl font-medium transition ${
                  deviceType === "mobile" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                📱 Mobile Screen Map
              </button>
              <button
                onClick={() => setDeviceType("desktop")}
                className={`flex-1 py-2 px-4 border rounded-xl font-medium transition ${
                  deviceType === "desktop" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                💻 Desktop Website Layout
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              Describe your platform app idea
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A cryptocurrency swapping dashboard with a dark neon theme..."
              rows={3}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm resize-none"
            />
          </div>

          <button
            onClick={handleCreateProjectBlueprint}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading ? "AI is Mapping Screen Architecture..." : "Start Blueprinting MVP Layout"}
          </button>
        </div>
      </div>

      {/* Blueprint Content Output Display Grid */}
      {projectData && (
        <div className="max-w-5xl mx-auto mt-16 px-4 space-y-8">
          <div className="border-b pb-4">
            <h2 className="text-3xl font-bold text-slate-800">{projectData.projectName}</h2>
            <p className="text-slate-500 mt-2 text-sm italic">
              <strong>Visual Guide:</strong> {projectData.projectVisualDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projectData.screens.map((screen) => (
              <div key={screen.screenId} className="bg-white p-5 border shadow-sm rounded-xl flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center font-bold text-sm mb-3">
                    🗺️
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{screen.name}</h3>
                  <p className="text-xs font-semibold uppercase text-purple-600 mt-1 tracking-wider">
                    {screen.purpose}
                  </p>
                  <p className="text-slate-600 text-xs mt-3 leading-relaxed">
                    {screen.layoutDescription}
                  </p>
                </div>
                <button className="mt-5 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition">
                  Ready to Render Code
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}