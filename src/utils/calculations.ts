import type { Duck, Upgrade } from '../types/game';

export const calculateDebugRate = (ducks: Duck[], upgrades: Upgrade[]): number => {
  // Base debug rate from ducks
  const baseRate = ducks.reduce((total, duck) => total + duck.debugPower, 0);
  
  // Apply multipliers from upgrades
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
  
  return (baseRate + additives) * multipliers;
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

export const canAffordUpgrade = (currentCQ: number, upgradeCost: number): boolean => {
  return currentCQ >= upgradeCost;
};

export const calculateDuckEfficiency = (duck: Duck, upgrades: Upgrade[]): number => {
  const baseEfficiency = duck.debugPower;
  
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