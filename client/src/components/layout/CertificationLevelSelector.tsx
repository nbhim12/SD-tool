import { useScenarioStore } from '../../store';
import { CERTIFICATION_THRESHOLDS, CertificationLevel } from '../../types';

export function CertificationLevelSelector() {
  const { currentScenario, updateScenarioInfo } = useScenarioStore();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateScenarioInfo({
      targetCertificationLevel: e.target.value as CertificationLevel,
    });
  };

  const currentLevel = currentScenario?.targetCertificationLevel || 'certified';
  const levelConfig = CERTIFICATION_THRESHOLDS.find(t => t.level === currentLevel);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="certification-level" className="text-sm text-gray-600">
        Target:
      </label>
      <div className="relative">
        <select
          id="certification-level"
          value={currentLevel}
          onChange={handleChange}
          className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
          style={{ color: levelConfig?.color }}
        >
          {CERTIFICATION_THRESHOLDS.map((threshold) => (
            <option
              key={threshold.level}
              value={threshold.level}
              style={{ color: threshold.color }}
            >
              {threshold.label} ({threshold.minPoints}-{threshold.maxPoints} pts)
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
