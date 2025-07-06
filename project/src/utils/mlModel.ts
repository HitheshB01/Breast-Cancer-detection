import { PatientData, PredictionResult, FeatureImportance, ModelMetrics } from '../types';

// Simulated pre-trained model weights (in a real app, these would be loaded from a trained model)
const modelWeights = {
  meanRadius: 0.15,
  meanTexture: 0.08,
  meanPerimeter: 0.18,
  meanArea: 0.12,
  meanSmoothness: 0.06,
  worstRadius: 0.16,
  worstTexture: 0.05,
  worstPerimeter: 0.14,
  worstArea: 0.11,
  worstSmoothness: 0.04
};

// Feature normalization parameters (simulated from training data)
const featureStats = {
  meanRadius: { mean: 14.13, std: 3.52 },
  meanTexture: { mean: 19.29, std: 4.30 },
  meanPerimeter: { mean: 91.97, std: 24.30 },
  meanArea: { mean: 654.89, std: 351.91 },
  meanSmoothness: { mean: 0.096, std: 0.014 },
  worstRadius: { mean: 16.27, std: 4.83 },
  worstTexture: { mean: 25.68, std: 6.15 },
  worstPerimeter: { mean: 107.26, std: 33.60 },
  worstArea: { mean: 880.58, std: 569.36 },
  worstSmoothness: { mean: 0.132, std: 0.023 }
};

export function normalizeFeature(value: number, feature: keyof typeof featureStats): number {
  const stats = featureStats[feature];
  return (value - stats.mean) / stats.std;
}

export function predictBreastCancer(data: PatientData): PredictionResult {
  // Normalize features
  const normalizedFeatures = {
    meanRadius: normalizeFeature(data.meanRadius, 'meanRadius'),
    meanTexture: normalizeFeature(data.meanTexture, 'meanTexture'),
    meanPerimeter: normalizeFeature(data.meanPerimeter, 'meanPerimeter'),
    meanArea: normalizeFeature(data.meanArea, 'meanArea'),
    meanSmoothness: normalizeFeature(data.meanSmoothness, 'meanSmoothness'),
    worstRadius: normalizeFeature(data.worstRadius, 'worstRadius'),
    worstTexture: normalizeFeature(data.worstTexture, 'worstTexture'),
    worstPerimeter: normalizeFeature(data.worstPerimeter, 'worstPerimeter'),
    worstArea: normalizeFeature(data.worstArea, 'worstArea'),
    worstSmoothness: normalizeFeature(data.worstSmoothness, 'worstSmoothness')
  };

  // Calculate prediction score using simulated logistic regression
  let score = 0;
  Object.entries(normalizedFeatures).forEach(([key, value]) => {
    score += value * modelWeights[key as keyof typeof modelWeights];
  });

  // Apply sigmoid function to get probability
  const probability = 1 / (1 + Math.exp(-score));
  
  // Determine prediction
  const prediction = probability > 0.5 ? 'Malignant' : 'Benign';
  
  // Calculate confidence (distance from decision boundary)
  const confidence = Math.abs(probability - 0.5) * 2;

  // Calculate feature importance for this prediction
  const features: FeatureImportance[] = Object.entries(data).map(([key, value]) => {
    if (key === 'id' || key === 'name' || key === 'age') return null;
    
    const normalizedValue = normalizedFeatures[key as keyof typeof normalizedFeatures];
    const weight = modelWeights[key as keyof typeof modelWeights];
    const importance = Math.abs(normalizedValue * weight);
    
    return {
      feature: key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase()),
      importance: importance,
      value: value as number
    };
  }).filter(Boolean) as FeatureImportance[];

  // Sort by importance
  features.sort((a, b) => b.importance - a.importance);

  return {
    prediction,
    probability: prediction === 'Malignant' ? probability : 1 - probability,
    confidence,
    features
  };
}

export function getModelMetrics(): ModelMetrics {
  // Simulated metrics from model evaluation
  return {
    accuracy: 0.954,
    precision: 0.942,
    recall: 0.963,
    f1Score: 0.952,
    rocAuc: 0.978
  };
}

export function getDatasetInfo() {
  return {
    totalSamples: 569,
    benignCount: 357,
    malignantCount: 212,
    features: 30
  };
}