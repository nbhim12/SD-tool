import mongoose, { Schema, Document } from 'mongoose';
import { CategoryCode } from '../types';

// Mandatory Compliance Sub-document
export interface IMandatoryCompliance {
  requirementId: string;
  isCompliant: boolean;
  notes: string;
}

const MandatoryComplianceSchema = new Schema<IMandatoryCompliance>({
  requirementId: { type: String, required: true },
  isCompliant: { type: Boolean, default: false },
  notes: { type: String, default: '' },
}, { _id: false });

// Credit Distribution Sub-document
export interface ICreditDistribution {
  creditId: string;
  yesPoints: number;
  maybePoints: number;
  noPoints: number;
  notes: string;
}

const CreditDistributionSchema = new Schema<ICreditDistribution>({
  creditId: { type: String, required: true },
  yesPoints: { type: Number, default: 0, min: 0 },
  maybePoints: { type: Number, default: 0, min: 0 },
  noPoints: { type: Number, default: 0, min: 0 },
  notes: { type: String, default: '' },
}, { _id: false });

// Category Input Sub-document
export interface ICategoryInput {
  categoryCode: CategoryCode;
  mandatoryCompliance: IMandatoryCompliance[];
  creditDistributions: ICreditDistribution[];
}

const CategoryInputSchema = new Schema<ICategoryInput>({
  categoryCode: { 
    type: String, 
    required: true,
    enum: ['SD', 'WC', 'EE', 'MR', 'RHW', 'ID']
  },
  mandatoryCompliance: [MandatoryComplianceSchema],
  creditDistributions: [CreditDistributionSchema],
}, { _id: false });

// Main Scenario Document
export interface IScenario extends Document {
  name: string;
  projectName: string;
  projectType: string;
  targetCertificationLevel: 'certified' | 'silver' | 'gold' | 'platinum';
  categories: ICategoryInput[];
  createdAt: Date;
  updatedAt: Date;
}

const ScenarioSchema = new Schema<IScenario>({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  projectName: { 
    type: String, 
    required: true,
    trim: true,
    default: 'Untitled Project'
  },
  projectType: { 
    type: String, 
    required: true,
    trim: true,
    default: 'Residential'
  },
  targetCertificationLevel: { 
    type: String, 
    required: true,
    enum: ['certified', 'silver', 'gold', 'platinum'],
    default: 'certified'
  },
  categories: {
    type: [CategoryInputSchema],
    default: []
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret: Record<string, unknown>) => {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Index for faster queries (name index is already created by unique: true)
ScenarioSchema.index({ createdAt: -1 });

export const Scenario = mongoose.model<IScenario>('Scenario', ScenarioSchema);
