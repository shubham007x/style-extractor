import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectComponent } from '../features/components/componentsSlice';

const ComponentsPanel = () => {
  const dispatch = useDispatch();
  const { detectedComponents, selectedComponent, analysis, isAnalyzing, error } = useSelector(state => state.components);

  const handleComponentSelect = (component) => {
    dispatch(selectComponent(component));
  };

  const getComponentIcon = (type) => {
    const icons = {
      button: '🔘',
      card: '🃏', 
      input: '📝',
      'nav-item': '🧭',
      container: '📦',
      unknown: '❓'
    };
    return icons[type] || '📦';
  };

  const getComponentColor = (type) => {
    const colors = {
      button: 'from-blue-500 to-blue-600',
      card: 'from-purple-500 to-purple-600',
      input: 'from-green-500 to-green-600',
      'nav-item': 'from-orange-500 to-orange-600',
      container: 'from-gray-500 to-gray-600',
      unknown: 'from-gray-400 to-gray-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  if (error) {
    return (
      <div className="bg-white h-full overflow-y-auto p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
            <span className="text-2xl text-red-600">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Failed</h3>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">🧩</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Components</h2>
            <p className="text-gray-600 text-sm">Detected UI elements</p>
          </div>
        </div>
        
        {isAnalyzing ? (
          <div className="text-center py-12">
            <div className="relative mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 mx-auto"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <p className="text-gray-600">Analyzing components...</p>
          </div>
        ) : (
          <>
            {analysis && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="mr-2">📊</span>
                  Analysis Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700 font-medium">Total Components:</p>
                    <p className="text-blue-800 font-bold text-lg">{analysis.totalComponents}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Confidence:</p>
                    <p className="text-blue-800 font-bold text-lg">{analysis.detectionConfidence.toFixed(1)}%</p>
                  </div>
                </div>
                
                {Object.keys(analysis.componentTypes).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-blue-700 font-medium mb-2">Component Types:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(analysis.componentTypes).map(([type, count]) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium capitalize"
                        >
                          {getComponentIcon(type)} {type}: {count}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {detectedComponents.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Detected Components:</h3>
                {detectedComponents.map((component, index) => (
                  <div
                    key={component.id}
                    onClick={() => handleComponentSelect(component)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                      selectedComponent?.id === component.id
                        ? 'bg-blue-100 border-2 border-blue-300 shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getComponentColor(component.type)} flex items-center justify-center`}>
                        <span className="text-white text-lg">{getComponentIcon(component.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 capitalize flex items-center">
                          {component.type} Component
                          {component.confidence && (
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium ${
                              component.confidence > 0.7 ? 'bg-green-100 text-green-700' :
                              component.confidence > 0.4 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {(component.confidence * 100).toFixed(0)}%
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-600">
                          #{index + 1} • {component.bounds.width}×{component.bounds.height}px
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-2 rounded-lg">
                        <p className="text-gray-600 font-medium">Position:</p>
                        <p className="text-gray-900">({component.bounds.x}, {component.bounds.y})</p>
                      </div>
                      
                      <div className="bg-white p-2 rounded-lg">
                        <p className="text-gray-600 font-medium">Border Radius:</p>
                        <p className="text-gray-900">{component.properties.borderRadius}px</p>
                      </div>
                    </div>
                    
                    {component.colors && component.colors.palette.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 font-medium mb-2">Colors:</p>
                        <div className="flex space-x-1">
                          {component.colors.palette.slice(0, 4).map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {component.hasText && (
                      <div className="mt-2 flex items-center text-xs text-green-600">
                        <span className="mr-1">📝</span>
                        Contains text content
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                  <span className="text-3xl text-gray-400">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Components Found</h3>
                <p className="text-gray-600 text-sm max-w-xs mx-auto">
                  Upload an image with clear UI elements to detect components automatically.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ComponentsPanel;
