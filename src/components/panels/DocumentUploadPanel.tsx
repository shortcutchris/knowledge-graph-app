import React from 'react';
import { Upload, CheckCircle } from 'lucide-react';

interface DocumentUploadPanelProps {
  uploadedDoc: { name: string; size: string } | null;
  onDocumentUpload: () => void;
  processStep: string;
  onReset: () => void;
}

export const DocumentUploadPanel: React.FC<DocumentUploadPanelProps> = ({
  uploadedDoc,
  onDocumentUpload,
  processStep,
  onReset
}) => {
  return (
    <>
      <div style={{
        backgroundColor: '#e3f2fd',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #2196f3'
      }}>
        <h4 style={{ margin: 0, color: '#1565c0', fontSize: '14px' }}>
          📌 Szenario: Herr Wagner geht in Rente
        </h4>
        <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#424242' }}>
          30 Jahre Erfahrung als Senior-Techniker bei Siemens. 
          Sein Wissen steckt in tausenden Dokumenten...
        </p>
      </div>
      
      {!uploadedDoc ? (
        <div 
          onClick={onDocumentUpload}
          style={{
            border: '2px dashed #007bff',
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
            backgroundColor: '#f8f9fa'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e8f0fe'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
        >
          <Upload size={48} color="#007bff" style={{ marginBottom: '10px' }} />
          <p style={{ color: '#666', margin: '10px 0' }}>Klicken zum Dokument hochladen</p>
          <p style={{ color: '#999', fontSize: '14px' }}>PDF, DOC, XLSX unterstützt</p>
        </div>
      ) : (
        <div style={{
          border: '1px solid #28a745',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#d4edda'
        }}>
          <CheckCircle size={24} color="#28a745" style={{ marginBottom: '10px' }} />
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{uploadedDoc.name}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>{uploadedDoc.size}</p>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Wagners Dokumente (30 Jahre)</h3>
        <div style={{ fontSize: '14px', color: '#666' }}>
          <div style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>• Wagner_Praesentation_X500.pptx</div>
          <div style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>• Email_Archiv_2020-2024.mbox</div>
          <div style={{ padding: '8px 0' }}>• Ersatzteil_Inkompatibilitaeten.xlsx</div>
        </div>
      </div>

      {processStep === 'complete' && (
        <button
          onClick={onReset}
          style={{
            marginTop: '30px',
            width: '100%',
            padding: '12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Demo zurücksetzen
        </button>
      )}
    </>
  );
};