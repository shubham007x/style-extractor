import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { runTestCase, runAllTestCases, clearTestResults } from '../features/testing/testingSlice';
import TestingPanel from '../components/TestingPanel';
import ComponentsPanel from '../components/ComponentsPanel';

const TestingPage = () => {
  const dispatch = useDispatch();
  const { testResults, overallAccuracy } = useSelector(state => state.testing);
  const { currentImage } = useSelector(state => state.images);

  const handleBackToEditor = () => {
    dispatch(clearTestResults());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
            <p className="text-gray-600">Validation results for extracted components</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleBackToEditor}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Editor
            </button>
          </div>
        </div>

        {overallAccuracy > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900">
              Overall Test Accuracy: {overallAccuracy.toFixed(1)}%
            </h2>
            <p className="text-blue-700 mt-1">
              {Object.keys(testResults).length} test cases completed
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-12 h-screen">
        <div className="col-span-4">
          <ComponentsPanel />
        </div>
        
        <div className="col-span-8">
          <TestingPanel />
        </div>
      </div>
    </div>
  );
};

export default TestingPage;
