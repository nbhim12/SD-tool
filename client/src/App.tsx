import { BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header will be added in PR 5 */}
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-600 mb-4">
              IGBC Green Homes Certification Tool
            </h1>
            <p className="text-gray-600 mb-8">
              Interactive feasibility assessment for green building certification
            </p>
            
            {/* Placeholder for development */}
            <div className="card p-8 max-w-2xl mx-auto">
              <p className="text-gray-500">
                🚧 Application under development
              </p>
              <ul className="mt-4 text-left text-sm text-gray-500 space-y-2">
                <li>✅ PR 1: Project Foundation - Complete</li>
                <li>⏳ PR 2: Backend Models & DB</li>
                <li>⏳ PR 3: Backend REST API</li>
                <li>⏳ PR 4: Frontend State & API</li>
                <li>⏳ PR 5: Frontend Layout & Navigation</li>
                <li>⏳ PR 6: Credits Table</li>
                <li>⏳ PR 7: Scenario Management</li>
                <li>⏳ PR 8: PDF Export</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
