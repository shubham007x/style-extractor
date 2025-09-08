import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useDispatch } from 'react-redux';
import { updateStyle } from '../features/styles/stylesSlice';

const ColorPicker = ({ category, property, value, semanticName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleColorChange = (color) => {
    dispatch(updateStyle({ category, property, value: color }));
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded border-2 border-gray-300 shadow-sm"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => handleColorChange(e.target.value)}
          className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">
            <HexColorPicker color={value} onChange={handleColorChange} />
          </div>
        </>
      )}
    </div>
  );
};

export default ColorPicker;
