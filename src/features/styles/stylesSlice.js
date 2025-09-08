import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { extractColors } from "../../utils/colorExtraction";
import { detectText } from "../../utils/textDetection";
import { analyzeSpacing } from "../../utils/spacingAnalysis";

export const extractStyles = createAsyncThunk(
  "styles/extractStyles",
  async ({ canvas, tolerance = 10 }) => {
    const colors = await extractColors(canvas, tolerance);
    const typography = await detectText(canvas);
    const spacing = await analyzeSpacing(canvas);

    return {
      colors,
      typography,
      spacing,
      shadows: {
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        dropShadow: "drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07))",
      },
      borderRadius: {
        small: "4px",
        medium: "8px",
        large: "12px",
      },
    };
  }
);

const stylesSlice = createSlice({
  name: "styles",
  initialState: {
    extractedStyles: {},
    editedStyles: {},
    tolerance: 10,
    isExtracting: false,
    semanticNames: {},
  },
  reducers: {
    updateStyle: (state, action) => {
      const { category, property, value } = action.payload;
      if (!state.editedStyles[category]) {
        state.editedStyles[category] = {};
      }
      state.editedStyles[category][property] = value;
    },
    updateSemanticName: (state, action) => {
      const { category, property, name } = action.payload;
      const key = `${category}.${property}`;
      state.semanticNames[key] = name;
    },
    setTolerance: (state, action) => {
      state.tolerance = action.payload;
    },
    resetStyles: (state) => {
      state.extractedStyles = {};
      state.editedStyles = {};
      state.semanticNames = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(extractStyles.pending, (state) => {
        state.isExtracting = true;
      })
      .addCase(extractStyles.fulfilled, (state, action) => {
        state.isExtracting = false;
        state.extractedStyles = action.payload;
        state.editedStyles = JSON.parse(JSON.stringify(action.payload));
      })
      .addCase(extractStyles.rejected, (state) => {
        state.isExtracting = false;
      });
  },
});

export const { updateStyle, updateSemanticName, setTolerance, resetStyles } =
  stylesSlice.actions;
export default stylesSlice.reducer;
