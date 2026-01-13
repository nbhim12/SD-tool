import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Load IGBC data from JSON file
const igbcDataPath = path.join(__dirname, '../../../shared/data/igbc-green-homes.json');
const igbcData = JSON.parse(fs.readFileSync(igbcDataPath, 'utf-8'));

/**
 * Get all categories with their credits and mandatory requirements
 * GET /api/categories
 */
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      data: igbcData.categories,
      meta: {
        totalCategories: igbcData.categories.length,
        totalPossiblePoints: igbcData.totalPossiblePoints,
        certificationLevels: igbcData.certificationLevels,
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
};

/**
 * Get a single category by code
 * GET /api/categories/:code
 */
export const getCategoryByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const category = igbcData.categories.find(
      (cat: { code: string }) => cat.code.toLowerCase() === code.toLowerCase()
    );

    if (!category) {
      res.status(404).json({
        success: false,
        error: `Category with code '${code}' not found`
      });
      return;
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category'
    });
  }
};

/**
 * Get certification levels and thresholds
 * GET /api/categories/certification-levels
 */
export const getCertificationLevels = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      data: igbcData.certificationLevels,
      totalPossiblePoints: igbcData.totalPossiblePoints
    });
  } catch (error) {
    console.error('Error fetching certification levels:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch certification levels'
    });
  }
};
