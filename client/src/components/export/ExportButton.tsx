import { useState } from 'react';
import { useScenarioStore } from '../../store';
import { useCertification } from '../../hooks';
import { generatePDF } from '../../utils';

export function ExportButton() {
  const { currentScenario, categories } = useScenarioStore();
  const { totalPoints, achievedLevel } = useCertification();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!currentScenario) return;

    setIsExporting(true);
    try {
      // Small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 100));
      
      generatePDF({
        scenario: currentScenario,
        categories,
        totalPoints,
        achievedLevel,
      });
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={!currentScenario || isExporting}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Export to PDF"
    >
      {isExporting ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="hidden sm:inline">Exporting...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden sm:inline">Export PDF</span>
        </>
      )}
    </button>
  );
}
