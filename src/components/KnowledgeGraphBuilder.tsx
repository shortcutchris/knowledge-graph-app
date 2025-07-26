import React, { useState, useEffect } from 'react';
import { FileText, Brain, Maximize2 } from 'lucide-react';
import type { Node, Link, ProposedElement, GraphDimensions } from '../types';
import { sampleQAs } from '../data/sampleData';
import { generateProposedElements } from '../utils/proposedElements';
import { DocumentUploadPanel } from './panels/DocumentUploadPanel';
import { QAExtractionPanel } from './panels/QAExtractionPanel';
import { ForceGraph } from './graph/ForceGraph';
import { DetailPanel } from './panels/DetailPanel';
import { Legend } from './common/Legend';
import { FullscreenGraph } from './graph/FullscreenGraph';

export const KnowledgeGraphBuilder: React.FC = () => {
  const [uploadedDoc, setUploadedDoc] = useState<{ name: string; size: string } | null>(null);
  const [extractedQAs, setExtractedQAs] = useState(sampleQAs);
  const [currentQAIndex, setCurrentQAIndex] = useState(0);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLegendMinimized, setIsLegendMinimized] = useState(false);
  const [ontologyNodes, setOntologyNodes] = useState<Node[]>([
    { id: 'entity', label: 'Entity', type: 'class', nodeType: 'class' },
    { id: 'anlage', label: 'Anlage', type: 'class', parent: 'entity', nodeType: 'class' },
    { id: 'kunde', label: 'Kunde', type: 'class', parent: 'entity', nodeType: 'class' },
    { id: 'fehler', label: 'Fehler', type: 'class', parent: 'entity', nodeType: 'class' },
  ]);
  const [ontologyLinks, setOntologyLinks] = useState<Link[]>([
    { source: 'anlage', target: 'entity', type: 'is_a', id: 'link1' },
    { source: 'kunde', target: 'entity', type: 'is_a', id: 'link2' },
    { source: 'fehler', target: 'entity', type: 'is_a', id: 'link3' },
  ]);
  const [proposedElements, setProposedElements] = useState<ProposedElement[]>([]);
  const [processStep, setProcessStep] = useState<'upload' | 'extract' | 'map' | 'complete'>('upload');
  const [graphDimensions, setGraphDimensions] = useState<GraphDimensions>({ width: 800, height: 600 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDocumentUpload = () => {
    setUploadedDoc({ name: 'Wagner_Wartungsberichte_2019-2024.pdf', size: '45.3 MB' });
    setProcessStep('extract');
    
    setTimeout(() => {
      setExtractedQAs(sampleQAs);
      setCurrentQAIndex(0);
      setProcessStep('map');
      
      const firstQA = sampleQAs[0];
      setProposedElements(generateProposedElements(firstQA, 0));
    }, 1500);
  };

  const handleConfirmMapping = () => {
    const newNodes = [...ontologyNodes];
    const newLinks = [...ontologyLinks];
    
    proposedElements.forEach(element => {
      if (element.nodeType) {
        newNodes.push({
          ...element,
          id: element.id!,
          label: element.label!,
          isNew: true,
          isProposed: false
        } as Node);
        
        if (element.type === 'class' && element.parent) {
          newLinks.push({
            source: element.id!,
            target: element.parent,
            type: 'is_a'
          });
        }
      } else if (element.type === 'edge') {
        newLinks.push({
          source: element.from!,
          target: element.to!,
          type: element.label!,
          attributes: element.attributes
        });
      }
    });
    
    setOntologyNodes(newNodes);
    setOntologyLinks(newLinks);
    
    if (currentQAIndex < extractedQAs.length - 1) {
      setCurrentQAIndex(currentQAIndex + 1);
      const nextQA = sampleQAs[currentQAIndex + 1];
      setProposedElements(generateProposedElements(nextQA, currentQAIndex + 1));
    } else {
      setProcessStep('complete');
      setProposedElements([]);
    }
  };

  const handleSkipMapping = () => {
    if (currentQAIndex < extractedQAs.length - 1) {
      setCurrentQAIndex(currentQAIndex + 1);
      setProposedElements([]);
    } else {
      setProcessStep('complete');
      setProposedElements([]);
    }
  };

  const resetDemo = () => {
    setUploadedDoc(null);
    setExtractedQAs([]);
    setCurrentQAIndex(0);
    setSelectedNode(null);
    setIsPanelOpen(false);
    setOntologyNodes([
      { id: 'entity', label: 'Entity', type: 'class', nodeType: 'class' },
      { id: 'anlage', label: 'Anlage', type: 'class', parent: 'entity', nodeType: 'class' },
      { id: 'kunde', label: 'Kunde', type: 'class', parent: 'entity', nodeType: 'class' },
      { id: 'fehler', label: 'Fehler', type: 'class', parent: 'entity', nodeType: 'class' },
    ]);
    setOntologyLinks([
      { source: 'anlage', target: 'entity', type: 'is_a', id: 'link1' },
      { source: 'kunde', target: 'entity', type: 'is_a', id: 'link2' },
      { source: 'fehler', target: 'entity', type: 'is_a', id: 'link3' },
    ]);
    setProposedElements([]);
    setProcessStep('upload');
  };

  useEffect(() => {
    const updateDimensions = () => {
      const rightPanel = document.getElementById('graph-container');
      if (rightPanel) {
        setGraphDimensions({
          width: rightPanel.offsetWidth - 40,
          height: rightPanel.offsetHeight - 100
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Left Panel - Document Import */}
      <div style={{ 
        width: '25%', 
        backgroundColor: 'white', 
        borderRight: '1px solid #e0e0e0',
        padding: '20px'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>
          <FileText size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Dokument Import
        </h2>
        
        <DocumentUploadPanel
          uploadedDoc={uploadedDoc}
          onDocumentUpload={handleDocumentUpload}
          processStep={processStep}
          onReset={resetDemo}
        />
      </div>

      {/* Middle Panel - Q&A Extraction & Mapping */}
      <div style={{ 
        width: '35%', 
        backgroundColor: 'white', 
        borderRight: '1px solid #e0e0e0',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>
          <Brain size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Q&A Extraktion & Mapping
        </h2>
        
        <QAExtractionPanel
          processStep={processStep}
          extractedQAs={extractedQAs}
          currentQAIndex={currentQAIndex}
          onConfirmMapping={handleConfirmMapping}
          onSkipMapping={handleSkipMapping}
        />
      </div>

      {/* Right Panel - Ontology Graph */}
      <div 
        id="graph-container"
        style={{ 
          width: '40%', 
          backgroundColor: '#fafafa',
          padding: '20px',
          position: 'relative'
        }}
      >
        <h2 style={{ marginBottom: '20px', color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Wissensgraph</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '13px', color: '#666' }}>
              Hover • Klick • Ziehen
            </span>
            <button
              onClick={() => setIsFullscreen(true)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
              title="Vollbildansicht"
            >
              <Maximize2 size={16} />
              Vollbild
            </button>
          </div>
        </h2>
        
        <div style={{ 
          position: 'relative',
          height: 'calc(100% - 60px)',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <ForceGraph 
            nodes={ontologyNodes}
            links={ontologyLinks}
            proposedElements={proposedElements}
            width={graphDimensions.width}
            height={graphDimensions.height}
            onNodeClick={(node) => {
              setSelectedNode(node);
              setIsPanelOpen(!!node);
            }}
            enableZoomControls={false}
            graphId="main"
          />
          
          {/* Detail Panel */}
          <DetailPanel 
            node={selectedNode} 
            isOpen={isPanelOpen} 
            onClose={() => {
              setIsPanelOpen(false);
              setSelectedNode(null);
            }}
            graphLinks={ontologyLinks}
          />
          
          {/* Legend with minimize functionality */}
          <Legend 
            isMinimized={isLegendMinimized}
            onToggle={() => setIsLegendMinimized(!isLegendMinimized)}
          />
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      {/* Fullscreen Graph */}
      {isFullscreen && (
        <FullscreenGraph
          nodes={ontologyNodes}
          links={ontologyLinks}
          proposedElements={proposedElements}
          onClose={() => setIsFullscreen(false)}
          onNodeClick={setSelectedNode}
          selectedNode={selectedNode}
        />
      )}
    </div>
  );
};