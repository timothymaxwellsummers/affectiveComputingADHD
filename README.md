# FocusPlay: Spielbasierte Therapieansätze für Kinder mit ADHS und Monitoring für Eltern

FocusPlay ist eine innovative Plattform, die spielbasierte Therapieansätze für Kinder mit Aufmerksamkeitsdefizit-Hyperaktivitätsstörung (ADHS) bietet und Eltern eine umfassende Überwachung ermöglicht. Dieses Projekt verwendet Gesichtserkennungstechnologie, um das emotionale und aufmerksamkeitsspezifische Verhalten der Kinder zu analysieren.

## Installation

Um das Projekt lokal auszuführen, folgen Sie bitte diesen Schritten:

1. **Repository klonen**: 
   ```bash
   git clone url
   ```
2. **Dependencies installieren**:
   ```bash
   npm install
   ```
3. **Projekt starten**:
   ```bash
   npm run dev
   ```
   Das Projekt ist nun unter `http://localhost:3000` erreichbar.

4. **Kamerazugriff erlauben**: Für die Gesichtserkennung muss der Zugriff auf die Kamera erlaubt werden.

5. **Elterndashboard aufrufen**: Navigieren Sie manuell zu `/dashboard`, um das Elterndashboard aufzurufen.

## Projektstruktur

Die Projektstruktur ist wie folgt aufgebaut:

- **public**: Enthält Modelle und entsprechende Gewichte, die für die Gesichtserkennung benötigt werden.

- **src**: Hauptverzeichnis des Projekts, das den gesamten Quellcode enthält.
  - **page.tsx**: Die Root-Datei der Anwendung.
  - **GameComponent**: Enthält die spielbasierten Therapieansätze.
  - **DashboardComponent**: Verantwortlich für das Tracking von Aufmerksamkeit und Emotionen, wird jedoch visuell nicht angezeigt.
  - **services**: Beinhaltet den `localStorageService.ts`, der für das Speichern der Daten zuständig ist.

- **dashboard**: Enthält alle Komponenten des Elterndashboards.
  - **page.tsx**: Root-Komponente des Dashboards.
  - **services/dataHandler.ts**: Verantwortlich für die Auswertung der gespeicherten Daten.

## Verwendung

FocusPlay zielt darauf ab, Kindern durch spielbasierte Ansätze zu helfen, ihre Konzentration zu verbessern und ihre Emotionen zu regulieren. Eltern können über das Dashboard detaillierte Berichte und Analysen einsehen, um den Fortschritt ihrer Kinder zu verfolgen.