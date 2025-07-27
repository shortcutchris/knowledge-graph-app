# Q&A Bearbeitungsfunktion - Beispiele und Dokumentation

## Übersicht
Die Bearbeitungsfunktion ermöglicht es Benutzern, extrahierte Q&As zu korrigieren oder zu präzisieren. Nach jeder Bearbeitung werden automatisch neue Entitäten und Beziehungen aus dem geänderten Text extrahiert.

## Funktionsweise

1. **Bearbeiten-Button** neben jeder Q&A
2. **Modal öffnet sich** mit Textfeldern für Frage und Antwort
3. **Speichern & Neu analysieren** extrahiert automatisch neue Entitäten
4. **Loading-Animation** zeigt die Verarbeitung
5. **Neue Entitäten** werden basierend auf dem geänderten Text vorgeschlagen

## Konkrete Beispiele

### Beispiel 1: Präzisierung und zusätzliche Kontaktdaten

**Original Q&A:**
```
Frage: Was tun bei Fehler F42 an Schaltanlage X500?
Antwort: Kondensator C3 prüfen, meist durchgebrannt nach 8-10 Jahren. 
         Ersatz mit Teil-Nr 4711 (NICHT 4712!). Bei BMW München 3x aufgetreten.
```

**Nach Bearbeitung:**
```
Frage: Wie behebe ich den Überhitzungsfehler F42 bei BMW München in Halle 3?
Antwort: Bei BMW München tritt der Überhitzungsfehler F42 durch defekten 
         Kondensator C3 auf. Kontakt: Herr Maier von Hydrotech Augsburg 
         (Tel: 0821-445566) kann schnell helfen. WICHTIG: Teil 4711 verwenden, 
         NICHT 4712! Herr Maier kennt das Problem gut.
```

**Neu extrahierte Entitäten:**
- `Überhitzungsfehler` (neue Fehlerklassifikation)
- `Halle 3` (Standort-Detail)
- `Herr Maier` (Kontakt mit Telefonnummer: 0821-445566)
- `Hydrotech Augsburg` (Firma)
- Beziehung: `F42 → ist_typ_von → Überhitzungsfehler`
- Beziehung: `Herr Maier → arbeitet_bei → Hydrotech Augsburg`

### Beispiel 2: Vereinfachung und Klarstellung

**Original Q&A:**
```
Frage: Welche Firmware-Version für Bosch-Anlagen verwenden?
Antwort: IMMER Version 2.3 behalten! Neuere Versionen (2.4+) haben 
         Timing-Probleme mit Bosch-SPS.
```

**Nach Bearbeitung:**
```
Frage: Welche Firmware ist für die alte Bosch-SPS Generation kompatibel?
Antwort: Für Bosch-Anlagen mit SPS-Generation vor 2015 ausschließlich 
         Firmware Version 2.3 verwenden. Versionen 2.4 und 2.5 führen zu 
         Timing-Problemen und Produktionsausfällen. Ansprechpartner bei Bosch: 
         Dr. Schmidt (0711-811-0).
```

**Neu extrahierte Entitäten:**
- `SPS-Generation vor 2015` (präzisere Spezifikation)
- `Dr. Schmidt` (neuer Kontakt mit Tel: 0711-811-0)
- `Version 2.4` und `Version 2.5` (explizite inkompatible Versionen)
- Beziehung: `Version 2.3 → kompatibel_mit → SPS-Generation vor 2015`

### Beispiel 3: Ergänzung von Sicherheitshinweisen

**Original Q&A:**
```
Frage: Besonderheiten bei Wartung BMW Werk 2?
Antwort: KRITISCH: Anlagen laufen im Verbund! IMMER alle drei Anlagen 
         gleichzeitig abschalten.
```

**Nach Bearbeitung:**
```
Frage: Was muss ich bei der Wartung des Verbundsystems in BMW Werk 2 Halle 4 beachten?
Antwort: SICHERHEITSKRITISCH! Das Verbundsystem A/B/C in Halle 4 hat einen 
         gemeinsamen Kühlkreislauf. Bei Einzelabschaltung droht Kesselschaden! 
         Wartungskoordinator: Meister Huber (0171-2345678, Mo-Fr 6-14 Uhr). 
         Notfallkontakt Wochenende: Schichtleiter Müller (0171-9876543).
```

**Neu extrahierte Entitäten:**
- `Verbundsystem A/B/C` (präzise Systembezeichnung)
- `Halle 4` (Standort)
- `Meister Huber` (Hauptkontakt mit Arbeitszeiten)
- `Schichtleiter Müller` (Notfallkontakt)
- Attribut: `sicherheitskritisch: true`
- Beziehung: `Verbundsystem → hat_risiko → Kesselschaden`

## Automatisch erkannte Muster

Die Neu-Extraktion erkennt folgende Muster:

### 1. **Telefonnummern**
- Format: `0821-445566` oder `0171 2345678`
- Werden automatisch der nächsten Person zugeordnet

### 2. **Fehlercodes**
- Format: `F42`, `F71`, `F80`
- Mit Kontext: "Überhitzungsfehler F42" → Klassifikation

### 3. **Firmennamen**
- Bekannte: BMW, Bosch, Daimler, Audi, VW
- Mit Kontext: "Hydrotech Augsburg" → Firma + Standort

### 4. **Komponenten**
- Format: `Kondensator C3`, `Teil 4711`, `Schütz K4`
- Mit Warnung: "NICHT 4712" → Inkompatibilität

### 5. **Personen**
- Format: `Herr/Meister/Dr. + Name`
- Mit Kontext: Telefon, Firma, Rolle

### 6. **Zeitangaben**
- Arbeitszeiten: "Mo-Fr 6-14 Uhr"
- Wartungsintervalle: "monatlich", "alle 3 Monate"

## Tipps für effektive Bearbeitung

1. **Präzisieren Sie Orte**: "bei BMW" → "bei BMW München in Halle 3"
2. **Ergänzen Sie Kontakte**: Namen + Telefonnummern + Arbeitszeiten
3. **Klassifizieren Sie Probleme**: "Fehler F42" → "Überhitzungsfehler F42"
4. **Fügen Sie Warnungen hinzu**: "KRITISCH:", "SICHERHEITSRELEVANT:"
5. **Verknüpfen Sie Informationen**: "Herr Maier von Hydrotech (Tel: ...)"

## Technische Details

Die Extraktion nutzt:
- **Regex-Pattern** für Telefonnummern, Fehlercodes, Teilenummern
- **Named Entity Recognition** für Personen und Firmen
- **Kontextanalyse** für Beziehungen und Attribute
- **Sicherheitswörter** für Prioritätserkennung

Nach jeder Änderung werden die alten Entitäten verworfen und komplett neu extrahiert, um Konsistenz zu gewährleisten.