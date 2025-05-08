import React, { useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import LeafParticles from './LeafParticles';

const Hero: React.FC = () => {
  const scrollToAnalyzer = useCallback(() => {
    const analyzerSection = document.getElementById('leaf-analyzer');
    if (analyzerSection) {
      analyzerSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-800/90 to-secondary-800/90 z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/1227648/pexels-photo-1227648.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')" 
        }}
      ></div>
      
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-leaf-texture opacity-50 z-10"></div>
      
      {/* Animated particles */}
      <LeafParticles />
      
      <div className="container mx-auto px-4 relative z-20 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
          <span className="block mb-2 text-shadow">Identify & Analyze</span>
          <span className="bg-gradient-to-r from-primary-200 to-accent-200 bg-clip-text text-transparent">Plant Leaves</span>
        </h1>
        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload a picture of any plant leaf and our advanced AI will identify 
          the species, assess its health, and provide detailed information about the plant.
        </p>
        <button 
          onClick={scrollToAnalyzer}
          className="btn btn-primary group"
          aria-label="Try the leaf analyzer"
        >
          <span className="relative z-10">Try It Now</span>
        </button>
      </div>
      
      <button 
        onClick={scrollToAnalyzer}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20
                 bg-white/20 backdrop-blur-sm p-3 rounded-full 
                 hover:bg-white/30 transition-all duration-300
                 hover:scale-110 hover:shadow-lg"
        aria-label="Scroll to analyzer"
      >
        <ChevronDown className="w-6 h-6 text-white animate-bounce" />
      </button>
    </section>
  );
};

export default Hero;