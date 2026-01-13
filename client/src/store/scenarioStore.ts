import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Category, 
  CategoryCode, 
  CertificationLevel, 
  Scenario,
  CategoryInput,
  CertificationThreshold
} from '@shared/types';

interface ScenarioState {
  // Data
  categories: Category[];
  certificationLevels: CertificationThreshold[];
  currentScenario: Scenario | null;
  scenarios: { _id: string; name: string; projectName: string; updatedAt: string }[];
  
  // UI State
  selectedCategoryCode: CategoryCode;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Modal State
  loadModalOpen: boolean;
  saveModalOpen: boolean;
  saveAsModalOpen: boolean;
  
  // Actions - Data Loading
  setCategories: (categories: Category[]) => void;
  setCertificationLevels: (levels: CertificationThreshold[]) => void;
  setScenarios: (scenarios: { _id: string; name: string; projectName: string; updatedAt: string }[]) => void;
  
  // Actions - Current Scenario
  setCurrentScenario: (scenario: Scenario | null) => void;
  updateScenarioInfo: (info: Partial<Pick<Scenario, 'name' | 'projectName' | 'projectType' | 'targetCertificationLevel'>>) => void;
  
  // Actions - Category Updates
  setSelectedCategory: (code: CategoryCode) => void;
  updateMandatoryCompliance: (categoryCode: CategoryCode, requirementId: string, isCompliant: boolean, notes?: string) => void;
  updateCreditDistribution: (categoryCode: CategoryCode, creditId: string, field: 'yesPoints' | 'maybePoints' | 'noPoints', value: number) => void;
  updateCreditNotes: (categoryCode: CategoryCode, creditId: string, notes: string) => void;
  
  // Actions - UI State
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  
  // Actions - Modal State
  setLoadModalOpen: (open: boolean) => void;
  setSaveModalOpen: (open: boolean) => void;
  setSaveAsModalOpen: (open: boolean) => void;
  
  // Computed helpers
  getCategoryInput: (categoryCode: CategoryCode) => CategoryInput | undefined;
  getTotalPoints: () => { yes: number; maybe: number; no: number };
  getCategoryPoints: (categoryCode: CategoryCode) => { yes: number; maybe: number; no: number };
  getAchievedLevel: () => CertificationLevel | null;
}

export const useScenarioStore = create<ScenarioState>()(
  persist(
    (set, get) => ({
      // Initial State
      categories: [],
      certificationLevels: [],
      currentScenario: null,
      scenarios: [],
      selectedCategoryCode: 'SD',
      isLoading: false,
      isSaving: false,
      error: null,
      loadModalOpen: false,
      saveModalOpen: false,
      saveAsModalOpen: false,

      // Data Loading Actions
      setCategories: (categories) => set({ categories }),
      setCertificationLevels: (levels) => set({ certificationLevels: levels }),
      setScenarios: (scenarios) => set({ scenarios }),

      // Current Scenario Actions
      setCurrentScenario: (scenario) => set({ currentScenario: scenario, error: null }),
      
      updateScenarioInfo: (info) => set((state) => ({
        currentScenario: state.currentScenario 
          ? { ...state.currentScenario, ...info }
          : null
      })),

      // Category Selection
      setSelectedCategory: (code) => set({ selectedCategoryCode: code }),

      // Mandatory Compliance Update
      updateMandatoryCompliance: (categoryCode, requirementId, isCompliant, notes) => 
        set((state) => {
          if (!state.currentScenario) return state;
          
          const categories = state.currentScenario.categories.map((cat) => {
            if (cat.categoryCode !== categoryCode) return cat;
            
            const mandatoryCompliance = cat.mandatoryCompliance.map((mc) => {
              if (mc.requirementId !== requirementId) return mc;
              return { ...mc, isCompliant, notes: notes ?? mc.notes };
            });
            
            return { ...cat, mandatoryCompliance };
          });
          
          return {
            currentScenario: { ...state.currentScenario, categories }
          };
        }),

      // Credit Distribution Update
      updateCreditDistribution: (categoryCode, creditId, field, value) =>
        set((state) => {
          if (!state.currentScenario) return state;
          
          const categories = state.currentScenario.categories.map((cat) => {
            if (cat.categoryCode !== categoryCode) return cat;
            
            const creditDistributions = cat.creditDistributions.map((cd) => {
              if (cd.creditId !== creditId) return cd;
              return { ...cd, [field]: Math.max(0, value) };
            });
            
            return { ...cat, creditDistributions };
          });
          
          return {
            currentScenario: { ...state.currentScenario, categories }
          };
        }),

      // Credit Notes Update
      updateCreditNotes: (categoryCode, creditId, notes) =>
        set((state) => {
          if (!state.currentScenario) return state;
          
          const categories = state.currentScenario.categories.map((cat) => {
            if (cat.categoryCode !== categoryCode) return cat;
            
            const creditDistributions = cat.creditDistributions.map((cd) => {
              if (cd.creditId !== creditId) return cd;
              return { ...cd, notes };
            });
            
            return { ...cat, creditDistributions };
          });
          
          return {
            currentScenario: { ...state.currentScenario, categories }
          };
        }),

      // UI State Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setSaving: (saving) => set({ isSaving: saving }),
      setError: (error) => set({ error }),
      
      // Modal State Actions
      setLoadModalOpen: (open) => set({ loadModalOpen: open }),
      setSaveModalOpen: (open) => set({ saveModalOpen: open }),
      setSaveAsModalOpen: (open) => set({ saveAsModalOpen: open }),

      // Computed Helpers
      getCategoryInput: (categoryCode) => {
        const { currentScenario } = get();
        return currentScenario?.categories.find((c) => c.categoryCode === categoryCode);
      },

      getTotalPoints: () => {
        const { currentScenario } = get();
        if (!currentScenario) return { yes: 0, maybe: 0, no: 0 };
        
        return currentScenario.categories.reduce(
          (totals, cat) => {
            cat.creditDistributions.forEach((cd) => {
              totals.yes += cd.yesPoints;
              totals.maybe += cd.maybePoints;
              totals.no += cd.noPoints;
            });
            return totals;
          },
          { yes: 0, maybe: 0, no: 0 }
        );
      },

      getCategoryPoints: (categoryCode) => {
        const { currentScenario } = get();
        if (!currentScenario) return { yes: 0, maybe: 0, no: 0 };
        
        const category = currentScenario.categories.find((c) => c.categoryCode === categoryCode);
        if (!category) return { yes: 0, maybe: 0, no: 0 };
        
        return category.creditDistributions.reduce(
          (totals, cd) => {
            totals.yes += cd.yesPoints;
            totals.maybe += cd.maybePoints;
            totals.no += cd.noPoints;
            return totals;
          },
          { yes: 0, maybe: 0, no: 0 }
        );
      },

      getAchievedLevel: () => {
        const { certificationLevels } = get();
        const { yes } = get().getTotalPoints();
        
        // Find the highest level achieved
        const sortedLevels = [...certificationLevels].sort((a, b) => b.minPoints - a.minPoints);
        const achieved = sortedLevels.find((level) => yes >= level.minPoints);
        
        return achieved?.level ?? null;
      },
    }),
    {
      name: 'igbc-scenario-store',
      partialize: (state) => ({
        // Only persist these fields to localStorage
        currentScenario: state.currentScenario,
        selectedCategoryCode: state.selectedCategoryCode,
      }),
    }
  )
);
