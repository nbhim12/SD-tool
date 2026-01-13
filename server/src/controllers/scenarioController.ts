import { Request, Response } from 'express';
import { Scenario } from '../models';
import fs from 'fs';
import path from 'path';
import { CategoryCode } from '../types';

// Load IGBC data for creating empty scenarios
const igbcDataPath = path.join(__dirname, '../../../shared/data/igbc-green-homes.json');
const igbcData = JSON.parse(fs.readFileSync(igbcDataPath, 'utf-8'));

interface CategoryData {
  code: CategoryCode;
  mandatoryRequirements: { id: string }[];
  credits: { id: string }[];
}

// Helper to create empty category inputs
const createEmptyCategoryInputs = () => {
  return (igbcData.categories as CategoryData[]).map((category) => ({
    categoryCode: category.code,
    mandatoryCompliance: category.mandatoryRequirements.map((req) => ({
      requirementId: req.id,
      isCompliant: false,
      notes: '',
    })),
    creditDistributions: category.credits.map((credit) => ({
      creditId: credit.id,
      yesPoints: 0,
      maybePoints: 0,
      noPoints: 0,
      notes: '',
    })),
  }));
};

/**
 * Get all scenarios
 * GET /api/scenarios
 */
export const getAllScenarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const scenarios = await Scenario.find()
      .select('name projectName projectType targetCertificationLevel createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: scenarios,
      count: scenarios.length
    });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scenarios'
    });
  }
};

/**
 * Get a single scenario by ID
 * GET /api/scenarios/:id
 */
export const getScenarioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const scenario = await Scenario.findById(id);

    if (!scenario) {
      res.status(404).json({
        success: false,
        error: 'Scenario not found'
      });
      return;
    }

    res.json({
      success: true,
      data: scenario
    });
  } catch (error) {
    console.error('Error fetching scenario:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scenario'
    });
  }
};

/**
 * Create a new scenario
 * POST /api/scenarios
 */
export const createScenario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, projectName, projectType, targetCertificationLevel } = req.body;

    // Validate required fields
    if (!name) {
      res.status(400).json({
        success: false,
        error: 'Scenario name is required'
      });
      return;
    }

    // Check for duplicate name
    const existingScenario = await Scenario.findOne({ name });
    if (existingScenario) {
      res.status(400).json({
        success: false,
        error: 'A scenario with this name already exists'
      });
      return;
    }

    // Create scenario with empty category inputs
    const scenario = new Scenario({
      name,
      projectName: projectName || 'Untitled Project',
      projectType: projectType || 'Residential',
      targetCertificationLevel: targetCertificationLevel || 'certified',
      categories: createEmptyCategoryInputs(),
    });

    await scenario.save();

    res.status(201).json({
      success: true,
      data: scenario,
      message: 'Scenario created successfully'
    });
  } catch (error) {
    console.error('Error creating scenario:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create scenario'
    });
  }
};

/**
 * Update an existing scenario
 * PUT /api/scenarios/:id
 */
export const updateScenario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if scenario exists
    const scenario = await Scenario.findById(id);
    if (!scenario) {
      res.status(404).json({
        success: false,
        error: 'Scenario not found'
      });
      return;
    }

    // If name is being updated, check for duplicates
    if (updates.name && updates.name !== scenario.name) {
      const existingScenario = await Scenario.findOne({ name: updates.name });
      if (existingScenario) {
        res.status(400).json({
          success: false,
          error: 'A scenario with this name already exists'
        });
        return;
      }
    }

    // Update scenario
    const updatedScenario = await Scenario.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedScenario,
      message: 'Scenario updated successfully'
    });
  } catch (error) {
    console.error('Error updating scenario:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update scenario'
    });
  }
};

/**
 * Delete a scenario
 * DELETE /api/scenarios/:id
 */
export const deleteScenario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const scenario = await Scenario.findByIdAndDelete(id);

    if (!scenario) {
      res.status(404).json({
        success: false,
        error: 'Scenario not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Scenario deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scenario:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete scenario'
    });
  }
};

/**
 * Update a specific category within a scenario
 * PUT /api/scenarios/:id/categories/:categoryCode
 */
export const updateScenarioCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, categoryCode } = req.params;
    const { mandatoryCompliance, creditDistributions } = req.body;

    const scenario = await Scenario.findById(id);
    if (!scenario) {
      res.status(404).json({
        success: false,
        error: 'Scenario not found'
      });
      return;
    }

    // Find and update the category
    const categoryIndex = scenario.categories.findIndex(
      (cat) => cat.categoryCode === categoryCode.toUpperCase()
    );

    if (categoryIndex === -1) {
      res.status(404).json({
        success: false,
        error: `Category '${categoryCode}' not found in scenario`
      });
      return;
    }

    // Update category data
    if (mandatoryCompliance) {
      scenario.categories[categoryIndex].mandatoryCompliance = mandatoryCompliance;
    }
    if (creditDistributions) {
      scenario.categories[categoryIndex].creditDistributions = creditDistributions;
    }

    await scenario.save();

    res.json({
      success: true,
      data: scenario.categories[categoryIndex],
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update category'
    });
  }
};
