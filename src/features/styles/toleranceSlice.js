import { createSlice } from '@reduxjs/toolkit';

const toleranceSlice = createSlice({
  name: 'tolerance',
  initialState: {
    global: 10,
    colors: 15,
    spacing: 20,
    typography: 10,
    borderRadius: 25,
    components: {},
    validationResults: {}
  },
  reducers: {
    setGlobalTolerance: (state, action) => {
      state.global = action.payload;
    },
    setCategoryTolerance: (state, action) => {
      const { category, value } = action.payload;
      state[category] = value;
    },
    setComponentTolerance: (state, action) => {
      const { componentId, property, value } = action.payload;
      if (!state.components[componentId]) {
        state.components[componentId] = {};
      }
      state.components[componentId][property] = value;
    },
    validateTolerance: (state, action) => {
      const { componentId, property, extractedValue, expectedValue } = action.payload;
      const tolerance = state.components[componentId]?.[property] || state[property] || state.global;
      
      const deviation = Math.abs(extractedValue - expectedValue) / expectedValue * 100;
      const isValid = deviation <= tolerance;
      
      if (!state.validationResults[componentId]) {
        state.validationResults[componentId] = {};
      }
      
      state.validationResults[componentId][property] = {
        isValid,
        deviation,
        tolerance,
        extractedValue,
        expectedValue
      };
    }
  }
});

export const { 
  setGlobalTolerance, 
  setCategoryTolerance, 
  setComponentTolerance,
  validateTolerance 
} = toleranceSlice.actions;

export default toleranceSlice.reducer;
