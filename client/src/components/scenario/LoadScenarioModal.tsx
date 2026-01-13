import { useState, useEffect } from 'react';
import { useScenarioStore } from '../../store';
import { useScenario } from '../../hooks';

interface LoadScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoadScenarioModal({ isOpen, onClose }: LoadScenarioModalProps) {
  const { scenarios, currentScenario } = useScenarioStore();
  const { loadScenarios, loadScenario, remove } = useScenario();
  
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadScenarios();
    }
  }, [isOpen, loadScenarios]);

  const handleLoad = async (id: string) => {
    setIsLoading(true);
    try {
      await loadScenario(id);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      setDeleteConfirm(null);
      await loadScenarios();
    } catch (err) {
      console.error('Failed to delete scenario:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Load Scenario</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {scenarios.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">No saved scenarios found</p>
              <p className="text-sm text-gray-400 mt-1">Create and save a scenario to see it here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scenarios.map((scenario) => (
                <div
                  key={scenario._id}
                  className={`p-4 rounded-lg border transition-colors ${
                    currentScenario?._id === scenario._id
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {deleteConfirm === scenario._id ? (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-red-600">Delete this scenario?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(scenario._id)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 truncate">{scenario.name}</h3>
                          {currentScenario?._id === scenario._id && (
                            <span className="px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{scenario.projectName}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Last modified: {formatDate(scenario.updatedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleLoad(scenario._id)}
                          disabled={isLoading || currentScenario?._id === scenario._id}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Loading...' : 'Load'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(scenario._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete scenario"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>
    </div>
  );
}
