import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { testCases, validateTestCase } from '../../utils/testCases';

export const runTestCase = createAsyncThunk(
  'testing/runTestCase',
  async ({ testCaseId, extractedComponents }) => {
    const testCase = testCases.find(tc => tc.id === testCaseId);
    if (!testCase) {
      throw new Error(`Test case ${testCaseId} not found`);
    }
    
    const results = await validateTestCase(testCase, extractedComponents);
    return { testCaseId, results };
  }
);

export const runAllTestCases = createAsyncThunk(
  'testing/runAllTestCases',
  async ({ allExtractedComponents }) => {
    const results = [];
    
    for (const testCase of testCases) {
      const extractedComponents = allExtractedComponents[testCase.id] || [];
      const testResults = await validateTestCase(testCase, extractedComponents);
      results.push({ testCase: testCase.id, results: testResults });
    }
    
    return results;
  }
);

const testingSlice = createSlice({
  name: 'testing',
  initialState: {
    testCases: testCases,
    testResults: {},
    overallAccuracy: 0,
    isRunning: false,
    completedTests: 0,
    totalTests: testCases.length
  },
  reducers: {
    clearTestResults: (state) => {
      state.testResults = {};
      state.overallAccuracy = 0;
      state.completedTests = 0;
    },
    updateTestProgress: (state, action) => {
      state.completedTests = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(runTestCase.pending, (state) => {
        state.isRunning = true;
      })
      .addCase(runTestCase.fulfilled, (state, action) => {
        const { testCaseId, results } = action.payload;
        state.testResults[testCaseId] = results;
        state.completedTests++;
        state.isRunning = false;
        
        // Calculate overall accuracy
        const allResults = Object.values(state.testResults);
        if (allResults.length > 0) {
          const totalAccuracy = allResults.reduce((sum, result) => sum + result.accuracy, 0);
          state.overallAccuracy = totalAccuracy / allResults.length;
        }
      })
      .addCase(runTestCase.rejected, (state) => {
        state.isRunning = false;
      })
      .addCase(runAllTestCases.fulfilled, (state, action) => {
        action.payload.forEach(({ testCase, results }) => {
          state.testResults[testCase] = results;
        });
        
        state.completedTests = state.totalTests;
        state.isRunning = false;
        
        // Calculate overall accuracy
        const allResults = Object.values(state.testResults);
        if (allResults.length > 0) {
          const totalAccuracy = allResults.reduce((sum, result) => sum + result.accuracy, 0);
          state.overallAccuracy = totalAccuracy / allResults.length;
        }
      });
  }
});

export const { clearTestResults, updateTestProgress } = testingSlice.actions;
export default testingSlice.reducer;
