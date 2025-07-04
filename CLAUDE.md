# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DuckOS: The Quacking** is an incremental/idle game built with React + TypeScript where players debug code with the help of sentient rubber ducks. The game progresses from simple manual debugging to managing cosmic debugging infrastructure that maintains the universe's stability.

## Commands

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

### Testing
No testing framework is currently configured. When implementing tests, check with the user for their preferred testing approach.

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand (lightweight Redux alternative)
- **Styling**: Tailwind CSS v4 with Vite plugin
- **Build Tool**: Vite with TypeScript support
- **Linting**: ESLint with TypeScript and React configs

### Project Structure
```
src/
├── components/     # UI components (DebugButton, ResourceDisplay, etc.)
├── hooks/         # Custom React hooks (useGameLoop, useAutoSave, etc.)
├── stores/        # Zustand stores (gameStore, upgradeStore, duckStore)
├── types/         # TypeScript type definitions
├── utils/         # Utility functions (calculations, saveLoad, formatting)
├── data/          # Static game data (ducks, upgrades, lore)
└── App.tsx        # Main app component
```

### Core Game Architecture
The game follows incremental game patterns with:
- **Persistent State**: Game state stored in localStorage
- **Tick-based Loop**: Auto-debugging runs on intervals
- **Resource Management**: Bugs Fixed, Code Quality, Debug Rate, Architecture Points
- **Prestige System**: "Refactoring" resets progress for permanent bonuses

### Game Phases
1. **Phase 1**: Manual debugging (0-100 bugs)
2. **Phase 2**: Automation & specialization (100-10K bugs)
3. **Phase 3**: Corporate contracts & DuckOS (10K-1M bugs)
4. **Phase 4**: Reality debugging (1M+ bugs)

### UI Design
- **Terminal/IDE aesthetic**: Dark theme with monospace fonts
- **Single-page layout**: Stats panel, debug log, upgrades panel
- **Narrative through debug log**: Story unfolds through scrolling messages
- **Minimal but functional**: Focus on numbers and progression

## Key Implementation Details

### State Management
Use Zustand for all game state. The main game state includes:
```typescript
interface GameState {
  bugsFixed: number;
  codeQuality: number;
  debugRate: number;
  ducks: Duck[];
  upgrades: Upgrade[];
  lastUpdate: number;
}
```

### Save/Load System
- Auto-save to localStorage every few seconds
- Handle offline progress when player returns
- Implement backup save system to prevent corruption

### Duck Types & Specializations
- Basic Rubber Duck (general debugging)
- Bath Duck (frontend specialist)
- Pirate Duck (security expert)
- Fancy Duck (enterprise debugging)
- Quantum Duck (paradox handling)
- Cosmic Duck (universe-level debugging)

### Upgrade System
- Cost scaling algorithms for balanced progression
- Unlock conditions based on bugs fixed or story progress
- Categories: Ducks, Tools & Environment, Prestige Upgrades

## Development Notes

### Code Style
- Use TypeScript strictly - no `any` types
- Follow React best practices with hooks
- Keep components small and focused
- Use Tailwind classes for styling
- Maintain the monospace/terminal aesthetic

### Game Balance
- Manual debugging should feel rewarding initially
- Auto-debugging unlocks around 50 bugs fixed
- Each phase should provide 30-60 minutes of engagement
- Prestige system should offer meaningful permanent bonuses

### Narrative Integration
- Debug log messages tell the story
- Escalating absurdity as game progresses
- Duck "dialogue" through different squeak translations
- Lore reveals ducks are cosmic debugging entities

## Documentation

See `docs/PLAN.md` for complete game design document including:
- Detailed phase breakdowns
- UI mockups and color schemes
- Implementation timeline
- Success metrics and risk mitigation

Individual development tickets are in `docs/tickets/` with specific implementation tasks for each phase.