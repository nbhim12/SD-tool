import { useEffect } from 'react';
import { Layout } from './components';
import { useCategories, useScenario } from './hooks';
import { useScenarioStore } from './store';

function App() {
  const { isLoading: categoriesLoading } = useCategories();
  const { create } = useScenario();
  const { currentScenario, selectedCategoryCode, categories, error: categoriesError } = useScenarioStore();

  // Create new scenario if none exists after categories load
  useEffect(() => {
    if (categories.length > 0 && !currentScenario) {
      create({
        name: 'Untitled Scenario',
        projectName: 'New Project',
        projectType: 'Residential',
        targetCertificationLevel: 'gold'
      });
    }
  }, [categories.length, currentScenario, create]);

  const selectedCategory = categories.find(c => c.code === selectedCategoryCode);

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading IGBC Categories...</p>
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error loading data</p>
          <p className="mt-2">{categoriesError}</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Category Content - Placeholder for PR6 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedCategory?.name || 'Select a Category'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedCategory?.possiblePoints || 0} possible points • {selectedCategory?.credits.length || 0} credits
            </p>
          </div>
        </div>

        {/* Mandatory Requirements Section */}
        {selectedCategory && selectedCategory.mandatoryRequirements.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Mandatory Requirements
            </h3>
            <div className="space-y-2">
              {selectedCategory.mandatoryRequirements.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-xs font-mono text-gray-500 w-16">{req.code}</span>
                  <span className="text-sm text-gray-700">{req.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credits Preview - Full table in PR6 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Credits ({selectedCategory?.credits.length || 0})
          </h3>
          <p className="text-sm text-gray-500">
            Credits table will be implemented in PR6
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default App;
