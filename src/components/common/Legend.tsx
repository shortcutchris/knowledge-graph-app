import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LegendProps {
  isMinimized: boolean;
  onToggle: () => void;
}

export const Legend: React.FC<LegendProps> = ({ isMinimized, onToggle }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      backgroundColor: 'rgba(255,255,255,0.95)',
      padding: isMinimized ? '10px' : '15px',
      borderRadius: '6px',
      fontSize: '12px',
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: isMinimized ? 0 : '10px'
      }}>
        <h4 style={{ 
          margin: 0,
          fontSize: '14px', 
          color: '#333',
          display: isMinimized ? 'none' : 'block'
        }}>Legende</h4>
        <button
          onClick={onToggle}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            color: '#666'
          }}
          title={isMinimized ? 'Legende anzeigen' : 'Legende verbergen'}
        >
          {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {!isMinimized && (
        <>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Knoten:</div>
          <div style={{ marginBottom: '5px', paddingLeft: '10px' }}>
            <span style={{ 
              display: 'inline-block',
              width: '20px',
              height: '12px',
              backgroundColor: '#e8eaf6',
              border: '1px solid #5c6bc0',
              marginRight: '5px',
              verticalAlign: 'middle'
            }}></span>
            Entity (Wurzel)
          </div>
          <div style={{ marginBottom: '5px', paddingLeft: '10px' }}>
            <span style={{ 
              display: 'inline-block',
              width: '20px',
              height: '12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              marginRight: '5px',
              verticalAlign: 'middle'
            }}></span>
            Klasse
          </div>
          <div style={{ marginBottom: '5px', paddingLeft: '10px' }}>
            <span style={{ 
              display: 'inline-block',
              width: '20px',
              height: '12px',
              backgroundColor: '#e3f2fd',
              border: '1px solid #2196f3',
              marginRight: '5px',
              verticalAlign: 'middle'
            }}></span>
            Instanz
          </div>
          <div style={{ marginBottom: '5px', paddingLeft: '10px' }}>
            <span style={{ 
              display: 'inline-block',
              width: '16px',
              height: '16px',
              backgroundColor: '#e1bee7',
              border: '1px solid #7b1fa2',
              borderRadius: '50%',
              marginRight: '5px',
              verticalAlign: 'middle'
            }}></span>
            Frage
          </div>
          <div style={{ marginBottom: '8px', paddingLeft: '10px' }}>
            <span style={{ 
              display: 'inline-block',
              width: '16px',
              height: '16px',
              backgroundColor: '#c8e6c9',
              border: '1px solid #388e3c',
              borderRadius: '50%',
              marginRight: '5px',
              verticalAlign: 'middle'
            }}></span>
            Antwort
          </div>
          
          <div style={{ fontSize: '11px', color: '#666', fontStyle: 'italic', marginTop: '10px' }}>
            <strong>Neu:</strong> Grüner Rand<br/>
            <strong>Vorgeschlagen:</strong> Gelb gestrichelt<br/>
            <strong>Tipp:</strong> 30 Jahre Erfahrung werden lebendig!
          </div>
        </>
      )}
    </div>
  );
};