import React from 'react';
import { AlertCircle, Brain, CheckCircle, HelpCircle, MessageSquare, Plus, Check, X } from 'lucide-react';
import type { QA } from '../../types';

interface QAExtractionPanelProps {
  processStep: string;
  extractedQAs: QA[];
  currentQAIndex: number;
  onConfirmMapping: () => void;
  onSkipMapping: () => void;
}

export const QAExtractionPanel: React.FC<QAExtractionPanelProps> = ({
  processStep,
  extractedQAs,
  currentQAIndex,
  onConfirmMapping,
  onSkipMapping
}) => {
  if (processStep === 'upload') {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>
        <AlertCircle size={48} style={{ marginBottom: '10px' }} />
        <p>Laden Sie ein Dokument hoch, um die Extraktion zu starten</p>
      </div>
    );
  }
  
  if (processStep === 'extract') {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <div style={{ 
          display: 'inline-block',
          animation: 'spin 1s linear infinite'
        }}>
          <Brain size={48} color="#007bff" />
        </div>
        <p style={{ marginTop: '20px', color: '#666' }}>Extrahiere Q&As aus dem Dokument...</p>
      </div>
    );
  }
  
  if ((processStep === 'map' || processStep === 'complete') && extractedQAs.length > 0) {
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              Frage {currentQAIndex + 1} von {extractedQAs.length}
            </span>
            <span style={{ fontSize: '14px', color: '#007bff' }}>
              {Math.round(((currentQAIndex + 1) / extractedQAs.length) * 100)}% Fertig
            </span>
          </div>
          <div style={{ 
            height: '4px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: '#007bff',
              width: `${((currentQAIndex + 1) / extractedQAs.length) * 100}%`,
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
        
        {processStep === 'map' && (
          <>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h4 style={{ marginBottom: '10px', color: '#495057' }}>
                <HelpCircle size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                Extrahierte Q&A:
              </h4>
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                Q: {extractedQAs[currentQAIndex].question}
              </p>
              <p style={{ color: '#666' }}>
                A: {extractedQAs[currentQAIndex].answer}
              </p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '15px', color: '#495057' }}>Identifizierte Elemente:</h4>
              
              <div style={{ marginBottom: '15px' }}>
                <h5 style={{ fontSize: '14px', marginBottom: '8px', color: '#6c757d' }}>Entitäten:</h5>
                {extractedQAs[currentQAIndex].entities.map((entity, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    backgroundColor: entity.isNew ? '#fff3cd' : '#d1ecf1',
                    borderRadius: '4px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ flex: 1 }}>{entity.text}</span>
                    {entity.isNew && (
                      <span style={{
                        backgroundColor: '#ffc107',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>NEU</span>
                    )}
                  </div>
                ))}
              </div>
              
              <div>
                <h5 style={{ fontSize: '14px', marginBottom: '8px', color: '#6c757d' }}>Beziehungen:</h5>
                {extractedQAs[currentQAIndex].predicates.map((predicate, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    backgroundColor: predicate.isNew ? '#fff3cd' : '#d1ecf1',
                    borderRadius: '4px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ flex: 1 }}>
                      {predicate.text}
                      {predicate.attributes && (
                        <span style={{ color: '#666', fontSize: '12px', marginLeft: '8px' }}>
                          [{Object.entries(predicate.attributes).map(([k,v]) => `${k}: ${v}`).join(', ')}]
                        </span>
                      )}
                    </span>
                    {predicate.isNew && (
                      <span style={{
                        backgroundColor: '#ffc107',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>NEW</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {extractedQAs[currentQAIndex].newClassProposal && (
              <div style={{
                border: '2px solid #ffc107',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#fffbf0',
                marginBottom: '20px'
              }}>
                <h4 style={{ marginBottom: '10px', color: '#856404' }}>
                  <Plus size={20} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                  Neue Ontologie-Klasse vorgeschlagen
                </h4>
                <p><strong>Name:</strong> {extractedQAs[currentQAIndex].newClassProposal.name}</p>
                <p><strong>Elternklasse:</strong> {extractedQAs[currentQAIndex].newClassProposal.parent}</p>
                <p><strong>Eigenschaften:</strong></p>
                <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                  {extractedQAs[currentQAIndex].newClassProposal.properties.map((prop, idx) => (
                    <li key={idx}>{prop}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div style={{
              backgroundColor: '#e1bee7',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <h4 style={{ marginBottom: '10px', color: '#6a1b9a' }}>
                <MessageSquare size={20} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                Q&A Graph Integration
              </h4>
              <p style={{ fontSize: '14px', color: '#4a148c' }}>
                Diese Q&A wird mit "is_relevant_for" Beziehungen verknüpft zu:
              </p>
              <ul style={{ marginLeft: '20px', marginTop: '8px', fontSize: '14px' }}>
                {currentQAIndex === 0 && (
                  <>
                    <li>Anlage X500 (Instanz)</li>
                    <li>Fehler F42 (Instanz)</li>
                    <li>BMW München (Kunde)</li>
                    <li>Komponente (neue Klasse)</li>
                  </>
                )}
                {currentQAIndex === 1 && (
                  <>
                    <li>Bosch (Kunde)</li>
                    <li>Firmware v2.3 (Instanz)</li>
                    <li>Firmware (neue Klasse)</li>
                  </>
                )}
                {currentQAIndex === 2 && (
                  <>
                    <li>BMW Werk 2 (Kunde-Standort)</li>
                    <li>Wartungshinweis (neue Klasse)</li>
                    <li>Meister Huber (Ansprechpartner)</li>
                  </>
                )}
                {currentQAIndex === 3 && (
                  <>
                    <li>Schütz K4 (Komponente)</li>
                    <li>Anlage X300 (Instanz)</li>
                    <li>Inkompatibilität dokumentiert</li>
                  </>
                )}
                {currentQAIndex === 4 && (
                  <>
                    <li>Daimler Stuttgart (Kunde)</li>
                    <li>Umgebungsfaktor (neue Klasse)</li>
                    <li>Staubproblem identifiziert</li>
                  </>
                )}
              </ul>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={onConfirmMapping}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Check size={20} style={{ marginRight: '5px' }} />
                Bestätigen
              </button>
              <button
                onClick={onSkipMapping}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} style={{ marginRight: '5px' }} />
                Überspringen
              </button>
            </div>
          </>
        )}
        
        {processStep === 'complete' && (
          <div style={{
            textAlign: 'center',
            padding: '50px 0'
          }}>
            <CheckCircle size={64} color="#28a745" style={{ marginBottom: '20px' }} />
            <h3 style={{ color: '#28a745', marginBottom: '10px' }}>Expertenwissen gesichert!</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              {extractedQAs.length} kritische Wissensfragmente aus Herrn Wagners Dokumenten extrahiert
            </p>
            
            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '20px',
              borderRadius: '8px',
              border: '2px solid #4caf50'
            }}>
              <h4 style={{ color: '#2e7d32', marginBottom: '15px' }}>
                🧠 Das digitale Gedächtnis kann jetzt antworten:
              </h4>
              <ul style={{ color: '#424242', listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                  ✓ "Welcher Kunde hat die meisten F42-Fehler?" 
                  <span style={{ fontSize: '12px', color: '#666' }}> (Muster über alle Kunden erkannt)</span>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  ✓ "Welche Ersatzteile passen NICHT, obwohl kompatibel?" 
                  <span style={{ fontSize: '12px', color: '#666' }}> (47 versteckte Fallen gefunden!)</span>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  ✓ "Wartungsplan für neuen Kunden mit X500?" 
                  <span style={{ fontSize: '12px', color: '#666' }}> (Best Practices automatisch angewendet)</span>
                </li>
                <li>
                  ✓ "Wer ist Ansprechpartner bei BMW für Notfälle?" 
                  <span style={{ fontSize: '12px', color: '#666' }}> (Kontakte aus E-Mails extrahiert)</span>
                </li>
              </ul>
              <p style={{ 
                marginTop: '15px', 
                fontSize: '14px', 
                fontStyle: 'italic', 
                color: '#1b5e20',
                fontWeight: 'bold'
              }}>
                30 Jahre Erfahrung von Herrn Wagner - jetzt für immer verfügbar!
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return null;
};