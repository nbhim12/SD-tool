/**
 * Seed Script - Load IGBC Green Homes data and create initial scenario template
 * Run with: npm run seed
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Scenario } from '../models';
import { CategoryCode } from '../types';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/igbc-tool';

// Load IGBC data from JSON file
const igbcDataPath = path.join(__dirname, '../../../shared/data/igbc-green-homes.json');
const igbcData = JSON.parse(fs.readFileSync(igbcDataPath, 'utf-8'));

interface Category {
  code: CategoryCode;
  possiblePoints: number;
  mandatoryRequirements: { id: string }[];
  credits: { id: string }[];
}

// Create empty category inputs based on IGBC data
function createEmptyCategoryInputs() {
  return (igbcData.categories as Category[]).map((category) => ({
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
}

async function seed() {
  try {
    console.log('🌱 Starting seed process...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing scenarios (optional - comment out to preserve data)
    // await Scenario.deleteMany({});
    // console.log('🗑️ Cleared existing scenarios');

    // Check if sample scenario exists
    const existingScenario = await Scenario.findOne({ name: 'Sample Project - Green Homes' });
    
    if (!existingScenario) {
      // Create a sample scenario
      const sampleScenario = new Scenario({
        name: 'Sample Project - Green Homes',
        projectName: 'Sample Residential Tower',
        projectType: 'Apartment',
        targetCertificationLevel: 'gold',
        categories: createEmptyCategoryInputs(),
      });

      await sampleScenario.save();
      console.log('✅ Created sample scenario:', sampleScenario.name);
    } else {
      console.log('ℹ️ Sample scenario already exists, skipping...');
    }

    console.log('\n📊 IGBC Data Summary:');
    console.log(`   Total Categories: ${igbcData.categories.length}`);
    console.log(`   Total Possible Points: ${igbcData.totalPossiblePoints}`);
    
    let totalMandatory = 0;
    let totalCredits = 0;
    
    (igbcData.categories as Category[]).forEach((cat: Category) => {
      totalMandatory += cat.mandatoryRequirements.length;
      totalCredits += cat.credits.length;
      console.log(`   ${cat.code}: ${cat.possiblePoints} points (${cat.mandatoryRequirements.length} mandatory, ${cat.credits.length} credits)`);
    });
    
    console.log(`\n   Total Mandatory Requirements: ${totalMandatory}`);
    console.log(`   Total Credits: ${totalCredits}`);

    console.log('\n✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

seed();
