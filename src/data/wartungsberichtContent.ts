export interface WartungsberichtSeite {
  seitenNummer: number;
  datum: string;
  kopfzeile: {
    berichtNr: string;
    techniker: string;
    kunde: string;
    anlage: string;
  };
  inhalt: {
    titel: string;
    abschnitte: Array<{
      typ: 'text' | 'liste' | 'notiz' | 'tabelle';
      inhalt: string | string[] | Array<{ spalte1: string; spalte2: string }>;
      hervorhebung?: boolean;
      qaRef?: number; // Reference to Q&A number
    }>;
  };
}

export const wartungsberichtSeiten: WartungsberichtSeite[] = [
  {
    seitenNummer: 156,
    datum: '15.03.2019',
    kopfzeile: {
      berichtNr: '2019-0156',
      techniker: 'Wagner, H.',
      kunde: 'BMW München',
      anlage: 'X500 (Baujahr 2011)'
    },
    inhalt: {
      titel: 'STÖRUNGSBEHEBUNG - FEHLERCODE F42',
      abschnitte: [
        {
          typ: 'text',
          inhalt: 'FEHLERBESCHREIBUNG:\nAnlage stoppt wiederholt nach 3-4 Stunden Dauerbetrieb. Fehlercode F42 im Display. Kunde berichtet von Produktionsausfällen in den letzten 2 Wochen.'
        },
        {
          typ: 'liste',
          inhalt: [
            'Fehlercode F42 tritt auf',
            'Überhitzung Schaltschrank Sektor 3',
            'Sporadische Spannungsspitzen gemessen',
            'Kondensator C3 zeigt Verfärbungen'
          ]
        },
        {
          typ: 'text',
          inhalt: 'DIAGNOSE:\nNach systematischer Fehlersuche und Ausschlussverfahren wurde Kondensator C3 als Ursache identifiziert. Dies ist ein bekanntes Problem bei X500-Anlagen nach 8-10 Jahren Betriebszeit.',
          hervorhebung: true,
          qaRef: 1
        },
        {
          typ: 'notiz',
          inhalt: '⚠️ WICHTIG! Bei Ersatz IMMER Teil-Nr. 4711 verwenden! \nTeil 4712 passt mechanisch, hat aber falsche Spannungsfestigkeit! \nSchon 3x bei BMW München aufgetreten!',
          hervorhebung: true,
          qaRef: 1
        },
        {
          typ: 'text',
          inhalt: 'DURCHGEFÜHRTE ARBEITEN:'
        },
        {
          typ: 'liste',
          inhalt: [
            'Kondensator C3 ausgetauscht (Teil-Nr. 4711)',
            'Kühlsystem gereinigt und entstaubt',
            'Alle Anschlüsse nachgezogen',
            'Testlauf 6 Stunden ohne Störung'
          ]
        },
        {
          typ: 'notiz',
          inhalt: 'Ansprechpartner vor Ort: Hr. Maier (Hydrotech Augsburg)\nTel: 0821-445566 - kennt die Anlage gut!',
          hervorhebung: true
        }
      ]
    }
  },
  {
    seitenNummer: 203,
    datum: '07.08.2019',
    kopfzeile: {
      berichtNr: '2019-0203',
      techniker: 'Wagner, H.',
      kunde: 'Bosch Stuttgart',
      anlage: 'Steuerungssystem (2015)'
    },
    inhalt: {
      titel: 'FIRMWARE-UPDATE PROBLEMATIK',
      abschnitte: [
        {
          typ: 'text',
          inhalt: 'SITUATION:\nKunde möchte auf neueste Firmware 2.5 updaten. Habe dringend abgeraten!'
        },
        {
          typ: 'text',
          inhalt: 'HINTERGRUND:\nBosch verwendet noch alte SPS-Generation. Firmware-Versionen ab 2.4 haben bekannte Timing-Probleme mit dieser Hardware-Kombination.',
          hervorhebung: true,
          qaRef: 2
        },
        {
          typ: 'notiz',
          inhalt: 'MERKE: Bei Bosch-Anlagen IMMER Version 2.3 beibehalten!\n2019 hatte Update auf 2.4 zu 6 Stunden Produktionsausfall geführt!',
          hervorhebung: true,
          qaRef: 2
        },
        {
          typ: 'tabelle',
          inhalt: [
            { spalte1: 'Version', spalte2: 'Kompatibilität' },
            { spalte1: '2.3', spalte2: '✓ Stabil mit Bosch-SPS' },
            { spalte1: '2.4', spalte2: '✗ Timing-Probleme' },
            { spalte1: '2.5', spalte2: '✗ Nicht getestet' }
          ]
        },
        {
          typ: 'text',
          inhalt: 'EMPFEHLUNG:\nKunde überzeugt bei Version 2.3 zu bleiben. Dokumentation für Nachfolger hinterlegt.'
        }
      ]
    }
  },
  {
    seitenNummer: 378,
    datum: '12.11.2020',
    kopfzeile: {
      berichtNr: '2020-0378',
      techniker: 'Wagner, H.',
      kunde: 'BMW Werk 2',
      anlage: 'Verbundanlage A/B/C'
    },
    inhalt: {
      titel: 'KRITISCHER WARTUNGSHINWEIS - VERBUNDSYSTEM',
      abschnitte: [
        {
          typ: 'text',
          inhalt: 'ACHTUNG - SICHERHEITSKRITISCH!',
          hervorhebung: true
        },
        {
          typ: 'text',
          inhalt: 'Die drei Anlagen laufen im Verbund mit gemeinsamen Kühlkreislauf. Bei Wartung MÜSSEN IMMER alle drei Anlagen gleichzeitig abgeschaltet werden!',
          hervorhebung: true,
          qaRef: 3
        },
        {
          typ: 'notiz',
          inhalt: '⚠️ LEBENSGEFAHR!\nBei Einzelabschaltung droht Druckabfall im Kühlsystem!\nKann zu Kesselschaden führen!',
          hervorhebung: true,
          qaRef: 3
        },
        {
          typ: 'text',
          inhalt: 'ANSPRECHPARTNER VOR ORT:'
        },
        {
          typ: 'liste',
          inhalt: [
            'Meister Huber: 0171-2345678',
            'Kennt alle Eigenheiten der Anlage',
            'Immer VOR Arbeiten kontaktieren!',
            'Schichtplan beachten (Mo-Fr 6-14 Uhr)'
          ],
          hervorhebung: true,
          qaRef: 3
        },
        {
          typ: 'text',
          inhalt: 'Dieser Hinweis wurde in Werksdokumentation aufgenommen nach Beinahe-Unfall 2019.'
        }
      ]
    }
  },
  {
    seitenNummer: 512,
    datum: '23.05.2021',
    kopfzeile: {
      berichtNr: '2021-0512',
      techniker: 'Wagner, H.',
      kunde: 'Verschiedene',
      anlage: 'X300-Serie'
    },
    inhalt: {
      titel: 'WARNUNG: ERSATZTEIL-INKOMPATIBILITÄTEN',
      abschnitte: [
        {
          typ: 'text',
          inhalt: 'WICHTIGER HINWEIS FÜR ALLE X300-ANLAGEN:'
        },
        {
          typ: 'text',
          inhalt: 'Schütz K4 (Art-Nr. 8834) wird im Katalog als kompatibel gelistet, passt aber NICHT in X300-Anlagen vor Baujahr 2018!',
          hervorhebung: true,
          qaRef: 4
        },
        {
          typ: 'notiz',
          inhalt: 'Problem: Andere Befestigungslöcher!\nSchon 5x falsch bestellt und zurückgeschickt!',
          hervorhebung: true,
          qaRef: 4
        },
        {
          typ: 'text',
          inhalt: 'WEITERE DOKUMENTIERTE FALLEN:'
        },
        {
          typ: 'liste',
          inhalt: [
            'Ventil V23: Nur bis Baujahr 2016',
            'Sensor S44: Andere Steckerbelegung ab 2019',
            'Platine P12: Rev. B nicht abwärtskompatibel'
          ]
        },
        {
          typ: 'notiz',
          inhalt: 'Komplette Liste mit 47 Inkompatibilitäten:\nG:/Wagner/Fallen.xlsx\n(Backup auf USB-Stick im Schreibtisch)',
          hervorhebung: true,
          qaRef: 4
        }
      ]
    }
  },
  {
    seitenNummer: 689,
    datum: '18.09.2022',
    kopfzeile: {
      berichtNr: '2022-0689',
      techniker: 'Wagner, H.',
      kunde: 'Daimler Stuttgart',
      anlage: 'Produktionslinie 3'
    },
    inhalt: {
      titel: 'UMGEBUNGSBEDINGTE STÖRUNGEN',
      abschnitte: [
        {
          typ: 'text',
          inhalt: 'PROBLEM:\nWiederkehrende Fehler F71, F72 und F80. Kunde vermutet Software-Problem.'
        },
        {
          typ: 'text',
          inhalt: 'TATSÄCHLICHE URSACHE:\nMassive Staubbelastung durch benachbarte Lackiererei! Filter völlig verstopft.',
          hervorhebung: true,
          qaRef: 5
        },
        {
          typ: 'notiz',
          inhalt: 'MERKE: Bei Daimler Stuttgart IMMER zuerst Filter prüfen!\nMonatlicher Wechsel ZWINGEND notwendig!\n(Standard ist quartalsweise)',
          hervorhebung: true,
          qaRef: 5
        },
        {
          typ: 'text',
          inhalt: 'DURCHGEFÜHRTE MASSNAHMEN:'
        },
        {
          typ: 'liste',
          inhalt: [
            'Alle Filter gewechselt',
            'Reinigungsintervall auf MONATLICH umgestellt',
            'Wartungsplan entsprechend angepasst',
            'Techniker vor Ort instruiert'
          ]
        },
        {
          typ: 'text',
          inhalt: 'Nach Filterwechsel alle Fehler verschwunden. Kunde beeindruckt von schneller Lösung.'
        },
        {
          typ: 'notiz',
          inhalt: '€€€ TIPP: Monatliche Filterwartung als Zusatzservice verkaufen!',
          hervorhebung: true
        }
      ]
    }
  }
];