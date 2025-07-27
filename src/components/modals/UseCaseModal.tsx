import React from 'react';
import { X, FileText, Calendar, UserCheck, Building, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UseCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UseCaseModal: React.FC<UseCaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-gray-200">
          {/* Header */}
          <div className="bg-gray-900 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h1 className="text-3xl font-bold mb-2">
              Wissensbewahrung bei Siemens
            </h1>
            <p className="text-gray-300 text-lg">
              30 Jahre Expertenwissen digitalisieren - bevor es zu spät ist
            </p>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Scenario */}
            <div className="mb-6 p-5 bg-gray-50 border border-gray-300 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-gray-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Kritische Situation: Herr Wagner geht in Rente
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Herr Wagner</strong>, Senior-Techniker bei Siemens mit über <strong>30 Jahren Erfahrung</strong>, 
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

            {/* Statistics Dashboard */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Herr Wagners Erfahrungsschatz in Zahlen:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gray-50 border-gray-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-8 w-8 text-gray-600" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">30</p>
                        <p className="text-sm text-gray-600">Jahre Erfahrung</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-50 border-gray-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-gray-600" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">4.5M</p>
                        <p className="text-sm text-gray-600">Eingesparte €</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-50 border-gray-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <UserCheck className="h-8 w-8 text-gray-600" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">723</p>
                        <p className="text-sm text-gray-600">Gelöste Fälle</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-50 border-gray-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Building className="h-8 w-8 text-gray-600" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">45</p>
                        <p className="text-sm text-gray-600">Kunden</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                onClick={onClose}
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