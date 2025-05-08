import React from 'react';
import ImageUploader from './ImageUploader';
import AnalyzeButton from './AnalyzeButton';
import ResultsDisplay from './ResultsDisplay';
import { useLeafAnalysis } from '../context/LeafAnalysisContext';

const LeafAnalyzer: React.FC = () => {
  const { selectedImage } = useLeafAnalysis();

  return (
    <section id="leaf-analyzer" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Analyze Your Plant Leaf
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simply upload a clear image of a plant leaf, and our advanced AI will identify 
            the plant species, assess its health, and provide valuable information.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-6 md:p-8 relative overflow-hidden">
            {/* Decorative leaf background */}
            <div className="absolute -bottom-20 -right-20 text-primary-100 opacity-20 transform rotate-45">
              <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 3V5C21 14.627 15.627 19 9 19H5C5 19 2 19 2 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 15C4.5 12.6 3 8.2 3 5C5.2 5 9.6 6.5 12 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <ImageUploader />
            
            {selectedImage && (
              <div className="mt-8 flex flex-col items-center">
                <AnalyzeButton />
              </div>
            )}
            
            <ResultsDisplay />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeafAnalyzer;