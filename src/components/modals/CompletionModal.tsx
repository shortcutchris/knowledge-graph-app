import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  extractedQAsCount: number;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({ isOpen, onClose, extractedQAsCount }) => {
  const [isClosing, setIsClosing] = useState(false);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-md z-50 transition-all duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100 animate-in fade-in'
        }`}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col pointer-events-auto transition-all duration-300 border border-gray-200 ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-in zoom-in-95 slide-in-from-bottom-4'
        }`}>
          {/* Header */}
          <div className="bg-[#000e22] p-6 text-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div>
                <h1 className="text-3xl font-bold">
                  Expertenwissen erfolgreich gesichert!
                </h1>
                <p className="text-gray-300 text-lg mt-1">
                  30 Jahre Erfahrung digitalisiert und durchsuchbar gemacht
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* Statistics */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Was wurde bewahrt:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gray-50 border-gray-300">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-gray-900">{extractedQAsCount}</p>
                    <p className="text-sm text-gray-600">Q&As extrahiert</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-gray-300">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-gray-900">723</p>
                    <p className="text-sm text-gray-600">Gelöste Fälle</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-gray-300">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-gray-900">4.5M€</p>
                    <p className="text-sm text-gray-600">Eingespart</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-gray-300">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-gray-900">45</p>
                    <p className="text-sm text-gray-600">Kunden</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Knowledge Graph Capabilities */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <h4 className="text-green-800 font-semibold mb-4">
                  🧠 Das digitale Gedächtnis kann jetzt antworten:
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div>
                      <span className="font-medium">"Welche Anlagen haben hydraulische Probleme?"</span>
                      <span className="text-sm text-gray-600 block">→ X500 zeigt Druckschwankungen, FB-2000 mit Getriebeproblemen</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div>
                      <span className="font-medium">"Welche Kunden kennt Wagner persönlich?"</span>
                      <span className="text-sm text-gray-600 block">→ BMW München, Bosch, BMW Werk 2, VW Wolfsburg, Daimler Stuttgart</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div>
                      <span className="font-medium">"Welche Servicepartner sind vertrauenswürdig?"</span>
                      <span className="text-sm text-gray-600 block">→ Hydrotech Augsburg, Müller Präzisionstechnik, OELCHECK Brannenburg</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div>
                      <span className="font-medium">"Welche Firmware-Bugs sind bekannt?"</span>
                      <span className="text-sm text-gray-600 block">→ SPS-Steuerung V2.8.1, Sicherheits-SPS vor 2019</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <div>
                      <span className="font-medium">"Welche Kostenersparnisse sind dokumentiert?"</span>
                      <span className="text-sm text-gray-600 block">→ 3.520€ Hydraulik, 2.5 Mio€/Jahr VW, ROI 1:15 Ölanalyse</span>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="text-blue-900 font-semibold mb-2">💡 Weitere Abfragemöglichkeiten:</h5>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• "Zeige alle Komponenten mit Konstruktionsfehlern"</li>
                    <li>• "Welche Anlagen sind bei welchen Kunden?"</li>
                    <li>• "Alle Notfall-Lösungen mit Sicherheitsrisiko?"</li>
                    <li>• "Dokumentierte Inkompatibilitäten?"</li>
                    <li>• "Wartungsstrategien mit ROI &gt; 10?"</li>
                  </ul>
                </div>
                
                <p className="mt-6 text-center text-sm font-medium text-green-700 italic">
                  30 Jahre Erfahrung von Herrn Wagner - jetzt für immer verfügbar!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Wissensgraph erfolgreich aufgebaut und durchsuchbar.
              </p>
              <Button
                onClick={handleClose}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Schließen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};