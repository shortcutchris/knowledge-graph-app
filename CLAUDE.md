# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev      # Start development server (default: http://localhost:5173)
npm run build    # Create production build (TypeScript check + Vite build)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint checks
```

### Common Development Tasks
```bash
# Kill processes on common ports if needed
lsof -ti:5173 | xargs kill -9 2>/dev/null
lsof -ti:5174 | xargs kill -9 2>/dev/null

# Install new dependencies
npm install <package-name>
npm install -D <dev-package-name>
```

## Architecture Overview

### Core Application Flow
The application simulates knowledge extraction from expert documents into an interactive knowledge graph:

1. **UseCaseModal** - Initial modal explaining the demo scenario (Herr Wagner's retirement)
2. **DocumentUploadPanel** - Simulates document upload with pre-loaded sample data
3. **QAExtractionPanel** - Shows extracted Q&A pairs with entity/relationship proposals
4. **ForceGraph** - D3.js-based interactive visualization of the knowledge graph
5. **KnowledgeGraphBuilder** - Main orchestrator component managing the entire flow

### State Management Pattern
- Uses React hooks for local state management
- Main state lives in `KnowledgeGraphBuilder` component
- Process flow controlled by `processStep` state: 'upload' → 'extract' → 'map' → 'complete'
- Graph data managed through `ontologyNodes` and `ontologyLinks` arrays
- Proposed elements temporarily stored before confirmation

### Key Data Structures

**Node** (`src/types/index.ts`):
- Represents entities in the graph (person, class, instance, question, answer)
- Contains positioning data for D3.js force simulation
- Special `nodeType` field determines visualization style

**Link** (`src/types/index.ts`):
- Represents relationships between nodes
- Can include attributes for additional metadata
- Types: 'is_a', 'instance_of', 'is_relevant_for', custom predicates

**QA** (`src/types/index.ts`):
- Question-Answer pairs with extracted entities and predicates
- Includes metadata (category, difficulty, cost savings, etc.)
- Can propose new ontology classes

### D3.js Integration
- Force-directed layout with custom forces for node positioning
- SVG pattern definitions for images (e.g., Herr Wagner's profile picture)
- Zoom/pan behavior with constraints
- Drag-and-drop node repositioning
- Custom node rendering based on `nodeType`

### Component Communication
- Props drilling for state and callbacks
- `useImperativeHandle` for exposing graph methods (e.g., `fitToViewport`)
- Event handlers passed down for user interactions
- Dimension updates through resize observers

### Styling Approach
- Tailwind CSS for utility-first styling
- Shadcn/ui components for consistent UI elements
- Custom animations using Tailwind's animation utilities
- Dark theme headers with gray-900 background

### Sample Data
- Pre-defined Q&A pairs in `src/data/sampleData.ts`
- Proposed elements generated dynamically in `src/utils/proposedElements.ts`
- Each Q&A mapped to specific ontology extensions based on index

### Important Implementation Details
- Images imported as ES modules (e.g., `import expertWagnerImage from '../../assets/images/expert_herr_wagner.png'`)
- SVG patterns used for circular image display in graph nodes
- Responsive panel layout with collapsible left panel
- Fullscreen mode creates separate graph instance
- Animation delays for smooth UI transitions