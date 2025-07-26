import React from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      <Alert className="mb-4 border-blue-200 bg-blue-50">
        <AlertDescription className="text-blue-900">
          <h4 className="font-semibold mb-1">📌 Szenario: Herr Wagner geht in Rente</h4>
          <p className="text-sm">
            30 Jahre Erfahrung als Senior-Techniker bei Siemens. 
            Sein Wissen steckt in tausenden Dokumenten...
          </p>
        </AlertDescription>
      </Alert>
      
      {!uploadedDoc ? (
        <Card 
          onClick={onDocumentUpload}
          className="border-2 border-dashed border-blue-300 hover:border-blue-400 bg-blue-50/30 hover:bg-blue-50/50 cursor-pointer transition-all"
        >
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Upload size={48} className="text-blue-500 mb-3" />
            <p className="text-gray-600 mb-2">Klicken zum Dokument hochladen</p>
            <p className="text-sm text-gray-500">PDF, DOC, XLSX unterstützt</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} className="text-green-600" />
              <div>
                <p className="font-medium text-gray-900">{uploadedDoc.name}</p>
                <p className="text-sm text-gray-600">{uploadedDoc.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-8">
        <h3 className="text-base font-semibold mb-4">Wagners Dokumente (30 Jahre)</h3>
        <div className="space-y-2">
          <div className="py-2 px-3 border-b text-sm text-gray-600 hover:bg-gray-50">
            • Wagner_Praesentation_X500.pptx
          </div>
          <div className="py-2 px-3 border-b text-sm text-gray-600 hover:bg-gray-50">
            • Email_Archiv_2020-2024.mbox
          </div>
          <div className="py-2 px-3 text-sm text-gray-600 hover:bg-gray-50">
            • Ersatzteil_Inkompatibilitaeten.xlsx
          </div>
        </div>
      </div>

      {processStep === 'complete' && (
        <Button
          onClick={onReset}
          variant="secondary"
          className="w-full mt-8"
        >
          Demo zurücksetzen
        </Button>
      )}
    </>
  );
};