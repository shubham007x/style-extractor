import React from 'react';
import { useSelector } from 'react-redux';

const ImagePreview = () => {
  const { currentImage, images } = useSelector(state => state.images);

  if (!currentImage) return null;

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Original Image</h3>
      <div className="space-y-4">
        <img
          src={currentImage.url}
          alt="Uploaded screenshot"
          className="w-full rounded-lg shadow-sm border border-gray-200"
        />
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Dimensions:</strong> {currentImage.dimensions.width} × {currentImage.dimensions.height}px</p>
          <p><strong>File:</strong> {currentImage.file.name}</p>
          <p><strong>Size:</strong> {(currentImage.file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        
        {images.length > 1 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Other Images</h4>
            <div className="grid grid-cols-2 gap-2">
              {images.filter(img => img.id !== currentImage.id).map(image => (
                <img
                  key={image.id}
                  src={image.url}
                  alt="Screenshot"
                  className="w-full h-20 object-cover rounded border border-gray-200 cursor-pointer hover:border-blue-500"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
