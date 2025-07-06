export interface PatientData {
  id: string;
  name?: string;
  age?: number;
  meanRadius: number;
  meanTexture: number;
  meanPerimeter: number;
  meanArea: number;
  meanSmoothness: number;
  worstRadius: number;
  worstTexture: number;
  worstPerimeter: number;
  worstArea: number;
  worstSmoothness: number;
}

export interface PredictionResult {
  prediction: 'Benign' | 'Malignant';
  probability: number;
  confidence: number;
  features: FeatureImportance[];
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  value: number;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
}

export interface DatasetInfo {
  totalSamples: number;
  benignCount: number;
  malignantCount: number;
  features: number;
}