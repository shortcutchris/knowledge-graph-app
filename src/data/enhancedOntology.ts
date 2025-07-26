import type { Node, Link } from '../types';

// Erweiterte Ontologie-Struktur für die neuen Demo-Daten
export const enhancedOntologyNodes: Node[] = [
  // ROOT
  { id: 'entity', label: 'Entity', type: 'class', nodeType: 'class' },
  
  // HAUPTKATEGORIEN (Level 1)
  { id: 'anlage', label: 'Anlage', type: 'class', parent: 'entity', nodeType: 'class' },
  { id: 'kunde', label: 'Kunde', type: 'class', parent: 'entity', nodeType: 'class' },
  { id: 'fehler', label: 'Fehler', type: 'class', parent: 'entity', nodeType: 'class' },
  { id: 'komponente', label: 'Komponente', type: 'class', parent: 'entity', nodeType: 'class' },
  { id: 'wissen', label: 'Wissen', type: 'class', parent: 'entity', nodeType: 'class' },
  { id: 'prozess', label: 'Prozess', type: 'class', parent: 'entity', nodeType: 'class' },
  { id: 'person', label: 'Person', type: 'class', parent: 'entity', nodeType: 'class' },
  
  // KOMPONENTEN-UNTERKLASSEN (Level 2)
  { id: 'hydraulikkomponente', label: 'Hydraulikkomponente', type: 'class', parent: 'komponente', nodeType: 'class' },
  { id: 'elektronikkomponente', label: 'Elektronikkomponente', type: 'class', parent: 'komponente', nodeType: 'class' },
  { id: 'mechanikkomponente', label: 'Mechanikkomponente', type: 'class', parent: 'komponente', nodeType: 'class' },
  { id: 'sicherheitskomponente', label: 'Sicherheitskomponente', type: 'class', parent: 'komponente', nodeType: 'class' },
  { id: 'software', label: 'Software', type: 'class', parent: 'komponente', nodeType: 'class' },
  
  // SOFTWARE-UNTERKLASSEN (Level 3)
  { id: 'firmware', label: 'Firmware', type: 'class', parent: 'software', nodeType: 'class' },
  { id: 'sps', label: 'SPS', type: 'class', parent: 'software', nodeType: 'class' },
  { id: 'parameter', label: 'Parameter', type: 'class', parent: 'software', nodeType: 'class' },
  
  // FEHLER-UNTERKLASSEN (Level 2)
  { id: 'symptom', label: 'Symptom', type: 'class', parent: 'fehler', nodeType: 'class' },
  { id: 'stoerquelle', label: 'Störquelle', type: 'class', parent: 'fehler', nodeType: 'class' },
  { id: 'umgebungsfaktor', label: 'Umgebungsfaktor', type: 'class', parent: 'fehler', nodeType: 'class' },
  
  // WISSEN-UNTERKLASSEN (Level 2)
  { id: 'wartungsstrategie', label: 'Wartungsstrategie', type: 'class', parent: 'wissen', nodeType: 'class' },
  { id: 'notfallmassnahme', label: 'Notfallmaßnahme', type: 'class', parent: 'wissen', nodeType: 'class' },
  { id: 'wissensdokument', label: 'Wissensdokument', type: 'class', parent: 'wissen', nodeType: 'class' },
  { id: 'ersatzteilqualitaet', label: 'Ersatzteilqualität', type: 'class', parent: 'wissen', nodeType: 'class' },
  
  // PROZESS-UNTERKLASSEN (Level 2)
  { id: 'wartung', label: 'Wartung', type: 'class', parent: 'prozess', nodeType: 'class' },
  { id: 'optimierung', label: 'Optimierung', type: 'class', parent: 'prozess', nodeType: 'class' },
  { id: 'reparatur', label: 'Reparatur', type: 'class', parent: 'prozess', nodeType: 'class' },
  
  // PERSONEN-UNTERKLASSEN (Level 2)
  { id: 'ansprechpartner', label: 'Ansprechpartner', type: 'class', parent: 'person', nodeType: 'class' },
  { id: 'servicepartner', label: 'Servicepartner', type: 'class', parent: 'person', nodeType: 'class' },
  
  // KUNDEN-UNTERKLASSEN (Level 2)
  { id: 'kundenstandort', label: 'Kunden-Standort', type: 'class', parent: 'kunde', nodeType: 'class' },
  { id: 'kundenbesonderheit', label: 'Kundenbesonderheit', type: 'class', parent: 'kunde', nodeType: 'class' },
  
  // ANLAGEN-UNTERKLASSEN (Level 2)
  { id: 'anlagenkonfiguration', label: 'Anlagen-Konfiguration', type: 'class', parent: 'anlage', nodeType: 'class' },
  { id: 'netzwerkkonfiguration', label: 'Netzwerkkonfiguration', type: 'class', parent: 'anlage', nodeType: 'class' },
];

export const enhancedOntologyLinks: Link[] = [
  // Hauptverbindungen
  { source: 'anlage', target: 'entity', type: 'is_a' },
  { source: 'kunde', target: 'entity', type: 'is_a' },
  { source: 'fehler', target: 'entity', type: 'is_a' },
  { source: 'komponente', target: 'entity', type: 'is_a' },
  { source: 'wissen', target: 'entity', type: 'is_a' },
  { source: 'prozess', target: 'entity', type: 'is_a' },
  { source: 'person', target: 'entity', type: 'is_a' },
  
  // Komponenten-Hierarchie
  { source: 'hydraulikkomponente', target: 'komponente', type: 'is_a' },
  { source: 'elektronikkomponente', target: 'komponente', type: 'is_a' },
  { source: 'mechanikkomponente', target: 'komponente', type: 'is_a' },
  { source: 'sicherheitskomponente', target: 'komponente', type: 'is_a' },
  { source: 'software', target: 'komponente', type: 'is_a' },
  
  // Software-Hierarchie
  { source: 'firmware', target: 'software', type: 'is_a' },
  { source: 'sps', target: 'software', type: 'is_a' },
  { source: 'parameter', target: 'software', type: 'is_a' },
  
  // Fehler-Hierarchie
  { source: 'symptom', target: 'fehler', type: 'is_a' },
  { source: 'stoerquelle', target: 'fehler', type: 'is_a' },
  { source: 'umgebungsfaktor', target: 'fehler', type: 'is_a' },
  
  // Wissen-Hierarchie
  { source: 'wartungsstrategie', target: 'wissen', type: 'is_a' },
  { source: 'notfallmassnahme', target: 'wissen', type: 'is_a' },
  { source: 'wissensdokument', target: 'wissen', type: 'is_a' },
  { source: 'ersatzteilqualitaet', target: 'wissen', type: 'is_a' },
  
  // Prozess-Hierarchie
  { source: 'wartung', target: 'prozess', type: 'is_a' },
  { source: 'optimierung', target: 'prozess', type: 'is_a' },
  { source: 'reparatur', target: 'prozess', type: 'is_a' },
  
  // Personen-Hierarchie
  { source: 'ansprechpartner', target: 'person', type: 'is_a' },
  { source: 'servicepartner', target: 'person', type: 'is_a' },
  
  // Kunden-Hierarchie
  { source: 'kundenstandort', target: 'kunde', type: 'is_a' },
  { source: 'kundenbesonderheit', target: 'kunde', type: 'is_a' },
  
  // Anlagen-Hierarchie
  { source: 'anlagenkonfiguration', target: 'anlage', type: 'is_a' },
  { source: 'netzwerkkonfiguration', target: 'anlage', type: 'is_a' },
];

// Neue Prädikate für die erweiterten Verbindungen
export const enhancedPredicates = [
  'zeigt_symptom',
  'hat_verschleißteil',
  'reparierbar_bei',
  'hat_firmware_bug',
  'gelöst_durch',
  'hat_konstruktionsfehler',
  'reparierbar_durch',
  'sicherheitskritisch',
  'dokumentationspflichtig',
  'optimierbar_durch',
  'wirtschaftlicher_nutzen',
  'gestört_durch',
  'entstörbar_mit',
  'angepasst_an',
  'validiert_durch',
  'qualität_getestet',
  'dokumentiert_in',
  'hat_besonderheit',
  'kommunikationsregel',
  'temporär_ersetzbar',
  'sicherheitshinweis',
  'hat_umgebungsproblem',
  'benötigt_wartungsintervall',
  'ist_inkompatibel',
  'hat_konfiguration',
  'hat_ansprechpartner',
  'benötigt_firmware',
  'inkompatibel_mit',
  'hat_typischen_fehler',
  'hat_lösung'
];

// Visualisierungs-Hinweise für die Ontologie
export const ontologyVisualization = {
  // Hierarchie-Ebenen (für Layout)
  levels: {
    0: ['entity'],
    1: ['anlage', 'kunde', 'fehler', 'komponente', 'wissen', 'prozess', 'person'],
    2: [
      'hydraulikkomponente', 'elektronikkomponente', 'mechanikkomponente', 
      'sicherheitskomponente', 'software', 'symptom', 'stoerquelle', 
      'umgebungsfaktor', 'wartungsstrategie', 'notfallmassnahme', 
      'wissensdokument', 'ersatzteilqualitaet', 'wartung', 'optimierung', 
      'reparatur', 'ansprechpartner', 'servicepartner', 'kundenstandort', 
      'kundenbesonderheit', 'anlagenkonfiguration', 'netzwerkkonfiguration'
    ],
    3: ['firmware', 'sps', 'parameter']
  },
  
  // Farb-Schema pro Hauptkategorie
  colors: {
    komponente: '#3b82f6', // Blau
    fehler: '#ef4444',     // Rot
    kunde: '#10b981',      // Grün
    anlage: '#8b5cf6',     // Violett
    wissen: '#f59e0b',     // Orange
    prozess: '#06b6d4',    // Cyan
    person: '#ec4899'      // Pink
  },
  
  // Wichtige Verbindungstypen
  relationshipTypes: {
    hierarchical: ['is_a', 'instance_of'],
    functional: [
      'zeigt_symptom', 'hat_verschleißteil', 'benötigt_firmware',
      'hat_konstruktionsfehler', 'hat_umgebungsproblem'
    ],
    solution: [
      'gelöst_durch', 'reparierbar_bei', 'reparierbar_durch',
      'entstörbar_mit', 'optimierbar_durch'
    ],
    documentation: [
      'dokumentiert_in', 'dokumentationspflichtig', 'validiert_durch'
    ],
    social: [
      'hat_ansprechpartner', 'kommunikationsregel', 'hat_besonderheit'
    ]
  }
};