import { CreditRow } from './CreditRow';
import { MandatoryRequirementRow } from './MandatoryRequirementRow';
import { useScenarioStore } from '../../store';
import type { Category, CategoryInput } from '../../types';

interface CreditsTableProps {
  category: Category;
  categoryInput: CategoryInput | undefined;
}

export function CreditsTable({ category, categoryInput }: CreditsTableProps) {
  const { 
    updateCreditDistribution, 
    updateCreditNotes, 
    updateMandatoryCompliance,
    getCategoryPoints 
  } = useScenarioStore();

  const points = getCategoryPoints(category.code);
  
  const handleCreditUpdate = (creditId: string, field: 'yesPoints' | 'maybePoints' | 'noPoints', value: number) => {
    updateCreditDistribution(category.code, creditId, field, value);
  };

  const handleNotesUpdate = (creditId: string, notes: string) => {
    updateCreditNotes(category.code, creditId, notes);
  };

  const handleMandatoryUpdate = (requirementId: string, isCompliant: boolean, notes?: string) => {
    updateMandatoryCompliance(category.code, requirementId, isCompliant, notes);
  };

  const getDistribution = (creditId: string) => {
    return categoryInput?.creditDistributions.find(d => d.creditId === creditId);
  };

  const getCompliance = (requirementId: string) => {
    return categoryInput?.mandatoryCompliance.find(m => m.requirementId === requirementId);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Category Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{category.name}</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {category.possiblePoints} possible points • {category.credits.length} credits
          </p>
        </div>
        
        {/* Category Points Summary */}
        <div className="flex items-center gap-3 sm:gap-4 bg-gray-50 rounded-lg px-3 sm:px-4 py-2">
          <div className="text-center">
            <p className="text-base sm:text-lg font-bold text-green-600">{points.yes}</p>
            <p className="text-[10px] sm:text-xs text-gray-500">Yes</p>
          </div>
          <div className="text-center">
            <p className="text-base sm:text-lg font-bold text-amber-500">{points.maybe}</p>
            <p className="text-[10px] sm:text-xs text-gray-500">Maybe</p>
          </div>
          <div className="text-center">
            <p className="text-base sm:text-lg font-bold text-gray-400">{points.no}</p>
            <p className="text-[10px] sm:text-xs text-gray-500">No</p>
          </div>
          <div className="h-6 sm:h-8 w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-base sm:text-lg font-bold text-blue-600">
              {category.possiblePoints - points.yes - points.maybe - points.no}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">Left</p>
          </div>
        </div>
      </div>

      {/* Mandatory Requirements Section */}
      {category.mandatoryRequirements.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Mandatory Requirements ({category.mandatoryRequirements.length})
          </h3>
          <div className="space-y-2">
            {category.mandatoryRequirements.map((req) => (
              <MandatoryRequirementRow
                key={req.id}
                requirement={req}
                compliance={getCompliance(req.id)}
                onUpdate={handleMandatoryUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Credits Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Credits ({category.credits.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">
                  Code
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Credit Name
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">
                  Max
                </th>
                <th className="py-3 px-2 text-center text-xs font-semibold text-green-600 uppercase tracking-wide w-20">
                  Yes
                </th>
                <th className="py-3 px-2 text-center text-xs font-semibold text-amber-600 uppercase tracking-wide w-20">
                  Maybe
                </th>
                <th className="py-3 px-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">
                  No
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-blue-600 uppercase tracking-wide w-20">
                  Left
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide w-12">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {category.credits.map((credit) => (
                <CreditRow
                  key={credit.id}
                  credit={credit}
                  distribution={getDistribution(credit.id)}
                  onUpdate={handleCreditUpdate}
                  onNotesUpdate={handleNotesUpdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
