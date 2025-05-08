import React from 'react';
import { Search } from 'lucide-react';
import { useLeafAnalysis } from '../context/LeafAnalysisContext';

const AnalyzeButton: React.FC = () => {
  const { isAnalyzing, startAnalysis } = useLeafAnalysis();

  return (
    <button
      onClick={startAnalysis}
      disabled={isAnalyzing}
      aria-label="Analyze leaf image"
      className="btn btn-primary group relative overflow-hidden"
    >
      <div className="flex items-center gap-2">
        {isAnalyzing ? (
          <>
            <div className="relative h-5 w-5">
              <div className="loading-leaf" style={{ animationDelay: '0s' }}></div>
              <div className="loading-leaf" style={{ animationDelay: '0.4s' }}></div>
              <div className="loading-leaf" style={{ animationDelay: '0.8s' }}></div>
            </div>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Analyze Image</span>
          </>
        )}
      </div>
      
      {/* Button shine effect */}
      <span className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-full">
        <span className="absolute top-0 left-[-100%] w-full h-full bg-white/30 transform rotate-12 transition-transform duration-700 
                        group-hover:translate-x-[200%]"></span>
      </span>
    </button>
  );
};

export default AnalyzeButton;