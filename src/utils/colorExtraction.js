import ColorThief from 'colorthief';

export const extractColors = async (canvas, tolerance = 10) => {
  return new Promise((resolve) => {
    const colorThief = new ColorThief();
    
    try {
      // Get dominant colors
      const dominantColor = colorThief.getColor(canvas);
      const palette = colorThief.getPalette(canvas, 8);
      
      // Convert RGB arrays to hex
      const rgbToHex = ([r, g, b]) => 
        '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
      
      // Analyze colors for semantic meaning
      const colors = {
        primary: rgbToHex(dominantColor),
        secondary: palette.length > 1 ? rgbToHex(palette[1]) : '#6366f1',
        accent: palette.length > 2 ? rgbToHex(palette[2]) : '#f59e0b',
        background: '#ffffff',
        surface: '#f9fafb',
        text: {
          primary: '#111827',
          secondary: '#6b7280',
          muted: '#9ca3af'
        },
        border: '#e5e7eb',
        palette: palette.map(color => rgbToHex(color))
      };
      
      resolve(colors);
    } catch (error) {
      console.error('Color extraction failed:', error);
      resolve({
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f9fafb',
        text: {
          primary: '#111827',
          secondary: '#6b7280',
          muted: '#9ca3af'
        },
        border: '#e5e7eb',
        palette: ['#3b82f6', '#6366f1', '#f59e0b']
      });
    }
  });
};

export const getLuminance = (hex) => {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};
