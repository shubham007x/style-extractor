import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { detectComponents } from "../../utils/componentDetection";

export const analyzeComponents = createAsyncThunk(
  "components/analyzeComponents",
  async ({ canvas, tolerance }) => {
    try {
      // Actually analyze the canvas instead of returning mock data
      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Simple but working component detection
      const components = await analyzeImageForComponents(canvas, imageData);

      return {
        components,
        analysis: {
          totalComponents: components.length,
          componentTypes: getComponentTypeCounts(components),
          averageSize: calculateAverageComponentSize(components),
          detectionConfidence: calculateDetectionConfidence(components),
        },
      };
    } catch (error) {
      console.error("Component analysis failed:", error);
      return {
        components: [],
        analysis: {
          totalComponents: 0,
          componentTypes: {},
          averageSize: { width: 0, height: 0 },
          detectionConfidence: 0,
        },
      };
    }
  }
);

// Simplified but functional component detection
const analyzeImageForComponents = async (canvas, imageData) => {
  const components = [];
  const { width, height, data } = imageData;

  // Detect rectangular regions that could be components
  const regions = findComponentRegions(data, width, height);

  regions.forEach((region, index) => {
    const component = {
      id: `detected_${index}`,
      type: classifyRegion(region),
      bounds: region,
      properties: {
        width: region.width,
        height: region.height,
        borderRadius: estimateBorderRadius(region),
        padding: { top: 8, right: 12, bottom: 8, left: 12 },
      },
      colors: {
        dominant: extractDominantColor(data, region, width),
        palette: extractColorPalette(data, region, width),
      },
      hasText: region.width > 50 && region.height > 20, // Simple heuristic
      confidence: calculateRegionConfidence(region),
    };

    components.push(component);
  });

  return components.filter((c) => c.confidence > 0.3); // Filter low confidence detections
};

const findComponentRegions = (data, width, height) => {
  const regions = [];
  const visited = new Array(width * height).fill(false);
  const minSize = 20; // Minimum component size

  for (let y = 0; y < height - minSize; y += 10) {
    // Sample every 10 pixels
    for (let x = 0; x < width - minSize; x += 10) {
      const index = y * width + x;

      if (!visited[index]) {
        const region = detectRectangularRegion(
          data,
          x,
          y,
          width,
          height,
          visited
        );

        if (region && region.width >= minSize && region.height >= minSize) {
          regions.push(region);
        }
      }
    }
  }

  return regions;
};

const detectRectangularRegion = (
  data,
  startX,
  startY,
  width,
  height,
  visited
) => {
  // Simple rectangle detection based on color similarity
  const startIndex = startY * width + startX;
  const startColor = {
    r: data[startIndex * 4],
    g: data[startIndex * 4 + 1],
    b: data[startIndex * 4 + 2],
    a: data[startIndex * 4 + 3],
  };

  if (startColor.a < 128) return null; // Skip transparent areas

  let maxWidth = 0;
  let maxHeight = 0;

  // Find width
  for (let x = startX; x < Math.min(startX + 200, width); x++) {
    const index = startY * width + x;
    const color = {
      r: data[index * 4],
      g: data[index * 4 + 1],
      b: data[index * 4 + 2],
      a: data[index * 4 + 3],
    };

    if (isColorSimilar(startColor, color, 30)) {
      maxWidth = x - startX + 1;
    } else {
      break;
    }
  }

  // Find height
  for (let y = startY; y < Math.min(startY + 200, height); y++) {
    const index = y * width + startX;
    const color = {
      r: data[index * 4],
      g: data[index * 4 + 1],
      b: data[index * 4 + 2],
      a: data[index * 4 + 3],
    };

    if (isColorSimilar(startColor, color, 30)) {
      maxHeight = y - startY + 1;
    } else {
      break;
    }
  }

  if (maxWidth >= 20 && maxHeight >= 20) {
    // Mark region as visited
    for (let y = startY; y < startY + maxHeight; y++) {
      for (let x = startX; x < startX + maxWidth; x++) {
        if (x < width && y < height) {
          visited[y * width + x] = true;
        }
      }
    }

    return {
      x: startX,
      y: startY,
      width: maxWidth,
      height: maxHeight,
    };
  }

  return null;
};

const isColorSimilar = (color1, color2, threshold) => {
  const rDiff = Math.abs(color1.r - color2.r);
  const gDiff = Math.abs(color1.g - color2.g);
  const bDiff = Math.abs(color1.b - color2.b);

  return (rDiff + gDiff + bDiff) / 3 <= threshold;
};

const classifyRegion = (region) => {
  const aspectRatio = region.width / region.height;
  const area = region.width * region.height;

  // Button classification
  if (
    aspectRatio > 1.5 &&
    aspectRatio < 6 &&
    area < 20000 &&
    region.height < 60
  ) {
    return "button";
  }

  // Card classification
  if (area > 15000 && aspectRatio < 3) {
    return "card";
  }

  // Input field classification
  if (aspectRatio > 3 && region.height < 50) {
    return "input";
  }

  // Navigation item
  if (aspectRatio > 2 && region.height < 40) {
    return "nav-item";
  }

  return "container";
};

const extractDominantColor = (data, region, width) => {
  const colors = new Map();

  for (
    let y = region.y;
    y < region.y + region.height && y < region.y + 50;
    y += 2
  ) {
    for (
      let x = region.x;
      x < region.x + region.width && x < region.x + 50;
      x += 2
    ) {
      const index = (y * width + x) * 4;
      if (index < data.length - 3) {
        const color = `rgb(${data[index]},${data[index + 1]},${
          data[index + 2]
        })`;
        colors.set(color, (colors.get(color) || 0) + 1);
      }
    }
  }

  let dominantColor = "rgb(128,128,128)";
  let maxCount = 0;

  for (const [color, count] of colors) {
    if (count > maxCount) {
      maxCount = count;
      dominantColor = color;
    }
  }

  return dominantColor;
};

const extractColorPalette = (data, region, width) => {
  // Simple palette extraction - return top 3 colors
  const colors = new Map();

  for (
    let y = region.y;
    y < Math.min(region.y + region.height, region.y + 30);
    y += 3
  ) {
    for (
      let x = region.x;
      x < Math.min(region.x + region.width, region.x + 30);
      x += 3
    ) {
      const index = (y * width + x) * 4;
      if (index < data.length - 3) {
        const color = `rgb(${data[index]},${data[index + 1]},${
          data[index + 2]
        })`;
        colors.set(color, (colors.get(color) || 0) + 1);
      }
    }
  }

  return Array.from(colors.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([color]) => color);
};

const estimateBorderRadius = (region) => {
  // Simple heuristic based on size
  if (region.width < 100 && region.height < 50) return 8;
  if (region.width < 200 && region.height < 100) return 12;
  return 16;
};

const calculateRegionConfidence = (region) => {
  const aspectRatio = region.width / region.height;
  const area = region.width * region.height;

  // Higher confidence for typical UI component ratios and sizes
  let confidence = 0.5;

  if (aspectRatio > 0.5 && aspectRatio < 10) confidence += 0.2;
  if (area > 400 && area < 50000) confidence += 0.2;
  if (region.width > 30 && region.height > 20) confidence += 0.1;

  return Math.min(confidence, 1.0);
};

// Helper functions
const getComponentTypeCounts = (components) => {
  const counts = {};
  components.forEach((component) => {
    counts[component.type] = (counts[component.type] || 0) + 1;
  });
  return counts;
};

const calculateAverageComponentSize = (components) => {
  if (components.length === 0) return { width: 0, height: 0 };

  const totals = components.reduce(
    (acc, component) => ({
      width: acc.width + component.bounds.width,
      height: acc.height + component.bounds.height,
    }),
    { width: 0, height: 0 }
  );

  return {
    width: Math.round(totals.width / components.length),
    height: Math.round(totals.height / components.length),
  };
};

const calculateDetectionConfidence = (components) => {
  if (components.length === 0) return 0;

  const totalConfidence = components.reduce(
    (sum, comp) => sum + comp.confidence,
    0
  );
  return (totalConfidence / components.length) * 100;
};

const componentsSlice = createSlice({
  name: "components",
  initialState: {
    detectedComponents: [],
    selectedComponent: null,
    analysis: null,
    isAnalyzing: false,
    error: null,
  },
  reducers: {
    selectComponent: (state, action) => {
      state.selectedComponent = action.payload;
    },
    clearComponents: (state) => {
      state.detectedComponents = [];
      state.selectedComponent = null;
      state.analysis = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeComponents.pending, (state) => {
        state.isAnalyzing = true;
        state.error = null;
      })
      .addCase(analyzeComponents.fulfilled, (state, action) => {
        state.isAnalyzing = false;
        state.detectedComponents = action.payload.components;
        state.analysis = action.payload.analysis;
      })
      .addCase(analyzeComponents.rejected, (state, action) => {
        state.isAnalyzing = false;
        state.error = action.error.message;
      });
  },
});

export const { selectComponent, clearComponents } = componentsSlice.actions;
export default componentsSlice.reducer;

