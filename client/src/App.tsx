import { useEffect, useRef } from 'react';
import { Layout, CreditsTable } from './components';
import { useCategories, useScenario } from './hooks';
import { useScenarioStore } from './store';

function App() {
  const { isLoading: categoriesLoading } = useCategories();
  const { loadScenarios, loadScenario, createNew } = useScenario();
  const { currentScenario, selectedCategoryCode, categories, scenarios, error: categoriesError, getCategoryInput } = useScenarioStore();
  const initialized = useRef(false);

  // Load existing scenarios and set up initial state
  useEffect(() => {
    if (categories.length > 0 && !initialized.current) {
      initialized.current = true;
      loadScenarios().then(() => {
        // After loading scenarios, check if we should load one or create new
      });
    }
  }, [categories.length, loadScenarios]);

  // Once scenarios are loaded, load the most recent one or create a blank local scenario
  useEffect(() => {
    if (categories.length > 0 && !currentScenario && initialized.current) {
      if (scenarios.length > 0) {
        // Load the most recent scenario
        loadScenario(scenarios[0]._id);
      } else {
        // Create a local-only scenario (not persisted until user saves)
        createNew();
      }
    }
  }, [categories.length, currentScenario, scenarios, loadScenario, createNew]);

  const selectedCategory = categories.find(c => c.code === selectedCategoryCode);
  const categoryInput = selectedCategoryCode ? getCategoryInput(selectedCategoryCode) : undefined;

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
      {selectedCategory ? (
        <CreditsTable 
          category={selectedCategory} 
          categoryInput={categoryInput}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-gray-500">Select a category to view credits</p>
        </div>
      )}
    </Layout>
  );
}

export default App;
