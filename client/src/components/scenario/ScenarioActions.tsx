import { SaveScenarioModal } from './SaveScenarioModal';
import { LoadScenarioModal } from './LoadScenarioModal';
import { useScenario } from '../../hooks';
import { useScenarioStore } from '../../store';

export function ScenarioActions() {
  const { 
    loadModalOpen, saveModalOpen, saveAsModalOpen,
    setLoadModalOpen, setSaveModalOpen, setSaveAsModalOpen 
  } = useScenarioStore();
  const { createNew } = useScenario();

  const handleNew = () => {
    if (confirm('Create a new scenario? Unsaved changes will be lost.')) {
      createNew();
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* New */}
        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="New Scenario"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">New</span>
        </button>

        {/* Load */}
        <button
          onClick={() => setLoadModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Load Scenario"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden sm:inline">Load</span>
        </button>

        {/* Save */}
        <button
          onClick={() => setSaveModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          title="Save Scenario"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span className="hidden sm:inline">Save</span>
        </button>

        {/* Save As */}
        <button
          onClick={() => setSaveAsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Save As New"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="hidden sm:inline">Save As</span>
        </button>
      </div>

      {/* Modals */}
      <SaveScenarioModal 
        isOpen={saveModalOpen} 
        onClose={() => setSaveModalOpen(false)} 
        mode="save"
      />
      <SaveScenarioModal 
        isOpen={saveAsModalOpen} 
        onClose={() => setSaveAsModalOpen(false)} 
        mode="saveAs"
      />
      <LoadScenarioModal 
        isOpen={loadModalOpen} 
        onClose={() => setLoadModalOpen(false)} 
      />
    </>
  );
}
