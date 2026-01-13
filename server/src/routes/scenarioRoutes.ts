import { Router } from 'express';
import {
  getAllScenarios,
  getScenarioById,
  createScenario,
  updateScenario,
  deleteScenario,
  updateScenarioCategory,
} from '../controllers/scenarioController';

const router = Router();

/**
 * @route   GET /api/scenarios
 * @desc    Get all scenarios (list view)
 * @access  Public
 */
router.get('/', getAllScenarios);

/**
 * @route   GET /api/scenarios/:id
 * @desc    Get a single scenario by ID (full details)
 * @access  Public
 */
router.get('/:id', getScenarioById);

/**
 * @route   POST /api/scenarios
 * @desc    Create a new scenario
 * @access  Public
 */
router.post('/', createScenario);

/**
 * @route   PUT /api/scenarios/:id
 * @desc    Update a scenario
 * @access  Public
 */
router.put('/:id', updateScenario);

/**
 * @route   DELETE /api/scenarios/:id
 * @desc    Delete a scenario
 * @access  Public
 */
router.delete('/:id', deleteScenario);

/**
 * @route   PUT /api/scenarios/:id/categories/:categoryCode
 * @desc    Update a specific category within a scenario
 * @access  Public
 */
router.put('/:id/categories/:categoryCode', updateScenarioCategory);

export default router;
