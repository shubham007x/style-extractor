import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { exportStylesAsJSON } from "../utils/jsonExport";
import { analyzeComponents } from "../features/components/componentsSlice";
import { runAllTestCases } from "../features/testing/testingSlice";
import ImagePreview from "../components/ImagePreview";
import MockComponents from "../components/ui/MockComponents";
import StyleEditor from "../components/StyleEditor";
import ComponentsPanel from "../components/ComponentsPanel";
import TestingPanel from "../components/TestingPanel";
import ToleranceControls from "../components/ToleranceControls";

const EditorPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("styles");

  const { currentImage } = useSelector((state) => state.images);
  const { extractedStyles, editedStyles, semanticNames } = useSelector(
    (state) => state.styles
  );
  const { detectedComponents, isAnalyzing } = useSelector(
    (state) => state.components
  );
  const { testResults, overallAccuracy } = useSelector(
    (state) => state.testing
  );

  useEffect(() => {
    if (currentImage && currentImage.canvas) {
      dispatch(
        analyzeComponents({
          canvas: currentImage.canvas,
          tolerance: 10,
        })
      );
    }
  }, [currentImage, dispatch]);

  const handleExportJSON = () => {
    exportStylesAsJSON(extractedStyles, editedStyles, semanticNames);
  };

  const handleRunTests = () => {
    if (detectedComponents.length > 0) {
      const allExtractedComponents = {
        desktop_components: detectedComponents,
        button_states: detectedComponents,
        mobile_layout: detectedComponents,
      };

      dispatch(runAllTestCases({ allExtractedComponents }));
      setActiveTab("testing");
    }
  };

  if (!currentImage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-3xl text-white">🎨</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No Image Selected
          </h2>
          <p className="text-gray-600 text-lg">
            Please upload a UI screenshot to get started.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "styles",
      label: "Style Editor",
      icon: "🎨",
      count: Object.keys(editedStyles).length,
    },
    {
      id: "components",
      label: "Components",
      icon: "🧩",
      count: detectedComponents.length,
    },
    {
      id: "testing",
      label: "Testing",
      icon: "🧪",
      count: Object.keys(testResults).length,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-xl text-white">⚡</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Style Extractor
              </h1>
              <p className="text-gray-600">AI-powered UI component analysis</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleRunTests}
              disabled={isAnalyzing || detectedComponents.length === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <span>🧪</span>
              <span className="font-medium">
                {isAnalyzing ? "Analyzing..." : "Run Tests"}
              </span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <span>💾</span>
              <span className="font-medium">Export JSON</span>
            </button>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex border-b border-gray-100 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-6 py-4 font-medium text-sm border-b-3 transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`px-2 py-1 text-xs rounded-full font-semibold ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Enhanced Results Banner */}
        {overallAccuracy > 0 && (
          <div
            className={`px-6 py-4 ${
              overallAccuracy >= 90
                ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-b border-green-200"
                : overallAccuracy >= 70
                ? "bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-800 border-b border-yellow-200"
                : "bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border-b border-red-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {overallAccuracy >= 90
                    ? "🎉"
                    : overallAccuracy >= 70
                    ? "⚡"
                    : "⚠️"}
                </span>
                <div>
                  <span className="font-bold text-lg">
                    Overall Test Accuracy: {overallAccuracy.toFixed(1)}%
                  </span>
                  <p className="text-sm opacity-80 mt-1">
                    {Object.keys(testResults).length} test cases completed with
                    detailed analysis
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-16 h-2 rounded-full overflow-hidden ${
                    overallAccuracy >= 90
                      ? "bg-green-200"
                      : overallAccuracy >= 70
                      ? "bg-yellow-200"
                      : "bg-red-200"
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      overallAccuracy >= 90
                        ? "bg-green-500"
                        : overallAccuracy >= 70
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${overallAccuracy}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">
                  {overallAccuracy.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Layout Grid */}
      <div className="grid grid-cols-12 min-h-screen">
        {/* Left Panel - Image Preview */}
        <div className="col-span-3 bg-white border-r border-gray-200 shadow-sm">
          <ImagePreview />
        </div>

        {/* Middle Panel - Enhanced Content */}
        <div className="col-span-6 bg-gradient-to-br from-slate-50 to-blue-50/30">
          {activeTab === "styles" && <MockComponents />}
          {activeTab === "components" && (
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🧩</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Component Analysis
                </h3>
              </div>

              {isAnalyzing ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <p className="text-gray-600 mt-6 text-lg">
                      Analyzing UI components...
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Using advanced computer vision algorithms
                    </p>
                  </div>
                </div>
              ) : detectedComponents.length > 0 ? (
                <div className="grid gap-6">
                  {detectedComponents.map((component, index) => (
                    <div
                      key={component.id}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                              component.type === "button"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                : component.type === "card"
                                ? "bg-gradient-to-r from-purple-500 to-purple-600"
                                : "bg-gradient-to-r from-gray-500 to-gray-600"
                            }`}
                          >
                            {component.type === "button"
                              ? "🔘"
                              : component.type === "card"
                              ? "🃏"
                              : "📦"}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg capitalize">
                              {component.type} Component
                            </h4>
                            <p className="text-gray-500 text-sm">
                              Component #{index + 1}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-600">
                            {component.bounds.width}×{component.bounds.height}px
                          </div>
                          <div className="text-xs text-gray-500">
                            Position: ({component.bounds.x},{" "}
                            {component.bounds.y})
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <span className="mr-2">📏</span>
                            Properties
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600">
                                Border Radius:
                              </span>
                              <span className="font-semibold text-gray-900">
                                {component.properties.borderRadius}px
                              </span>
                            </div>
                            <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600">Has Text:</span>
                              <span
                                className={`font-semibold ${
                                  component.hasText
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {component.hasText ? "✓ Yes" : "✗ No"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <span className="mr-2">🎨</span>
                            Color Palette
                          </h5>
                          {component.colors && (
                            <div className="flex flex-wrap gap-2">
                              {component.colors.palette
                                .slice(0, 4)
                                .map((color, colorIndex) => (
                                  <div key={colorIndex} className="text-center">
                                    <div
                                      className="w-8 h-8 rounded-lg shadow-md border-2 border-white"
                                      style={{ backgroundColor: color }}
                                      title={color}
                                    />
                                    <span className="text-xs text-gray-500 mt-1 block">
                                      {color.slice(0, 7)}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                    <span className="text-3xl text-gray-400">🔍</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Components Detected
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Upload a UI screenshot with clear component boundaries to
                    start the analysis.
                  </p>
                </div>
              )}
            </div>
          )}
          {activeTab === "testing" && (
            <div className="p-8">
              <TestingPanel />
            </div>
          )}
        </div>

        {/* Right Panel - Enhanced Controls */}
        <div className="col-span-3 bg-white border-l border-gray-200 shadow-sm">
          {activeTab === "styles" && <StyleEditor />}
          {activeTab === "components" && <ComponentsPanel />}
          {activeTab === "testing" && (
            <div className="h-full overflow-y-auto">
              <ToleranceControls />
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">⚙️</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Test Configuration
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <h4 className="font-semibold text-blue-900 flex items-center mb-3">
                      <span className="mr-2">📋</span>
                      Available Test Cases
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li className="flex items-center">
                        <span className="mr-2">🖥️</span>
                        Desktop Components (1920×1080)
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">🔘</span>
                        Button States (800×400)
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">📱</span>
                        Mobile Layout (375×667)
                      </li>
                    </ul>
                  </div>

                  {Object.keys(testResults).length > 0 && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <h4 className="font-semibold text-green-900 flex items-center mb-3">
                        <span className="mr-2">✅</span>
                        Test Results Summary
                      </h4>
                      <div className="text-sm text-green-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Completed Tests:</span>
                          <span className="font-bold">
                            {Object.keys(testResults).length}/3
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Average Accuracy:</span>
                          <span className="font-bold">
                            {overallAccuracy.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
