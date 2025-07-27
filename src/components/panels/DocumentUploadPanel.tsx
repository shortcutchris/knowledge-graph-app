import React from 'react';
import { Upload, CheckCircle, FileText, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="h-full flex flex-col">
      {!uploadedDoc ? (
        <>
          {/* Available Documents */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen className="h-5 w-5 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">
                Verfügbare Dokumente
              </h3>
            </div>
            <div className="space-y-2">
              <div 
                onClick={onDocumentUpload}
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <FileText className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Wagner_Wartungsberichte_2019-2024.pdf</p>
                  <p className="text-xs text-gray-600">45.3 MB • 847 Seiten • Hauptdokument</p>
                </div>
              </div>
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

          {/* Info Section */}
          <div className="mt-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              <strong>Tipp:</strong> Klicken Sie auf das blau hervorgehobene Hauptdokument, 
              um die Extraktion zu starten.
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Uploaded Document */}
          <Card className="border-green-200 bg-green-50 mb-4">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{uploadedDoc.name}</p>
                  <p className="text-sm text-gray-600">{uploadedDoc.size} • Wird verarbeitet...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {processStep === 'complete' && (
            <Button
              onClick={onReset}
              variant="secondary"
              className="w-full"
            >
              Demo zurücksetzen
            </Button>
          )}
        </>
      )}
    </div>
  );
};