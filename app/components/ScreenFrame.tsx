"use client";

import { useState } from "react";

interface ScreenFrameProps {
  screen: {
    screenId: string;
    screenName?: string;
    name?: string;
    purpose: string;
    screenDesc?: string;
    layoutDescription?: string;
  };
  index: number;
  setPanningEnabled: (enabled: boolean) => void;
}

export default function ScreenFrame({ screen, index, setPanningEnabled }: ScreenFrameProps) {
  const [generating, setGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const name = screen.screenName || screen.name || "Untitled Screen";
  const description = screen.screenDesc || screen.layoutDescription || "";

  const handleRenderCode = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screenName: name,
          purpose: screen.purpose,
          screenDesc: description,
          projectVisualDescription: "Clean, minimalist dark mode look with subtle purple accents."
        }),
      });

      if (!response.ok) throw new Error("Compilation failed");
      const data = await response.json();
      setGeneratedCode(data.code);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Draggable Card Module */}
      <div 
        onMouseEnter={() => setPanningEnabled(false)} // Safe drafting controls toggle
        onMouseLeave={() => setPanningEnabled(true)}
        className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl relative group transition hover:border-purple-500/40"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-40" />
        
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-4">
          <h3 className="font-bold text-slate-200 text-sm tracking-wide">📱 {name}</h3>
          <span className="text-[10px] uppercase font-bold tracking-widest bg-purple-950/50 text-purple-400 border border-purple-900/40 px-2.5 py-0.5 rounded-md">
            Slot {index + 1}
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-purple-400 mb-1">Functional Goal</h4>
            <p className="text-slate-300 text-xs leading-relaxed font-medium">{screen.purpose}</p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 mb-1">Layout Blueprint Specs</h4>
            <p className="text-slate-400 text-xs leading-relaxed bg-slate-900/50 border border-slate-800/60 rounded-xl p-3.5 max-h-48 overflow-y-auto">
              {description}
            </p>
          </div>
        </div>

        <button
          onClick={handleRenderCode}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-lg shadow-purple-950/20 active:scale-[0.99] transition disabled:opacity-50"
        >
          {generating ? (
            <span className="flex items-center gap-2 animate-pulse">⚙️ Compiling Component...</span>
          ) : (
            <>
              <span>⚡</span>
              <span>Render UI Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Viewer Panel overlay Modal */}
      {showModal && generatedCode && (
        <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">🚀 Rendered React Component</h3>
                <p className="text-xs text-slate-400">{name} Blueprint Code</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition"
                >
                  {copied ? "✅ Copied!" : "📋 Copy Source Code"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition text-xs"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Code Body area */}
            <div className="flex-1 p-6 overflow-auto font-mono text-xs text-purple-300 bg-slate-950 leading-relaxed text-left selection:bg-purple-500/20">
              <pre className="whitespace-pre-wrap">{generatedCode}</pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}