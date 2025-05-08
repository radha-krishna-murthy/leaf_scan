import React from 'react';
import { Leaf, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <Leaf className="h-8 w-8 text-primary-400" />
            <span className="text-xl font-bold">LeafScan</span>
          </div>
          
          <div className="flex gap-4">
            {[Github, Twitter, Linkedin].map((Icon, index) => (
              <a 
                key={index}
                href="#" 
                className="p-2 rounded-full bg-gray-800 hover:bg-primary-600 transition-colors"
                aria-label={`Social media link ${index + 1}`}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-t border-gray-800">
          <div>
            <h3 className="text-lg font-medium mb-4 text-primary-300">About</h3>
            <p className="text-gray-400 mb-4">
              LeafScan uses advanced AI to help you identify plants and assess their health through leaf analysis.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-primary-300">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              {['Home', 'About', 'Services', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary-300 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} LeafScan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;