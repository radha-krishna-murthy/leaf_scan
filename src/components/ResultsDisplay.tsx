import React, { useState, useRef } from 'react';
import { CheckCircle, AlertCircle, Leaf, Droplets, Sun, ThermometerSun, ChevronRight, Beaker, Sparkles, Bug, CheckCircle2, XCircle, Info, Download, Mail } from 'lucide-react';
import { useLeafAnalysis } from '../context/LeafAnalysisContext';
import DetailedInfoModal from './DetailedInfoModal';
import html2canvas from 'html2canvas';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate';

const ResultsDisplay: React.FC = () => {
  const { analysisResult, isAnalyzing, error, selectedImage } = useLeafAnalysis();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!resultsRef.current || !selectedImage) return;

    try {
      // Create a temporary container for the screenshot
      const container = document.createElement('div');
      container.style.padding = '20px';
      container.style.backgroundColor = '#ffffff';
      container.style.width = '800px';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      // Add the uploaded image
      const imageSection = document.createElement('div');
      imageSection.style.marginBottom = '20px';
      imageSection.style.textAlign = 'center';
      const img = document.createElement('img');
      img.src = selectedImage;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '300px';
      img.style.objectFit = 'contain';
      imageSection.appendChild(img);
      container.appendChild(imageSection);

      // Clone the results content
      const resultsClone = resultsRef.current.cloneNode(true) as HTMLElement;
      resultsClone.style.backgroundColor = '#ffffff';
      resultsClone.style.boxShadow = 'none';
      resultsClone.style.padding = '0';
      container.appendChild(resultsClone);

      // Take the screenshot
      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 800,
        height: container.offsetHeight,
      });

      // Clean up
      document.body.removeChild(container);

      // Download the image
      const link = document.createElement('a');
      link.download = `leaf-analysis-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error generating download:', err);
    }
  };

  const handleSendViaGmail = async () => {
    if (!resultsRef.current || !selectedImage || !analysisResult) return;

    try {
      // Create a temporary container for the screenshot
      const container = document.createElement('div');
      container.style.padding = '20px';
      container.style.backgroundColor = '#ffffff';
      container.style.width = '800px';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      // Add the uploaded image
      const imageSection = document.createElement('div');
      imageSection.style.marginBottom = '20px';
      imageSection.style.textAlign = 'center';
      const img = document.createElement('img');
      img.src = selectedImage;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '300px';
      img.style.objectFit = 'contain';
      imageSection.appendChild(img);
      container.appendChild(imageSection);

      // Clone the results content
      const resultsClone = resultsRef.current.cloneNode(true) as HTMLElement;
      resultsClone.style.backgroundColor = '#ffffff';
      resultsClone.style.boxShadow = 'none';
      resultsClone.style.padding = '0';
      container.appendChild(resultsClone);

      // Take the screenshot
      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 800,
        height: container.offsetHeight,
      });

      // Clean up
      document.body.removeChild(container);

      // Create email content
      const subject = `Leaf Analysis Results: ${analysisResult.name}`;
      const body = `Plant Analysis Results:\n\n` +
        `Plant Name: ${analysisResult.name}\n` +
        `Scientific Name: ${analysisResult.scientificName}\n` +
        `Health Status: ${analysisResult.health}\n` +
        `Water Needs: ${analysisResult.waterNeeds}\n` +
        `Sunlight Requirements: ${analysisResult.sunlight}\n` +
        `Temperature: ${analysisResult.temperature}\n\n` +
        `Care Instructions:\n${analysisResult.careInstructions}\n\n` +
        `Confidence Level: ${analysisResult.accuracy}%\n\n` +
        `Note: Please find the leaf image attached to this email.`;

      // Create Gmail compose URL
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Open Gmail in a new tab
      window.open(gmailUrl, '_blank');

      // Show a message to the user
      alert('Gmail compose window will open in a new tab. Please attach the downloaded image manually if needed.');
    } catch (err) {
      console.error('Error preparing Gmail:', err);
      alert('There was an error preparing the email. Please try again.');
    }
  };

  if (!analysisResult && !isAnalyzing && !error) {
    return null;
  }

  if (error) {
    return (
      <div className="mt-8 glass-card p-6 animate-fadeIn">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertCircle className="w-6 h-6" />
          <h3 className="text-lg font-medium">Analysis Error</h3>
        </div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="mt-8 glass-card p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-12 w-12">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="absolute h-3 w-3 rounded-full bg-emerald-500"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${index * 72}deg) translateX(16px)`,
                  animation: 'grow 1.5s infinite ease-out',
                  animationDelay: `${index * 0.2}s`
                }}
              ></div>
            ))}
          </div>
          <div className="text-lg font-medium text-gray-800">Analyzing your vegetable leaf...</div>
          <div className="text-sm text-gray-500">Identifying plant type and checking for diseases</div>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return null;
  }

  return (
    <>
      <div className="mt-8 overflow-hidden">
        <div
          ref={resultsRef}
          className="glass-card p-6 transform transition-all duration-500 ease-out"
          style={{
            animation: 'slideUpFade 0.6s ease-out forwards'
          }}
        >
          <div className="flex items-center justify-center mb-4">
            {analysisResult.health === 'Healthy' ? (
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            ) : (
              <AlertCircle className="w-8 h-8 text-amber-500 mr-3" />
            )}
            <h3 className="text-2xl font-bold text-gray-800">
              {analysisResult.name}
            </h3>
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-600">
              <span className="italic">{analysisResult.scientificName}</span> •
              <span className={`font-medium ml-2 ${analysisResult.health === 'Healthy' ? 'text-green-600' : 'text-amber-600'}`}>
                {analysisResult.health} Condition
              </span>
            </p>
            <div className="mt-2 p-2 bg-primary-50 rounded-lg inline-block">
              <span className="text-primary-700 font-semibold">
                {analysisResult.accuracy >= 85 ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    High Confidence ({analysisResult.accuracy}%)
                  </span>
                ) : analysisResult.accuracy >= 70 ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    Moderate Confidence ({analysisResult.accuracy}%)
                  </span>
                ) : analysisResult.accuracy >= 50 ? (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Low Confidence ({analysisResult.accuracy}%)
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Very Low Confidence ({analysisResult.accuracy}%)
                  </span>
                )}
              </span>
            </div>
          </div>

          {analysisResult.disease && (
            <div className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-100 animate-fadeIn">
              <h4 className="text-lg font-medium text-amber-800 mb-2 flex items-center gap-2">
                <Bug className="w-5 h-5" />
                {analysisResult.disease.name}
              </h4>
              <p className="text-amber-700 mb-4">{analysisResult.disease.description}</p>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Recommended Remedies
                  </h5>
                  <ul className="list-disc list-inside text-amber-700 space-y-1">
                    {analysisResult.disease.remedies.map((remedy, index) => (
                      <li key={index}>{remedy}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                    <Beaker className="w-4 h-4" />
                    Recommended Fertilizers
                  </h5>
                  <div className="space-y-3">
                    {analysisResult.disease.fertilizers.map((fertilizer, index) => (
                      <div key={index} className="bg-white/50 p-3 rounded-lg">
                        <h6 className="font-medium text-amber-800">{fertilizer.name}</h6>
                        <p className="text-sm text-amber-700">Composition: {fertilizer.composition}</p>
                        <p className="text-sm text-amber-700">Application: {fertilizer.application}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="result-item flex items-start gap-3 p-3 rounded-lg hover:bg-primary-50 transition-colors">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-full">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Vegetable Type</h4>
                <p className="text-gray-600 text-sm">{analysisResult.type}</p>
              </div>
            </div>

            <div className="result-item flex items-start gap-3 p-3 rounded-lg hover:bg-primary-50 transition-colors">
              <div className="p-2 bg-secondary-100 text-secondary-600 rounded-full">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Water Needs</h4>
                <p className="text-gray-600 text-sm">{analysisResult.waterNeeds}</p>
              </div>
            </div>

            <div className="result-item flex items-start gap-3 p-3 rounded-lg hover:bg-primary-50 transition-colors">
              <div className="p-2 bg-accent-100 text-accent-600 rounded-full">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Sunlight</h4>
                <p className="text-gray-600 text-sm">{analysisResult.sunlight}</p>
              </div>
            </div>

            <div className="result-item flex items-start gap-3 p-3 rounded-lg hover:bg-primary-50 transition-colors">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-full">
                <ThermometerSun className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Temperature</h4>
                <p className="text-gray-600 text-sm">{analysisResult.temperature}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <span>Care Instructions</span>
              <ChevronRight className="w-4 h-4 ml-1 text-primary-500" />
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {analysisResult.careInstructions}
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Info className="w-5 h-5 mr-2" />
              Learn More
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Results
            </button>
            <button
              onClick={handleSendViaGmail}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Send via Gmail
            </button>
          </div>
        </div>
      </div>

      <DetailedInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plantName={analysisResult.name}
        scientificName={analysisResult.scientificName}
        hasDisease={analysisResult.health !== 'Healthy'}
      />
    </>
  );
};

export default ResultsDisplay;