import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getDatasetInfo, getModelMetrics } from '../utils/mlModel';
import { ShieldCheck, TrendingUp, Users, Target } from 'lucide-react';

const HomePage: React.FC = () => {
  const datasetInfo = getDatasetInfo();
  const modelMetrics = getModelMetrics();

  const pieData = [
    { name: 'Benign', value: datasetInfo.benignCount, color: '#10B981' },
    { name: 'Malignant', value: datasetInfo.malignantCount, color: '#EF4444' }
  ];

  const featureImportanceData = [
    { feature: 'Worst Radius', importance: 0.16 },
    { feature: 'Worst Perimeter', importance: 0.18 },
    { feature: 'Mean Radius', importance: 0.15 },
    { feature: 'Mean Perimeter', importance: 0.18 },
    { feature: 'Mean Area', importance: 0.12 },
    { feature: 'Worst Area', importance: 0.11 },
    { feature: 'Mean Texture', importance: 0.08 },
    { feature: 'Mean Smoothness', importance: 0.06 }
  ];

  const performanceData = [
    { metric: 'Accuracy', value: modelMetrics.accuracy },
    { metric: 'Precision', value: modelMetrics.precision },
    { metric: 'Recall', value: modelMetrics.recall },
    { metric: 'F1-Score', value: modelMetrics.f1Score }
  ];

  const stats = [
    { icon: Users, label: 'Total Samples', value: datasetInfo.totalSamples.toLocaleString() },
    { icon: ShieldCheck, label: 'Model Accuracy', value: `${(modelMetrics.accuracy * 100).toFixed(1)}%` },
    { icon: Target, label: 'Features Used', value: datasetInfo.features.toString() },
    { icon: TrendingUp, label: 'ROC AUC', value: modelMetrics.rocAuc.toFixed(3) }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Breast Cancer Early Detection System
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Advanced machine learning for early breast cancer detection and personalized health recommendations.
          This educational tool helps understand risk factors and promotes proactive healthcare.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center">
                <Icon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Dataset Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dataset Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis domain={[0.9, 1]} />
                <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Importance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureImportanceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="feature" type="category" width={100} />
              <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
              <Bar dataKey="importance" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How It Works</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="font-medium mr-2">1.</span>
              <span>Enter tumor characteristics or upload data</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">2.</span>
              <span>AI analyzes features using trained models</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">3.</span>
              <span>Receive prediction with confidence scores</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">4.</span>
              <span>Get personalized health recommendations</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-3">Educational Purpose</h3>
          <p className="text-green-800 mb-3">
            This tool is designed for educational purposes to demonstrate machine learning applications in healthcare.
          </p>
          <p className="text-green-800 text-sm">
            <strong>Important:</strong> This is not a medical device. Always consult healthcare professionals for medical advice and diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;