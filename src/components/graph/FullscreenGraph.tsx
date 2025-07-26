import React, { useState, useEffect } from 'react';
import { Minimize2, Move } from 'lucide-react';
import type { Node, Link, ProposedElement } from '../../types';
import { ForceGraph } from './ForceGraph';
import { DetailPanel } from '../panels/DetailPanel';
import { Legend } from '../common/Legend';

interface FullscreenGraphProps {
  nodes: Node[];
  links: Link[];
  proposedElements: ProposedElement[];
  onClose: () => void;
  onNodeClick: (node: Node | null) => void;
  selectedNode: Node | null;
}

export const FullscreenGraph: React.FC<FullscreenGraphProps> = ({ 
  nodes, 
  links, 
  proposedElements, 
  onClose, 
  onNodeClick, 
  selectedNode 
}) => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isLegendMinimized, setIsLegendMinimized] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Header */}
      <div style={{
        height: '60px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>
          Wissensgraph - Vollbildansicht 
          <span style={{ fontSize: '16px', fontWeight: 'normal', marginLeft: '15px', color: '#666' }}>
            ({nodes.length} Knoten, {links.length} Verbindungen)
          </span>
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>
            <Move size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
            Ziehen zum Bewegen • Scrollen zum Zoomen • Klick für Details • ESC zum Verlassen
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#5a6268'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6c757d'}
          >
            <Minimize2 size={16} />
            Vollbild verlassen
          </button>
        </div>
      </div>

      {/* Graph Container */}
      <div style={{ 
        flex: 1, 
        position: 'relative',
        backgroundColor: 'white',
        margin: '20px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <ForceGraph 
          nodes={nodes}
          links={links}
          proposedElements={proposedElements}
          width={dimensions.width - 40}
          height={dimensions.height - 100}
          onNodeClick={onNodeClick}
          enableZoomControls={true}
          graphId="fullscreen"
        />
        
        {/* Detail Panel in Fullscreen */}
        <DetailPanel 
          node={selectedNode} 
          isOpen={!!selectedNode} 
          onClose={() => onNodeClick(null)}
          graphLinks={links}
        />
        
        {/* Legend in Fullscreen with minimize functionality */}
        <Legend 
          isMinimized={isLegendMinimized}
          onToggle={() => setIsLegendMinimized(!isLegendMinimized)}
        />
      </div>
    </div>
  );
};