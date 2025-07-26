import type { QA } from '../types';

export const sampleQAs: QA[] = [
  {
    id: 'qa1',
    question: "Was tun bei Fehler F42 an Schaltanlage X500?",
    answer: "Kondensator C3 prüfen, meist durchgebrannt nach 8-10 Jahren. Ersatz mit Teil-Nr 4711 (NICHT 4712 - passt mechanisch, aber falsche Spannungsfestigkeit!). Bei BMW München 3x aufgetreten.",
    entities: [
      { text: 'X500', type: 'Anlage', mapTo: 'anlage', isNew: false },
      { text: 'F42', type: 'Fehler', mapTo: 'fehler', isNew: false },
      { text: 'BMW München', type: 'Kunde', mapTo: 'kunde', isNew: false },
      { text: 'Kondensator C3', type: 'Komponente', mapTo: null, isNew: true },
    ],
    predicates: [
      { text: 'hat_typischen_fehler', attributes: { häufigkeit: 'oft', lebensdauer: '8-10 Jahre' }, isNew: true },
      { text: 'hat_lösung', attributes: { komponente: 'C3', ersatzteil: '4711' }, isNew: true }
    ],
    newClassProposal: {
      name: 'Komponente',
      parent: 'entity',
      properties: ['teilnummer', 'lebensdauer_jahre', 'spannungsfestigkeit']
    }
  },
  {
    id: 'qa2',
    question: "Welche Firmware-Version für Bosch-Anlagen verwenden?",
    answer: "IMMER Version 2.3 behalten! Neuere Versionen (2.4+) haben Timing-Probleme mit Bosch-SPS. Habe 2019 bei Update Produktionsausfall verursacht - 6 Stunden!",
    entities: [
      { text: 'Bosch', type: 'Kunde', mapTo: 'kunde', isNew: false },
      { text: 'Version 2.3', type: 'Firmware', mapTo: null, isNew: true },
      { text: 'Bosch-SPS', type: 'System', mapTo: null, isNew: true },
    ],
    predicates: [
      { text: 'benötigt_firmware', attributes: { version: '2.3', grund: 'SPS-Kompatibilität' }, isNew: true },
      { text: 'inkompatibel_mit', attributes: { version_ab: '2.4', problem: 'Timing' }, isNew: true }
    ],
    newClassProposal: {
      name: 'Firmware',
      parent: 'entity',
      properties: ['version', 'release_datum', 'bekannte_probleme']
    }
  },
  {
    id: 'qa3',
    question: "Besonderheiten bei Wartung BMW Werk 2?",
    answer: "KRITISCH: Anlagen laufen im Verbund! IMMER alle drei Anlagen gleichzeitig abschalten, sonst Druckabfall im Kühlsystem. Kontakt vor Ort: Meister Huber (0171-2345678), kennt die Eigenheiten.",
    entities: [
      { text: 'BMW Werk 2', type: 'Kunde-Standort', mapTo: 'kunde', isNew: false },
      { text: 'Verbund-System', type: 'Anlagen-Konfiguration', mapTo: null, isNew: true },
      { text: 'Meister Huber', type: 'Ansprechpartner', mapTo: null, isNew: true },
    ],
    predicates: [
      { text: 'hat_konfiguration', attributes: { typ: 'Verbund', kritisch: 'ja' }, isNew: true },
      { text: 'hat_ansprechpartner', attributes: { name: 'Huber', tel: '0171-2345678' }, isNew: true }
    ],
    newClassProposal: {
      name: 'Wartungshinweis',
      parent: 'entity',
      properties: ['priorität', 'sicherheitsrelevant', 'spezialwissen_erforderlich']
    }
  },
  {
    id: 'qa4',
    question: "Welche Ersatzteile sind NICHT kompatibel obwohl im Katalog als kompatibel gelistet?",
    answer: "ACHTUNG Falle: Schütz K4 (Art-Nr 8834) passt NICHT in X300-Anlagen vor Baujahr 2018! Andere Befestigungslöcher. Habe Excel-Liste mit 47 weiteren Inkompatibilitäten auf Laufwerk G:/Wagner/Fallen.xlsx",
    entities: [
      { text: 'Schütz K4', type: 'Komponente', mapTo: 'komponente', isNew: false },
      { text: 'X300', type: 'Anlage', mapTo: 'anlage', isNew: false },
      { text: 'Excel-Liste Inkompatibilitäten', type: 'Wissensdokument', mapTo: null, isNew: true },
    ],
    predicates: [
      { text: 'ist_inkompatibel', attributes: { grund: 'Befestigungslöcher', baujahr_grenze: '2018' }, isNew: true },
      { text: 'dokumentiert_in', attributes: { pfad: 'G:/Wagner/Fallen.xlsx', anzahl_einträge: '47' }, isNew: true }
    ],
    newClassProposal: null
  },
  {
    id: 'qa5',
    question: "Was sind die häufigsten Fehlerquellen bei Daimler Stuttgart?",
    answer: "Staub! Lackiererei nebenan. Filter MONATLICH wechseln, nicht quartalsweise. Fehler F71, F72, F80 alle staubbedingt. Techniker vor Ort denkt oft an Software - ist aber immer der Filter!",
    entities: [
      { text: 'Daimler Stuttgart', type: 'Kunde', mapTo: 'kunde', isNew: false },
      { text: 'F71, F72, F80', type: 'Fehler', mapTo: 'fehler', isNew: false },
      { text: 'Staubfilter', type: 'Komponente', mapTo: 'komponente', isNew: false },
    ],
    predicates: [
      { text: 'hat_umgebungsproblem', attributes: { typ: 'Staub', quelle: 'Lackiererei' }, isNew: true },
      { text: 'benötigt_wartungsintervall', attributes: { komponente: 'Filter', intervall: 'monatlich' }, isNew: true }
    ],
    newClassProposal: {
      name: 'Umgebungsfaktor',
      parent: 'entity',
      properties: ['typ', 'auswirkung', 'gegenmassnahme']
    }
  }
];