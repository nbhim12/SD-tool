import { useEffect, useCallback } from 'react';
import { useScenarioStore } from '@/store';
import { getAllCategories, getCertificationLevels } from '@/services';

/**
 * Hook to load and access IGBC categories data
 */
export const useCategories = () => {
  const { 
    categories, 
    certificationLevels,
    setCategories, 
    setCertificationLevels,
    isLoading,
    setLoading,
    setError 
  } = useScenarioStore();

  const loadCategories = useCallback(async () => {
    if (categories.length > 0) return; // Already loaded
    
    setLoading(true);
    try {
      const [categoriesRes, levelsRes] = await Promise.all([
        getAllCategories(),
        getCertificationLevels()
      ]);
      
      if (categoriesRes.success) {
        setCategories(categoriesRes.data);
      }
      if (levelsRes.success) {
        setCertificationLevels(levelsRes.data);
      }
    } catch (error) {
      setError('Failed to load categories');
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }, [categories.length, setCategories, setCertificationLevels, setLoading, setError]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    certificationLevels,
    isLoading,
    refetch: loadCategories
  };
};
