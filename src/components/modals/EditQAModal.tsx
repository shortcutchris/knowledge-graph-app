import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { QA } from '../../types';

interface EditQAModalProps {
  isOpen: boolean;
  onClose: () => void;
  qa: QA;
  onSave: (updatedQA: { question: string; answer: string }) => void;
}

export const EditQAModal: React.FC<EditQAModalProps> = ({ 
  isOpen, 
  onClose, 
  qa, 
  onSave 
}) => {
  const [question, setQuestion] = useState(qa.question);
  const [answer, setAnswer] = useState(qa.answer);
  const [isClosing, setIsClosing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      // Reset to original values
      setQuestion(qa.question);
      setAnswer(qa.answer);
    }, 300);
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate processing time
    setTimeout(() => {
      onSave({ question, answer });
      setIsSaving(false);
      handleClose();
    }, 1000);
  };
  
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100 animate-in fade-in'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div className={`bg-white rounded-xl shadow-2xl max-w-2xl w-full h-[85vh] flex flex-col pointer-events-auto transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-in zoom-in-95'
        }`}>
          {/* Header */}
          <div className="bg-[#000e22] p-4 text-white flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold">Q&A bearbeiten</h2>
            <button
              onClick={handleClose}
              className="p-1 rounded hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tipp:</strong> Nach dem Speichern werden die Entitäten und Beziehungen automatisch neu extrahiert und an Ihren geänderten Text angepasst.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="question" className="text-sm font-semibold mb-2">
                  Frage
                </Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[80px] resize-none"
                  placeholder="Geben Sie die Frage ein..."
                />
              </div>

              <div>
                <Label htmlFor="answer" className="text-sm font-semibold mb-2">
                  Antwort
                </Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[120px] resize-none"
                  placeholder="Geben Sie die Antwort ein..."
                />
              </div>
            </div>

            {/* Example hint */}
            <Card className="bg-gray-50 border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Beispiel-Änderungen:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Präzisieren: "Fehler F42" → "Überhitzungsfehler F42"</li>
                <li>• Details ergänzen: Namen, Telefonnummern, Standorte</li>
                <li>• Kontext hinzufügen: "bei BMW München in Halle 3"</li>
                <li>• Fachbegriffe korrigieren oder vereinfachen</li>
              </ul>
            </Card>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-2 flex-shrink-0">
            <Button
              onClick={handleClose}
              variant="outline"
              disabled={isSaving}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || (!question.trim() || !answer.trim())}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verarbeite...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Speichern & Neu analysieren
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};