import { useCertification } from '../../hooks';
import { CERTIFICATION_THRESHOLDS } from '../../types';

export function PointsSummary() {
  const { totalPoints, achievedLevel, targetLevel, targetThreshold } = useCertification();

  // Calculate if on track to reach target
  const isOnTrack = targetThreshold ? totalPoints.yes >= targetThreshold.minPoints : false;

  const achievedConfig = CERTIFICATION_THRESHOLDS.find(t => t.level === achievedLevel);
  const targetConfig = CERTIFICATION_THRESHOLDS.find(t => t.level === targetLevel);

  const progressPercent = Math.min((totalPoints.yes / 100) * 100, 100);
  const maybePercent = Math.min((totalPoints.maybe / 100) * 100, 100);

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Points Display */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{totalPoints.yes}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Confirmed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-amber-500">{totalPoints.maybe}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Potential</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-400">{totalPoints.no}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Excluded</p>
            </div>
          </div>

          {/* Level Status */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Current Level</p>
              <p
                className="text-lg font-semibold"
                style={{ color: achievedConfig?.color || '#6b7280' }}
              >
                {achievedConfig?.label || 'Not Certified'}
              </p>
            </div>
            <div
              className={`
                flex items-center justify-center w-10 h-10 rounded-full
                ${isOnTrack ? 'bg-green-100' : 'bg-amber-100'}
              `}
            >
              {isOnTrack ? (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            {/* Maybe points (background layer) */}
            <div
              className="absolute h-full bg-amber-200 transition-all duration-300"
              style={{ width: `${progressPercent + maybePercent}%` }}
            />
            {/* Yes points (foreground layer) */}
            <div
              className="absolute h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Target marker */}
            {targetConfig && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-gray-800"
                style={{ left: `${targetConfig.minPoints}%` }}
                title={`${targetConfig.label} threshold: ${targetConfig.minPoints} pts`}
              />
            )}
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>0</span>
            <span>40</span>
            <span>50</span>
            <span>60</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
