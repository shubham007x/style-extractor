import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateStyle, updateSemanticName } from '../features/styles/stylesSlice';
import ColorPicker from './ColorPicker';

const StyleEditor = () => {
  const { editedStyles, semanticNames } = useSelector(state => state.styles);
  const dispatch = useDispatch();

  const handleSemanticNameChange = (category, property, name) => {
    dispatch(updateSemanticName({ category, property, name }));
  };

  const renderColorSection = () => {
    if (!editedStyles.colors) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Colors</h3>
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(editedStyles.colors).map(([key, value]) => {
            if (typeof value === 'object') {
              return (
                <div key={key} className="space-y-2">
                  <h4 className="font-medium text-gray-700 capitalize">{key}</h4>
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <div key={`${key}.${subKey}`} className="grid grid-cols-3 gap-4 items-center">
                      <input
                        type="text"
                        placeholder="Semantic name"
                        value={semanticNames[`colors.${key}.${subKey}`] || ''}
                        onChange={(e) => handleSemanticNameChange('colors', `${key}.${subKey}`, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span className="text-sm text-gray-600 capitalize">{subKey}</span>
                      <ColorPicker
                        category="colors"
                        property={`${key}.${subKey}`}
                        value={subValue}
                      />
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div key={key} className="grid grid-cols-3 gap-4 items-center">
                <input
                  type="text"
                  placeholder="Semantic name"
                  value={semanticNames[`colors.${key}`] || ''}
                  onChange={(e) => handleSemanticNameChange('colors', key, e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-sm text-gray-600 capitalize">{key}</span>
                <ColorPicker
                  category="colors"
                  property={key}
                  value={value}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTypographySection = () => {
    if (!editedStyles.typography) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Typography</h3>
        {Object.entries(editedStyles.typography).map(([category, values]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-gray-700 capitalize">{category}</h4>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(values).map(([key, value]) => (
                <div key={`${category}.${key}`} className="grid grid-cols-3 gap-4 items-center">
                  <input
                    type="text"
                    placeholder="Semantic name"
                    value={semanticNames[`typography.${category}.${key}`] || ''}
                    onChange={(e) => handleSemanticNameChange('typography', `${category}.${key}`, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span className="text-sm text-gray-600">{key}</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => dispatch(updateStyle({ 
                      category: 'typography', 
                      property: `${category}.${key}`, 
                      value: e.target.value 
                    }))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSpacingSection = () => {
    if (!editedStyles.spacing) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Spacing</h3>
        {Object.entries(editedStyles.spacing).map(([category, values]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-gray-700 capitalize">{category}</h4>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(values).map(([key, value]) => (
                <div key={`${category}.${key}`} className="grid grid-cols-3 gap-4 items-center">
                  <input
                    type="text"
                    placeholder="Semantic name"
                    value={semanticNames[`spacing.${category}.${key}`] || ''}
                    onChange={(e) => handleSemanticNameChange('spacing', `${category}.${key}`, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span className="text-sm text-gray-600">{key}</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => dispatch(updateStyle({ 
                      category: 'spacing', 
                      property: `${category}.${key}`, 
                      value: e.target.value 
                    }))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-white border-l border-gray-200">
      <div className="p-6 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Style Editor</h2>
          <p className="text-sm text-gray-600 mt-1">
            Edit extracted styles and add semantic names
          </p>
        </div>
        
        {renderColorSection()}
        {renderTypographySection()}
        {renderSpacingSection()}
      </div>
    </div>
  );
};

export default StyleEditor;
