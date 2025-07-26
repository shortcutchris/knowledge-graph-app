import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LegendProps {
  isMinimized: boolean;
  onToggle: () => void;
}

export const Legend: React.FC<LegendProps> = ({ isMinimized, onToggle }) => {
  if (isMinimized) {
    return (
      <Button
        onClick={onToggle}
        variant="secondary"
        size="icon"
        className="absolute bottom-4 left-4 h-10 w-10 shadow-lg"
        title="Legende anzeigen"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="absolute bottom-4 left-4 w-56 bg-white/95 backdrop-blur-sm shadow-xl animate-in slide-in-from-bottom-2 p-0">
      <CardContent className="p-2.5">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold text-gray-700">Legende</h4>
          <Button
            onClick={onToggle}
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mr-1"
            title="Legende verbergen"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Knoten</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-2.5 bg-indigo-100 border border-indigo-500 rounded-sm"></div>
                <span className="text-[11px]">Entity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2.5 bg-gray-50 border border-gray-300 rounded-sm"></div>
                <span className="text-[11px]">Klasse</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2.5 bg-blue-50 border border-blue-500 rounded-sm"></div>
                <span className="text-[11px]">Instanz</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-100 border border-purple-600 rounded-full"></div>
                <span className="text-[11px]">Frage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-600 rounded-full"></div>
                <span className="text-[11px]">Antwort</span>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-gray-500 pt-1.5 border-t space-y-0.5">
            <p><span className="font-semibold">Neu:</span> Grün</p>
            <p><span className="font-semibold">Vorgeschlagen:</span> Gelb/gestrichelt</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};