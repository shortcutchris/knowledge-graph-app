import React from 'react';
import { AlertCircle, Brain, CheckCircle, HelpCircle, MessageSquare, Plus, Check, X, Play } from 'lucide-react';
import type { QA } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QAExtractionPanelProps {
  processStep: string;
  extractedQAs: QA[];
  currentQAIndex: number;
  onConfirmMapping: () => void;
  onSkipMapping: () => void;
  onReset?: () => void;
  onShowCompletionModal?: () => void;
}

export const QAExtractionPanel: React.FC<QAExtractionPanelProps> = ({
  processStep,
  extractedQAs,
  currentQAIndex,
  onConfirmMapping,
  onSkipMapping,
  onReset,
  onShowCompletionModal
}) => {
  const handleStartExtraction = () => {
    // Highlight the document permanently
    const mainDoc = document.getElementById('main-document');
    const mainDocIcon = mainDoc?.querySelector('svg');
    if (mainDoc) {
      // Change to blue background
      mainDoc.classList.remove('bg-gray-50', 'border-gray-200');
      mainDoc.classList.add('bg-blue-50', 'border-blue-200', 'animate-highlight');
      
      // Change icon color
      if (mainDocIcon) {
        mainDocIcon.classList.remove('text-gray-600');
        mainDocIcon.classList.add('text-blue-600');
      }
      
      // Remove animation after it completes
      setTimeout(() => {
        mainDoc.classList.remove('animate-highlight');
      }, 1800);
    }
    
    // Trigger the extraction
    const uploadPanel = document.querySelector('[data-upload-trigger]') as HTMLElement;
    if (uploadPanel) {
      uploadPanel.click();
    }
  };

  if (processStep === 'upload') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative group animate-float">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <Button
            onClick={handleStartExtraction}
            size="lg"
            className="relative bg-blue-600 hover:bg-blue-700 text-white px-12 py-8 text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all transform duration-300"
          >
            <Play className="mr-3 h-6 w-6" />
            Extraktion starten
          </Button>
        </div>
      </div>
    );
  }
  
  if (processStep === 'extract') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping animation-delay-200"></div>
          
          {/* Core animation */}
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-8 shadow-2xl">
            <Brain size={48} className="text-white animate-pulse" />
          </div>
          
          {/* Rotating dots */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-700 font-medium">Extrahiere Wissen...</p>
          <p className="text-sm text-gray-500 mt-1">Analysiere Q&As und Beziehungen</p>
        </div>
      </div>
    );
  }
  
  if ((processStep === 'map' || processStep === 'complete') && extractedQAs.length > 0) {
    const progress = ((currentQAIndex + 1) / extractedQAs.length) * 100;
    
    if (processStep === 'complete') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <CheckCircle size={64} className="text-green-500 mb-5" />
          <h3 className="text-2xl font-semibold text-green-700 mb-2">Expertenwissen gesichert!</h3>
          <p className="text-gray-600 mb-8">
            {extractedQAs.length} kritische Wissensfragmente aus Herrn Wagners Dokumenten extrahiert
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={onReset}
              size="lg"
              variant="secondary"
              className="w-64"
            >
              Demo zurücksetzen
            </Button>
            
            <Button
              onClick={onShowCompletionModal}
              size="lg"
              className="w-64 bg-green-600 hover:bg-green-700 text-white"
            >
              Extraktionswissen ansehen
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Frage {currentQAIndex + 1} von {extractedQAs.length}
            </span>
            <span className="text-blue-600 font-medium">
              {Math.round(progress)}% Fertig
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {processStep === 'map' && (
          <div className="space-y-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                  <HelpCircle size={20} />
                  Extrahierte Q&A
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold mb-2 text-blue-900">Frage:</p>
                  <p className="text-blue-800">{extractedQAs[currentQAIndex].question}</p>
                </div>
                <div>
                  <p className="font-semibold mb-2 text-blue-900">Antwort:</p>
                  <p className="text-blue-800">{extractedQAs[currentQAIndex].answer}</p>
                </div>
                
                {/* Metadaten anzeigen */}
                {extractedQAs[currentQAIndex].metadata && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="flex flex-wrap gap-2">
                      {extractedQAs[currentQAIndex].metadata?.kategorie && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                          {extractedQAs[currentQAIndex].metadata.kategorie}
                        </Badge>
                      )}
                      {extractedQAs[currentQAIndex].metadata?.schwierigkeit && (
                        <Badge variant="secondary" className={`text-xs
                          ${extractedQAs[currentQAIndex].metadata.schwierigkeit === 'kritisch' ? 'bg-red-100 text-red-700' : ''}
                          ${extractedQAs[currentQAIndex].metadata.schwierigkeit === 'hoch' ? 'bg-orange-100 text-orange-700' : ''}
                          ${extractedQAs[currentQAIndex].metadata.schwierigkeit === 'mittel' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${extractedQAs[currentQAIndex].metadata.schwierigkeit === 'niedrig' ? 'bg-green-100 text-green-700' : ''}
                          ${extractedQAs[currentQAIndex].metadata.schwierigkeit === 'sozial' ? 'bg-purple-100 text-purple-700' : ''}
                        `}>
                          {extractedQAs[currentQAIndex].metadata.schwierigkeit}
                        </Badge>
                      )}
                      {extractedQAs[currentQAIndex].metadata?.kostenersparnis && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          💰 {extractedQAs[currentQAIndex].metadata.kostenersparnis}
                        </Badge>
                      )}
                      {extractedQAs[currentQAIndex].metadata?.datum && (
                        <span className="text-xs text-gray-500">
                          📅 {new Date(extractedQAs[currentQAIndex].metadata.datum!).toLocaleDateString('de-DE')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-gray-300">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-lg">Identifizierte Elemente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-gray-600 mb-2">Entitäten:</h5>
                  <div className="space-y-2">
                    {extractedQAs[currentQAIndex].entities.map((entity, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-2 rounded border ${
                        entity.isNew 
                          ? 'bg-yellow-50 border-yellow-300' 
                          : 'bg-blue-50 border-blue-300'
                      }`}>
                        <span className="text-sm font-medium">{entity.text}</span>
                        {entity.isNew && <Badge className="bg-green-500 text-white hover:bg-green-600">NEU</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-gray-600 mb-2">Beziehungen:</h5>
                  <div className="space-y-2">
                    {extractedQAs[currentQAIndex].predicates.map((predicate, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-2 rounded border ${
                        predicate.isNew 
                          ? 'bg-yellow-50 border-yellow-300' 
                          : 'bg-blue-50 border-blue-300'
                      }`}>
                        <div className="text-sm">
                          <span className="font-medium">{predicate.text}</span>
                          {predicate.attributes && (
                            <span className="text-gray-600 ml-2 text-xs">
                              [{Object.entries(predicate.attributes).map(([k,v]) => `${k}: ${v}`).join(', ')}]
                            </span>
                          )}
                        </div>
                        {predicate.isNew && <Badge className="bg-green-500 text-white hover:bg-green-600">NEU</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {extractedQAs[currentQAIndex].newClassProposal && (
              <Alert className="border-amber-200 bg-amber-50">
                <Plus className="h-4 w-4" />
                <AlertDescription>
                  <h4 className="font-semibold mb-2">Neue Ontologie-Klasse vorgeschlagen</h4>
                  <p><strong>Name:</strong> {extractedQAs[currentQAIndex].newClassProposal.name}</p>
                  <p><strong>Elternklasse:</strong> {extractedQAs[currentQAIndex].newClassProposal.parent}</p>
                  <p><strong>Eigenschaften:</strong></p>
                  <ul className="list-disc list-inside mt-1">
                    {extractedQAs[currentQAIndex].newClassProposal.properties.map((prop, idx) => (
                      <li key={idx} className="text-sm">{prop}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-purple-900">
                  <MessageSquare size={20} />
                  Q&A Graph Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-800 mb-2">
                  Diese Q&A wird mit "is_relevant_for" Beziehungen verknüpft zu:
                </p>
                <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
                  {currentQAIndex === 0 && (
                    <>
                      <li>Anlage X500 (Instanz)</li>
                      <li>Fehler F42 (Instanz)</li>
                      <li>BMW München (Kunde)</li>
                      <li>Hr. Maier (Kontakt - Hydrotech)</li>
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
              </CardContent>
            </Card>
            
            <div className="flex gap-3">
              <Button
                onClick={onConfirmMapping}
                className="flex-1"
                size="lg"
              >
                <Check className="mr-2 h-4 w-4" />
                Bestätigen
              </Button>
              <Button
                onClick={onSkipMapping}
                variant="secondary"
                className="flex-1"
                size="lg"
              >
                <X className="mr-2 h-4 w-4" />
                Überspringen
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return null;
};