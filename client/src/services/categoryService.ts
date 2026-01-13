import api from './api';
import type { Category, CertificationThreshold } from '@shared/types';

interface CategoriesResponse {
  success: boolean;
  data: Category[];
  meta: {
    totalCategories: number;
    totalPossiblePoints: number;
    certificationLevels: CertificationThreshold[];
  };
}

interface CategoryResponse {
  success: boolean;
  data: Category;
}

interface CertificationLevelsResponse {
  success: boolean;
  data: CertificationThreshold[];
  totalPossiblePoints: number;
}

/**
 * Get all categories with credits and mandatory requirements
 */
export const getAllCategories = async (): Promise<CategoriesResponse> => {
  const response = await api.get<CategoriesResponse>('/categories');
  return response.data;
};

/**
 * Get a single category by code
 */
export const getCategoryByCode = async (code: string): Promise<CategoryResponse> => {
  const response = await api.get<CategoryResponse>(`/categories/${code}`);
  return response.data;
};

/**
 * Get certification levels and thresholds
 */
export const getCertificationLevels = async (): Promise<CertificationLevelsResponse> => {
  const response = await api.get<CertificationLevelsResponse>('/categories/certification-levels');
  return response.data;
};
