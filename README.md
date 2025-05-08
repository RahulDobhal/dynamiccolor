# Dynamic Color Palette Generator for Figma

A Figma plugin that generates a complete tonal palette based on the HCT (Hue, Chroma, Tone) color space from a single base color. This provides a perceptually uniform palette with consistent lightness steps, making it perfect for creating accessible color systems for your design projects.

## Features

- Generate a complete color palette from a single base color
- Create 15 tonal steps from 0-100 (dark to light)
- Optionally create alpha variants for each tone (5%, 10%, 20%, 40%, 60%, 80%)
- Automatically creates or updates Figma Color Styles
- All processing happens locally (no external APIs needed)

## How to Install

### Method 1: Direct Installation
1. Download the plugin files (manifest.json, code.js, ui.html)
2. Create a folder named "Dynamic Color Palette Generator" on your computer
3. Place the downloaded files in this folder
4. In Figma, go to Plugins > Development > Import plugin from manifest...
5. Select the manifest.json file from your folder

### Method 2: From Figma Community
1. Visit the plugin page on Figma Community (link to be added when published)
2. Click "Install" button

## How to Use

1. Run the plugin from the Plugins menu or right-click > Plugins > Dynamic Color Palette Generator
2. Choose a base color using the color picker or enter a hex value
3. Choose whether to create Figma Color Styles and include alpha variants
4. Click "Generate Palette"
5. The plugin will create a complete tonal palette and (optionally) create Figma Color Styles

## Generated Styles

When you generate a palette with Figma Color Styles, the plugin creates:

- Main tonal swatches: `HCT Palette/T0` through `HCT Palette/T100`
- Alpha variants (if enabled): `HCT Palette/T50/Alpha 20%`

## Using the Color Styles

Once generated, you can use the styles like any other Figma Color Style:

1. Select an element (rectangle, text, etc.)
2. Open the Color property in the right panel
3. Click on the Style icon (four dots)
4. Select one of the generated styles from the "HCT Palette" collection

## Updating the Palette

If you want to change the base color:

1. Run the plugin again
2. Choose a new base color
3. Click "Generate Palette"
4. The plugin will update all existing styles while maintaining any instances using them

## About HCT Color Space

HCT (Hue, Chroma, Tone) is a color space that provides perceptually uniform colors across the entire lightness range. Unlike HSL or HSB, which can produce colors with wildly different perceived lightness, HCT ensures that all colors with the same tone value appear equally light to the human eye.

## Credits

This plugin implements a simplified version of the Material Color Utilities' HCT color space transformations.

## License

MIT License 