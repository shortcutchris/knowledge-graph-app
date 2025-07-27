import React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  x: number;
  y: number;
  content: string;
  visible: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ x, y, content, visible }) => {
  if (!visible || !content) return null;
  
  return (
    <div 
      className={cn(
        "absolute bg-[#00afef] text-white px-3 py-2 rounded-md text-xs pointer-events-none z-[1000] max-w-[300px] shadow-lg transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{
        left: x + 10,
        top: y - 30,
      }}
    >
      {content}
    </div>
  );
};