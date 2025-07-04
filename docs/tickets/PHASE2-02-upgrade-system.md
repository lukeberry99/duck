# Phase 2 - Upgrade System

**Phase**: Automation & Progression (Week 3-4)  
**Priority**: High  
**Estimated Time**: 6-7 hours  

## Description
Expand the upgrade system with multiple duck types, proper upgrade trees, and unlock conditions.

## Tasks
- [ ] Create 5-7 different duck types with unique properties
- [ ] Implement upgrade tree structure and dependencies
- [ ] Add cost scaling algorithms for balanced progression
- [ ] Create unlock conditions based on progress milestones
- [ ] Design upgrade categories (Ducks, Tools, Environment)
- [ ] Implement upgrade effects and bonuses

## Acceptance Criteria
- [ ] Multiple duck types available with different specializations
- [ ] Upgrade costs scale appropriately to maintain challenge
- [ ] Unlock conditions create meaningful progression gates
- [ ] Upgrade effects are clearly communicated to players
- [ ] Upgrade tree provides strategic choices

## Dependencies
- PHASE2-01-auto-debug-system
- PHASE1-04-core-mechanics

## Duck Types to Implement
- **Basic Rubber Duck**: 1 bug/sec, general purpose
- **Bath Duck**: 2x web bugs, frontend specialist
- **Pirate Duck**: Security expert, finds critical vulnerabilities
- **Fancy Duck**: Enterprise debugging, high-value bonuses
- **Premium Duck**: 2x efficiency, distinguished appearance

## Cost Scaling Formula
- Base cost * (1.15 ^ owned_count)
- Adjust multiplier based on playtesting feedback

## Notes
- Balance is critical - too cheap makes progression trivial
- Each duck should feel meaningfully different
- Unlock conditions should create anticipation