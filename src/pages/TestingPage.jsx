import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearTestResults } from "../features/testing/testingSlice";
import TestingPanel from "../components/TestingPanel";
import ComponentsPanel from "../components/ComponentsPanel";
import { testImages } from "../data/testImages";

const TestingPage = () => {
  const dispatch = useDispatch();
  const { testResults, overallAccuracy } = useSelector(
    (state) => state.testing
  );

  const [selectedImage, setSelectedImage] = useState(null);

  const handleBackToEditor = () => {
    dispatch(clearTestResults());
  };

  const hasResults = overallAccuracy > 0 && Object.keys(testResults).length > 0;

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
            <p className="text-gray-600">
              Validation results for extracted components
            </p>
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

        {/* Accuracy Overview */}
        {hasResults && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900">
              Overall Test Accuracy: {overallAccuracy.toFixed(1)}%
            </h2>
            <p className="text-blue-700 mt-1">
              {Object.keys(testResults).length} test cases completed
            </p>
          </div>
        )}

        {/* Test Images */}
        <div className="mt-4 flex space-x-4 overflow-x-auto">
          {testImages.map((image) => (
            <div
              key={image.id}
              className="cursor-pointer border border-gray-300 rounded-lg p-2 hover:border-blue-500 transition-colors"
              onClick={() => handleImageClick(image)}
              title={image.name}
            >
              <img
                src={image.url}
                alt={image.name}
                className="h-24 w-auto rounded"
              />
              <p className="text-xs text-center mt-1">{image.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 h-[calc(100vh-240px)]">
        <div className="col-span-12 md:col-span-4 border-r border-gray-200">
          <ComponentsPanel />
        </div>
        <div className="col-span-12 md:col-span-8">
          {hasResults ? (
            <TestingPanel />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No test results yet. Run a test to see results.
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={handleCloseImage}
        >
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-full overflow-auto">
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="max-w-full max-h-[80vh] rounded"
            />
            <p className="mt-2 text-center font-semibold">{selectedImage.name}</p>
            <button
              onClick={handleCloseImage}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestingPage;
