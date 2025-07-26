import React from 'react';

interface TooltipProps {
  x: number;
  y: number;
  content: string;
  visible: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ x, y, content, visible }) => {
  if (!visible || !content) return null;
  
  return (
    <div style={{
      position: 'absolute',
      left: x + 10,
      top: y - 30,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      pointerEvents: 'none',
      zIndex: 1000,
      maxWidth: '300px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      transition: 'opacity 0.2s',
      opacity: visible ? 1 : 0
    }}>
      {content}
    </div>
  );
};