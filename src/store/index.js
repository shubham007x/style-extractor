import { configureStore } from '@reduxjs/toolkit';
import imageReducer from '../features/images/imageSlice';
import stylesReducer from '../features/styles/stylesSlice';
import componentsReducer from '../features/components/componentsSlice';
import toleranceReducer from '../features/styles/toleranceSlice';
import testingReducer from '../features/testing/testingSlice';

export const store = configureStore({
  reducer: {
    images: imageReducer,
    styles: stylesReducer,
    components: componentsReducer,
    tolerance: toleranceReducer,
    testing: testingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'images/uploadImage', 
          'components/detectComponents',
          'testing/runTestCase'
        ],
        ignoredActionsPaths: [
          'payload.file', 
          'payload.canvas',
          'payload.imageData'
        ],
        ignoredPaths: [
          'images.currentImage.file', 
          'images.currentImage.canvas',
          'components.detectedComponents'
        ],
      },
    }),
});
