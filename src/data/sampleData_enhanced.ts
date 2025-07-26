import type { QA } from '../types';

// Erweiterte Demo-Daten mit realistischeren Szenarien aus 30 Jahren Wartungserfahrung
export const enhancedSampleQAs: QA[] = [
  // KATEGORIE: HYDRAULIK
  {
    id: 'qa_hyd_1',
    question: "Hydraulikdruck schwankt zwischen 180-220 bar bei X500, sollte konstant 200 bar sein. Was tun?",
    answer: "Das ist der klassische 'Wagner-Fall' von 2015! Proportionalventil PV12 hat minimalen Verschleiß an der Steuerkante. NICHT das ganze Ventil tauschen (3.800€)! Nur Steuerschieber nachschleifen lassen bei Firma Hydrotech in Augsburg (280€, 2 Tage). Kontakt: Hr. Maier 0821-445566. WICHTIG: Beim Ausbau Position markieren, sonst 4h Einstellarbeit!",
    entities: [
      { text: 'X500', type: 'Anlage', mapTo: 'anlage', isNew: false },
      { text: 'Proportionalventil PV12', type: 'Hydraulikkomponente', mapTo: null, isNew: true },
      { text: 'Hydrotech Augsburg', type: 'Servicepartner', mapTo: null, isNew: true },
      { text: 'Druckschwankung 180-220bar', type: 'Symptom', mapTo: null, isNew: true }
    ],
    predicates: [
      { text: 'zeigt_symptom', attributes: { typ: 'Druckschwankung', bereich: '180-220bar', soll: '200bar' }, isNew: true },
      { text: 'hat_verschleißteil', attributes: { komponente: 'Steuerkante', lebensdauer: '12-15 Jahre' }, isNew: true },
      { text: 'reparierbar_bei', attributes: { firma: 'Hydrotech', kosten: '280€', dauer: '2 Tage' }, isNew: true }
    ],
    newClassProposal: {
      name: 'Hydraulikkomponente',
      parent: 'komponente',
      properties: ['druckbereich_bar', 'durchfluss_l_min', 'verschleißteile', 'service_intervall']
    },
    metadata: {
      datum: '2015-03-12',
      kategorie: 'Hydraulik',
      schwierigkeit: 'mittel',
      kostenersparnis: '3520€',
      zeitersparnis: '6h'
    }
  },

  // KATEGORIE: ELEKTRONIK/SOFTWARE
  {
    id: 'qa_el_1',
    question: "Siemens S7-1500 zeigt sporadisch SF-LED rot, aber kein Fehler im Diagnosepuffer?",
    answer: "Das ist der berüchtigte 'Geisterfehler'! Firmware-Bug in V2.8.1 - tritt NUR auf wenn: 1) Profinet-Ring aktiv UND 2) mehr als 32 IO-Devices UND 3) Zykluszeit < 10ms. Lösung: Firmware-Downgrade auf V2.6.5 oder Upgrade auf V2.9.2 (NICHT V2.9.0/2.9.1!). Bei BMW und Daimler 8x aufgetreten. Siemens weiß Bescheid, gibt's aber nicht zu.",
    entities: [
      { text: 'Siemens S7-1500', type: 'SPS', mapTo: null, isNew: true },
      { text: 'SF-LED rot', type: 'Fehlersymptom', mapTo: 'fehler', isNew: false },
      { text: 'Firmware V2.8.1', type: 'Firmware', mapTo: 'firmware', isNew: false },
      { text: 'Profinet-Ring', type: 'Netzwerkkonfiguration', mapTo: null, isNew: true }
    ],
    predicates: [
      { text: 'hat_firmware_bug', attributes: { version: 'V2.8.1', bedingungen: '3-fach', bestätigt: 'ja' }, isNew: true },
      { text: 'gelöst_durch', attributes: { methode: 'Firmware-Wechsel', versionen: 'V2.6.5 oder V2.9.2' }, isNew: true }
    ],
    newClassProposal: {
      name: 'SPS',
      parent: 'entity',
      properties: ['hersteller', 'modell', 'firmware_version', 'io_devices_max', 'zykluszeit_ms']
    },
    metadata: {
      datum: '2021-11-08',
      kategorie: 'Elektronik',
      schwierigkeit: 'hoch',
      betroffene_kunden: ['BMW', 'Daimler'],
      workaround: true
    }
  },

  // KATEGORIE: MECHANIK
  {
    id: 'qa_mech_1',
    question: "Getriebegeräusche bei Förderband FB-2000 nach genau 18 Monaten Laufzeit?",
    answer: "KLASSIKER! Schneckengetriebe SG-450 hat Konstruktionsfehler. Lagersitz wird nach ~13.000 Betriebsstunden oval (= 18 Monate bei 24/7). Hersteller tauscht nur komplett (4.200€). ABER: Lagersitz kann aufgeschweißt und nachgedreht werden! Macht Firma Müller Präzisionstechnik für 650€. Dauert 1 Tag. Hält dann weitere 5 Jahre! Skizze in Ordner 'Mechanik-Tricks'.",
    entities: [
      { text: 'FB-2000', type: 'Förderband', mapTo: 'anlage', isNew: false },
      { text: 'Schneckengetriebe SG-450', type: 'Getriebe', mapTo: null, isNew: true },
      { text: '13.000 Betriebsstunden', type: 'Verschleißgrenze', mapTo: null, isNew: true },
      { text: 'Müller Präzisionstechnik', type: 'Servicepartner', mapTo: null, isNew: true }
    ],
    predicates: [
      { text: 'hat_konstruktionsfehler', attributes: { typ: 'Lagersitz', ausfallzeit: '13000h' }, isNew: true },
      { text: 'reparierbar_durch', attributes: { methode: 'Aufschweißen+Nachdrehen', kosten: '650€' }, isNew: true }
    ],
    newClassProposal: {
      name: 'Mechanikkomponente',
      parent: 'komponente',
      properties: ['betriebsstunden_max', 'verschleißart', 'reparaturmethode']
    },
    metadata: {
      datum: '2020-06-15',
      kategorie: 'Mechanik',
      schwierigkeit: 'mittel',
      kostenersparnis: '3550€',
      dokumentation: 'Ordner Mechanik-Tricks'
    }
  },

  // KATEGORIE: SICHERHEIT/NOTFALL
  {
    id: 'qa_sich_1',
    question: "Not-Aus gedrückt, aber Anlage läuft weiter - was tun?",
    answer: "SOFORT Hauptschalter! Dann systematisch: 1) Sicherheitsrelais K-S1 prüfen (verklebt oft bei hoher Luftfeuchtigkeit) 2) Verdrahtung X12.3-X12.4 messen 3) Bei Anlagen vor 2019: Firmware-Bug in Sicherheits-SPS! Update auf V4.2 zwingend. DOKUMENTIEREN für BG - sonst Ärger bei Audit! Vorlage für Störbericht auf Laufwerk unter /Sicherheit/Vorlagen/",
    entities: [
      { text: 'Not-Aus', type: 'Sicherheitseinrichtung', mapTo: null, isNew: true },
      { text: 'Sicherheitsrelais K-S1', type: 'Sicherheitskomponente', mapTo: null, isNew: true },
      { text: 'Sicherheits-SPS', type: 'SPS', mapTo: null, isNew: true },
      { text: 'BG-Audit', type: 'Compliance', mapTo: null, isNew: true }
    ],
    predicates: [
      { text: 'sicherheitskritisch', attributes: { sofortmaßnahme: 'Hauptschalter', meldepflichtig: 'ja' }, isNew: true },
      { text: 'dokumentationspflichtig', attributes: { grund: 'BG-Audit', vorlage: '/Sicherheit/Vorlagen/' }, isNew: true }
    ],
    newClassProposal: {
      name: 'Sicherheitseinrichtung',
      parent: 'entity',
      properties: ['sil_level', 'prüfintervall_monate', 'dokumentationspflicht']
    },
    metadata: {
      datum: '2022-02-28',
      kategorie: 'Sicherheit',
      schwierigkeit: 'kritisch',
      priorität: 'höchste',
      compliance_relevant: true
    }
  },

  // KATEGORIE: PROZESSOPTIMIERUNG
  {
    id: 'qa_proz_1',
    question: "Taktzeit plötzlich von 45s auf 52s gestiegen, keine offensichtlichen Fehler?",
    answer: "Die 7-Sekunden-Falle! Check: 1) Pneumatikdruck (oft von 6 auf 5.5 bar gefallen - reicht für Bewegung, aber langsamer) 2) Schmierung Linearführung LF-3 (alle 5000 Zyklen fällig) 3) Der GEHEIMTIPP: Parameter P412 im Antrieb - werksseitig auf 80% Beschleunigung! Auf 95% stellen, spart 5-8s. Bei VW Wolfsburg 20 Anlagen optimiert, Gesamtersparnis: 2.5 Mio €/Jahr!",
    entities: [
      { text: 'Taktzeit 45s->52s', type: 'Leistungsabfall', mapTo: null, isNew: true },
      { text: 'Pneumatikdruck', type: 'Prozessparameter', mapTo: null, isNew: true },
      { text: 'Linearführung LF-3', type: 'Mechanikkomponente', mapTo: null, isNew: true },
      { text: 'Parameter P412', type: 'Antriebsparameter', mapTo: null, isNew: true },
      { text: 'VW Wolfsburg', type: 'Kunde', mapTo: 'kunde', isNew: false }
    ],
    predicates: [
      { text: 'optimierbar_durch', attributes: { parameter: 'P412', verbesserung: '5-8s', standardwert: '80%' }, isNew: true },
      { text: 'wirtschaftlicher_nutzen', attributes: { ersparnis_jahr: '2.5 Mio €', kunde: 'VW' }, isNew: true }
    ],
    newClassProposal: {
      name: 'Prozessparameter',
      parent: 'entity',
      properties: ['einheit', 'sollwert', 'istwert', 'optimierungspotential']
    },
    metadata: {
      datum: '2023-08-20',
      kategorie: 'Prozessoptimierung',
      schwierigkeit: 'niedrig',
      wirtschaftlicher_effekt: 'sehr hoch',
      skalierbar: true
    }
  },

  // KATEGORIE: UMWELTBEDINGUNGEN
  {
    id: 'qa_umw_1',
    question: "Mysteriöse Ausfälle immer Dienstag + Donnerstag zwischen 14-16 Uhr?",
    answer: "Sherlock-Holmes-Fall von 2018! Ursache: Gabelstapler-Ladestationen 50m entfernt. Beim Schnellladen entstehen Netzoberwellen, die Frequenzumrichter FU-200 stören. Lösung: Netzfilter NF-THD-40 vor FU einbauen (1.200€). Alternative: Ladezeiten verschieben. Habe ähnliche Fälle dokumentiert: Mikrowelle in Pausenraum (BMW), Schweißroboter nebenan (Audi), sogar Solaranlage auf Dach (Bosch)!",
    entities: [
      { text: 'Gabelstapler-Ladestation', type: 'Störquelle', mapTo: null, isNew: true },
      { text: 'Frequenzumrichter FU-200', type: 'Elektronikkomponente', mapTo: null, isNew: true },
      { text: 'Netzfilter NF-THD-40', type: 'Entstörkomponente', mapTo: null, isNew: true },
      { text: 'Netzoberwellen', type: 'Störung', mapTo: null, isNew: true }
    ],
    predicates: [
      { text: 'gestört_durch', attributes: { quelle: 'Schnelllader', typ: 'Netzoberwellen', zeitfenster: 'Di+Do 14-16' }, isNew: true },
      { text: 'entstörbar_mit', attributes: { komponente: 'NF-THD-40', kosten: '1200€', wirksamkeit: '100%' }, isNew: true }
    ],
    newClassProposal: {
      name: 'Störquelle',
      parent: 'entity',
      properties: ['typ', 'frequenzbereich_hz', 'reichweite_m', 'zeitliches_muster']
    },
    metadata: {
      datum: '2018-09-03',
      kategorie: 'Umweltbedingungen',
      schwierigkeit: 'hoch',
      detektivarbeit: true,
      ähnliche_fälle: ['BMW', 'Audi', 'Bosch']
    }
  },

  // KATEGORIE: WARTUNGSSTRATEGIE
  {
    id: 'qa_wart_1',
    question: "Wann WIRKLICH Öl wechseln? Hersteller sagt 2000h, aber...",
    answer: "Wagner's Ölwechsel-Matrix (bewährt bei >500 Anlagen): VERGISS Herstellerangaben! Entscheidend: 1) Umgebungstemperatur >30°C = alle 1200h 2) Dauerlast >80% = alle 1500h 3) Start-Stop >20x/Tag = alle 1000h 4) Normalfall = alle 2500h (!) Ölanalyse alle 500h (35€) spart Tausende! Labor: OELCHECK Brannenburg. Mit deren Online-Tool eigene Grenzwerte festlegen. ROI: 1:15!",
    entities: [
      { text: 'Ölwechsel-Matrix', type: 'Wartungsstrategie', mapTo: null, isNew: true },
      { text: '2000h Herstellervorgabe', type: 'Wartungsintervall', mapTo: null, isNew: true },
      { text: 'OELCHECK Brannenburg', type: 'Servicepartner', mapTo: null, isNew: true },
      { text: 'Ölanalyse', type: 'Präventivmaßnahme', mapTo: null, isNew: true }
    ],
    predicates: [
      { text: 'angepasst_an', attributes: { faktoren: '4', basis: 'Erfahrungswerte', anlagen: '>500' }, isNew: true },
      { text: 'validiert_durch', attributes: { methode: 'Ölanalyse', labor: 'OELCHECK', roi: '1:15' }, isNew: true }
    ],
    newClassProposal: {
      name: 'Wartungsstrategie',
      parent: 'entity',
      properties: ['basis', 'anpassungsfaktoren', 'validierungsmethode', 'roi_faktor']
    },
    metadata: {
      datum: '2024-01-15',
      kategorie: 'Wartungsstrategie',
      schwierigkeit: 'mittel',
      erfahrungsbasis: '>500 Anlagen',
      kosteneinsparung: 'Faktor 15'
    }
  },

  // KATEGORIE: ERSATZTEIL-MANAGEMENT
  {
    id: 'qa_ers_1',
    question: "Welche 'billigen' Ersatzteile sind ihr Geld NICHT wert?",
    answer: "Wagner's schwarze Liste (Update 2024): 1) Kugellager 6205-2RS China-Kopie = max 3 Monate! Original SKF hält 3 Jahre. 2) Pneumatikschläuche 'BlueLine' = werden porös, verstopfen Ventile! 3) Induktive Sensoren 'SensoSave' = driften nach 6 Monaten. ABER: Schütze von 'ElectroAsia' sind TOP (gleiche Fabrik wie Siemens, 60% günstiger)! Excel-Liste mit 200+ getesteten Alternativen: G:/Wagner/Ersatzteile_gut_schlecht.xlsx",
    entities: [
      { text: 'Kugellager 6205-2RS', type: 'Ersatzteil', mapTo: null, isNew: true },
      { text: 'SKF Original', type: 'Qualitätsersatzteil', mapTo: null, isNew: true },
      { text: 'Wagner schwarze Liste', type: 'Wissensdokument', mapTo: null, isNew: true },
      { text: 'ElectroAsia Schütze', type: 'Ersatzteil', mapTo: null, isNew: true }
    ],
    predicates: [
      { text: 'qualität_getestet', attributes: { ergebnis: 'durchgefallen', lebensdauer: '3 Monate vs 3 Jahre' }, isNew: true },
      { text: 'dokumentiert_in', attributes: { liste: 'Ersatzteile_gut_schlecht.xlsx', einträge: '200+' }, isNew: true }
    ],
    newClassProposal: {
      name: 'Ersatzteilqualität',
      parent: 'entity',
      properties: ['hersteller', 'lebensdauer_erwartet', 'lebensdauer_real', 'preis_leistung']
    },
    metadata: {
      datum: '2024-02-01',
      kategorie: 'Ersatzteil-Management',
      schwierigkeit: 'niedrig',
      geldersparnis: 'langfristig hoch',
      dokumentation: 'Excel-Liste'
    }
  },

  // KATEGORIE: KUNDENWISSEN
  {
    id: 'qa_kund_1',
    question: "Spezielle 'Macken' bei Audi Ingolstadt die man kennen MUSS?",
    answer: "Audi-Bibel by Wagner: 1) Halle 4: Boden vibriert durch Presse nebenan - ALLE Sensoren mit Dämpfungsplatten! 2) Schichtleiter Früh heißt Müller, mag KEINE Überraschungen - immer vorher anrufen! 3) Kantine-Trick: Mittwochs Schnitzel, da sind alle gut gelaunt = beste Zeit für schwierige Themen 4) Parkplatz: NIE auf Platz 13-20 (Geschäftsleitung) 5) Goldene Regel: Herr Dr. Weber (Werksleiter) immer mit 'Ihre Anlage läuft perfekt' begrüßen, auch wenn nicht!",
    entities: [
      { text: 'Audi Ingolstadt', type: 'Kunde', mapTo: 'kunde', isNew: false },
      { text: 'Halle 4 Vibration', type: 'Standortbesonderheit', mapTo: null, isNew: true },
      { text: 'Schichtleiter Müller', type: 'Ansprechpartner', mapTo: null, isNew: true },
      { text: 'Dr. Weber Werksleiter', type: 'Ansprechpartner', mapTo: null, isNew: true }
    ],
    predicates: [
      { text: 'hat_besonderheit', attributes: { typ: 'Vibration', lösung: 'Dämpfungsplatten', ort: 'Halle 4' }, isNew: true },
      { text: 'kommunikationsregel', attributes: { person: 'Dr. Weber', regel: 'immer positiv', wichtigkeit: 'hoch' }, isNew: true }
    ],
    newClassProposal: {
      name: 'Kundenbesonderheit',
      parent: 'entity',
      properties: ['typ', 'auswirkung', 'umgang', 'ansprechpartner']
    },
    metadata: {
      datum: '2023-11-30',
      kategorie: 'Kundenwissen',
      schwierigkeit: 'sozial',
      wichtigkeit: 'sehr hoch',
      soft_skills: true
    }
  },

  // KATEGORIE: NOTFALL-HACKS
  {
    id: 'qa_not_1',
    question: "Sonntag 3 Uhr morgens, Produktion muss laufen, Ersatzteil erst Montag lieferbar?",
    answer: "Wagner's Notfall-Tricks (NUR für Überbrückung!): 1) Temperatursensor defekt? 100kOhm Widerstand parallel = simuliert 25°C 2) Drucksensor hin? Poti 0-10V anschließen, manuell regeln 3) Schütz klemmt? Mit Holz(!) vorsichtig klopfen, WD40 4) Software-Lizenz abgelaufen? Systemzeit zurückstellen (max 30 Tage) 5) Not-Aus defekt? Überbrücken + WACHMANN daneben stellen! ALLES dokumentieren + Montag sofort richtig reparieren! Vorlage Notfall-Protokoll: /Notfall/Protokoll_Muster.doc",
    entities: [
      { text: 'Notfall-Überbrückung', type: 'Wartungsstrategie', mapTo: null, isNew: true },
      { text: '100kOhm Widerstand', type: 'Notfall-Ersatz', mapTo: null, isNew: true },
      { text: 'Notfall-Protokoll', type: 'Dokumentation', mapTo: null, isNew: true },
      { text: 'Wachmann', type: 'Sicherheitsmaßnahme', mapTo: null, isNew: true }
    ],
    predicates: [
      { text: 'temporär_ersetzbar', attributes: { dauer: 'max 48h', risiko: 'kalkuliert', dokumentation: 'zwingend' }, isNew: true },
      { text: 'sicherheitshinweis', attributes: { maßnahme: 'Wachmann', grund: 'Not-Aus überbrückt' }, isNew: true }
    ],
    newClassProposal: {
      name: 'Notfallmaßnahme',
      parent: 'entity',
      properties: ['typ', 'max_dauer', 'risikostufe', 'folgemaßnahmen', 'dokumentationspflicht']
    },
    metadata: {
      datum: '2022-12-18',
      kategorie: 'Notfall',
      schwierigkeit: 'hoch',
      rechtliche_grauzone: true,
      nur_temporär: true
    }
  }
];

// Zusätzliche Metadaten für bessere Visualisierung
export const kategorien = [
  { name: 'Hydraulik', color: '#1e40af', icon: '💧' },
  { name: 'Elektronik', color: '#dc2626', icon: '⚡' },
  { name: 'Mechanik', color: '#7c3aed', icon: '⚙️' },
  { name: 'Sicherheit', color: '#dc2626', icon: '🚨' },
  { name: 'Prozessoptimierung', color: '#059669', icon: '📈' },
  { name: 'Umweltbedingungen', color: '#ea580c', icon: '🌡️' },
  { name: 'Wartungsstrategie', color: '#0891b2', icon: '🔧' },
  { name: 'Ersatzteil-Management', color: '#a21caf', icon: '📦' },
  { name: 'Kundenwissen', color: '#0f766e', icon: '👥' },
  { name: 'Notfall', color: '#b91c1c', icon: '🆘' }
];

// Statistiken für Dashboard
export const wissenStatistiken = {
  gesamtFälle: 847,
  gelösteFehler: 723,
  eingesparte_euro: 4_500_000,
  dokumentierteJahre: 30,
  betreute_kunden: 45,
  anlagenTypen: 23,
  häufigsteFehler: [
    { code: 'F42', anzahl: 89, kategorie: 'Hydraulik' },
    { code: 'SF-LED', anzahl: 67, kategorie: 'Elektronik' },
    { code: 'F71/72/80', anzahl: 45, kategorie: 'Umgebung' }
  ],
  topKunden: [
    { name: 'BMW', anlagen: 156, seit: 1994 },
    { name: 'Daimler', anlagen: 98, seit: 1996 },
    { name: 'Audi', anlagen: 87, seit: 1998 },
    { name: 'VW', anlagen: 134, seit: 1995 },
    { name: 'Bosch', anlagen: 76, seit: 2001 }
  ]
};