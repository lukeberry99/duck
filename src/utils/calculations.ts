import type { Duck, Upgrade } from '../types/game';
import { duckTypes } from '../data/ducks';

export const calculateDebugRate = (ducks: Duck[], upgrades: Upgrade[]): number => {
  // Calculate duck efficiency multiplier
  const duckEfficiencyMultiplier = upgrades
    .filter(upgrade => upgrade.purchased && upgrade.effect.target === 'duckEfficiency')
    .reduce((total, upgrade) => {
      if (upgrade.effect.type === 'multiplier') {
        return total * upgrade.effect.value;
      }
      return total;
    }, 1);
  
  // Calculate special multipliers (like zen garden)
  const specialMultiplier = upgrades
    .filter(upgrade => upgrade.purchased && upgrade.effect.target === 'special')
    .reduce((total, upgrade) => {
      if (upgrade.effect.type === 'multiplier') {
        return total * upgrade.effect.value;
      }
      return total;
    }, 1);
  
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
  
  // Apply general debug rate multipliers
  const multipliers = upgrades
    .filter(upgrade => upgrade.purchased && upgrade.effect.target === 'debugRate')
    .reduce((total, upgrade) => {
      if (upgrade.effect.type === 'multiplier') {
        return total * upgrade.effect.value;
      }
      return total;
    }, 1);
  
  // Apply additive bonuses
  const additives = upgrades
    .filter(upgrade => upgrade.purchased && upgrade.effect.target === 'debugRate')
    .reduce((total, upgrade) => {
      if (upgrade.effect.type === 'additive') {
        return total + upgrade.effect.value;
      }
      return total;
    }, 0);
  
  return (baseRate + additives) * multipliers * specialMultiplier;
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
  let baseEfficiency = duck.debugPower;
  
  // Apply duck-specific bonuses
  const duckConfig = duckTypes[duck.type];
  if (duckConfig.specialBonus.type === 'efficiencyMultiplier') {
    baseEfficiency *= duckConfig.specialBonus.value;
  }
  
  // Apply duck-specific upgrades
  const duckMultipliers = upgrades
    .filter(upgrade => 
      upgrade.purchased && 
      upgrade.effect.target === 'duckEfficiency' &&
      upgrade.type === 'duck'
    )
    .reduce((total, upgrade) => {
      if (upgrade.effect.type === 'multiplier') {
        return total * upgrade.effect.value;
      }
      return total;
    }, 1);
  
  return baseEfficiency * duckMultipliers;
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

export const formatRate = (rate: number): string => {
  if (rate < 1) return rate.toFixed(2) + '/sec';
  if (rate < 10) return rate.toFixed(1) + '/sec';
  return Math.floor(rate) + '/sec';
};