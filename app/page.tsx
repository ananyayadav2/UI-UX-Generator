"use client";

import React, { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      setGeneratedCode(data.code);
    } catch (error) {
      console.error("Error generating UI:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh', 
      padding: '20px',
      textAlign: 'center' 
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>
        Build Your UI with <span style={{ color: '#3b82f6' }}>AI</span>
      </h1>
      <p style={{ color: '#666', marginBottom: '30px', maxWidth: '600px' }}>
        Generate high-quality, modern React components in seconds using the power of Artificial Intelligence.
      </p>

      <div style={{ width: '100%', maxWidth: '500px', marginBottom: '20px' }}>
        <input 
          type="text"
          placeholder="Describe the UI you want (e.g., a blue login card)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            color: 'black',
            marginBottom: '10px'
          }}
        />
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: 'black', 
              color: 'white', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? "Generating..." : "Start Generating"}
          </button>
          <button style={{ 
            padding: '12px 24px', 
            backgroundColor: 'white', 
            color: 'black', 
            borderRadius: '8px', 
            border: '1px solid #ccc',
            fontWeight: 'bold'
          }}>
            View Gallery
          </button>
        </div>
      </div>

      {generatedCode && (
        <div style={{ 
          marginTop: '40px', 
          width: '100%', 
          maxWidth: '800px', 
          textAlign: 'left',
          backgroundColor: '#f4f4f4',
          padding: '20px',
          borderRadius: '8px',
          overflowX: 'auto'
        }}>
          <h3 style={{ marginBottom: '10px' }}>Generated Code:</h3>
          <pre style={{ fontSize: '14px' }}>
            <code>{generatedCode}</code>
          </pre>
        </div>
      )}
    </main>
  );
}