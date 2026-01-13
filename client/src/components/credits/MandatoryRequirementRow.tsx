import type { MandatoryRequirement, MandatoryComplianceInput } from '../../types';

interface MandatoryRequirementRowProps {
  requirement: MandatoryRequirement;
  compliance: MandatoryComplianceInput | undefined;
  onUpdate: (requirementId: string, isCompliant: boolean, notes?: string) => void;
}

export function MandatoryRequirementRow({ 
  requirement, 
  compliance, 
  onUpdate 
}: MandatoryRequirementRowProps) {
  const isCompliant = compliance?.isCompliant ?? false;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded border">
          {requirement.code}
        </span>
        <span className="text-sm text-gray-700">{requirement.name}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdate(requirement.id, !isCompliant)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isCompliant
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {isCompliant ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Compliant
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Not Set
            </>
          )}
        </button>
      </div>
    </div>
  );
}
