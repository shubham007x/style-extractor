import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setGlobalTolerance,
  setCategoryTolerance,
  setComponentTolerance,
} from "../features/styles/toleranceSlice";

const ToleranceControls = () => {
  const dispatch = useDispatch();
  const tolerance = useSelector((state) => state.tolerance);
  const { selectedComponent } = useSelector((state) => state.components);

  const handleGlobalToleranceChange = (value) => {
    dispatch(setGlobalTolerance(parseInt(value)));
  };

  const handleCategoryToleranceChange = (category, value) => {
    dispatch(setCategoryTolerance({ category, value: parseInt(value) }));
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Tolerance Settings
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Global Tolerance
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="1"
              max="50"
              value={tolerance.global}
              onChange={(e) => handleGlobalToleranceChange(e.target.value)}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12">
              {tolerance.global}%
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Colors
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="1"
              max="50"
              value={tolerance.colors}
              onChange={(e) =>
                handleCategoryToleranceChange("colors", e.target.value)
              }
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12">
              {tolerance.colors}%
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spacing
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="1"
              max="50"
              value={tolerance.spacing}
              onChange={(e) =>
                handleCategoryToleranceChange("spacing", e.target.value)
              }
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12">
              {tolerance.spacing}%
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Border Radius
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="1"
              max="50"
              value={tolerance.borderRadius}
              onChange={(e) =>
                handleCategoryToleranceChange("borderRadius", e.target.value)
              }
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12">
              {tolerance.borderRadius}%
            </span>
          </div>
        </div>
      </div>

      {selectedComponent && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Component-Specific Tolerance: {selectedComponent.type}
          </h4>
          <p className="text-xs text-blue-700">
            Adjust tolerance settings for individual component properties
          </p>
        </div>
      )}
    </div>
  );
};

export default ToleranceControls;
