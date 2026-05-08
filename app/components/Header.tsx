"use client";

import React from 'react';

export default function Header() {
  return (
    <div style={{ 
      padding: '20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderBottom: '1px solid #eee' 
    }}>
      <h2 style={{ fontWeight: 'bold', margin: 0 }}>AI UI Generator</h2>
      <div>
        <button style={{ 
          padding: '8px 16px', 
          backgroundColor: 'black', 
          color: 'white', 
          borderRadius: '5px',
          cursor: 'pointer',
          border: 'none'
        }}>
          Sign In (Bypassed)
        </button>
      </div>
    </div>
  );
}