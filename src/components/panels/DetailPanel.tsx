import React from 'react';
import { HelpCircle, MessageSquare, Database, Tag, Info, ArrowRight, ArrowLeft, X } from 'lucide-react';
import type { Node, Link } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DetailPanelProps {
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
  graphLinks: Link[];
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ node, isOpen, onClose, graphLinks }) => {
  
  const getNodeTypeInfo = () => {
    if (!node) return { icon: <Info size={20} />, color: '#666', bg: '#f5f5f5' };
    
    switch(node.nodeType) {
      case 'question':
        return { icon: <HelpCircle size={20} />, color: '#7b1fa2', bg: '#e1bee7' };
      case 'answer':
        return { icon: <MessageSquare size={20} />, color: '#388e3c', bg: '#c8e6c9' };
      case 'class':
        return { icon: <Database size={20} />, color: '#333', bg: '#f8f9fa' };
      case 'instance':
        return { icon: <Tag size={20} />, color: '#2196f3', bg: '#e3f2fd' };
      default:
        return { icon: <Info size={20} />, color: '#666', bg: '#f5f5f5' };
    }
  };
  
  const typeInfo = getNodeTypeInfo();
  
  // Find connected nodes
  const connectedNodes = node ? graphLinks
    .filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return sourceId === node.id || targetId === node.id;
    })
    .map(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      const sourceNode = typeof link.source === 'object' ? link.source : { id: link.source, label: link.source };
      const targetNode = typeof link.target === 'object' ? link.target : { id: link.target, label: link.target };
      
      return {
        node: sourceId === node.id ? targetNode : sourceNode,
        relationship: link.type,
        direction: sourceId === node.id ? 'outgoing' : 'incoming',
        attributes: link.attributes
      };
    }) : [];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogContent className="max-w-[500px] max-h-[80vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()} showCloseButton={false}>
          {node && (
          <>
            <DialogHeader className="flex-shrink-0">
              <div 
                className="flex items-center gap-3 p-4 -mx-6 -mt-6 bg-[#000e22]"
              >
                <div className="text-white">
                  {typeInfo.icon}
                </div>
                <DialogTitle className="flex-1 text-white">
                  {node.label || node.id}
                </DialogTitle>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DialogDescription className="sr-only">
                Details for {node.label || node.id}
              </DialogDescription>
            </DialogHeader>
      
            <div className="flex-1 overflow-y-auto mt-6 space-y-6 pr-2">
              {/* Node Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Knoten-Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-medium">{node.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Typ:</span>
                    <span className="font-medium">{node.nodeType || node.type}</span>
                  </div>
                  {node.parent && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Elternklasse:</span>
                      <span className="font-medium">{node.parent}</span>
                    </div>
                  )}
                  {(node.isNew || node.isProposed) && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Status:</span>
                      {node.isNew && <Badge variant="secondary">Neu hinzugefügt</Badge>}
                      {node.isProposed && <Badge variant="outline">Vorgeschlagen</Badge>}
                    </div>
                  )}
                </div>
              </div>
        
              <Separator />

              {/* Q&A Content */}
              {(node.nodeType === 'question' || node.nodeType === 'answer') && node.content && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">Inhalt</h4>
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed">{node.content}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
        
              {connectedNodes.length > 0 && <Separator />}

              {/* Connected Nodes */}
              {connectedNodes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">
                    Verbindungen ({connectedNodes.length})
                  </h4>
                  <div className="space-y-2">
                    {connectedNodes.map((connection, idx) => (
                      <Card 
                        key={idx}
                        className={`border-l-4 ${
                          connection.relationship === 'is_relevant_for' ? 'border-l-purple-600' :
                          connection.relationship === 'is_a' || connection.relationship === 'instance_of' ? 
                            (connection.direction === 'outgoing' ? 'border-l-green-600' : 'border-l-blue-600') :
                          'border-l-red-500'
                        }`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 text-sm">
                            {connection.direction === 'incoming' && <ArrowLeft className="h-3 w-3" />}
                            <span className="font-semibold">{connection.relationship}</span>
                            {connection.direction === 'outgoing' && <ArrowRight className="h-3 w-3" />}
                            <span className="text-gray-700">{connection.node.label || connection.node.id}</span>
                          </div>
                          {connection.attributes && (
                            <div className="mt-2 text-xs text-gray-500">
                              {Object.entries(connection.attributes).map(([k, v]) => (
                                <span key={k} className="mr-3">
                                  {k}: {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};