import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PatientData, PredictionResult } from '../types';

export interface PDFReportData {
  patientData: PatientData;
  prediction: PredictionResult;
  timestamp: Date;
}

export async function generatePDFReport(reportData: PDFReportData): Promise<void> {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(37, 99, 235); // Blue color
  pdf.text('Breast Cancer Prediction Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Subtitle
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on ${reportData.timestamp.toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Patient Information
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Patient Information', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  if (reportData.patientData.name) {
    pdf.text(`Name: ${reportData.patientData.name}`, 20, yPosition);
    yPosition += 8;
  }
  if (reportData.patientData.age) {
    pdf.text(`Age: ${reportData.patientData.age}`, 20, yPosition);
    yPosition += 8;
  }
  pdf.text(`Patient ID: ${reportData.patientData.id}`, 20, yPosition);
  yPosition += 15;

  // Prediction Results
  pdf.setFontSize(16);
  pdf.text('Prediction Results', 20, yPosition);
  yPosition += 10;

  // Prediction with color coding
  pdf.setFontSize(14);
  if (reportData.prediction.prediction === 'Malignant') {
    pdf.setTextColor(220, 38, 38); // Red for malignant
  } else {
    pdf.setTextColor(34, 197, 94); // Green for benign
  }
  pdf.text(`Prediction: ${reportData.prediction.prediction}`, 20, yPosition);
  yPosition += 10;

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.text(`Probability: ${(reportData.prediction.probability * 100).toFixed(1)}%`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Confidence: ${(reportData.prediction.confidence * 100).toFixed(1)}%`, 20, yPosition);
  yPosition += 15;

  // Feature Values
  pdf.setFontSize(16);
  pdf.text('Feature Values', 20, yPosition);
  yPosition += 10;

  const features = [
    { label: 'Mean Radius', value: reportData.patientData.meanRadius },
    { label: 'Mean Texture', value: reportData.patientData.meanTexture },
    { label: 'Mean Perimeter', value: reportData.patientData.meanPerimeter },
    { label: 'Mean Area', value: reportData.patientData.meanArea },
    { label: 'Mean Smoothness', value: reportData.patientData.meanSmoothness },
    { label: 'Worst Radius', value: reportData.patientData.worstRadius },
    { label: 'Worst Texture', value: reportData.patientData.worstTexture },
    { label: 'Worst Perimeter', value: reportData.patientData.worstPerimeter },
    { label: 'Worst Area', value: reportData.patientData.worstArea },
    { label: 'Worst Smoothness', value: reportData.patientData.worstSmoothness }
  ];

  pdf.setFontSize(11);
  features.forEach((feature, index) => {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(`${feature.label}: ${feature.value.toFixed(3)}`, 20, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Health Recommendations
  if (yPosition > pageHeight - 50) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(16);
  pdf.text('Health Recommendations', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  const recommendations = [
    'Diet Recommendations:',
    '• Consume leafy greens (spinach, kale, arugula)',
    '• Include berries (blueberries, strawberries, raspberries)',
    '• Eat cruciferous vegetables (broccoli, cauliflower, cabbage)',
    '• Choose whole grains over refined carbohydrates',
    '• Limit processed foods and red meat',
    '',
    'Exercise Recommendations:',
    '• Aim for 150 minutes of moderate exercise weekly',
    '• Include strength training 2-3 times per week',
    '• Practice stress-reducing activities like yoga or meditation',
    '• Maintain a healthy weight (BMI 18.5-24.9)',
    '',
    'Lifestyle Tips:',
    '• Avoid tobacco products completely',
    '• Limit alcohol consumption',
    '• Get adequate sleep (7-9 hours nightly)',
    '• Regular medical check-ups and screenings'
  ];

  if (reportData.prediction.prediction === 'Malignant') {
    recommendations.push(
      '',
      'Medical Options (Consult with Oncologist):',
      '• Lumpectomy (breast-conserving surgery)',
      '• Mastectomy (surgical removal of breast tissue)',
      '• Radiation therapy',
      '• Chemotherapy',
      '• Hormone therapy',
      '• Targeted therapy'
    );
  }

  recommendations.forEach(rec => {
    if (yPosition > pageHeight - 15) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(rec, 20, yPosition);
    yPosition += 6;
  });

  // Disclaimer
  if (yPosition > pageHeight - 40) {
    pdf.addPage();
    yPosition = 20;
  }

  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.text('Disclaimer:', 20, yPosition);
  yPosition += 5;
  
  const disclaimerText = 'This report is for educational purposes only and should not be used for medical diagnosis. Always consult with qualified healthcare professionals and oncologists for proper medical advice, diagnosis, and treatment planning.';
  const splitDisclaimer = pdf.splitTextToSize(disclaimerText, pageWidth - 40);
  pdf.text(splitDisclaimer, 20, yPosition);

  // Save the PDF
  pdf.save(`breast-cancer-report-${reportData.patientData.id}.pdf`);
}

export async function generateBatchPDFReport(predictions: Array<{ data: PatientData; result: PredictionResult }>): Promise<void> {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(37, 99, 235);
  pdf.text('Batch Prediction Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Summary
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Summary', 20, yPosition);
  yPosition += 10;

  const benignCount = predictions.filter(p => p.result.prediction === 'Benign').length;
  const malignantCount = predictions.filter(p => p.result.prediction === 'Malignant').length;

  pdf.setFontSize(12);
  pdf.text(`Total Predictions: ${predictions.length}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Benign: ${benignCount}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Malignant: ${malignantCount}`, 20, yPosition);
  yPosition += 15;

  // Individual Results
  pdf.setFontSize(14);
  pdf.text('Individual Results', 20, yPosition);
  yPosition += 10;

  predictions.forEach((prediction, index) => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(12);
    pdf.text(`${index + 1}. Patient ID: ${prediction.data.id}`, 20, yPosition);
    yPosition += 8;

    if (prediction.result.prediction === 'Malignant') {
      pdf.setTextColor(220, 38, 38);
    } else {
      pdf.setTextColor(34, 197, 94);
    }
    pdf.text(`   Prediction: ${prediction.result.prediction}`, 20, yPosition);
    yPosition += 8;

    pdf.setTextColor(0, 0, 0);
    pdf.text(`   Probability: ${(prediction.result.probability * 100).toFixed(1)}%`, 20, yPosition);
    yPosition += 8;
    pdf.text(`   Confidence: ${(prediction.result.confidence * 100).toFixed(1)}%`, 20, yPosition);
    yPosition += 12;
  });

  pdf.save(`batch-prediction-report-${Date.now()}.pdf`);
}