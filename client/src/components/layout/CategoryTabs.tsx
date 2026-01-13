import { useScenarioStore } from '../../store';
import { CategoryCode } from '../../types';

const CATEGORY_TABS: { code: CategoryCode; name: string; shortName: string }[] = [
  { code: 'SD', name: 'Sustainable Design', shortName: 'Sustainable Design' },
  { code: 'WC', name: 'Water Conservation', shortName: 'Water' },
  { code: 'EE', name: 'Energy Efficiency', shortName: 'Energy' },
  { code: 'MR', name: 'Materials & Resources', shortName: 'Materials' },
  { code: 'RHW', name: 'Resident Health & Well-being', shortName: 'Health' },
  { code: 'ID', name: 'Innovation & Design', shortName: 'Innovation' },
];

export function CategoryTabs() {
  const { selectedCategoryCode, setSelectedCategory, categories, getCategoryPoints } = useScenarioStore();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 overflow-x-auto py-2" aria-label="Categories">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategoryCode === tab.code;
            const category = categories.find(c => c.code === tab.code);
            const points = getCategoryPoints(tab.code);
            const possiblePoints = category?.possiblePoints || 0;

            return (
              <button
                key={tab.code}
                onClick={() => setSelectedCategory(tab.code)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 whitespace-nowrap
                  ${isSelected
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden">{tab.code}</span>
                <span
                  className={`
                    inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold
                    ${isSelected
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  {points.yes}/{possiblePoints}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
