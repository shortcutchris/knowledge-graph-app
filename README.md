# Knowledge Graph Builder

Eine React-basierte Anwendung zur Digitalisierung von Expertenwissen in Form eines interaktiven Wissensgraphen.

## Überblick

Diese Anwendung wurde entwickelt, um implizites Expertenwissen aus Dokumenten zu extrahieren und in einem strukturierten Wissensgraphen zu visualisieren. Das Beispielszenario zeigt, wie das 30-jährige Erfahrungswissen eines Senior-Technikers digitalisiert werden kann.

## Features

- **Dokumenten-Upload**: Simulation des Uploads von Wissensdokumenten
- **Q&A-Extraktion**: Automatische Extraktion von Frage-Antwort-Paaren aus Dokumenten
- **Ontologie-Mapping**: Intelligente Zuordnung von Entitäten und Beziehungen
- **Interaktiver Graph**: D3.js-basierte Visualisierung mit Zoom, Drag & Drop
- **Vollbildmodus**: Detaillierte Graphenansicht im Vollbildmodus
- **Detail-Panel**: Kontextinformationen zu jedem Knoten
- **Legende**: Übersicht über Knotentypen und Beziehungen

## Installation

```bash
# Repository klonen
git clone [repository-url]
cd knowledge-graph-app

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

## Technologie-Stack

- **React** (18.3.1) mit TypeScript
- **D3.js** (7.9.0) für Graphenvisualisierung
- **Lucide React** für Icons
- **Vite** als Build-Tool

## Projektstruktur

```
src/
├── components/
│   ├── common/          # Wiederverwendbare Komponenten
│   │   ├── Tooltip.tsx
│   │   └── Legend.tsx
│   ├── graph/           # Graph-bezogene Komponenten
│   │   ├── ForceGraph.tsx
│   │   └── FullscreenGraph.tsx
│   ├── panels/          # Panel-Komponenten
│   │   ├── DetailPanel.tsx
│   │   ├── DocumentUploadPanel.tsx
│   │   └── QAExtractionPanel.tsx
│   └── KnowledgeGraphBuilder.tsx  # Hauptkomponente
├── data/
│   └── sampleData.ts    # Beispieldaten
├── types/
│   └── index.ts         # TypeScript-Definitionen
├── utils/
│   └── proposedElements.ts  # Hilfsfunktionen
└── App.tsx              # App-Einstiegspunkt
```

## Verwendung

1. **Start**: Die Anwendung startet mit einem leeren Wissensgraphen
2. **Upload**: Klicken Sie auf den Upload-Bereich, um die Demo zu starten
3. **Extraktion**: Beobachten Sie die automatische Q&A-Extraktion
4. **Mapping**: Bestätigen oder überspringen Sie vorgeschlagene Mappings
5. **Exploration**: Erkunden Sie den fertigen Graphen durch:
   - Hover für Tooltips
   - Klick für Details
   - Drag & Drop zum Verschieben
   - Zoom mit Mausrad
   - Vollbildmodus für bessere Übersicht

## Beispiel-Szenario

Die Demo zeigt die Digitalisierung von Herrn Wagners Wissen mit 5 kritischen Q&A-Paaren:

1. **Fehlerdiagnose**: Kondensator-Probleme bei Schaltanlagen
2. **Firmware-Kompatibilität**: Version-spezifische Anforderungen
3. **Wartungshinweise**: Kritische Verbund-Konfigurationen
4. **Inkompatibilitäten**: Versteckte Fallen bei Ersatzteilen
5. **Umgebungsfaktoren**: Standort-spezifische Probleme

## Scripts

```bash
npm run dev      # Entwicklungsserver starten
npm run build    # Production Build erstellen
npm run preview  # Production Build lokal testen
npm run lint     # Code-Qualität prüfen
```

## Architektur-Highlights

- **Modularer Aufbau**: Klare Trennung von Komponenten
- **TypeScript**: Vollständige Typsicherheit
- **Force-Directed Layout**: Automatische Graph-Anordnung mit D3.js
- **State Management**: React Hooks für lokalen State
- **Responsive Design**: Anpassung an verschiedene Bildschirmgrößen

## Weiterentwicklung

Mögliche Erweiterungen:
- Backend-Integration für echte Dokumentenverarbeitung
- ML-basierte Q&A-Extraktion
- Persistierung des Wissensgraphen
- Export-Funktionen (JSON, GraphML)
- Erweiterte Suchmöglichkeiten
- Collaborative Editing

## Lizenz

[Ihre Lizenz hier]