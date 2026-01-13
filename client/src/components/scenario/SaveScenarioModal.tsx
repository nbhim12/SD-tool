import { useState, useEffect } from 'react';
import { useScenarioStore } from '../../store';
import { useScenario } from '../../hooks';
import type { CertificationLevel } from '../../types';
import { CERTIFICATION_THRESHOLDS } from '../../types';

interface SaveScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'save' | 'saveAs';
}

export function SaveScenarioModal({ isOpen, onClose, mode }: SaveScenarioModalProps) {
  const { currentScenario, scenarios } = useScenarioStore();
  const { create, update } = useScenario();
  
  const [name, setName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Residential');
  const [targetLevel, setTargetLevel] = useState<CertificationLevel>('gold');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && currentScenario) {
      setName(mode === 'saveAs' ? `${currentScenario.name} (Copy)` : currentScenario.name);
      setProjectName(currentScenario.projectName);
      setProjectType(currentScenario.projectType);
      setTargetLevel(currentScenario.targetCertificationLevel);
      setError('');
    }
  }, [isOpen, currentScenario, mode]);

  const validateName = (scenarioName: string): boolean => {
    if (!scenarioName.trim()) {
      setError('Scenario name is required');
      return false;
    }
    
    // Check for duplicate names (except current scenario in save mode)
    const isDuplicate = scenarios.some(s => 
      s.name.toLowerCase() === scenarioName.trim().toLowerCase() &&
      (mode === 'saveAs' || s._id !== currentScenario?._id)
    );
    
    if (isDuplicate) {
      setError('A scenario with this name already exists');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSave = async () => {
    if (!validateName(name)) return;
    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    setIsSaving(true);
    try {
      if (mode === 'save' && currentScenario?._id) {
        await update({
          name: name.trim(),
          projectName: projectName.trim(),
          projectType,
          targetCertificationLevel: targetLevel
        });
      } else {
        await create({
          name: name.trim(),
          projectName: projectName.trim(),
          projectType,
          targetCertificationLevel: targetLevel
        });
      }
      onClose();
    } catch (err) {
      setError('Failed to save scenario');
    } finally {
      setIsSaving(false);
    }
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
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'save' ? 'Save Scenario' : 'Save As New Scenario'}
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Scenario Name */}
          <div>
            <label htmlFor="scenario-name" className="block text-sm font-medium text-gray-700 mb-1">
              Scenario Name *
            </label>
            <input
              id="scenario-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                validateName(e.target.value);
              }}
              placeholder="Enter scenario name"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                error && error.includes('name') ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Project Name */}
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              id="project-name"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Project Type */}
          <div>
            <label htmlFor="project-type" className="block text-sm font-medium text-gray-700 mb-1">
              Project Type
            </label>
            <select
              id="project-type"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Mixed Use">Mixed Use</option>
              <option value="Institutional">Institutional</option>
            </select>
          </div>

          {/* Target Certification */}
          <div>
            <label htmlFor="target-level" className="block text-sm font-medium text-gray-700 mb-1">
              Target Certification
            </label>
            <select
              id="target-level"
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value as CertificationLevel)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {CERTIFICATION_THRESHOLDS.map((threshold) => (
                <option key={threshold.level} value={threshold.level}>
                  {threshold.label} ({threshold.minPoints}-{threshold.maxPoints} pts)
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {mode === 'save' ? 'Save' : 'Save as New'}
          </button>
        </div>
      </div>
    </div>
  );
}
