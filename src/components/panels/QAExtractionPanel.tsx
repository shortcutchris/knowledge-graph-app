import React from 'react';
import { AlertCircle, Brain, CheckCircle, HelpCircle, MessageSquare, Plus, Check, X } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-12">
        <div className="p-4 rounded-full bg-gray-100 mb-4">
          <AlertCircle size={48} className="text-gray-400" />
        </div>
        <p className="text-gray-600 text-center">Laden Sie ein Dokument hoch, um die Extraktion zu starten</p>
      </div>
    );
  }
  
  if (processStep === 'extract') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Brain size={48} className="text-blue-500 animate-spin mb-5" />
        <p className="text-gray-600">Extrahiere Q&As aus dem Dokument...</p>
      </div>
    );
  }
  
  if ((processStep === 'map' || processStep === 'complete') && extractedQAs.length > 0) {
    const progress = ((currentQAIndex + 1) / extractedQAs.length) * 100;
    
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
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-gray-100 border border-gray-200">
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
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-gray-100 border border-gray-200">
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
        
        {processStep === 'complete' && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle size={64} className="text-green-500 mb-5" />
            <h3 className="text-2xl font-semibold text-green-700 mb-2">Expertenwissen gesichert!</h3>
            <p className="text-gray-600 mb-6">
              {extractedQAs.length} kritische Wissensfragmente aus Herrn Wagners Dokumenten extrahiert
            </p>
            
            <Card className="bg-green-50 border-green-200 w-full">
              <CardContent className="pt-6">
                <h4 className="text-green-800 font-semibold mb-4">
                  🧠 Das digitale Gedächtnis kann jetzt antworten:
                </h4>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div>
                      <span className="font-medium">"Welcher Kunde hat die meisten F42-Fehler?"</span>
                      <span className="text-sm text-gray-600 block">Muster über alle Kunden erkannt</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div>
                      <span className="font-medium">"Welche Ersatzteile passen NICHT, obwohl kompatibel?"</span>
                      <span className="text-sm text-gray-600 block">47 versteckte Fallen gefunden!</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div>
                      <span className="font-medium">"Wartungsplan für neuen Kunden mit X500?"</span>
                      <span className="text-sm text-gray-600 block">Best Practices automatisch angewendet</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div>
                      <span className="font-medium">"Wer ist Ansprechpartner bei BMW für Notfälle?"</span>
                      <span className="text-sm text-gray-600 block">Kontakte aus E-Mails extrahiert</span>
                    </div>
                  </li>
                </ul>
                <p className="mt-6 text-sm font-medium text-green-700 italic">
                  30 Jahre Erfahrung von Herrn Wagner - jetzt für immer verfügbar!
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }
  
  return null;
};