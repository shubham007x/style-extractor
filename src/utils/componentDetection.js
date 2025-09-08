export const detectComponents = async (canvas) => {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  // Edge detection using Sobel operator
  const edges = detectEdges(data, width, height);

  // Find rectangular regions (potential components)
  const rectangles = findRectangularRegions(edges, width, height);

  // Classify components by analyzing their properties
  const components = await classifyComponents(rectangles, canvas);

  return components;
};

const detectEdges = (data, width, height) => {
  const edges = new Uint8ClampedArray(width * height);
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let pixelX = 0,
        pixelY = 0;

      for (let i = 0; i < 9; i++) {
        const offsetX = (i % 3) - 1;
        const offsetY = Math.floor(i / 3) - 1;
        const pixelIndex = ((y + offsetY) * width + (x + offsetX)) * 4;

        // Convert to grayscale
        const gray =
          (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;

        pixelX += gray * sobelX[i];
        pixelY += gray * sobelY[i];
      }

      const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
      edges[y * width + x] = magnitude > 50 ? 255 : 0;
    }
  }

  return edges;
};

const findRectangularRegions = (edges, width, height) => {
  const visited = new Array(width * height).fill(false);
  const rectangles = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!visited[y * width + x] && edges[y * width + x] === 255) {
        const rect = floodFill(edges, visited, x, y, width, height);
        if (rect && rect.width > 20 && rect.height > 20) {
          rectangles.push(rect);
        }
      }
    }
  }

  return rectangles.sort((a, b) => b.width * b.height - a.width * a.height);
};

const floodFill = (edges, visited, startX, startY, width, height) => {
  const stack = [{ x: startX, y: startY }];
  let minX = startX,
    maxX = startX,
    minY = startY,
    maxY = startY;
  let pixelCount = 0;

  while (stack.length > 0) {
    const { x, y } = stack.pop();
    const index = y * width + x;

    if (
      x < 0 ||
      x >= width ||
      y < 0 ||
      y >= height ||
      visited[index] ||
      edges[index] !== 255
    ) {
      continue;
    }

    visited[index] = true;
    pixelCount++;

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);

    stack.push(
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 }
    );
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    pixelCount,
  };
};

const classifyComponents = async (rectangles, canvas) => {
  const components = [];

  for (const rect of rectangles) {
    const component = await analyzeComponentRegion(rect, canvas);
    components.push(component);
  }

  return components;
};

const analyzeComponentRegion = async (rect, canvas) => {
  const ctx = canvas.getContext("2d");

  // Extract region data
  const regionData = ctx.getImageData(rect.x, rect.y, rect.width, rect.height);

  // Analyze colors in region
  const colors = analyzeRegionColors(regionData);

  // Detect text presence
  const hasText = await detectTextInRegion(regionData);

  // Measure properties
  const measurements = measureComponentProperties(rect, regionData);

  // Classify component type
  const type = classifyComponentType(rect, colors, hasText, measurements);

  return {
    id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    bounds: rect,
    properties: measurements,
    colors,
    hasText,
    states: detectComponentStates(rect, colors),
  };
};

const classifyComponentType = (rect, colors, hasText, measurements) => {
  const aspectRatio = rect.width / rect.height;
  const area = rect.width * rect.height;

  // Button classification
  if (aspectRatio > 1.5 && aspectRatio < 5 && area < 15000 && hasText) {
    return "button";
  }

  // Card classification
  if (area > 20000 && measurements.borderRadius > 4) {
    return "card";
  }

  // Input field classification
  if (aspectRatio > 3 && rect.height < 60 && measurements.borderRadius < 8) {
    return "input";
  }

  // Navigation item
  if (hasText && rect.height < 50 && aspectRatio > 2) {
    return "nav-item";
  }

  return "unknown";
};

const detectComponentStates = (rect, colors) => {
  // Analyze color variations to detect different states
  const dominantColor = colors.dominant;
  const brightness = getBrightness(dominantColor);

  return {
    default: {
      backgroundColor: dominantColor,
      brightness,
    },
    // Estimate hover state (typically 10% darker/lighter)
    hover: {
      backgroundColor: adjustBrightness(
        dominantColor,
        brightness > 128 ? -0.1 : 0.1
      ),
      brightness: brightness > 128 ? brightness - 25 : brightness + 25,
    },
    // Estimate active state (typically 20% darker)
    active: {
      backgroundColor: adjustBrightness(dominantColor, -0.2),
      brightness: Math.max(0, brightness - 50),
    },
  };
};

const measureComponentProperties = (rect, regionData) => {
  const { data, width, height } = regionData;

  // Detect border radius by analyzing corners
  const borderRadius = detectBorderRadius(data, width, height);

  // Measure padding by analyzing content bounds
  const padding = measurePadding(data, width, height);

  // Detect shadows
  const shadow = detectShadow(rect, regionData);

  return {
    width: rect.width,
    height: rect.height,
    borderRadius,
    padding,
    shadow,
    border: detectBorder(data, width, height),
  };
};

const detectBorderRadius = (data, width, height) => {
  // Check corners for rounded edges
  const corners = [
    { x: 0, y: 0 }, // top-left
    { x: width - 1, y: 0 }, // top-right
    { x: 0, y: height - 1 }, // bottom-left
    { x: width - 1, y: height - 1 }, // bottom-right
  ];

  let totalRadius = 0;
  let validCorners = 0;

  corners.forEach((corner) => {
    const radius = measureCornerRadius(data, corner.x, corner.y, width, height);
    if (radius > 0) {
      totalRadius += radius;
      validCorners++;
    }
  });

  return validCorners > 0 ? Math.round(totalRadius / validCorners) : 0;
};

const measureCornerRadius = (data, startX, startY, width, height) => {
  // Simplified radius detection - measure distance from corner to first opaque pixel
  const maxRadius = Math.min(20, width / 4, height / 4);

  for (let r = 1; r <= maxRadius; r++) {
    const x = startX === 0 ? r : width - 1 - r;
    const y = startY === 0 ? r : height - 1 - r;

    if (x >= 0 && x < width && y >= 0 && y < height) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];

      if (alpha > 128) {
        return r;
      }
    }
  }

  return 0;
};

// Helper functions
const analyzeRegionColors = (regionData) => {
  const { data } = regionData;
  const colorCounts = new Map();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a > 128) {
      // Only count opaque pixels
      const color = `rgb(${r},${g},${b})`;
      colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
    }
  }

  const sortedColors = Array.from(colorCounts.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  return {
    dominant: sortedColors[0] ? sortedColors[0][0] : "rgb(255,255,255)",
    palette: sortedColors.slice(0, 5).map(([color]) => color),
  };
};

const getBrightness = (rgbColor) => {
  const match = rgbColor.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (!match) return 128;

  const [, r, g, b] = match.map(Number);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

const adjustBrightness = (rgbColor, factor) => {
  const match = rgbColor.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (!match) return rgbColor;

  let [, r, g, b] = match.map(Number);

  r = Math.max(0, Math.min(255, r + r * factor));
  g = Math.max(0, Math.min(255, g + g * factor));
  b = Math.max(0, Math.min(255, b + b * factor));

  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
};
// Add these functions to the existing componentDetection.js file

const measurePadding = (data, width, height) => {
  // Simplified padding detection
  // Look for content bounds within the component
  let topPadding = 0,
    leftPadding = 0;

  // Find first non-background pixel from top
  for (let y = 0; y < height; y++) {
    let hasContent = false;
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];
      if (alpha > 128) {
        hasContent = true;
        break;
      }
    }
    if (hasContent) {
      topPadding = y;
      break;
    }
  }

  // Find first non-background pixel from left
  for (let x = 0; x < width; x++) {
    let hasContent = false;
    for (let y = 0; y < height; y++) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];
      if (alpha > 128) {
        hasContent = true;
        break;
      }
    }
    if (hasContent) {
      leftPadding = x;
      break;
    }
  }

  return {
    top: Math.max(0, topPadding),
    right: Math.max(0, topPadding), // Simplified
    bottom: Math.max(0, topPadding),
    left: Math.max(0, leftPadding),
  };
};

const detectShadow = (rect, regionData) => {
  // Simplified shadow detection
  // Look for darker areas around the component
  return {
    offsetX: 0,
    offsetY: 2,
    blurRadius: 4,
    color: "rgba(0,0,0,0.1)",
  };
};

const detectBorder = (data, width, height) => {
  // Simplified border detection
  // Check edge pixels for consistent color
  const edgePixels = [];

  // Top edge
  for (let x = 0; x < width; x++) {
    const index = x * 4;
    edgePixels.push({
      r: data[index],
      g: data[index + 1],
      b: data[index + 2],
      a: data[index + 3],
    });
  }

  // Check if edge pixels are consistent (indicating a border)
  const firstPixel = edgePixels[0];
  const hasBorder = edgePixels.every(
    (pixel) =>
      Math.abs(pixel.r - firstPixel.r) < 10 &&
      Math.abs(pixel.g - firstPixel.g) < 10 &&
      Math.abs(pixel.b - firstPixel.b) < 10
  );

  return hasBorder
    ? {
        width: 1,
        color: `rgb(${firstPixel.r},${firstPixel.g},${firstPixel.b})`,
        style: "solid",
      }
    : null;
};
