import React from 'react';
import { HelpCircle, MessageSquare, Database, Tag, Info } from 'lucide-react';
import type { Node, Link } from '../../types';

interface DetailPanelProps {
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
  graphLinks: Link[];
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ node, isOpen, onClose, graphLinks }) => {
  if (!isOpen || !node) return null;
  
  const getNodeTypeInfo = () => {
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
  const connectedNodes = graphLinks
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
    });
  
  return (
    <div style={{
      position: 'absolute',
      right: '20px',
      top: '80px',
      width: '350px',
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 100,
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px',
        backgroundColor: typeInfo.bg,
        borderBottom: '1px solid #e0e0e0',
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ color: typeInfo.color }}>{typeInfo.icon}</div>
          <h3 style={{ margin: 0, fontSize: '16px', color: typeInfo.color }}>
            {node.label || node.id}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666',
            padding: '0 5px'
          }}
        >
          ×
        </button>
      </div>
      
      {/* Content */}
      <div style={{ padding: '15px' }}>
        {/* Node Information */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>Knoten-Information</h4>
          <div style={{ fontSize: '13px', color: '#333' }}>
            <p style={{ margin: '5px 0' }}><strong>ID:</strong> {node.id}</p>
            <p style={{ margin: '5px 0' }}><strong>Typ:</strong> {node.nodeType || node.type}</p>
            {node.parent && <p style={{ margin: '5px 0' }}><strong>Elternklasse:</strong> {node.parent}</p>}
            {node.isNew && <p style={{ margin: '5px 0' }}><strong>Status:</strong> Neu hinzugefügt</p>}
            {node.isProposed && <p style={{ margin: '5px 0' }}><strong>Status:</strong> Vorgeschlagen</p>}
          </div>
        </div>
        
        {/* Q&A Content */}
        {(node.nodeType === 'question' || node.nodeType === 'answer') && node.content && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>Inhalt</h4>
            <div style={{
              fontSize: '13px',
              color: '#333',
              backgroundColor: '#f8f9fa',
              padding: '10px',
              borderRadius: '4px',
              lineHeight: '1.4'
            }}>
              {node.content}
            </div>
          </div>
        )}
        
        {/* Connected Nodes */}
        {connectedNodes.length > 0 && (
          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>
              Verbindungen ({connectedNodes.length})
            </h4>
            <div style={{ fontSize: '13px' }}>
              {connectedNodes.map((connection, idx) => (
                <div key={idx} style={{
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  borderLeft: `3px solid ${
                    connection.relationship === 'is_relevant_for' ? '#9c27b0' :
                    connection.relationship === 'is_a' || connection.relationship === 'instance_of' ? 
                      (connection.direction === 'outgoing' ? '#28a745' : '#007bff') :
                    '#ff6b6b'
                  }`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {connection.direction === 'incoming' && <span>←</span>}
                    <strong>{connection.relationship}</strong>
                    {connection.direction === 'outgoing' && <span>→</span>}
                    <span>{connection.node.label || connection.node.id}</span>
                  </div>
                  {connection.attributes && (
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                      {Object.entries(connection.attributes).map(([k, v]) => (
                        <span key={k}>{k}: {v}</span>
                      )).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};