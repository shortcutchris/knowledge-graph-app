import React, { useState, useEffect, useCallback } from 'react';
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
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Document Import */}
      <div className="w-1/4 bg-white border-r p-5">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-5">
          <FileText className="h-6 w-6" />
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
      <div className="w-[35%] bg-white border-r p-5 overflow-y-auto">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-5">
          <Brain className="h-6 w-6" />
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
      <div id="graph-container" className="w-[40%] bg-gray-50 p-5 relative">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-900">Wissensgraph</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hover • Klick • Ziehen
            </span>
            <Button
              onClick={() => setIsFullscreen(true)}
              size="sm"
              className="gap-2"
            >
              <Maximize2 className="h-4 w-4" />
              Vollbild
            </Button>
          </div>
        </div>
        
        <Card className="relative h-[calc(100%-60px)] overflow-hidden">
          <ForceGraph 
            nodes={ontologyNodes}
            links={ontologyLinks}
            proposedElements={proposedElements}
            width={graphDimensions.width}
            height={graphDimensions.height}
            onNodeClick={useCallback((node) => {
              setSelectedNode(node);
              setIsPanelOpen(!!node);
            }, [])}
            selectedNodeId={selectedNode?.id}
            enableZoomControls={true}
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
        </Card>
      </div>
      
      {/* Fullscreen Graph */}
      {isFullscreen && (
        <FullscreenGraph
          nodes={ontologyNodes}
          links={ontologyLinks}
          proposedElements={proposedElements}
          onClose={() => setIsFullscreen(false)}
        />
      )}
    </div>
  );
};