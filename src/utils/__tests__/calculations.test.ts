import {
  calculateDebugRate,
  calculateOfflineProgress,
  calculateUpgradeCost,
  calculateDynamicUpgradeCost,
  canAffordUpgrade,
  calculateDuckEfficiency,
  isDependencyMet,
  getUpgradeScalingCost,
  formatNumber,
  formatRate
} from '../calculations';
import type { Duck, Upgrade, PrestigeUpgrade, DuckType, UpgradeType } from '../../types/game';

describe('calculateDebugRate', () => {
  const createMockDuck = (type: DuckType, debugPower: number): Duck => ({
    id: 'test-duck',
    type,
    debugPower,
    level: 1,
    acquired: Date.now(),
    specialization: type === 'rubber' ? 'general' : 'frontend',
    specializationBonus: 1.0
  });

  const createMockUpgrade = (
    id: string,
    purchased: boolean,
    effectTarget: 'debugRate' | 'codeQuality' | 'duckEfficiency' | 'special',
    effectType: 'multiplier' | 'additive' | 'unlock',
    effectValue: number,
    type: UpgradeType = 'tool'
  ): Upgrade => ({
    id,
    name: `Test ${id}`,
    description: 'Test upgrade',
    cost: 100,
    purchased,
    effect: {
      target: effectTarget,
      type: effectType,
      value: effectValue
    },
    type,
    dependencies: [],
    unlocked: true
  });

  it('should return 0 for empty ducks array', () => {
    const result = calculateDebugRate([], []);
    expect(result).toBe(0);
  });

  it('should calculate base rate from duck debug power', () => {
    const ducks = [createMockDuck('rubber', 5)];
    const result = calculateDebugRate(ducks, []);
    expect(result).toBe(5);
  });

  it('should apply duck efficiency multipliers', () => {
    const ducks = [createMockDuck('rubber', 5)];
    const upgrades = [
      createMockUpgrade('test1', true, 'duckEfficiency', 'multiplier', 2)
    ];
    const result = calculateDebugRate(ducks, upgrades);
    expect(result).toBe(10); // 5 * 2
  });

  it('should apply debug rate multipliers from upgrades', () => {
    const ducks = [createMockDuck('rubber', 5)];
    const upgrades = [
      createMockUpgrade('test1', true, 'debugRate', 'multiplier', 2)
    ];
    const result = calculateDebugRate(ducks, upgrades);
    expect(result).toBe(10); // 5 * 2
  });

  it('should apply additive bonuses from upgrades', () => {
    const ducks = [createMockDuck('rubber', 5)];
    const upgrades = [
      createMockUpgrade('test1', true, 'debugRate', 'additive', 3)
    ];
    const result = calculateDebugRate(ducks, upgrades);
    expect(result).toBe(8); // (5 + 3) * 1
  });

  it('should apply special multipliers (zen garden)', () => {
    const ducks = [createMockDuck('rubber', 5)];
    const upgrades = [
      createMockUpgrade('test1', true, 'special', 'multiplier', 1.5)
    ];
    const result = calculateDebugRate(ducks, upgrades);
    expect(result).toBe(7.5); // 5 * 1.5
  });

  it('should apply prestige multipliers when provided', () => {
    const ducks = [createMockDuck('rubber', 5)];
    
    // Create a mock prestige upgrade that provides 2x debug rate multiplier
    const prestigeUpgrades: PrestigeUpgrade[] = [{
      id: 'test-prestige',
      category: 'architecture',
      name: 'Test Prestige',
      description: 'Test description',
      cost: 10,
      purchased: true,
      currentLevel: 1,
      maxLevel: 5,
      effect: {
        type: 'multiplier',
        target: 'debugRate',
        value: 2
      }
    }];
    
    const result = calculateDebugRate(ducks, [], prestigeUpgrades);
    expect(result).toBe(10); // 5 * 2 (prestige multiplier)
  });

  it('should handle multiple ducks of same type', () => {
    const ducks = [
      createMockDuck('rubber', 5),
      createMockDuck('rubber', 5)
    ];
    const result = calculateDebugRate(ducks, []);
    expect(result).toBe(10); // 5 + 5
  });

  it('should handle mixed duck types with different bonuses', () => {
    const ducks = [
      createMockDuck('rubber', 5),
      createMockDuck('bath', 8)
    ];
    const result = calculateDebugRate(ducks, []);
    expect(result).toBe(13); // 5 + 8
  });

  it('should not apply unpurchased upgrades', () => {
    const ducks = [createMockDuck('rubber', 5)];
    const upgrades = [
      createMockUpgrade('test1', false, 'debugRate', 'multiplier', 2)
    ];
    const result = calculateDebugRate(ducks, upgrades);
    expect(result).toBe(5); // No multiplier applied
  });

  it('should combine multiple multipliers correctly', () => {
    const ducks = [createMockDuck('rubber', 5)];
    const upgrades = [
      createMockUpgrade('test1', true, 'debugRate', 'multiplier', 2),
      createMockUpgrade('test2', true, 'debugRate', 'multiplier', 1.5)
    ];
    const result = calculateDebugRate(ducks, upgrades);
    expect(result).toBe(15); // 5 * 2 * 1.5
  });
});

describe('calculateOfflineProgress', () => {
  const mockNow = 1640995200000; // Fixed timestamp
  
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(mockNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return 0 progress for future lastUpdate', () => {
    const futureTime = mockNow + 1000;
    const result = calculateOfflineProgress(futureTime, 10);
    expect(result.bugsFixed).toBe(0);
    expect(result.codeQuality).toBe(0);
    expect(result.timeAway).toBe(0);
  });

  it('should calculate progress for 1 hour offline', () => {
    const oneHourAgo = mockNow - (3600 * 1000); // 1 hour ago
    const debugRate = 10; // 10 bugs per second
    const result = calculateOfflineProgress(oneHourAgo, debugRate);
    
    expect(result.bugsFixed).toBe(36000); // 10 * 3600 * 1.0 efficiency
    expect(result.codeQuality).toBe(180000); // 36000 * 5
    expect(result.timeAway).toBe(3600 * 1000);
  });

  it('should apply diminishing returns after 1 hour', () => {
    const twoHoursAgo = mockNow - (7200 * 1000); // 2 hours ago
    const debugRate = 10; // 10 bugs per second
    const result = calculateOfflineProgress(twoHoursAgo, debugRate);
    
    expect(result.bugsFixed).toBe(57600); // 10 * 7200 * 0.8 efficiency
    expect(result.codeQuality).toBe(288000); // 57600 * 5
  });

  it('should cap progress at 24 hours maximum', () => {
    const twoDaysAgo = mockNow - (48 * 3600 * 1000); // 48 hours ago
    const debugRate = 10; // 10 bugs per second
    const result = calculateOfflineProgress(twoDaysAgo, debugRate);
    
    const maxSeconds = 24 * 3600;
    const expectedBugs = Math.floor(10 * maxSeconds * 0.8); // 0.8 efficiency for > 1 hour
    expect(result.bugsFixed).toBe(expectedBugs);
    expect(result.codeQuality).toBe(expectedBugs * 5);
  });

  it('should calculate correct code quality (5 CQ per bug)', () => {
    const oneHourAgo = mockNow - (3600 * 1000);
    const debugRate = 5;
    const result = calculateOfflineProgress(oneHourAgo, debugRate);
    
    expect(result.codeQuality).toBe(result.bugsFixed * 5);
  });

  it('should handle zero debug rate', () => {
    const oneHourAgo = mockNow - (3600 * 1000);
    const result = calculateOfflineProgress(oneHourAgo, 0);
    
    expect(result.bugsFixed).toBe(0);
    expect(result.codeQuality).toBe(0);
  });
});

describe('calculateUpgradeCost', () => {
  it('should return base cost for level 0', () => {
    const result = calculateUpgradeCost(100, 0);
    expect(result).toBe(100);
  });

  it('should scale cost exponentially with level', () => {
    const baseCost = 100;
    const level1 = calculateUpgradeCost(baseCost, 1);
    const level2 = calculateUpgradeCost(baseCost, 2);
    
    expect(level1).toBe(Math.floor(100 * Math.pow(1.15, 1))); // 100 * 1.15^1 with floating point precision
    expect(level2).toBe(132); // 100 * 1.15^2, floored
  });

  it('should handle fractional results correctly', () => {
    const result = calculateUpgradeCost(100, 5);
    const expected = Math.floor(100 * Math.pow(1.15, 5));
    expect(result).toBe(expected);
  });
});

describe('calculateDynamicUpgradeCost', () => {
  it('should use default scaling factor of 1.2', () => {
    const result = calculateDynamicUpgradeCost(100, 2);
    expect(result).toBe(144); // 100 * 1.2^2
  });

  it('should use custom scaling factor', () => {
    const result = calculateDynamicUpgradeCost(100, 2, 1.5);
    expect(result).toBe(225); // 100 * 1.5^2
  });

  it('should return base cost for 0 purchased', () => {
    const result = calculateDynamicUpgradeCost(100, 0);
    expect(result).toBe(100);
  });
});

describe('canAffordUpgrade', () => {
  it('should return true when current CQ >= upgrade cost', () => {
    expect(canAffordUpgrade(100, 50)).toBe(true);
    expect(canAffordUpgrade(100, 100)).toBe(true);
  });

  it('should return false when current CQ < upgrade cost', () => {
    expect(canAffordUpgrade(50, 100)).toBe(false);
  });
});

describe('calculateDuckEfficiency', () => {
  const createMockDuck = (type: DuckType, debugPower: number): Duck => ({
    id: 'test-duck',
    type,
    debugPower,
    level: 1,
    acquired: Date.now(),
    specialization: 'general',
    specializationBonus: 1.0
  });

  const createMockUpgrade = (purchased: boolean, effectValue: number): Upgrade => ({
    id: 'test-upgrade',
    name: 'Test Upgrade',
    description: 'Test',
    cost: 100,
    purchased,
    effect: {
      target: 'duckEfficiency',
      type: 'multiplier',
      value: effectValue
    },
    type: 'duck',
    dependencies: [],
    unlocked: true
  });

  it('should return base duck debug power', () => {
    const duck = createMockDuck('rubber', 10);
    const result = calculateDuckEfficiency(duck, []);
    expect(result).toBe(10);
  });

  it('should apply duck efficiency multipliers', () => {
    const duck = createMockDuck('rubber', 10);
    const upgrades = [createMockUpgrade(true, 2)];
    const result = calculateDuckEfficiency(duck, upgrades);
    expect(result).toBe(20); // 10 * 2
  });

  it('should not apply unpurchased upgrades', () => {
    const duck = createMockDuck('rubber', 10);
    const upgrades = [createMockUpgrade(false, 2)];
    const result = calculateDuckEfficiency(duck, upgrades);
    expect(result).toBe(10); // No multiplier applied
  });
});

describe('isDependencyMet', () => {
  const createMockUpgrade = (id: string, purchased: boolean, dependencies: string[] = []): Upgrade => ({
    id,
    name: `Test ${id}`,
    description: 'Test upgrade',
    cost: 100,
    purchased,
    effect: { target: 'debugRate', type: 'multiplier', value: 1.5 },
    type: 'tool',
    dependencies,
    unlocked: true
  });

  it('should return true for no dependencies', () => {
    const upgrade = createMockUpgrade('test', false, []);
    const result = isDependencyMet(upgrade, []);
    expect(result).toBe(true);
  });

  it('should return true when all dependencies are purchased', () => {
    const upgrade = createMockUpgrade('test', false, ['dep1', 'dep2']);
    const upgrades = [
      createMockUpgrade('dep1', true),
      createMockUpgrade('dep2', true)
    ];
    const result = isDependencyMet(upgrade, upgrades);
    expect(result).toBe(true);
  });

  it('should return false when some dependencies are not purchased', () => {
    const upgrade = createMockUpgrade('test', false, ['dep1', 'dep2']);
    const upgrades = [
      createMockUpgrade('dep1', true),
      createMockUpgrade('dep2', false)
    ];
    const result = isDependencyMet(upgrade, upgrades);
    expect(result).toBe(false);
  });

  it('should return false when dependencies do not exist', () => {
    const upgrade = createMockUpgrade('test', false, ['nonexistent']);
    const upgrades = [createMockUpgrade('other', true)];
    const result = isDependencyMet(upgrade, upgrades);
    expect(result).toBe(false);
  });
});

describe('getUpgradeScalingCost', () => {
  const createMockUpgrade = (type: string, cost: number): Upgrade => ({
    id: 'test',
    name: 'Test',
    description: 'Test upgrade',
    cost,
    purchased: false,
    effect: { target: 'debugRate', type: 'multiplier', value: 1.5 },
    type: type as UpgradeType,
    dependencies: [],
    unlocked: true
  });

  it('should apply correct scaling for duck type', () => {
    const upgrade = createMockUpgrade('duck', 100);
    const result = getUpgradeScalingCost(upgrade, 2);
    expect(result).toBe(132); // 100 * 1.15^2
  });

  it('should apply correct scaling for tool type', () => {
    const upgrade = createMockUpgrade('tool', 100);
    const result = getUpgradeScalingCost(upgrade, 2);
    expect(result).toBe(144); // 100 * 1.2^2
  });

  it('should apply correct scaling for environment type', () => {
    const upgrade = createMockUpgrade('environment', 100);
    const result = getUpgradeScalingCost(upgrade, 2);
    expect(result).toBe(156); // 100 * 1.25^2
  });

  it('should use default scaling for unknown type', () => {
    const upgrade = createMockUpgrade('unknown', 100);
    const result = getUpgradeScalingCost(upgrade, 2);
    expect(result).toBe(144); // 100 * 1.2^2 (default)
  });

  it('should return base cost for 0 times purchased', () => {
    const upgrade = createMockUpgrade('duck', 100);
    const result = getUpgradeScalingCost(upgrade, 0);
    expect(result).toBe(100);
  });
});

describe('formatNumber', () => {
  it('should return number as string for < 1000', () => {
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(42)).toBe('42');
  });

  it('should format thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(999999)).toBe('1000.0K');
  });

  it('should format millions with M suffix', () => {
    expect(formatNumber(1000000)).toBe('1.0M');
    expect(formatNumber(1500000)).toBe('1.5M');
    expect(formatNumber(999999999)).toBe('1000.0M');
  });

  it('should format billions with B suffix', () => {
    expect(formatNumber(1000000000)).toBe('1.0B');
    expect(formatNumber(1500000000)).toBe('1.5B');
  });
});

describe('formatRate', () => {
  it('should format rates < 1 with 2 decimal places', () => {
    expect(formatRate(0.5)).toBe('0.50/sec');
    expect(formatRate(0.123)).toBe('0.12/sec');
  });

  it('should format rates < 10 with 1 decimal place', () => {
    expect(formatRate(1.5)).toBe('1.5/sec');
    expect(formatRate(9.9)).toBe('9.9/sec');
  });

  it('should format rates >= 10 as whole numbers', () => {
    expect(formatRate(10)).toBe('10/sec');
    expect(formatRate(42.7)).toBe('42/sec');
    expect(formatRate(100.9)).toBe('100/sec');
  });
});