import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { processImage } from '../features/images/imageSlice';
import { extractStyles } from '../features/styles/stylesSlice';
import { testImages } from '../data/testImages';

const ImageUpload = () => {
  const dispatch = useDispatch();
  const { isProcessing } = useSelector(state => state.images);
  const { isExtracting } = useSelector(state => state.styles);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingTestImage, setIsLoadingTestImage] = useState(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  }, []);

  const handleFiles = async (files) => {
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
    );

    for (const file of imageFiles) {
      const result = await dispatch(processImage(file));
      if (result.payload) {
        dispatch(extractStyles({ 
          canvas: result.payload.canvas,
          tolerance: 10 
        }));
      }
    }
  };

  // Handle test image loading
  const handleTestImage = async (testImage) => {
    setIsLoadingTestImage(testImage.id);
    
    try {
      // Fetch the image from URL
      const response = await fetch(testImage.url);
      const blob = await response.blob();
      
      // Create a File object from the blob
      const file = new File([blob], `${testImage.id}.jpg`, { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      // Process the file as if it was uploaded
      const result = await dispatch(processImage(file));
      if (result.payload) {
        dispatch(extractStyles({ 
          canvas: result.payload.canvas,
          tolerance: 10 
        }));
      }
    } catch (error) {
      console.error('Failed to load test image:', error);
      // Fallback: create a simple test canvas
      await createFallbackTestImage(testImage);
    } finally {
      setIsLoadingTestImage(null);
    }
  };

  // Create a simple fallback test image using canvas
  const createFallbackTestImage = async (testImage) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    // Create a simple UI mockup
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, 80);
    ctx.fillStyle = '#1f2937';
    ctx.font = '24px Arial';
    ctx.fillText('Sample UI Interface', 30, 50);

    // Card component
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(50, 120, 300, 200, 12);
    ctx.fill();
    ctx.fillStyle = '#374151';
    ctx.font = '18px Arial';
    ctx.fillText('Card Title', 70, 160);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('This is sample content', 70, 190);

    // Button
    ctx.fillStyle = '#3b82f6';
    ctx.roundRect(70, 240, 120, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText('Button', 115, 265);

    // Create file from canvas
    canvas.toBlob(async (blob) => {
      const file = new File([blob], `${testImage.id}-fallback.png`, { 
        type: 'image/png',
        lastModified: Date.now()
      });
      
      const result = await dispatch(processImage(file));
      if (result.payload) {
        dispatch(extractStyles({ 
          canvas: result.payload.canvas,
          tolerance: 10 
        }));
      }
    });
  };

  const dragHandlers = {
    onDragOver: (e) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragEnter: (e) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: (e) => {
      e.preventDefault();
      setIsDragging(false);
    },
    onDrop: handleDrop
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        {...dragHandlers}
        className={`relative border-3 border-dashed rounded-3xl p-16 text-center transition-all duration-300 ${
          isDragging 
            ? 'border-blue-400 bg-blue-50 scale-105 shadow-2xl' 
            : 'border-gray-300 bg-white/80 hover:border-gray-400 hover:bg-white shadow-xl'
        }`}
      >
        <div className="space-y-8">
          {/* Upload Icon */}
          <div className="flex justify-center">
            <div className={`w-32 h-32 rounded-3xl flex items-center justify-center transition-all duration-300 ${
              isDragging 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 scale-110' 
                : 'bg-gradient-to-r from-gray-100 to-gray-200'
            }`}>
              <span className={`text-6xl transition-colors duration-300 ${
                isDragging ? 'text-white' : 'text-gray-400'
              }`}>
                {isDragging ? '🚀' : '📷'}
              </span>
            </div>
          </div>

          {/* Upload Text */}
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {isDragging ? 'Drop your images here!' : 'Upload UI Screenshots'}
            </h3>
            <div className="space-y-2">
              <p className="text-xl text-gray-600">
                Drag and drop your design images, or click to browse
              </p>
              <p className="text-sm text-gray-500 flex items-center justify-center space-x-4">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  PNG
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  JPEG
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  WEBP
                </span>
              </p>
            </div>
          </div>

          {/* Upload Button */}
          <div>
            <label className="inline-flex items-center space-x-3 px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold text-lg">
              <span>🎯</span>
              <span>Choose Files</span>
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>

          {/* Working Test Images */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-gray-700 text-lg font-semibold mb-6">Or try with sample images:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {testImages.map((testImage) => (
                <div
                  key={testImage.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl text-white">
                      {testImage.name.charAt(0)}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{testImage.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{testImage.description}</p>
                    
                    <button
                      onClick={() => handleTestImage(testImage)}
                      disabled={isLoadingTestImage === testImage.id}
                      className={`w-full px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                        isLoadingTestImage === testImage.id
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:scale-105'
                      }`}
                    >
                      {isLoadingTestImage === testImage.id ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                          <span>Loading...</span>
                        </div>
                      ) : (
                        'Try This Sample'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Processing Status */}
      {(isProcessing || isExtracting) && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4 px-8 py-4 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="relative">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">
                {isProcessing ? 'Processing your image...' : 'Extracting design tokens...'}
              </p>
              <p className="text-sm text-gray-600">
                {isProcessing ? 'Analyzing image structure' : 'Using AI to detect components'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
