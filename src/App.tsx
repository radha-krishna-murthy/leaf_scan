import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LeafAnalyzer from './components/LeafAnalyzer';
import Footer from './components/Footer';
import { LeafAnalysisProvider } from './context/LeafAnalysisContext';
import './styles/animations.css';

function App() {
  return (
    <LeafAnalysisProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Hero />
          <LeafAnalyzer />
        </main>
        <Footer />
      </div>
    </LeafAnalysisProvider>
  );
}

export default App;