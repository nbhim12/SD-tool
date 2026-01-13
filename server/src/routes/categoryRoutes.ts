import { Router } from 'express';
import {
  getAllCategories,
  getCategoryByCode,
  getCertificationLevels,
} from '../controllers/categoryController';

const router = Router();

/**
 * @route   GET /api/categories
 * @desc    Get all categories with credits and mandatory requirements
 * @access  Public
 */
router.get('/', getAllCategories);

/**
 * @route   GET /api/categories/certification-levels
 * @desc    Get certification levels and thresholds
 * @access  Public
 */
router.get('/certification-levels', getCertificationLevels);

/**
 * @route   GET /api/categories/:code
 * @desc    Get a single category by code (SD, WC, EE, MR, RHW, ID)
 * @access  Public
 */
router.get('/:code', getCategoryByCode);

export default router;
