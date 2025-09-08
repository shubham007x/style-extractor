import Tesseract from "tesseract.js";

export const detectTextInRegion = async (regionData) => {
  try {
    // Create a temporary canvas for the region
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = regionData.width;
    canvas.height = regionData.height;

    ctx.putImageData(regionData, 0, 0);

    const result = await Tesseract.recognize(canvas, "eng", {
      logger: () => {}, // Suppress logs for region detection
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ",
    });


    const hasText =
      result.data.text.trim().length > 0 && result.data.confidence > 60;
    return hasText;
  } catch (error) {
    console.warn("Text detection in region failed:", error);
    return false;
  }
};

export const detectText = async (canvas) => {
  try {
    const result = await Tesseract.recognize(canvas, "eng", {
      logger: (m) => console.log(m),
    });

    // Analyze detected text for typography patterns
    const text = result.data.text;
    const words = result.data.words;

    // Estimate font sizes based on bounding boxes
    const fontSizes = words
      .filter((word) => word.confidence > 60)
      .map((word) => word.bbox.h0 - word.bbox.h1)
      .sort((a, b) => b - a);

    const avgFontSize =
      fontSizes.length > 0
        ? fontSizes.reduce((sum, size) => sum + size, 0) / fontSizes.length
        : 16;

    return {
      fontFamily: {
        primary: "Inter, system-ui, sans-serif",
        secondary: "Georgia, serif",
        mono: "Fira Code, monospace",
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: `${Math.round(avgFontSize)}px`,
        lg: `${Math.round(avgFontSize * 1.125)}px`,
        xl: `${Math.round(avgFontSize * 1.25)}px`,
        "2xl": `${Math.round(avgFontSize * 1.5)}px`,
        "3xl": `${Math.round(avgFontSize * 1.875)}px`,
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      lineHeight: {
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.75",
      },
      letterSpacing: {
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em",
      },
    };
  } catch (error) {
    console.error("Text detection failed:", error);
    return {
      fontFamily: {
        primary: "Inter, system-ui, sans-serif",
        secondary: "Georgia, serif",
        mono: "Fira Code, monospace",
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "30px",
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      lineHeight: {
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.75",
      },
      letterSpacing: {
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em",
      },
    };
  }
};
