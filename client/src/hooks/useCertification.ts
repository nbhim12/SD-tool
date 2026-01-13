import { useScenarioStore } from '@/store';
import type { CertificationLevel } from '@shared/types';

/**
 * Hook to access and calculate certification-related data
 */
export const useCertification = () => {
  const {
    currentScenario,
    certificationLevels,
    getTotalPoints,
    getCategoryPoints,
    getAchievedLevel,
    categories
  } = useScenarioStore();

  const totalPoints = getTotalPoints();
  const achievedLevel = getAchievedLevel();
  const targetLevel = currentScenario?.targetCertificationLevel as CertificationLevel | undefined;

  // Get the target level threshold
  const targetThreshold = certificationLevels.find(l => l.level === targetLevel);
  
  // Calculate points needed to reach target
  const pointsToTarget = targetThreshold 
    ? Math.max(0, targetThreshold.minPoints - totalPoints.yes)
    : 0;

  // Get next level above current
  const getNextLevel = (): { level: CertificationLevel; pointsNeeded: number } | null => {
    const sortedLevels = [...certificationLevels].sort((a, b) => a.minPoints - b.minPoints);
    const nextLevel = sortedLevels.find(l => l.minPoints > totalPoints.yes);
    
    if (!nextLevel) return null;
    
    return {
      level: nextLevel.level,
      pointsNeeded: nextLevel.minPoints - totalPoints.yes
    };
  };

  // Calculate category summaries
  const getCategorySummaries = () => {
    return categories.map(cat => {
      const points = getCategoryPoints(cat.code);
      const categoryInput = currentScenario?.categories.find(c => c.categoryCode === cat.code);
      const mandatoryCompliant = categoryInput?.mandatoryCompliance.filter(m => m.isCompliant).length ?? 0;
      const totalMandatory = cat.mandatoryRequirements.length;

      return {
        code: cat.code,
        name: cat.name,
        possiblePoints: cat.possiblePoints,
        yesPoints: points.yes,
        maybePoints: points.maybe,
        noPoints: points.no,
        mandatoryCompliant,
        totalMandatory,
        allMandatoryMet: mandatoryCompliant === totalMandatory
      };
    });
  };

  // Check if all mandatory requirements are met
  const allMandatoryMet = () => {
    if (!currentScenario) return false;
    
    return currentScenario.categories.every(cat => {
      const categoryDef = categories.find(c => c.code === cat.categoryCode);
      if (!categoryDef) return true;
      return cat.mandatoryCompliance.every(m => m.isCompliant);
    });
  };

  return {
    totalPoints,
    achievedLevel,
    targetLevel,
    targetThreshold,
    pointsToTarget,
    nextLevel: getNextLevel(),
    categorySummaries: getCategorySummaries(),
    allMandatoryMet: allMandatoryMet(),
    certificationLevels
  };
};
