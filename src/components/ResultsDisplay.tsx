import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Leaf, Droplets, Sun, ThermometerSun, ChevronRight, Beaker, Sparkles, Bug, CheckCircle2, XCircle, Info } from 'lucide-react';
import { useLeafAnalysis } from '../context/LeafAnalysisContext';
import DetailedInfoModal from './DetailedInfoModal';

const API_KEY = 'AIzaSyDgMq_XN04HPlT-G-skttYMtT0XnTg02CI';
const API_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate';

const ResultsDisplay: React.FC = () => {
  const { analysisResult, isAnalyzing, error } = useLeafAnalysis();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          
          <p className="text-center text-gray-600 mb-8">
            <span className="italic">{analysisResult.scientificName}</span> • 
            <span className={`font-medium ml-2 ${
              analysisResult.health === 'Healthy' ? 'text-green-600' : 'text-amber-600'
            }`}>
              {analysisResult.health} Condition
            </span>
          </p>

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
          
          <div className="flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Info className="w-5 h-5 mr-2" />
              Learn More
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