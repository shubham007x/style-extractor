// Test case definitions with expected values
export const testCases = [
  {
    id: 'desktop_components',
    name: 'Desktop Multi-Component Interface',
    description: 'Various UI components on desktop viewport',
    imagePath: '/test-images/desktop-components.png',
    viewport: { width: 1920, height: 1080, type: 'desktop' },
    expectedComponents: [
      {
        type: 'button',
        properties: {
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          borderRadius: 8,
          paddingX: 16,
          paddingY: 8,
          fontSize: 14,
          fontWeight: 500
        },
        tolerance: {
          backgroundColor: 10,
          borderRadius: 25,
          padding: 20,
          fontSize: 15
        }
      },
      {
        type: 'card',
        properties: {
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 24,
          shadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB'
        }
      }
    ]
  },
  {
    id: 'button_states',
    name: 'Button State Variations',
    description: 'Default, hover, and active button states',
    imagePath: '/test-images/button-states.png',
    viewport: { width: 800, height: 400, type: 'tablet' },
    expectedComponents: [
      {
        type: 'button',
        state: 'default',
        properties: {
          backgroundColor: '#3B82F6',
          color: '#FFFFFF'
        }
      },
      {
        type: 'button', 
        state: 'hover',
        properties: {
          backgroundColor: '#2563EB',
          color: '#FFFFFF'
        }
      },
      {
        type: 'button',
        state: 'active',
        properties: {
          backgroundColor: '#1D4ED8',
          color: '#FFFFFF'
        }
      }
    ]
  },
  {
    id: 'mobile_layout',
    name: 'Mobile Responsive Layout',
    description: 'Components adapted for mobile viewport',
    imagePath: '/test-images/mobile-layout.png',
    viewport: { width: 375, height: 667, type: 'mobile' },
    expectedComponents: [
      {
        type: 'button',
        properties: {
          width: '100%',
          paddingY: 12,
          fontSize: 16
        }
      },
      {
        type: 'input',
        properties: {
          width: '100%',
          paddingX: 12,
          paddingY: 8,
          borderRadius: 6
        }
      }
    ]
  }
];

export const validateTestCase = async (testCase, extractedComponents) => {
  const results = {
    testCaseId: testCase.id,
    passed: 0,
    failed: 0,
    accuracy: 0,
    details: []
  };
  
  for (const expectedComponent of testCase.expectedComponents) {
    const matchingComponent = findMatchingComponent(expectedComponent, extractedComponents);
    
    if (matchingComponent) {
      const componentValidation = validateComponentProperties(
        expectedComponent,
        matchingComponent,
        expectedComponent.tolerance || {}
      );
      
      results.details.push(componentValidation);
      
      if (componentValidation.passed) {
        results.passed++;
      } else {
        results.failed++;
      }
    } else {
      results.failed++;
      results.details.push({
        expected: expectedComponent,
        found: null,
        passed: false,
        reason: 'Component not detected'
      });
    }
  }
  
  const total = results.passed + results.failed;
  results.accuracy = total > 0 ? (results.passed / total) * 100 : 0;
  
  return results;
};

const findMatchingComponent = (expectedComponent, extractedComponents) => {
  return extractedComponents.find(component => {
    if (component.type !== expectedComponent.type) return false;
    
    // Additional matching logic based on position, size, or properties
    const expectedBounds = expectedComponent.bounds;
    if (expectedBounds) {
      const boundsMatch = Math.abs(component.bounds.x - expectedBounds.x) < 50 &&
                         Math.abs(component.bounds.y - expectedBounds.y) < 50;
      return boundsMatch;
    }
    
    return true;
  });
};

const validateComponentProperties = (expected, actual, tolerances) => {
  const validation = {
    expected,
    actual,
    passed: true,
    propertyValidations: {}
  };
  
  Object.entries(expected.properties).forEach(([property, expectedValue]) => {
    const actualValue = getNestedProperty(actual.properties, property);
    const tolerance = tolerances[property] || 10;
    
    const isValid = validateProperty(expectedValue, actualValue, tolerance);
    
    validation.propertyValidations[property] = {
      expected: expectedValue,
      actual: actualValue,
      tolerance,
      valid: isValid,
      deviation: calculateDeviation(expectedValue, actualValue)
    };
    
    if (!isValid) {
      validation.passed = false;
    }
  });
  
  return validation;
};

const validateProperty = (expected, actual, tolerance) => {
  if (typeof expected === 'number' && typeof actual === 'number') {
    const deviation = Math.abs(expected - actual) / expected * 100;
    return deviation <= tolerance;
  }
  
  if (typeof expected === 'string' && typeof actual === 'string') {
    // For colors, convert to RGB and compare
    if (expected.startsWith('#') || expected.startsWith('rgb')) {
      return compareColors(expected, actual, tolerance);
    }
    
    // Exact string match for other properties
    return expected.toLowerCase() === actual.toLowerCase();
  }
  
  return expected === actual;
};

const compareColors = (color1, color2, tolerance) => {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);
  
  if (!rgb1 || !rgb2) return color1 === color2;
  
  const distance = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
  
  // Maximum distance is ~441 (sqrt(255^2 * 3))
  const maxDistance = Math.sqrt(255 * 255 * 3);
  const similarity = (1 - distance / maxDistance) * 100;
  
  return similarity >= (100 - tolerance);
};

const parseColor = (color) => {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16)
    };
  }
  
  const rgbMatch = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3])
    };
  }
  
  return null;
};

const getNestedProperty = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const calculateDeviation = (expected, actual) => {
  if (typeof expected === 'number' && typeof actual === 'number') {
    return Math.abs(expected - actual) / expected * 100;
  }
  return expected === actual ? 0 : 100;
};
