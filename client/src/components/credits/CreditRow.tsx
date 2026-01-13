import { useState } from 'react';
import type { Credit, CreditDistributionInput } from '../../types';

interface CreditRowProps {
  credit: Credit;
  distribution: CreditDistributionInput | undefined;
  onUpdate: (creditId: string, field: 'yesPoints' | 'maybePoints' | 'noPoints', value: number) => void;
  onNotesUpdate: (creditId: string, notes: string) => void;
}

export function CreditRow({ credit, distribution, onUpdate, onNotesUpdate }: CreditRowProps) {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  
  const yesPoints = distribution?.yesPoints ?? 0;
  const maybePoints = distribution?.maybePoints ?? 0;
  const noPoints = distribution?.noPoints ?? 0;
  const notes = distribution?.notes ?? '';
  
  const allocatedPoints = yesPoints + maybePoints + noPoints;
  const remainingPoints = credit.maxPoints - allocatedPoints;

  const handlePointChange = (field: 'yesPoints' | 'maybePoints' | 'noPoints', value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(numValue, credit.maxPoints));
    onUpdate(credit.id, field, clampedValue);
  };

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        {/* Credit Code */}
        <td className="py-3 px-4">
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {credit.code}
          </span>
        </td>
        
        {/* Credit Name */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900">{credit.name}</span>
            {notes && (
              <span className="text-xs text-amber-600" title="Has notes">📝</span>
            )}
          </div>
        </td>
        
        {/* Max Points */}
        <td className="py-3 px-4 text-center">
          <span className="text-sm font-semibold text-gray-700">{credit.maxPoints}</span>
        </td>
        
        {/* Yes Points */}
        <td className="py-3 px-2">
          <input
            type="number"
            min="0"
            max={credit.maxPoints}
            value={yesPoints || ''}
            onChange={(e) => handlePointChange('yesPoints', e.target.value)}
            placeholder="0"
            className="w-16 px-2 py-1.5 text-center text-sm border border-gray-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                       bg-green-50 text-green-700 placeholder-green-300"
          />
        </td>
        
        {/* Maybe Points */}
        <td className="py-3 px-2">
          <input
            type="number"
            min="0"
            max={credit.maxPoints}
            value={maybePoints || ''}
            onChange={(e) => handlePointChange('maybePoints', e.target.value)}
            placeholder="0"
            className="w-16 px-2 py-1.5 text-center text-sm border border-gray-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                       bg-amber-50 text-amber-700 placeholder-amber-300"
          />
        </td>
        
        {/* No Points */}
        <td className="py-3 px-2">
          <input
            type="number"
            min="0"
            max={credit.maxPoints}
            value={noPoints || ''}
            onChange={(e) => handlePointChange('noPoints', e.target.value)}
            placeholder="0"
            className="w-16 px-2 py-1.5 text-center text-sm border border-gray-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
                       bg-gray-100 text-gray-600 placeholder-gray-400"
          />
        </td>
        
        {/* Remaining */}
        <td className="py-3 px-4 text-center">
          <span className={`text-sm font-medium ${
            remainingPoints > 0 ? 'text-blue-600' : 
            remainingPoints < 0 ? 'text-red-600' : 'text-gray-400'
          }`}>
            {remainingPoints}
          </span>
        </td>
        
        {/* Notes Toggle */}
        <td className="py-3 px-4">
          <button
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className={`p-1.5 rounded-lg transition-colors ${
              isNotesOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-400'
            }`}
            title="Add notes"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </td>
      </tr>
      
      {/* Notes Row */}
      {isNotesOpen && (
        <tr className="bg-blue-50/50">
          <td colSpan={8} className="py-3 px-4">
            <div className="flex items-start gap-3">
              <span className="text-xs text-gray-500 mt-2">Notes:</span>
              <textarea
                value={notes}
                onChange={(e) => onNotesUpdate(credit.id, e.target.value)}
                placeholder="Add notes for this credit..."
                rows={2}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           resize-none"
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
