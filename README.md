# Style Extractor

A powerful React application that automatically extracts design tokens from UI screenshots using advanced image analysis. Transform your design screenshots into structured design systems with colors, typography, spacing, components, shadows, and border radius values.

![Style Extractor](https://img.shields.io/badge/React-19.1.1-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.2-purple) ![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.9.0-orange) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.13-cyan)

## ✨ Features

### 🎨 Advanced Color Analysis
- **Dominant Color Extraction**: Automatically identifies and extracts the most prominent colors from your UI screenshots
- **Color Frequency Analysis**: Analyzes color usage patterns and percentages
- **Smart Color Grouping**: Groups similar colors to reduce redundancy and create cohesive palettes
- **Color Naming**: Generates meaningful names for extracted colors (e.g., "Primary Blue", "Accent Red")

### 📝 Typography Detection
- **Text Region Detection**: Uses computer vision to identify text areas in screenshots
- **Font Size Estimation**: Estimates font sizes based on detected text regions
- **Typography Hierarchy**: Analyzes and categorizes different text styles (headings, body text, captions)
- **Font Weight Analysis**: Detects font weights and suggests appropriate CSS values

### 📏 Spacing & Layout Analysis
- **Component Detection**: Identifies UI components like buttons, cards, headers, and sidebars
- **Spacing Pattern Recognition**: Analyzes gaps between elements to create consistent spacing systems
- **Grid System Detection**: Recognizes layout patterns and spacing grids
- **Visual Effects Analysis**: Detects shadows, borders, and other visual effects

### 🧩 Component Recognition
- **UI Component Classification**: Automatically categorizes detected elements (buttons, cards, icons, etc.)
- **Property Extraction**: Extracts CSS properties for each component (padding, border-radius, colors)
- **Component Variants**: Identifies different states and variants of components
- **Style Token Generation**: Creates reusable design tokens for components

### 🎯 Smart Tolerances
- **Configurable Analysis Settings**: Adjust sensitivity for color, spacing, typography, and border-radius detection
- **Noise Reduction**: Filters out irrelevant data and focuses on meaningful design elements
- **Accuracy Controls**: Fine-tune analysis parameters for different types of designs

### 📤 Multiple Export Formats
- **JSON Export**: Complete design system data with metadata
- **CSS Variables**: Ready-to-use CSS custom properties
- **SCSS Variables**: Sass-compatible variable definitions
- **Tailwind Config**: Integration-ready Tailwind CSS configuration
- **Clipboard Support**: Copy design tokens directly to clipboard

## 🚀 Technologies Used

- **Frontend Framework**: React 19.1.1 with Hooks and Context
- **Build Tool**: Vite 7.1.2 for fast development and optimized builds
- **State Management**: Redux Toolkit 2.9.0 for predictable state management
- **Styling**: Tailwind CSS 4.1.13 for utility-first CSS framework
- **Icons**: Lucide React for consistent iconography
- **Image Processing**:
  - ColorThief 2.6.0 for color palette extraction
  - Canvas API for pixel-level image analysis
  - Tesseract.js 6.0.1 for OCR and text detection
- **File Handling**: File Saver 2.0.5 for downloading exported files
- **UI Components**: Custom component library with accessibility support

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Modern web browser with Canvas API support

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/style-extractor.git
   cd style-extractor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📖 Usage

### Basic Workflow

1. **Upload Images**: Drag and drop or click to upload UI screenshots (PNG, JPEG, WEBP)
2. **Automatic Analysis**: The app analyzes your images using computer vision algorithms
3. **Review Results**: Examine extracted colors, typography, spacing, and components
4. **Edit Tokens**: Fine-tune extracted values and add custom names
5. **Export**: Download your design system in your preferred format

### Advanced Features

#### Tolerance Settings
Adjust analysis sensitivity in the extraction view:
- **Color Tolerance**: Controls how similar colors are grouped (1-10)
- **Spacing Tolerance**: Affects spacing pattern detection sensitivity
- **Typography Tolerance**: Influences text region detection accuracy
- **Border Radius Tolerance**: Controls corner radius detection precision

#### Component Analysis
The app automatically detects:
- Button elements and their variants
- Card layouts and containers
- Navigation components
- Form elements
- Icon placements

#### Export Options
Choose from multiple formats:
- **JSON**: Complete design system with metadata
- **CSS Variables**: `--color-primary: #007bff;`
- **SCSS**: `$color-primary: #007bff;`
- **Tailwind**: `colors: { primary: '#007bff' }`

## 🏗️ Project Structure

```
style-extractor/
├── public/
│   ├── vite.svg
│   └── ... (static assets)
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── MockComponents.jsx
│   │   ├── ColorPicker.jsx
│   │   ├── ComponentsPanel.jsx
│   │   ├── ImagePreview.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── StyleEditor.jsx
│   │   ├── TestingPanel.jsx
│   │   └── ToleranceControls.jsx
│   ├── data/
│   │   └── testImages.js
│   ├── features/
│   │   ├── components/
│   │   │   └── componentsSlice.js
│   │   ├── images/
│   │   │   └── imageSlice.js
│   │   ├── styles/
│   │   │   ├── stylesSlice.js
│   │   │   └── toleranceSlice.js
│   │   └── testing/
│   │       └── testingSlice.js
│   ├── pages/
│   │   ├── EditorPage.jsx
│   │   ├── StyleExtractor.jsx
│   │   ├── TestingPage.jsx
│   │   └── UploadPage.jsx
│   ├── store/
│   │   └── index.js
│   ├── utils/
│   │   ├── canvasPolyfill.js
│   │   ├── colorExtraction.js
│   │   ├── componentDetection.js
│   │   ├── jsonExport.js
│   │   ├── spacingAnalysis.js
│   │   ├── testCases.js
│   │   └── textDetection.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🎯 Key Components

### ImageAnalyzer Class
Core analysis engine that processes uploaded images:
- Edge detection using Sobel operator
- Color extraction with frequency analysis
- Rectangle detection for component identification
- Text region analysis with variance calculations
- Shadow and border-radius detection

### State Management
Redux slices for different aspects:
- **imagesSlice**: Manages uploaded images and current selection
- **stylesSlice**: Handles extracted design tokens
- **componentsSlice**: Component detection and properties
- **testingSlice**: Test case management and validation

### UI Components
Reusable components built with Tailwind CSS:
- **ImageUpload**: Drag-and-drop file upload interface
- **StyleExtractionView**: Tabbed interface for reviewing extracted styles
- **ExportView**: Export configuration and preview
- **StylePreviewView**: Side-by-side comparison of original and recreated designs

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Open a Pull Request

### Development Guidelines

- Follow React best practices and hooks patterns
- Use TypeScript for type safety (planned for future versions)
- Maintain consistent code style with ESLint
- Write meaningful commit messages
- Test your changes across different browsers
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ColorThief**: For robust color palette extraction
- **Tesseract.js**: For optical character recognition capabilities
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide React**: For beautiful and consistent icons
- **Redux Toolkit**: For simplified state management

## 🔮 Future Enhancements

- [ ] **Real-time Analysis**: Live preview as you upload images
- [ ] **Batch Processing**: Analyze multiple images simultaneously
- [ ] **Design System Integration**: Direct export to Figma, Sketch, and Adobe XD
- [ ] **TypeScript Migration**: Full TypeScript support for better development experience
- [ ] **Plugin System**: Extensible architecture for custom analysis algorithms
- [ ] **Cloud Storage**: Integration with cloud storage services
- [ ] **Collaboration Features**: Share and collaborate on design systems
- [ ] **Accessibility Analysis**: Automated accessibility compliance checking

## 📞 Support

If you have any questions, issues, or feature requests:

1. Check the [Issues](https://github.com/your-username/style-extractor/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Made with ❤️ for designers and developers who want to bridge the gap between design and code.**
