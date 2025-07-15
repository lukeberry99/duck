import {
  initialPrestigeUpgrades,
  calculateArchitecturePoints,
  getPrestigeUpgradesByCategory,
  calculatePrestigeMultipliers,
  canAffordPrestigeUpgrade,
  getPrestigeUpgradeCost
} from '../prestigeUpgrades';
import type { PrestigeUpgrade } from '../../types/game';

describe('Prestige System', () => {
  describe('calculateArchitecturePoints', () => {
    it('should return 0 for less than 1000 bugs', () => {
      expect(calculateArchitecturePoints(999)).toBe(0);
      expect(calculateArchitecturePoints(500)).toBe(0);
      expect(calculateArchitecturePoints(0)).toBe(0);
    });

    it('should calculate base points using sqrt formula', () => {
      expect(calculateArchitecturePoints(1000)).toBe(3); // sqrt(1000) / 10 = 3.16..., floored = 3
      expect(calculateArchitecturePoints(2500)).toBe(5); // sqrt(2500) / 10 = 5
      // Note: 10000 triggers the 1.4x multiplier, so base 10 becomes 14
      expect(calculateArchitecturePoints(4999)).toBe(7); // sqrt(4999) / 10 = 7.07..., floored = 7 (no multiplier)
    });

    it('should apply milestone multipliers', () => {
      // 5000 bugs: sqrt(5000) / 10 = 7.07..., floored = 7, then * 1.2 = 8.4, floored = 8
      expect(calculateArchitecturePoints(5000)).toBe(8);
      
      // 10000 bugs: sqrt(10000) / 10 = 10, then * 1.4 = 14
      expect(calculateArchitecturePoints(10000)).toBe(14);
      
      // 25000 bugs: sqrt(25000) / 10 = 15.8..., floored = 15, then * 1.6 = 24
      expect(calculateArchitecturePoints(25000)).toBe(24);
      
      // 50000 bugs: sqrt(50000) / 10 = 22.36..., floored = 22, then * 1.8 = 39.6, floored = 39
      expect(calculateArchitecturePoints(50000)).toBe(39);
      
      // 100000 bugs: sqrt(100000) / 10 = 31.6..., floored = 31, then * 2 = 62
      expect(calculateArchitecturePoints(100000)).toBe(62);
    });

    it('should handle large bug counts', () => {
      const result = calculateArchitecturePoints(1000000);
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
      expect(result).toBe(Math.floor(result)); // Should be integer
    });

    it('should apply highest applicable multiplier', () => {
      // Just over 100000 should get 2x multiplier
      const result = calculateArchitecturePoints(100001);
      const basePoints = Math.floor(Math.sqrt(100001) / 10);
      expect(result).toBe(Math.floor(basePoints * 2));
    });
  });

  describe('getPrestigeUpgradesByCategory', () => {
    it('should return upgrades filtered by category', () => {
      const architectureUpgrades = getPrestigeUpgradesByCategory(initialPrestigeUpgrades, 'architecture');
      expect(architectureUpgrades.length).toBeGreaterThan(0);
      architectureUpgrades.forEach(upgrade => {
        expect(upgrade.category).toBe('architecture');
      });
    });

    it('should return empty array for non-existent category', () => {
      const result = getPrestigeUpgradesByCategory(initialPrestigeUpgrades, 'nonexistent');
      expect(result).toEqual([]);
    });

    it('should return all categories correctly', () => {
      const categories = ['architecture', 'codeReview', 'methodology', 'universal'];
      
      categories.forEach(category => {
        const upgrades = getPrestigeUpgradesByCategory(initialPrestigeUpgrades, category);
        expect(upgrades.length).toBeGreaterThan(0);
      });
    });
  });

  describe('calculatePrestigeMultipliers', () => {
    const createMockPrestigeUpgrade = (
      id: string,
      purchased: boolean,
      currentLevel: number,
      target: 'debugRate' | 'codeQuality' | 'duckEfficiency' | 'architecturePointsGain' | 'startingResources',
      value: number
    ): PrestigeUpgrade => ({
      id,
      category: 'architecture',
      name: 'Test Upgrade',
      description: 'Test description',
      cost: 10,
      purchased,
      currentLevel,
      maxLevel: 5,
      effect: {
        type: 'multiplier',
        target,
        value
      }
    });

    it('should return 1.0 multipliers for no upgrades', () => {
      const result = calculatePrestigeMultipliers([]);
      expect(result).toEqual({
        debugRate: 1,
        codeQuality: 1,
        duckEfficiency: 1,
        architecturePointsGain: 1
      });
    });

    it('should return 1.0 multipliers for unpurchased upgrades', () => {
      const upgrades = [
        createMockPrestigeUpgrade('test', false, 0, 'debugRate', 1.5)
      ];
      const result = calculatePrestigeMultipliers(upgrades);
      expect(result.debugRate).toBe(1);
    });

    it('should apply single upgrade multiplier', () => {
      const upgrades = [
        createMockPrestigeUpgrade('test', true, 1, 'debugRate', 1.5)
      ];
      const result = calculatePrestigeMultipliers(upgrades);
      expect(result.debugRate).toBe(1.5);
      expect(result.codeQuality).toBe(1);
    });

    it('should compound multiple upgrades of same type', () => {
      const upgrades = [
        createMockPrestigeUpgrade('test1', true, 1, 'debugRate', 1.5),
        createMockPrestigeUpgrade('test2', true, 1, 'debugRate', 2.0)
      ];
      const result = calculatePrestigeMultipliers(upgrades);
      expect(result.debugRate).toBe(3.0); // 1.5 * 2.0
    });

    it('should handle multi-level upgrades', () => {
      const upgrades = [
        createMockPrestigeUpgrade('test', true, 3, 'debugRate', 1.2)
      ];
      const result = calculatePrestigeMultipliers(upgrades);
      expect(result.debugRate).toBeCloseTo(1.728); // 1.2^3
    });

    it('should handle all target types', () => {
      const upgrades = [
        createMockPrestigeUpgrade('test1', true, 1, 'debugRate', 1.5),
        createMockPrestigeUpgrade('test2', true, 1, 'codeQuality', 2.0),
        createMockPrestigeUpgrade('test3', true, 1, 'duckEfficiency', 1.75),
        createMockPrestigeUpgrade('test4', true, 1, 'architecturePointsGain', 1.25)
      ];
      const result = calculatePrestigeMultipliers(upgrades);
      expect(result.debugRate).toBe(1.5);
      expect(result.codeQuality).toBe(2.0);
      expect(result.duckEfficiency).toBe(1.75);
      expect(result.architecturePointsGain).toBe(1.25);
    });

    it('should ignore zero-level upgrades', () => {
      const upgrades = [
        createMockPrestigeUpgrade('test', true, 0, 'debugRate', 1.5)
      ];
      const result = calculatePrestigeMultipliers(upgrades);
      expect(result.debugRate).toBe(1);
    });

    it('should handle unknown target types gracefully', () => {
      const upgrades: PrestigeUpgrade[] = [{
        id: 'test',
        category: 'architecture',
        name: 'Test Upgrade',
        description: 'Test description',
        cost: 10,
        purchased: true,
        currentLevel: 1,
        maxLevel: 5,
        effect: {
          type: 'multiplier',
          target: 'unknownTarget' as 'debugRate',
          value: 1.5
        }
      }];
      const result = calculatePrestigeMultipliers(upgrades);
      expect(result.debugRate).toBe(1);
      expect(result.codeQuality).toBe(1);
      expect(result.duckEfficiency).toBe(1);
      expect(result.architecturePointsGain).toBe(1);
    });
  });

  describe('canAffordPrestigeUpgrade', () => {
    const createMockPrestigeUpgrade = (
      cost: number,
      currentLevel: number,
      maxLevel?: number
    ): PrestigeUpgrade => ({
      id: 'test',
      category: 'architecture',
      name: 'Test Upgrade',
      description: 'Test description',
      cost,
      purchased: false,
      currentLevel,
      maxLevel,
      effect: {
        type: 'multiplier',
        target: 'debugRate',
        value: 1.5
      }
    });

    it('should return true when can afford first level', () => {
      const upgrade = createMockPrestigeUpgrade(10, 0);
      expect(canAffordPrestigeUpgrade(10, upgrade)).toBe(true);
      expect(canAffordPrestigeUpgrade(15, upgrade)).toBe(true);
    });

    it('should return false when cannot afford first level', () => {
      const upgrade = createMockPrestigeUpgrade(10, 0);
      expect(canAffordPrestigeUpgrade(9, upgrade)).toBe(false);
      expect(canAffordPrestigeUpgrade(0, upgrade)).toBe(false);
    });

    it('should scale cost with current level', () => {
      const upgrade = createMockPrestigeUpgrade(10, 2); // Level 2, so cost = 10 * 2^2 = 40
      expect(canAffordPrestigeUpgrade(39, upgrade)).toBe(false);
      expect(canAffordPrestigeUpgrade(40, upgrade)).toBe(true);
    });

    it('should return false when at max level', () => {
      const upgrade = createMockPrestigeUpgrade(10, 3, 3);
      expect(canAffordPrestigeUpgrade(1000, upgrade)).toBe(false);
    });

    it('should handle upgrades without max level', () => {
      const upgrade = createMockPrestigeUpgrade(10, 5, undefined);
      expect(canAffordPrestigeUpgrade(320, upgrade)).toBe(true); // 10 * 2^5 = 320
    });

    it('should handle high levels correctly', () => {
      const upgrade = createMockPrestigeUpgrade(5, 10); // Cost = 5 * 2^10 = 5120
      expect(canAffordPrestigeUpgrade(5119, upgrade)).toBe(false);
      expect(canAffordPrestigeUpgrade(5120, upgrade)).toBe(true);
    });
  });

  describe('getPrestigeUpgradeCost', () => {
    const createMockPrestigeUpgrade = (cost: number, currentLevel: number): PrestigeUpgrade => ({
      id: 'test',
      category: 'architecture',
      name: 'Test Upgrade',
      description: 'Test description',
      cost,
      purchased: false,
      currentLevel,
      maxLevel: 5,
      effect: {
        type: 'multiplier',
        target: 'debugRate',
        value: 1.5
      }
    });

    it('should return base cost for level 0', () => {
      const upgrade = createMockPrestigeUpgrade(10, 0);
      expect(getPrestigeUpgradeCost(upgrade)).toBe(10);
    });

    it('should double cost for each level', () => {
      const upgrade1 = createMockPrestigeUpgrade(10, 1);
      const upgrade2 = createMockPrestigeUpgrade(10, 2);
      const upgrade3 = createMockPrestigeUpgrade(10, 3);
      
      expect(getPrestigeUpgradeCost(upgrade1)).toBe(20);  // 10 * 2^1
      expect(getPrestigeUpgradeCost(upgrade2)).toBe(40);  // 10 * 2^2
      expect(getPrestigeUpgradeCost(upgrade3)).toBe(80);  // 10 * 2^3
    });

    it('should handle different base costs', () => {
      const upgrade = createMockPrestigeUpgrade(25, 2);
      expect(getPrestigeUpgradeCost(upgrade)).toBe(100); // 25 * 2^2
    });

    it('should handle high levels', () => {
      const upgrade = createMockPrestigeUpgrade(1, 10);
      expect(getPrestigeUpgradeCost(upgrade)).toBe(1024); // 1 * 2^10
    });

    it('should return integer values', () => {
      for (let level = 0; level < 10; level++) {
        const upgrade = createMockPrestigeUpgrade(7, level);
        const cost = getPrestigeUpgradeCost(upgrade);
        expect(cost).toBe(Math.floor(cost));
      }
    });
  });

  describe('initialPrestigeUpgrades configuration', () => {
    it('should have all required properties', () => {
      initialPrestigeUpgrades.forEach(upgrade => {
        expect(upgrade).toHaveProperty('id');
        expect(upgrade).toHaveProperty('category');
        expect(upgrade).toHaveProperty('name');
        expect(upgrade).toHaveProperty('description');
        expect(upgrade).toHaveProperty('cost');
        expect(upgrade).toHaveProperty('purchased');
        expect(upgrade).toHaveProperty('currentLevel');
        expect(upgrade).toHaveProperty('maxLevel');
        expect(upgrade).toHaveProperty('effect');
        
        expect(typeof upgrade.id).toBe('string');
        expect(typeof upgrade.category).toBe('string');
        expect(typeof upgrade.name).toBe('string');
        expect(typeof upgrade.description).toBe('string');
        expect(typeof upgrade.cost).toBe('number');
        expect(typeof upgrade.purchased).toBe('boolean');
        expect(typeof upgrade.currentLevel).toBe('number');
        expect(typeof upgrade.effect).toBe('object');
      });
    });

    it('should have valid categories', () => {
      const validCategories = ['architecture', 'codeReview', 'methodology', 'universal'];
      initialPrestigeUpgrades.forEach(upgrade => {
        expect(validCategories).toContain(upgrade.category);
      });
    });

    it('should have valid effect targets', () => {
      const validTargets = [
        'debugRate',
        'codeQuality',
        'duckEfficiency',
        'architecturePointsGain',
        'startingResources'
      ];
      initialPrestigeUpgrades.forEach(upgrade => {
        expect(validTargets).toContain(upgrade.effect.target);
      });
    });

    it('should have valid effect types', () => {
      const validTypes = ['multiplier', 'special'];
      initialPrestigeUpgrades.forEach(upgrade => {
        expect(validTypes).toContain(upgrade.effect.type);
      });
    });

    it('should start with purchased = false and currentLevel = 0', () => {
      initialPrestigeUpgrades.forEach(upgrade => {
        expect(upgrade.purchased).toBe(false);
        expect(upgrade.currentLevel).toBe(0);
      });
    });

    it('should have positive costs and levels', () => {
      initialPrestigeUpgrades.forEach(upgrade => {
        expect(upgrade.cost).toBeGreaterThan(0);
        expect(upgrade.currentLevel).toBeGreaterThanOrEqual(0);
        if (upgrade.maxLevel) {
          expect(upgrade.maxLevel).toBeGreaterThan(0);
        }
      });
    });

    it('should have multiplier values > 1 for multiplier effects', () => {
      initialPrestigeUpgrades
        .filter(upgrade => upgrade.effect.type === 'multiplier')
        .forEach(upgrade => {
          expect(upgrade.effect.value).toBeGreaterThan(1);
        });
    });

    it('should have unique IDs', () => {
      const ids = initialPrestigeUpgrades.map(upgrade => upgrade.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('should have reasonable cost progression', () => {
      // Check that costs generally increase for more powerful upgrades
      const architectureUpgrades = getPrestigeUpgradesByCategory(initialPrestigeUpgrades, 'architecture');
      const universalUpgrades = getPrestigeUpgradesByCategory(initialPrestigeUpgrades, 'universal');
      
      // Universal upgrades should generally be more expensive
      const avgArchitectureCost = architectureUpgrades.reduce((sum, u) => sum + u.cost, 0) / architectureUpgrades.length;
      const avgUniversalCost = universalUpgrades.reduce((sum, u) => sum + u.cost, 0) / universalUpgrades.length;
      
      expect(avgUniversalCost).toBeGreaterThan(avgArchitectureCost);
    });
  });
});