# Phase 2 - Auto-Debug System

**Phase**: Automation & Progression (Week 3-4)  
**Priority**: High  
**Estimated Time**: 5-6 hours  

## Description
Implement the automated debugging system that allows ducks to fix bugs without manual clicking.

## Tasks
- [ ] Create tick-based game loop using useGameLoop hook
- [ ] Implement auto-debug rate calculations
- [ ] Add offline progress calculation for returning players
- [ ] Create duck efficiency bonus system
- [ ] Implement proper timing for auto-debug intervals
- [ ] Add visual feedback for automated debugging

## Acceptance Criteria
- [ ] Game continues to generate resources when not actively clicking
- [ ] Offline progress is calculated correctly when returning
- [ ] Duck efficiency bonuses apply properly
- [ ] Game loop runs smoothly without performance issues
- [ ] Visual indicators show when auto-debugging is active

## Dependencies
- PHASE1-04-core-mechanics
- Must have at least one duck that provides auto-debug capability

## Technical Implementation
- Use `setInterval` or `requestAnimationFrame` for game loop
- Calculate offline progress based on `lastUpdate` timestamp
- Implement duck efficiency multipliers
- Consider battery-friendly timing (1-second intervals)

## Success Criteria from PLAN.md
- Game plays itself through automation ✓
- Clear progression path with meaningful choices ✓