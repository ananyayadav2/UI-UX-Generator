"use client";

import { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ScreenFrame from "./components/ScreenFrame";

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
  const [deviceType, setDeviceType] = useState("Mobile");
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectConfig | null>(null);
  const [panningEnabled, setPanningEnabled] = useState(true);

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
      console.error("Execution mapping error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden flex flex-col relative">
      
      {/* Form Controls Input Overlay Bar Element Panel */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
        <div className="bg-white/90 backdrop-blur border shadow-xl p-4 rounded-2xl text-slate-900 flex gap-3 items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your next app setup software concept..."
            className="flex-1 p-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          />
          <button
            onClick={handleCreateProjectBlueprint}
            disabled={loading}
            className="p-2.5 px-5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Planning Layout..." : "Generate MVP Board"}
          </button>
        </div>
      </div>

      {/* Infinite Figma-style Workspace Pan/Zoom Canvas Core Area */}
      <div className="flex-1 w-full h-full relative">
        <TransformWrapper
          disabled={!panningEnabled}
          initialScale={1}
          minScale={0.4}
          maxScale={2}
          limitToBounds={false}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Utility Zoom Control Floating Pill Overlay Widget Button Group */}
              <div className="absolute bottom-6 right-6 z-50 bg-slate-800/80 backdrop-blur border border-slate-700 p-2 rounded-xl flex items-center gap-1">
                <button onClick={() => zoomIn()} className="p-2 hover:bg-slate-700 rounded-lg transition">➕ Zoom In</button>
                <div className="w-[1px] h-4 bg-slate-700 mx-1" />
                <button onClick={() => zoomOut()} className="p-2 hover:bg-slate-700 rounded-lg transition">➖ Zoom Out</button>
                <div className="w-[1px] h-4 bg-slate-700 mx-1" />
                <button onClick={() => resetTransform()} className="p-2 hover:bg-slate-700 rounded-lg transition">🔄 Reset</button>
              </div>

              <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                {/* The Grid-Patterned Infinite Drafting Floor Map Background Canvas Element */}
                <div 
                  className="w-[5000px] h-[5000px] bg-slate-950 relative"
                  style={{
                    backgroundImage: "radial-gradient(#334155 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                >
                  {projectData && (
                    <>
                      {/* Global Metadata Title Banner */}
                      <div className="absolute top-10 left-10 text-left space-y-2 p-6 pointer-events-none">
                        <span className="text-xs bg-purple-500/20 text-purple-400 font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                          Active Workspace Board Plan
                        </span>
                        <h2 className="text-4xl font-extrabold tracking-tight text-white">{projectData.projectName}</h2>
                        <p className="text-slate-400 text-xs max-w-xl leading-relaxed">{projectData.projectVisualDescription}</p>
                      </div>

                      {/* 🌟 Aligned Flex/Grid Floor Workspace Container with safe top offset padding */}
                      <div className="absolute top-44 left-10 right-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start max-w-7xl pb-24">
                        {projectData.screens.map((screen, index) => (
                          <ScreenFrame
                            key={screen.screenId || index}
                            screen={screen}
                            index={index}
                            setPanningEnabled={setPanningEnabled}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
}