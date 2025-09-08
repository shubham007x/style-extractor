import { saveAs } from 'file-saver';

export const exportStylesAsJSON = (extractedStyles, editedStyles, semanticNames) => {
  const exportData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      generator: 'Style Extractor'
    },
    extractedStyles: extractedStyles,
    editedStyles: editedStyles,
    semanticNames: semanticNames,
    cssVariables: generateCSSVariables(editedStyles, semanticNames),
    tailwindConfig: generateTailwindConfig(editedStyles, semanticNames)
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json;charset=utf-8'
  });
  
  saveAs(blob, `style-tokens-${Date.now()}.json`);
};

const generateCSSVariables = (styles, semanticNames) => {
  const variables = {};
  
  Object.entries(styles).forEach(([category, properties]) => {
    Object.entries(properties).forEach(([property, value]) => {
      const semanticKey = `${category}.${property}`;
      const varName = semanticNames[semanticKey] || `${category}-${property}`;
      variables[`--${varName.toLowerCase().replace(/\s+/g, '-')}`] = value;
    });
  });
  
  return variables;
};

const generateTailwindConfig = (styles, semanticNames) => {
  return {
    theme: {
      extend: {
        colors: styles.colors || {},
        fontFamily: styles.typography?.fontFamily || {},
        fontSize: styles.typography?.fontSize || {},
        spacing: styles.spacing?.padding || {},
        borderRadius: styles.borderRadius || {},
        boxShadow: styles.shadows || {}
      }
    }
  };
};
