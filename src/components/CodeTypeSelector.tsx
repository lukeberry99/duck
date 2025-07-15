import { useGameStore } from '../stores/gameStore';
import { codeTypeConfigs, isCodeTypeUnlocked } from '../data/codeTypes';
import type { CodeType } from '../types/game';

export default function CodeTypeSelector() {
  const { currentCodeType, setCurrentCodeType, bugsFixed, codeQuality, ducks } = useGameStore();
  
  const codeTypes: CodeType[] = ['web', 'mobile', 'backend', 'aiml'];
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-green-400 mb-3">Code Type Focus</h3>
      <div className="grid grid-cols-2 gap-2">
        {codeTypes.map((codeType) => {
          const config = codeTypeConfigs[codeType];
          const isUnlocked = isCodeTypeUnlocked(codeType, { bugsFixed, codeQuality, ducks });
          const isActive = currentCodeType === codeType;
          
          return (
            <button
              key={codeType}
              onClick={() => isUnlocked && setCurrentCodeType(codeType)}
              disabled={!isUnlocked}
              className={`
                p-3 rounded-lg text-left transition-all duration-200 font-mono text-sm
                ${isActive 
                  ? 'bg-green-600 text-white border-2 border-green-400' 
                  : isUnlocked 
                    ? 'bg-gray-700 text-green-400 border-2 border-gray-600 hover:bg-gray-600' 
                    : 'bg-gray-900 text-gray-500 border-2 border-gray-700 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{config.icon}</span>
                <div>
                  <div className="font-bold">{config.name}</div>
                  <div className="text-xs opacity-80">
                    {isUnlocked ? config.description : `Unlock at ${config.unlockCondition.value} bugs`}
                  </div>
                </div>
              </div>
              {isActive && (
                <div className="mt-1 text-xs text-green-300">
                  Active • {config.specialistBonus}x specialist bonus
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}