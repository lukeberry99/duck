import type { Duck, Upgrade, PrestigeUpgrade } from '../types/game';
import { duckTypes } from '../data/ducks';
import { calculatePrestigeMultipliers } from '../data/prestigeUpgrades';

export interface UpgradeEffects {
  debugRate: {
    additive: number;
    multiplier: number;
  };
  codeQuality: {
    additive: number;
    multiplier: number;
  };
  duckEfficiency: {
    additive: number;
    multiplier: number;
  };
  special: {
    additive: number;
    multiplier: number;
  };
}

export const calculateUpgradeEffects = (upgrades: Upgrade[]): UpgradeEffects => {
  const effects: UpgradeEffects = {
    debugRate: { additive: 0, multiplier: 1 },
    codeQuality: { additive: 0, multiplier: 1 },
    duckEfficiency: { additive: 0, multiplier: 1 },
    special: { additive: 0, multiplier: 1 }
  };

  let multiplierCount = 0;

  upgrades.forEach(upgrade => {
    if (!upgrade.purchased) return;

    const target = upgrade.effect.target as keyof UpgradeEffects;
    if (!effects[target]) return;

    if (upgrade.effect.type === 'additive') {
      effects[target].additive += upgrade.effect.value;
    } else if (upgrade.effect.type === 'multiplier') {
      // Apply diminishing returns to multiplier stacking
      const effectiveness = Math.pow(0.8, multiplierCount);
      const adjustedValue = 1 + (upgrade.effect.value - 1) * effectiveness;
      effects[target].multiplier *= adjustedValue;
      multiplierCount++;
    }
  });

  return effects;
};

export const calculateDebugRate = (ducks: Duck[], upgrades: Upgrade[], prestigeUpgrades?: PrestigeUpgrade[]): number => {
  const effects = calculateUpgradeEffects(upgrades);
  
  // Calculate duck efficiency multiplier
  const duckEfficiencyMultiplier = effects.duckEfficiency.multiplier;
  
  // Calculate special multipliers (like zen garden)
  const specialMultiplier = effects.special.multiplier;
  
  // Base debug rate from ducks (with efficiency bonuses and special bonuses)
  const baseRate = ducks.reduce((total, duck) => {
    let duckPower = duck.debugPower;
    
    // Apply duck-specific bonuses
    const duckConfig = duckTypes[duck.type];
    if (duckConfig.specialBonus.type === 'efficiencyMultiplier') {
      duckPower *= duckConfig.specialBonus.value;
    }
    
    return total + (duckPower * duckEfficiencyMultiplier);
  }, 0);
  
  // Apply debug rate effects
  const debugRateMultiplier = effects.debugRate.multiplier;
  const debugRateAdditive = effects.debugRate.additive;
  
  // Apply prestige multipliers if available
  let prestigeMultiplier = 1;
  if (prestigeUpgrades) {
    const prestigeMultipliers = calculatePrestigeMultipliers(prestigeUpgrades);
    prestigeMultiplier = prestigeMultipliers.debugRate;
  }
  
  return (baseRate + debugRateAdditive) * debugRateMultiplier * specialMultiplier * prestigeMultiplier;
};

export const calculateOfflineProgress = (
  lastUpdate: number,
  debugRate: number
): { bugsFixed: number; codeQuality: number; timeAway: number } => {
  const now = Date.now();
  const timeAway = Math.max(0, now - lastUpdate);
  const secondsAway = Math.floor(timeAway / 1000);
  
  // Calculate offline progress (with some diminishing returns for very long periods)
  const maxOfflineHours = 24; // Maximum 24 hours of full progress
  const maxOfflineSeconds = maxOfflineHours * 3600;
  const effectiveSeconds = Math.min(secondsAway, maxOfflineSeconds);
  
  // Diminishing returns for longer periods
  const efficiency = effectiveSeconds > 3600 ? 0.8 : 1.0; // 80% efficiency after 1 hour
  
  const bugsFixed = Math.floor(debugRate * effectiveSeconds * efficiency);
  const codeQuality = bugsFixed * 5; // 5 CQ per bug fixed
  
  return { bugsFixed, codeQuality, timeAway };
};

export const calculateUpgradeCost = (baseCost: number, level: number): number => {
  // Standard exponential cost scaling
  return Math.floor(baseCost * Math.pow(1.15, level));
};

export const calculateDynamicUpgradeCost = (baseCost: number, purchased: number, scalingFactor: number = 1.2): number => {
  // More aggressive scaling for dynamic upgrades
  return Math.floor(baseCost * Math.pow(scalingFactor, purchased));
};

export const canAffordUpgrade = (currentCQ: number, upgradeCost: number): boolean => {
  return currentCQ >= upgradeCost;
};

export const calculateDuckEfficiency = (duck: Duck, upgrades: Upgrade[]): number => {
  const effects = calculateUpgradeEffects(upgrades);
  let baseEfficiency = duck.debugPower;
  
  // Apply duck-specific bonuses
  const duckConfig = duckTypes[duck.type];
  if (duckConfig.specialBonus.type === 'efficiencyMultiplier') {
    baseEfficiency *= duckConfig.specialBonus.value;
  }
  
  // Apply duck efficiency multipliers
  return baseEfficiency * effects.duckEfficiency.multiplier;
};

export const isDependencyMet = (upgrade: Upgrade, upgrades: Upgrade[]): boolean => {
  return upgrade.dependencies.every(depId => 
    upgrades.find(u => u.id === depId)?.purchased || false
  );
};

export const getUpgradeScalingCost = (upgrade: Upgrade, timePurchased: number): number => {
  // Different scaling for different upgrade types
  const scalingFactors = {
    duck: 1.15,
    tool: 1.2,
    environment: 1.25,
    automation: 1.3,
    prestige: 1.5
  };
  
  const factor = scalingFactors[upgrade.type] || 1.2;
  return Math.floor(upgrade.cost * Math.pow(factor, timePurchased));
};

export const formatNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
};

export const calculateClickPower = (upgrades: Upgrade[]): number => {
  const upgradeEffects = calculateUpgradeEffects(upgrades);
  
  // Calculate raw click power
  const baseBugsFixed = 1;
  const debugRateBonus = upgradeEffects.debugRate.additive;
  const debugRateMultiplier = upgradeEffects.debugRate.multiplier;
  const specialMultiplier = upgradeEffects.special.multiplier;
  
  const rawPower = (baseBugsFixed + debugRateBonus) * debugRateMultiplier * specialMultiplier;
  
  // Apply hard cap to prevent exponential growth
  const hardCap = 10;
  let cappedPower = Math.min(rawPower, hardCap);
  
  // Allow slow growth past cap with logarithmic scaling
  if (rawPower > hardCap) {
    const excess = rawPower - hardCap;
    cappedPower = hardCap + Math.log10(excess + 1);
  }
  
  return Math.floor(cappedPower);
};

export const getBugDifficulty = (bugsFixed: number): number => {
  const baseTime = 1000; // 1 second base cooldown
  const scalingFactor = Math.floor(bugsFixed / 1000);
  return baseTime * Math.pow(1.1, scalingFactor);
};

export const formatRate = (rate: number): string => {
  if (rate < 1) return rate.toFixed(2) + '/sec';
  if (rate < 10) return rate.toFixed(1) + '/sec';
  return Math.floor(rate) + '/sec';
};