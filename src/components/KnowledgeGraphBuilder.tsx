import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Brain, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Node, Link, ProposedElement, GraphDimensions } from '../types';
import { sampleQAs, wissenStatistiken } from '../data/sampleData';
import { enhancedOntologyNodes, enhancedOntologyLinks } from '../data/enhancedOntology';
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
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [ontologyNodes, setOntologyNodes] = useState<Node[]>([
    { id: 'herr_wagner', label: 'Herr Wagner', type: 'person', nodeType: 'person' },
    { id: 'anlage', label: 'Anlage', type: 'class', parent: 'herr_wagner', nodeType: 'class' },
    { id: 'kunde', label: 'Kunde', type: 'class', parent: 'herr_wagner', nodeType: 'class' },
    { id: 'fehler', label: 'Fehler', type: 'class', parent: 'herr_wagner', nodeType: 'class' },
  ]);
  const [ontologyLinks, setOntologyLinks] = useState<Link[]>([
    { source: 'herr_wagner', target: 'anlage', type: 'kennt' },
    { source: 'herr_wagner', target: 'kunde', type: 'betreut' },
    { source: 'herr_wagner', target: 'fehler', type: 'löst' },
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
    
    // Process proposed elements (which already include Q&A nodes)
    proposedElements.forEach(element => {
      if (element.nodeType) {
        const nodeId = element.id!;
        newNodes.push({
          ...element,
          id: nodeId,
          label: element.label!,
          isNew: true,
          isProposed: false
        } as Node);
        
        if (element.type === 'class' && element.parent) {
          newLinks.push({
            source: nodeId,
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
      const nextQA = extractedQAs[currentQAIndex + 1];
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
      { id: 'herr_wagner', label: 'Herr Wagner', type: 'person', nodeType: 'person' },
      { id: 'anlage', label: 'Anlage', type: 'class', parent: 'herr_wagner', nodeType: 'class' },
      { id: 'kunde', label: 'Kunde', type: 'class', parent: 'herr_wagner', nodeType: 'class' },
      { id: 'fehler', label: 'Fehler', type: 'class', parent: 'herr_wagner', nodeType: 'class' },
    ]);
    setOntologyLinks([
      { source: 'herr_wagner', target: 'anlage', type: 'kennt' },
      { source: 'herr_wagner', target: 'kunde', type: 'betreut' },
      { source: 'herr_wagner', target: 'fehler', type: 'löst' },
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

  // Update dimensions when left panel is collapsed/expanded
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
    
    // Small delay to wait for CSS transition
    const timeoutId = setTimeout(updateDimensions, 300);
    return () => clearTimeout(timeoutId);
  }, [isLeftPanelCollapsed]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Document Import (Collapsible) */}
      <div className={`${isLeftPanelCollapsed ? 'w-12' : 'w-1/4'} bg-white border-r flex flex-col transition-all duration-300 relative`}>
        {isLeftPanelCollapsed ? (
          <div className="flex items-center justify-center h-full">
            <Button
              onClick={() => setIsLeftPanelCollapsed(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Panel öffnen"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="p-5 pb-0">
              <div className="flex items-center justify-between mb-5">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                  <FileText className="h-6 w-6" />
                  Dokument Import
                </h2>
                <Button
                  onClick={() => setIsLeftPanelCollapsed(true)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mr-2"
                  title="Panel minimieren"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              <DocumentUploadPanel
                uploadedDoc={uploadedDoc}
                onDocumentUpload={handleDocumentUpload}
                processStep={processStep}
                onReset={resetDemo}
              />
            </div>
          </>
        )}
      </div>

      {/* Middle Panel - Q&A Extraction & Mapping */}
      <div className={`${isLeftPanelCollapsed ? 'w-[40%]' : 'w-[35%]'} bg-white border-r flex flex-col transition-all duration-300`}>
        <div className="p-5 pb-0">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-5">
            <Brain className="h-6 w-6" />
            Q&A Extraktion & Mapping
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <QAExtractionPanel
            processStep={processStep}
            extractedQAs={extractedQAs}
            currentQAIndex={currentQAIndex}
            onConfirmMapping={handleConfirmMapping}
            onSkipMapping={handleSkipMapping}
          />
        </div>
      </div>

      {/* Right Panel - Ontology Graph */}
      <div id="graph-container" className={`${isLeftPanelCollapsed ? 'flex-1' : 'w-[40%]'} bg-gray-50 p-5 relative transition-all duration-300`}>
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