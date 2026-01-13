import { useCallback } from 'react';
import { useScenarioStore } from '@/store';
import { 
  getAllScenarios, 
  getScenarioById, 
  createScenario, 
  updateScenario, 
  deleteScenario,
  updateScenarioCategory,
  type CreateScenarioPayload,
  type UpdateScenarioPayload,
  type UpdateCategoryPayload
} from '@/services';
import type { CategoryCode } from '@shared/types';

/**
 * Hook to manage scenarios - load, create, update, delete
 */
export const useScenario = () => {
  const {
    currentScenario,
    scenarios,
    setCurrentScenario,
    setScenarios,
    isLoading,
    isSaving,
    setLoading,
    setSaving,
    setError,
    error
  } = useScenarioStore();

  // Load all scenarios list
  const loadScenarios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllScenarios();
      if (response.success) {
        setScenarios(response.data);
      }
    } catch (err) {
      setError('Failed to load scenarios');
      console.error('Error loading scenarios:', err);
    } finally {
      setLoading(false);
    }
  }, [setScenarios, setLoading, setError]);

  // Load a specific scenario
  const loadScenario = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await getScenarioById(id);
      if (response.success) {
        setCurrentScenario(response.data);
      }
    } catch (err) {
      setError('Failed to load scenario');
      console.error('Error loading scenario:', err);
    } finally {
      setLoading(false);
    }
  }, [setCurrentScenario, setLoading, setError]);

  // Create a blank new scenario (local only, not persisted until save)
  const createNew = useCallback(() => {
    setCurrentScenario({
      name: 'Untitled Scenario',
      projectName: 'New Project',
      projectType: 'Residential',
      targetCertificationLevel: 'gold',
      categories: []
    });
  }, [setCurrentScenario]);

  // Create a new scenario
  const create = useCallback(async (payload: CreateScenarioPayload) => {
    setSaving(true);
    try {
      const response = await createScenario(payload);
      if (response.success) {
        setCurrentScenario(response.data);
        await loadScenarios(); // Refresh list
        return response.data;
      }
    } catch (err) {
      setError('Failed to create scenario');
      console.error('Error creating scenario:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [setCurrentScenario, setSaving, setError, loadScenarios]);

  // Update current scenario
  const update = useCallback(async (payload: UpdateScenarioPayload) => {
    if (!currentScenario?._id) return;
    
    setSaving(true);
    try {
      const response = await updateScenario(currentScenario._id, payload);
      if (response.success) {
        setCurrentScenario(response.data);
        await loadScenarios(); // Refresh list
        return response.data;
      }
    } catch (err) {
      setError('Failed to update scenario');
      console.error('Error updating scenario:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [currentScenario?._id, setCurrentScenario, setSaving, setError, loadScenarios]);

  // Save current scenario state to server
  const save = useCallback(async () => {
    if (!currentScenario?._id) return;
    
    setSaving(true);
    try {
      const response = await updateScenario(currentScenario._id, {
        name: currentScenario.name,
        projectName: currentScenario.projectName,
        projectType: currentScenario.projectType,
        targetCertificationLevel: currentScenario.targetCertificationLevel,
        categories: currentScenario.categories
      });
      if (response.success) {
        await loadScenarios();
        return response.data;
      }
    } catch (err) {
      setError('Failed to save scenario');
      console.error('Error saving scenario:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [currentScenario, setSaving, setError, loadScenarios]);

  // Update a specific category
  const updateCategory = useCallback(async (categoryCode: CategoryCode, payload: UpdateCategoryPayload) => {
    if (!currentScenario?._id) return;
    
    setSaving(true);
    try {
      const response = await updateScenarioCategory(currentScenario._id, categoryCode, payload);
      if (response.success) {
        // Update local state with the returned category
        return response.data;
      }
    } catch (err) {
      setError('Failed to update category');
      console.error('Error updating category:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [currentScenario?._id, setSaving, setError]);

  // Delete a scenario
  const remove = useCallback(async (id: string) => {
    setSaving(true);
    try {
      const response = await deleteScenario(id);
      if (response.success) {
        if (currentScenario?._id === id) {
          setCurrentScenario(null);
        }
        await loadScenarios();
      }
    } catch (err) {
      setError('Failed to delete scenario');
      console.error('Error deleting scenario:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [currentScenario?._id, setCurrentScenario, setSaving, setError, loadScenarios]);

  // Clear current scenario
  const clear = useCallback(() => {
    setCurrentScenario(null);
  }, [setCurrentScenario]);

  return {
    currentScenario,
    scenarios,
    isLoading,
    isSaving,
    error,
    loadScenarios,
    loadScenario,
    createNew,
    create,
    update,
    save,
    updateCategory,
    remove,
    clear
  };
};
