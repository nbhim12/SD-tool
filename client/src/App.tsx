import { useEffect } from 'react';
import { Layout, CreditsTable } from './components';
import { useCategories, useScenario } from './hooks';
import { useScenarioStore } from './store';

function App() {
  const { isLoading: categoriesLoading } = useCategories();
  const { create } = useScenario();
  const { currentScenario, selectedCategoryCode, categories, error: categoriesError, getCategoryInput } = useScenarioStore();

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
