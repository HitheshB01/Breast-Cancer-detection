import React from 'react';
import { Brain, Shield, Users, Award, BookOpen, AlertTriangle } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About BreastCare AI</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          An educational machine learning system designed to demonstrate AI applications in healthcare
          and promote awareness about breast cancer early detection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Mission */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center mb-4">
            <Brain className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-700 mb-4">
            To demonstrate the potential of artificial intelligence in healthcare while educating users about 
            breast cancer, its risk factors, and the importance of early detection.
          </p>
          <p className="text-gray-700">
            This platform serves as an educational tool that bridges the gap between complex machine learning 
            concepts and practical healthcare applications.
          </p>
        </div>

        {/* Technology */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center mb-4">
            <Award className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Technology</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Built using advanced machine learning algorithms including Logistic Regression and Random Forest 
            classifiers, trained on the Wisconsin Breast Cancer dataset.
          </p>
          <ul className="text-gray-700 space-y-2">
            <li>• 95.4% accuracy on test data</li>
            <li>• 30 clinical features analyzed</li>
            <li>• Real-time prediction capability</li>
            <li>• Explainable AI for transparency</li>
          </ul>
        </div>
      </div>

      {/* Dataset Information */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 mb-12">
        <div className="flex items-center mb-6">
          <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Dataset Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Wisconsin Breast Cancer Dataset</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• 569 tissue samples</li>
              <li>• 357 benign cases</li>
              <li>• 212 malignant cases</li>
              <li>• 30 computed features</li>
              <li>• Originally from UCI Machine Learning Repository</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Categories</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• <strong>Mean features:</strong> Average values across the cell nuclei</li>
              <li>• <strong>Standard error:</strong> Variation in measurements</li>
              <li>• <strong>Worst features:</strong> Largest/most extreme values</li>
              <li>• <strong>Measurements:</strong> Radius, texture, perimeter, area, smoothness, etc.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ML Terms Glossary */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 mb-12">
        <div className="flex items-center mb-6">
          <Users className="h-8 w-8 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Machine Learning Glossary</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Accuracy</h3>
              <p className="text-gray-700 text-sm">
                The percentage of correct predictions out of total predictions made.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Precision</h3>
              <p className="text-gray-700 text-sm">
                Of all positive predictions, how many were actually correct.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Recall (Sensitivity)</h3>
              <p className="text-gray-700 text-sm">
                Of all actual positive cases, how many were correctly identified.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">F1-Score</h3>
              <p className="text-gray-700 text-sm">
                Harmonic mean of precision and recall, balancing both metrics.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">ROC AUC</h3>
              <p className="text-gray-700 text-sm">
                Area Under the Receiver Operating Characteristic curve, measuring model performance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Feature Importance</h3>
              <p className="text-gray-700 text-sm">
                Measure of how much each input feature contributes to the prediction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ethical Considerations */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 mb-12">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 text-orange-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Ethical Considerations & Privacy</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Data Privacy</h3>
            <p className="text-gray-700">
              All data processing happens locally in your browser. No personal health information is stored 
              or transmitted to external servers. We prioritize user privacy and data security.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Bias and Fairness</h3>
            <p className="text-gray-700">
              Our models are trained on historical data which may contain inherent biases. We acknowledge 
              these limitations and encourage users to consider multiple factors when interpreting results.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
            <p className="text-gray-700">
              We provide explainable AI features, including feature importance scores, to help users 
              understand how predictions are made. This transparency is crucial for trust and accountability.
            </p>
          </div>
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-red-50 p-8 rounded-lg border border-red-200">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-3 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-red-900 mb-4">Important Medical Disclaimer</h2>
            <div className="text-red-800 space-y-3">
              <p>
                <strong>This is an educational tool and NOT a medical diagnostic device.</strong> 
                The predictions provided by this system should never be used as the sole basis for medical decisions.
              </p>
              <p>
                Always consult with qualified healthcare professionals, including oncologists and radiologists, 
                for proper medical diagnosis, treatment planning, and healthcare advice.
              </p>
              <p>
                If you have concerns about breast health, please schedule an appointment with your healthcare provider 
                and follow established medical screening guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;