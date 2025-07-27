import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, FileText, Calendar, User, Building, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { wartungsberichtSeiten } from '../../data/wartungsberichtContent';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ isOpen, onClose, initialPage }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  
  // Set initial page when modal opens
  React.useEffect(() => {
    if (isOpen && initialPage !== undefined) {
      // Find the index of the page with the given page number
      const pageIndex = wartungsberichtSeiten.findIndex(page => page.seitenNummer === initialPage);
      if (pageIndex !== -1) {
        setCurrentPage(pageIndex);
      }
    }
  }, [isOpen, initialPage]);
  
  const currentPageData = wartungsberichtSeiten[currentPage];
  const totalPages = wartungsberichtSeiten.length;
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
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
        <div className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-in zoom-in-95'
        }`}>
          {/* Header */}
          <div className="bg-gray-900 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              <div>
                <h2 className="text-lg font-semibold">Wagner_Wartungsberichte_2019-2024.pdf</h2>
                <p className="text-sm text-gray-300">Seite {currentPageData.seitenNummer} von 847</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Document Content */}
          <div className="p-6 bg-gray-50 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            <Card className="mx-auto max-w-3xl bg-white shadow-lg" style={{ 
              background: 'linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)',
              fontFamily: 'monospace'
            }}>
              <div className="p-8">
                {/* Page Header */}
                <div className="border-b-2 border-gray-800 pb-4 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">WARTUNGSBERICHT Nr. {currentPageData.kopfzeile.berichtNr}</h3>
                      <p className="text-sm text-gray-600 mt-1">Seite {currentPageData.seitenNummer}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="flex items-center gap-2 justify-end">
                        <Calendar className="h-4 w-4" />
                        {currentPageData.datum}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="font-semibold">Techniker:</span> {currentPageData.kopfzeile.techniker}
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-600" />
                      <span className="font-semibold">Kunde:</span> {currentPageData.kopfzeile.kunde}
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Wrench className="h-4 w-4 text-gray-600" />
                      <span className="font-semibold">Anlage:</span> {currentPageData.kopfzeile.anlage}
                    </div>
                  </div>
                </div>

                {/* Page Title */}
                <h4 className="text-lg font-bold mb-4 underline">{currentPageData.inhalt.titel}</h4>

                {/* Content Sections */}
                <div className="space-y-4">
                  {currentPageData.inhalt.abschnitte.map((abschnitt, idx) => {
                    const baseClass = abschnitt.hervorhebung ? 'bg-yellow-100 -mx-2 px-2 py-1 rounded' : '';
                    
                    switch (abschnitt.typ) {
                      case 'text':
                        return (
                          <div key={idx} className={baseClass}>
                            <p className="whitespace-pre-line text-sm leading-relaxed">
                              {abschnitt.inhalt as string}
                            </p>
                            {abschnitt.qaRef && (
                              <span className="text-xs text-orange-600 font-semibold mt-1 inline-block">
                                → Quelle für Q&A #{abschnitt.qaRef}
                              </span>
                            )}
                          </div>
                        );
                        
                      case 'liste':
                        return (
                          <div key={idx} className={baseClass}>
                            <ul className="list-disc list-inside space-y-1">
                              {(abschnitt.inhalt as string[]).map((item, i) => (
                                <li key={i} className="text-sm">{item}</li>
                              ))}
                            </ul>
                          </div>
                        );
                        
                      case 'notiz':
                        return (
                          <div key={idx} className={`${baseClass} border-l-4 border-red-500 bg-red-50 p-3 my-4`}>
                            <p className="text-sm font-mono text-red-800 whitespace-pre-line">
                              {abschnitt.inhalt as string}
                            </p>
                            {abschnitt.qaRef && (
                              <span className="text-xs text-orange-600 font-semibold mt-2 inline-block">
                                → Quelle für Q&A #{abschnitt.qaRef}
                              </span>
                            )}
                          </div>
                        );
                        
                      case 'tabelle':
                        const tableData = abschnitt.inhalt as Array<{ spalte1: string; spalte2: string }>;
                        return (
                          <div key={idx} className={baseClass}>
                            <table className="w-full text-sm">
                              <tbody>
                                {tableData.map((row, i) => (
                                  <tr key={i} className={i === 0 ? 'font-semibold border-b' : ''}>
                                    <td className="py-1 pr-4">{row.spalte1}</td>
                                    <td className="py-1">{row.spalte2}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                        
                      default:
                        return null;
                    }
                  })}
                </div>

                {/* Page Footer */}
                <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500">
                  <p>Wagner Expertenwissen • Digitalisiert durch Corporate Digital Brain</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Footer with Navigation */}
          <div className="border-t border-gray-200 p-4 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={prevPage}
                disabled={currentPage === 0}
                size="sm"
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4" />
                Vorherige
              </Button>
              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                size="sm"
                variant="outline"
              >
                Nächste
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              Seite {currentPage + 1} von {totalPages} Beispielseiten • 
              <span className="text-orange-600 font-semibold ml-2">
                {currentPageData.inhalt.abschnitte.filter(a => a.qaRef).length} Q&A-Quellen auf dieser Seite
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};