import api from './api';
import type { Scenario, CategoryInput } from '@shared/types';

interface ScenarioListItem {
  _id: string;
  name: string;
  projectName: string;
  projectType: string;
  targetCertificationLevel: string;
  createdAt: string;
  updatedAt: string;
}

interface ScenariosResponse {
  success: boolean;
  data: ScenarioListItem[];
  count: number;
}

interface ScenarioResponse {
  success: boolean;
  data: Scenario;
  message?: string;
}

interface CreateScenarioPayload {
  name: string;
  projectName?: string;
  projectType?: string;
  targetCertificationLevel?: string;
}

interface UpdateScenarioPayload {
  name?: string;
  projectName?: string;
  projectType?: string;
  targetCertificationLevel?: string;
  categories?: CategoryInput[];
}

interface UpdateCategoryPayload {
  mandatoryCompliance?: {
    requirementId: string;
    isCompliant: boolean;
    notes: string;
  }[];
  creditDistributions?: {
    creditId: string;
    yesPoints: number;
    maybePoints: number;
    noPoints: number;
    notes: string;
  }[];
}

/**
 * Get all scenarios (list view)
 */
export const getAllScenarios = async (): Promise<ScenariosResponse> => {
  const response = await api.get<ScenariosResponse>('/scenarios');
  return response.data;
};

/**
 * Get a single scenario by ID
 */
export const getScenarioById = async (id: string): Promise<ScenarioResponse> => {
  const response = await api.get<ScenarioResponse>(`/scenarios/${id}`);
  return response.data;
};

/**
 * Create a new scenario
 */
export const createScenario = async (payload: CreateScenarioPayload): Promise<ScenarioResponse> => {
  const response = await api.post<ScenarioResponse>('/scenarios', payload);
  return response.data;
};

/**
 * Update an existing scenario
 */
export const updateScenario = async (id: string, payload: UpdateScenarioPayload): Promise<ScenarioResponse> => {
  const response = await api.put<ScenarioResponse>(`/scenarios/${id}`, payload);
  return response.data;
};

/**
 * Delete a scenario
 */
export const deleteScenario = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(`/scenarios/${id}`);
  return response.data;
};

/**
 * Update a specific category within a scenario
 */
export const updateScenarioCategory = async (
  scenarioId: string,
  categoryCode: string,
  payload: UpdateCategoryPayload
): Promise<ScenarioResponse> => {
  const response = await api.put<ScenarioResponse>(
    `/scenarios/${scenarioId}/categories/${categoryCode}`,
    payload
  );
  return response.data;
};

export type { ScenarioListItem, CreateScenarioPayload, UpdateScenarioPayload, UpdateCategoryPayload };
