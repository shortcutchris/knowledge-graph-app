import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, FileText, FolderOpen, Archive, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentPreviewModal } from '../modals/DocumentPreviewModal';

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
  const [showMainDocument, setShowMainDocument] = useState(true);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archivedCount, setArchivedCount] = useState(0);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  
  useEffect(() => {
    if (processStep === 'complete' && showMainDocument) {
      // Start archive animation when complete
      setTimeout(() => {
        const mainDoc = document.getElementById('main-document');
        const archiveIcon = document.getElementById('archive-icon');
        
        if (mainDoc && archiveIcon) {
          const docRect = mainDoc.getBoundingClientRect();
          const iconRect = archiveIcon.getBoundingClientRect();
          
          const deltaX = iconRect.left - docRect.left;
          const deltaY = iconRect.top - docRect.top;
          
          // Set CSS variables for animation
          mainDoc.style.setProperty('--archive-x', `${deltaX}px`);
          mainDoc.style.setProperty('--archive-y', `${deltaY}px`);
        }
        
        setIsArchiving(true);
        // After animation, hide document and increment counter
        setTimeout(() => {
          setShowMainDocument(false);
          setArchivedCount(1);
          setIsArchiving(false);
        }, 800);
      }, 500);
    }
    
    // Reset when demo restarts
    if (processStep === 'upload' && !showMainDocument) {
      setShowMainDocument(true);
      setArchivedCount(0);
    }
  }, [processStep, showMainDocument]);
  
  return (
    <div className="h-full flex flex-col">
      {/* Hidden trigger for extraction button */}
      <button 
        data-upload-trigger 
        onClick={onDocumentUpload} 
        className="hidden"
        aria-hidden="true"
      />
      {/* Always show document list */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Verfügbare Dokumente
            </h3>
          </div>
          
          {/* Archive indicator */}
          <div className={`flex items-center gap-2 transition-all duration-500 ${archivedCount > 0 ? 'opacity-100' : 'opacity-0'}`}>
            <Archive className="h-5 w-5 text-green-600" id="archive-icon" />
            <Badge className="bg-green-100 text-green-700 text-xs">
              {archivedCount} archiviert
            </Badge>
          </div>
        </div>
        <div className="space-y-2 relative">
          {showMainDocument && (
            <div 
              id="main-document"
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all bg-gray-50 border-gray-200 ${
                isArchiving ? 'animate-archive' : ''
              } ${processStep !== 'complete' ? 'hover:bg-gray-100 cursor-pointer group' : ''}`}
              onClick={() => processStep !== 'complete' && setShowDocumentPreview(true)}
            >
              <FileText className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Wagner_Wartungsberichte_2019-2024.pdf</p>
                <p className="text-xs text-gray-600">
                  45.3 MB • 847 Seiten • Hauptdokument
                </p>
              </div>
              {processStep !== 'complete' && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDocumentPreview(true);
                  }}
                  title="Dokument ansehen"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
            <FileText className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Fehlerdiagnosen_Sammlung.xlsx</p>
              <p className="text-xs text-gray-500">12.1 MB • 723 Einträge</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
            <FileText className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Kundenkontakte_Notizen.docx</p>
              <p className="text-xs text-gray-500">3.7 MB • 156 Kontakte</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
            <FileText className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Email_Archiv_2020-2024.mbox</p>
              <p className="text-xs text-gray-500">234.5 MB • 8,432 E-Mails</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
            <FileText className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Ersatzteil_Inkompatibilitaeten.xlsx</p>
              <p className="text-xs text-gray-500">1.2 MB • 156 Einträge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dropzone for new documents */}
      <div className="mt-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors bg-gray-50/50">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Weitere Dokumente hinzufügen</p>
          <p className="text-xs text-gray-500 mt-1">Drag & Drop oder klicken</p>
        </div>
      </div>
      
      {/* Document Preview Modal */}
      <DocumentPreviewModal 
        isOpen={showDocumentPreview}
        onClose={() => setShowDocumentPreview(false)}
      />
    </div>
  );
};