import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { runTestCase, runAllTestCases } from '../features/testing/testingSlice';

const TestingPanel = () => {
  const dispatch = useDispatch();
  const { testCases, testResults, overallAccuracy, isRunning } = useSelector(state => state.testing);
  const { detectedComponents } = useSelector(state => state.components);
  const [selectedTestCase, setSelectedTestCase] = useState(null);

  const handleRunTestCase = (testCaseId) => {
    dispatch(runTestCase({ 
      testCaseId, 
      extractedComponents: detectedComponents 
    }));
  };

  const handleRunAllTests = () => {
    const allExtractedComponents = {};
    testCases.forEach(testCase => {
      allExtractedComponents[testCase.id] = detectedComponents;
    });
    
    dispatch(runAllTestCases({ allExtractedComponents }));
  };

  const getResultColor = (accuracy) => {
    if (accuracy >= 90) return 'text-green-600 bg-green-50';
    if (accuracy >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Test Validation</h2>
          <button
            onClick={handleRunAllTests}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? 'Running...' : 'Run All Tests'}
          </button>
        </div>

        {overallAccuracy > 0 && (
          <div className={`p-3 rounded-lg mb-4 ${getResultColor(overallAccuracy)}`}>
            <div className="font-medium">Overall Accuracy: {overallAccuracy.toFixed(1)}%</div>
            <div className="text-sm mt-1">
              {Object.keys(testResults).length} of {testCases.length} tests completed
            </div>
          </div>
        )}

        <div className="space-y-3">
          {testCases.map((testCase) => {
            const result = testResults[testCase.id];
            
            return (
              <div key={testCase.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{testCase.name}</h3>
                  <button
                    onClick={() => handleRunTestCase(testCase.id)}
                    disabled={isRunning}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
                  >
                    Test
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{testCase.description}</p>
                
                <div className="text-xs text-gray-500">
                  {testCase.viewport.type} • {testCase.viewport.width}×{testCase.viewport.height}
                </div>

                {result && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs ${getResultColor(result.accuracy)}`}>
                      Accuracy: {result.accuracy.toFixed(1)}%
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-600">
                      Passed: {result.passed} | Failed: {result.failed}
                    </div>

                    {selectedTestCase === testCase.id && (
                      <div className="mt-3 space-y-2">
                        {result.details.map((detail, index) => (
                          <div key={index} className={`text-xs p-2 rounded ${detail.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                            <div className="font-medium">
                              {detail.expected.type} - {detail.passed ? 'PASS' : 'FAIL'}
                            </div>
                            {!detail.passed && detail.reason && (
                              <div className="text-red-600 mt-1">{detail.reason}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedTestCase(selectedTestCase === testCase.id ? null : testCase.id)}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      {selectedTestCase === testCase.id ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestingPanel;
