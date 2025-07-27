import React, { useState } from 'react';
import { X, FileText, Calendar, UserCheck, Building, AlertCircle, TrendingDown, Clock, Users, Lightbulb, AlertTriangle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import expertWagnerImage from '../../assets/images/expert_herr_wagner.png';

interface UseCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UseCaseModal: React.FC<UseCaseModalProps> = ({ isOpen, onClose }) => {
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
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto transition-all duration-300 border border-gray-200 ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-in zoom-in-95 slide-in-from-bottom-4'
        }`}>
          {/* Header */}
          <div className="bg-gray-900 p-6 text-white relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h1 className="text-3xl font-bold mb-2">
              Corporate Digital Brain - Knowledge Builder
            </h1>
            <p className="text-gray-300 text-lg">
              30 Jahre Expertenwissen digitalisieren - bevor es zu spät ist
            </p>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Scenario */}
            <div className="mb-6 p-5 bg-gray-50 border border-gray-300 rounded-lg">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 relative">
                  <img 
                    src={expertWagnerImage} 
                    alt="Herr Wagner" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white rounded-full p-2">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Kritische Situation: Herr Wagner geht in Rente
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Herr Wagner</strong>, Senior-Techniker bei einem führenden Maschinenbau-Unternehmen mit über <strong>30 Jahren Erfahrung</strong>, 
                    geht in wenigen Monaten in Rente. Sein Wissen über Anlagen, Fehlerdiagnosen, Kundenkontakte 
                    und spezielle Lösungen steckt in tausenden Dokumenten, E-Mails und handschriftlichen Notizen.
                    <br /><br />
                    <span className="text-gray-900 font-medium">
                      Ohne Digitalisierung geht dieses unbezahlbare Wissen für immer verloren!
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Risk & Value Dashboard */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Was auf dem Spiel steht:
              </h3>
              
              {/* Critical Risk Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <TrendingDown className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-red-700">-85%</p>
                        <p className="text-sm font-semibold text-red-700">Wissensverlust bei Pensionierung</p>
                        <p className="text-xs text-red-600 mt-1">
                          Nur 15% des Expertenwissens ist dokumentiert
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-orange-700">18+ Monate</p>
                        <p className="text-sm font-semibold text-orange-700">Einarbeitungszeit Nachfolger</p>
                        <p className="text-xs text-orange-600 mt-1">
                          Ohne strukturiertes Wissen
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">
                💡 Warum ist das so wertvoll?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <div>
                    <strong className="text-blue-900">Implizites Wissen</strong>
                    <p className="text-gray-700 mt-1">
                      Wagner weiß Dinge, die nirgends stehen - Tricks, die Millionen sparen
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <div>
                    <strong className="text-blue-900">Persönliche Netzwerke</strong>
                    <p className="text-gray-700 mt-1">
                      30 Jahre Kontakte & Vertrauen - unbezahlbar und unersetzlich
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <div>
                    <strong className="text-blue-900">Fehler-Historie</strong>
                    <p className="text-gray-700 mt-1">
                      Wissen über teure Fehler, die nie wieder passieren dürfen
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="mb-6 p-5 bg-gray-900 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-white">
                So funktioniert die Demo:
              </h3>
              <ol className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-white text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <div>
                    <strong className="text-white">Dokument auswählen:</strong> Klicken Sie nach dem Start auf das blau hervorgehobene Hauptdokument 
                    im linken Panel, um Herrn Wagners Wartungsberichte zu verarbeiten.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-white text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <div>
                    <strong className="text-white">KI-Extraktion:</strong> Die KI extrahiert automatisch Q&As aus 30 Jahren 
                    Dokumentation und identifiziert Entitäten, Beziehungen und Expertenwissen.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-white text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <div>
                    <strong className="text-white">Wissensgraph aufbauen:</strong> Bestätigen Sie die Vorschläge, um einen 
                    durchsuchbaren Knowledge Graph mit Herrn Wagner im Zentrum zu erstellen.
                  </div>
                </li>
              </ol>
            </div>

            {/* Benefits */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-300 mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Was wird bewahrt:
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-gray-900">•</span>
                  Geheime Problemlösungen & Workarounds
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-900">•</span>
                  Persönliche Kundenkontakte & Ansprechpartner
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-900">•</span>
                  Undokumentierte Maschineneigenheiten
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-900">•</span>
                  Kostspielige Fehler & deren Vermeidung
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-900">•</span>
                  Bewährte Wartungsstrategien
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-900">•</span>
                  Versteckte Optimierungspotentiale
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Diese Demo zeigt, wie KI dabei hilft, wertvolles Expertenwissen zu bewahren.
              </p>
              <Button
                onClick={handleClose}
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white gap-2"
              >
                <FileText className="h-5 w-5" />
                Demo starten
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};