import { useScenarioStore } from '../../store';
import { CertificationLevelSelector } from './CertificationLevelSelector';
import { ScenarioActions } from '../scenario';
import { ExportButton } from '../export';

export function Header() {
  const { currentScenario, isSaving } = useScenarioStore();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                IGBC Green Homes
              </h1>
              {/* <p className="text-xs text-gray-500">Feasibility Tool v3.0</p> */}
            </div>
          </div>

          {/* Project Info & Certification */}
          <div className="hidden md:flex items-center gap-6">
            {currentScenario && (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {currentScenario.projectName || 'Untitled Project'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentScenario.name || 'New Scenario'}
                  </p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
              </>
            )}
            
            <CertificationLevelSelector />
          </div>

          {/* Scenario Actions & Save Status */}
          <div className="flex items-center gap-4">
            <ScenarioActions />
            <div className="h-6 w-px bg-gray-200" />
            <ExportButton />
            
            {isSaving && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>Saving...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
