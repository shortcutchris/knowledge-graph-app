import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Minimize2, Move } from 'lucide-react';
import type { Node, Link, ProposedElement } from '../../types';
import { ForceGraph, ForceGraphHandle } from './ForceGraph';
import { SidePanel } from '../panels/SidePanel';
import { Legend } from '../common/Legend';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FullscreenGraphProps {
  nodes: Node[];
  links: Link[];
  proposedElements: ProposedElement[];
  onClose: () => void;
}

export const FullscreenGraph: React.FC<FullscreenGraphProps> = ({ 
  nodes, 
  links, 
  proposedElements, 
  onClose
}) => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isLegendMinimized, setIsLegendMinimized] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const graphRef = useRef<ForceGraphHandle>(null);
  
  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    // Initial resize to get correct dimensions
    handleResize();

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onClose]);
  
  // Fit graph to viewport when fullscreen opens
  useEffect(() => {
    // Small delay to ensure the graph is rendered before fitting
    const timer = setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.fitToViewport();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 bg-gray-100 z-[1000] flex flex-col transition-all duration-300 ${
      isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-in fade-in zoom-in-95'
    }`}>
      {/* Header */}
      <div className="bg-[#000e22] h-16 min-h-[64px] flex items-center justify-between px-5 border-b border-gray-300">
        <h2 className="text-xl font-semibold text-white flex items-center gap-4">
          Wissensgraph - Vollbildansicht
          <div className="flex items-center gap-2">
            <Badge className="bg-gray-700 text-gray-100 hover:bg-gray-600">{nodes.length} Knoten</Badge>
            <Badge className="bg-gray-700 text-gray-100 hover:bg-gray-600">{links.length} Verbindungen</Badge>
          </div>
        </h2>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <Move className="h-4 w-4" />
            Ziehen zum Bewegen • Scrollen zum Zoomen • Klick für Details • ESC zum Verlassen
          </span>
          <Button
            onClick={handleClose}
            size="sm"
            className="gap-2 bg-white text-gray-900 hover:bg-gray-100"
          >
            <Minimize2 className="h-4 w-4" />
            Vollbild verlassen
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative bg-gray-50">
        {/* Graph Container */}
        <div className={`flex-1 relative bg-white m-5 mr-0 rounded-lg border shadow-sm overflow-hidden transition-all duration-300 ${
          isSidePanelOpen ? 'mr-5' : 'mr-5'
        }`}>
          <ForceGraph 
            ref={graphRef}
            nodes={nodes}
            links={links}
            proposedElements={proposedElements}
            width={isSidePanelOpen ? dimensions.width - 440 : dimensions.width - 40}
            height={dimensions.height - 104}
            onNodeClick={useCallback((node: Node | null) => {
              setSelectedNode(node);
              setIsSidePanelOpen(!!node);
            }, [])}
            selectedNodeId={selectedNode?.id}
            enableZoomControls={true}
            graphId="fullscreen"
          />
          
          {/* Legend in Fullscreen with minimize functionality */}
          <Legend 
            isMinimized={isLegendMinimized}
            onToggle={() => setIsLegendMinimized(!isLegendMinimized)}
          />
        </div>
        
        {/* Side Panel */}
        <div className={`relative transition-all duration-300 ${
          isSidePanelOpen ? 'w-96' : 'w-0'
        }`}>
          <SidePanel 
            node={selectedNode} 
            isOpen={isSidePanelOpen} 
            onClose={() => {
              setSelectedNode(null);
              setIsSidePanelOpen(false);
            }}
            graphLinks={links}
          />
        </div>
      </div>
    </div>
  );
};