# Dynamic Color Generator

A powerful color palette generator based on the Material Color Utilities and HCT color space. This tool allows you to:

1. **Convert Base Color to HCT**  
   - Take your hex/RGB input and convert to HCT (Hue, Chroma, Tone).  
   - HCT's "Tone" (0–100) matches perceived lightness.

2. **Generate Tonal Palette**  
   - Creates a full tonal palette with 15 tone steps: `[0, 4, 8, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100]`.  
   - Preserves the same hue and chroma values across all tones.  

3. **Position Input Color**  
   - Compares the input color's exact HCT tone to the fixed steps.  
   - Labels the closest tone to show where your starting color fits.

4. **Determine Text Color**  
   - Tests white (`#FFF`) and black (`#000`) for WCAG-compliant contrast on the primary color.  
   - Selects the best option based on contrast ratio.

5. **Generate Alpha Variants**  
   - Creates alpha variants (5%, 10%, 20%, 40%, 60%, 80%) for each tone.  
   - Useful for overlays, backgrounds, and hover states.  

## Getting Started

### Prerequisites

- Node.js (14.x or higher)
- npm (6.x or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/dynamic-color-generator.git
   cd dynamic-color-generator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser to http://localhost:3000

## How to Use

1. Use the color picker or enter a hex code directly to choose your base color.
2. The app will automatically generate a complete tonal palette based on your selection.
3. The tonal swatch that most closely matches your original color will be highlighted.
4. Click on any tonal swatch to view its alpha variants.
5. The contrast ratio information will help you choose accessible text colors.

## Built With

- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Styled Components](https://styled-components.com/) - Component styling
- [Material Color Utilities](https://github.com/material-foundation/material-color-utilities) - HCT color space conversion

## License

This project is licensed under the MIT License - see the LICENSE file for details.
