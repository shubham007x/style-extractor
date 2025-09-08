import React from 'react';
import ImageUpload from '../components/ImageUpload';

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl text-white">⚡</span>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Style <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Extractor</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Harness the power of AI to automatically extract design tokens from your UI screenshots. 
              Get colors, typography, spacing, and component specifications in seconds.
            </p>
            
            <div className="flex justify-center space-x-8 mt-12">
              {[
                { icon: '🎨', label: 'Color Analysis', desc: 'Extract precise color palettes' },
                { icon: '📏', label: 'Spacing Detection', desc: 'Measure padding & margins' },
                { icon: '🔧', label: 'Component Recognition', desc: 'Identify UI elements' }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.label}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <ImageUpload />
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
