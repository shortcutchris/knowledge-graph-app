import React from 'react';
import { HelpCircle, MessageSquare, Database, Tag, Info, ArrowRight, ArrowLeft, X } from 'lucide-react';
import type { Node, Link } from '../../types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidePanelProps {
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
  graphLinks: Link[];
}

export const SidePanel: React.FC<SidePanelProps> = ({ node, isOpen, onClose, graphLinks }) => {
  
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
    <div className={`absolute top-0 right-0 h-full w-96 bg-white border-l shadow-xl transition-all duration-300 transform ${
      isOpen && node ? 'translate-x-0' : 'translate-x-full'
    }`}>
      {node && (
        <ScrollArea className="h-full">
          <div 
            className="sticky top-0 z-10 flex items-center gap-3 p-4 border-b"
            style={{ backgroundColor: typeInfo.bg }}
          >
            <div style={{ color: typeInfo.color }}>
              {typeInfo.icon}
            </div>
            <h3 className="flex-1 text-lg font-semibold" style={{ color: typeInfo.color }}>
              {node.label || node.id}
            </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            style={{ color: typeInfo.color }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Node Information */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Knoten-Information</h4>
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
                  <div className="flex gap-2">
                    {node.isNew && <Badge className="bg-green-500 text-white hover:bg-green-600">Neu hinzugefügt</Badge>}
                    {node.isProposed && <Badge variant="outline" className="border-yellow-500 text-yellow-700">Vorgeschlagen</Badge>}
                  </div>
                </div>
              )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Q&A Content */}
          {(node.nodeType === 'question' || node.nodeType === 'answer') && node.content && (
            <>
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Inhalt</h4>
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed">{node.content}</p>
                  </CardContent>
                </Card>
              </div>
              <Separator />
            </>
          )}

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
                    className={`border-l-4 transition-all hover:shadow-md cursor-pointer ${
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
      </ScrollArea>
      )}
    </div>
  );
};