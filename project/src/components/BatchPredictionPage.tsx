import React, { useState } from 'react';
import { Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { PatientData, PredictionResult } from '../types';
import { predictBreastCancer } from '../utils/mlModel';
import { generateBatchPDFReport } from '../utils/pdfGenerator';

interface BatchResult {
  data: PatientData;
  result: PredictionResult;
}

const BatchPredictionPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError(null);
    }
  };

  const processBatchPrediction = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must contain at least a header row and one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const requiredHeaders = [
        'meanRadius', 'meanTexture', 'meanPerimeter', 'meanArea', 'meanSmoothness',
        'worstRadius', 'worstTexture', 'worstPerimeter', 'worstArea', 'worstSmoothness'
      ];

      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const batchResults: BatchResult[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length !== headers.length) {
          console.warn(`Row ${i + 1} has incorrect number of columns, skipping`);
          continue;
        }

        const patientData: PatientData = {
          id: values[headers.indexOf('id')] || `P${Date.now()}-${i}`,
          name: values[headers.indexOf('name')] || undefined,
          age: values[headers.indexOf('age')] ? parseInt(values[headers.indexOf('age')]) : undefined,
          meanRadius: parseFloat(values[headers.indexOf('meanRadius')]),
          meanTexture: parseFloat(values[headers.indexOf('meanTexture')]),
          meanPerimeter: parseFloat(values[headers.indexOf('meanPerimeter')]),
          meanArea: parseFloat(values[headers.indexOf('meanArea')]),
          meanSmoothness: parseFloat(values[headers.indexOf('meanSmoothness')]),
          worstRadius: parseFloat(values[headers.indexOf('worstRadius')]),
          worstTexture: parseFloat(values[headers.indexOf('worstTexture')]),
          worstPerimeter: parseFloat(values[headers.indexOf('worstPerimeter')]),
          worstArea: parseFloat(values[headers.indexOf('worstArea')]),
          worstSmoothness: parseFloat(values[headers.indexOf('worstSmoothness')])
        };

        const result = predictBreastCancer(patientData);
        batchResults.push({ data: patientData, result });
      }

      setResults(batchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred processing the file');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCSVResults = () => {
    const csvContent = [
      'id,name,age,prediction,probability,confidence',
      ...results.map(({ data, result }) => 
        `${data.id},"${data.name || ''}",${data.age || ''},${result.prediction},${result.probability.toFixed(4)},${result.confidence.toFixed(4)}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch-predictions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDFReport = async () => {
    await generateBatchPDFReport(results);
  };

  const downloadSampleCSV = () => {
    const sampleCSV = `id,name,age,meanRadius,meanTexture,meanPerimeter,meanArea,meanSmoothness,worstRadius,worstTexture,worstPerimeter,worstArea,worstSmoothness
P001,Patient One,45,14.2,19.5,92.3,654.2,0.095,16.1,25.8,108.5,882.1,0.131
P002,Patient Two,52,13.8,18.2,88.7,582.3,0.089,15.2,23.4,102.1,765.8,0.124
P003,Patient Three,38,15.1,22.1,98.5,721.4,0.102,17.8,28.9,115.3,995.7,0.145`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-batch-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Batch Prediction</h1>
        <p className="text-gray-600">Upload CSV file to predict multiple cases at once</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-600" />
            Upload CSV File
          </h2>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Choose a CSV file with patient data
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {file && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected file:</strong> {file.name}
                </p>
                <p className="text-sm text-blue-600">
                  Size: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={processBatchPrediction}
                disabled={!file || isProcessing}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200 font-medium"
              >
                {isProcessing ? 'Processing...' : 'Process Batch'}
              </button>
              <button
                onClick={downloadSampleCSV}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Sample CSV
              </button>
            </div>

            {error && (
              <div className="bg-red-50 p-4 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-600" />
            CSV Requirements
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Required Columns</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• meanRadius</li>
                <li>• meanTexture</li>
                <li>• meanPerimeter</li>
                <li>• meanArea</li>
                <li>• meanSmoothness</li>
                <li>• worstRadius</li>
                <li>• worstTexture</li>
                <li>• worstPerimeter</li>
                <li>• worstArea</li>
                <li>• worstSmoothness</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Optional Columns</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• id (auto-generated if not provided)</li>
                <li>• name</li>
                <li>• age</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Format Notes</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Use comma-separated values</li>
                <li>• Include header row</li>
                <li>• Numeric values only for measurements</li>
                <li>• No special characters in names</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Batch Results</h2>
            <div className="flex space-x-4">
              <button
                onClick={downloadCSVResults}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </button>
              <button
                onClick={downloadPDFReport}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Predictions</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Benign</p>
              <p className="text-2xl font-bold text-green-700">
                {results.filter(r => r.result.prediction === 'Benign').length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600">Malignant</p>
              <p className="text-2xl font-bold text-red-700">
                {results.filter(r => r.result.prediction === 'Malignant').length}
              </p>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Age</th>
                  <th className="px-6 py-3">Prediction</th>
                  <th className="px-6 py-3">Probability</th>
                  <th className="px-6 py-3">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {result.data.id}
                    </td>
                    <td className="px-6 py-4">
                      {result.data.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {result.data.age || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.result.prediction === 'Benign' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.result.prediction}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {(result.result.probability * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4">
                      {(result.result.confidence * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchPredictionPage;