# Style Extractor

A powerful React application that automatically extracts design tokens from UI screenshots using advanced image analysis. Transform your design screenshots into structured design systems with colors, typography, spacing, components, shadows, and border radius values.

## Features

- Advanced color analysis with dominant color extraction and grouping
- Typography detection including font size and weight estimation
- Spacing and layout analysis with component detection
- Component recognition and property extraction
- Configurable tolerances for analysis sensitivity
- Export design tokens in JSON, CSS, SCSS, and Tailwind config formats

## Technologies Used

- React 19.1.1 with Hooks
- Vite 7.1.2
- Redux Toolkit 2.9.0
- Tailwind CSS 4.1.13
- Lucide React icons
- ColorThief for color extraction
- Tesseract.js for OCR and text detection
- File Saver for exporting files

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/style-extractor.git
   cd style-extractor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

- Upload UI screenshots (PNG, JPEG, WEBP)
- Review extracted colors, typography, spacing, and components
- Adjust tolerances and edit tokens as needed
- Export your design system in preferred formats

## Project Structure

- `src/components/` - Reusable UI components
- `src/features/` - Redux slices for images, styles, components, and testing
- `src/pages/` - Main pages including StyleExtractor, EditorPage, UploadPage
- `src/utils/` - Utility functions for image analysis and export
- `public/` - Static assets

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please fork the repo and submit pull requests.

## License

MIT License

---

Made for designers and developers to bridge design and code.
