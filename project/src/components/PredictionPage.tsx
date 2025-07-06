import React, { useState } from 'react';
import { Download, AlertCircle, CheckCircle, BarChart3, User, Calendar } from 'lucide-react';
import { PatientData, PredictionResult } from '../types';
import { predictBreastCancer } from '../utils/mlModel';
import { generatePDFReport } from '../utils/pdfGenerator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PredictionPage: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    id: `P${Date.now()}`,
    name: '',
    age: undefined,
    meanRadius: 14.0,
    meanTexture: 19.0,
    meanPerimeter: 92.0,
    meanArea: 655.0,
    meanSmoothness: 0.096,
    worstRadius: 16.0,
    worstTexture: 26.0,
    worstPerimeter: 107.0,
    worstArea: 881.0,
    worstSmoothness: 0.132
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof PatientData, value: string | number) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePredict = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = predictBreastCancer(patientData);
    setPrediction(result);
    setIsLoading(false);
  };

  const handleDownloadReport = async () => {
    if (!prediction) return;

    await generatePDFReport({
      patientData,
      prediction,
      timestamp: new Date()
    });
  };

  const resetForm = () => {
    setPatientData({
      id: `P${Date.now()}`,
      name: '',
      age: undefined,
      meanRadius: 14.0,
      meanTexture: 19.0,
      meanPerimeter: 92.0,
      meanArea: 655.0,
      meanSmoothness: 0.096,
      worstRadius: 16.0,
      worstTexture: 26.0,
      worstPerimeter: 107.0,
      worstArea: 881.0,
      worstSmoothness: 0.132
    });
    setPrediction(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Breast Cancer Prediction</h1>
        <p className="text-gray-600">Enter patient data to get AI-powered predictions and recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Patient Information
          </h2>

          <div className="space-y-4">
            {/* Patient Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name (Optional)
                </label>
                <input
                  type="text"
                  value={patientData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (Optional)
                </label>
                <input
                  type="number"
                  value={patientData.age || ''}
                  onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter age"
                />
              </div>
            </div>

            {/* Mean Features */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mean Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mean Radius (μm)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={patientData.meanRadius}
                    onChange={(e) => handleInputChange('meanRadius', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mean Texture
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={patientData.meanTexture}
                    onChange={(e) => handleInputChange('meanTexture', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mean Perimeter (μm)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={patientData.meanPerimeter}
                    onChange={(e) => handleInputChange('meanPerimeter', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mean Area (μm²)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={patientData.meanArea}
                    onChange={(e) => handleInputChange('meanArea', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mean Smoothness
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={patientData.meanSmoothness}
                    onChange={(e) => handleInputChange('meanSmoothness', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Worst Features */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Worst Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Worst Radius (μm)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={patientData.worstRadius}
                    onChange={(e) => handleInputChange('worstRadius', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Worst Texture
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={patientData.worstTexture}
                    onChange={(e) => handleInputChange('worstTexture', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Worst Perimeter (μm)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={patientData.worstPerimeter}
                    onChange={(e) => handleInputChange('worstPerimeter', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Worst Area (μm²)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={patientData.worstArea}
                    onChange={(e) => handleInputChange('worstArea', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Worst Smoothness
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={patientData.worstSmoothness}
                    onChange={(e) => handleInputChange('worstSmoothness', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                onClick={handlePredict}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200 font-medium"
              >
                {isLoading ? 'Analyzing...' : 'Predict'}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {prediction ? (
            <>
              {/* Prediction Result */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center mb-4">
                  {prediction.prediction === 'Benign' ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                  )}
                  <h3 className="text-xl font-semibold text-gray-900">Prediction Result</h3>
                </div>

                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    prediction.prediction === 'Benign' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">
                        Prediction:
                      </span>
                      <span className={`text-xl font-bold ${
                        prediction.prediction === 'Benign' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {prediction.prediction}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <span className="text-sm text-gray-600">Probability</span>
                      <div className="text-lg font-semibold text-gray-900">
                        {(prediction.probability * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <div className="text-lg font-semibold text-gray-900">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadReport}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download PDF Report
                  </button>
                </div>
              </div>

              {/* Feature Importance */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Feature Importance</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prediction.features.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="feature" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="importance" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Enter patient data and click "Predict" to see results</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;