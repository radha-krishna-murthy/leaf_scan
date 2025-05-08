import React, { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className={`h-8 w-8 transition-colors duration-500 ${scrolled ? 'text-primary-600' : 'text-primary-300'}`} />
          <span className={`text-xl font-bold transition-colors duration-500 ${scrolled ? 'text-primary-800' : 'text-white'}`}>
            LeafScan
          </span>
        </div>
        <nav>
          <ul className="flex gap-6">
            {['Home', 'About'].map((item) => (
              <li key={item}>
                <a 
                  href="#" 
                  className={`font-medium transition-colors relative ${
                    scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white/90 hover:text-white'
                  } group`}
                >
                  {item}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full ${
                    scrolled ? 'bg-primary-500' : 'bg-white'
                  }`}></span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;