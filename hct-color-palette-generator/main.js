// HCT Color Palette Generator - Main Plugin Code

// ========================================
// Material Design HCT Color Utilities
// Based on @material/material-color-utilities v0.3.0
// ========================================

// Define tone steps (identical to web app)
const TONE_STEPS = [0, 4, 8, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];

// Define alpha steps
const ALPHA_STEPS = [0.05, 0.1, 0.2, 0.4, 0.6, 0.8];

// ========================================
// Color Conversion Utilities
// ========================================

// Convert hex string to ARGB integer
function argbFromHex(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (255 << 24) | (r << 16) | (g << 8) | b;
}

// Convert ARGB integer to hex string
function hexFromArgb(argb) {
  const r = (argb >> 16) & 0xFF;
  const g = (argb >> 8) & 0xFF;
  const b = argb & 0xFF;
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Convert ARGB integer to RGB object with normalized [0-1] values
function rgbFromArgb(argb) {
  return {
    r: ((argb >> 16) & 0xFF) / 255.0,
    g: ((argb >> 8) & 0xFF) / 255.0,
    b: (argb & 0xFF) / 255.0
  };
}

// Convert RGB object to ARGB integer
function argbFromRgb(rgb) {
  const r = Math.max(0, Math.min(255, Math.round(rgb.r * 255))) & 0xFF;
  const g = Math.max(0, Math.min(255, Math.round(rgb.g * 255))) & 0xFF;
  const b = Math.max(0, Math.min(255, Math.round(rgb.b * 255))) & 0xFF;
  return (255 << 24) | (r << 16) | (g << 8) | b;
}

// ========================================
// Linear RGB / SRGB Conversion
// ========================================

// Convert SRGB value to linear RGB value
function linearized(rgbComponent) {
  // Convert 0-1 sRGB component to linear RGB
  if (rgbComponent <= 0.04045) {
    return rgbComponent / 12.92;
  } else {
    return Math.pow((rgbComponent + 0.055) / 1.055, 2.4);
  }
}

// Convert linear RGB value to SRGB value
function delinearized(rgbComponent) {
  // Convert linear RGB component to 0-1 sRGB
  if (rgbComponent <= 0.0031308) {
    return 12.92 * rgbComponent;
  } else {
    return 1.055 * Math.pow(rgbComponent, 1/2.4) - 0.055;
  }
}

// ========================================
// Matrix Operations
// ========================================

// Multiply a 3-element vector by a 3x3 matrix
function matrixMultiply(vector, matrix) {
  const result = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      result[i] += matrix[i][j] * vector[j];
    }
  }
  return result;
}

// ========================================
// Constants for Color Space Transformations
// ========================================

// Constants for RGB to XYZ conversion
const SRGB_TO_XYZ = [
  [0.41233895, 0.35762064, 0.18051042],
  [0.21267285, 0.71516868, 0.07215848],
  [0.01933142, 0.11919485, 0.95053373]
];

// Constants for XYZ to RGB conversion
const XYZ_TO_SRGB = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.9692660, 1.8760108, 0.0415560],
  [0.0556434, -0.2040259, 1.0572252]
];

// White point constants
const WHITE_POINT_D65 = {X: 0.95047, Y: 1.0, Z: 1.08883};

// ========================================
// Color Space Transformations
// ========================================

// Convert linear RGB to XYZ
function linearRgbToXyz(rgb) {
  const linearR = linearized(rgb.r);
  const linearG = linearized(rgb.g);
  const linearB = linearized(rgb.b);
  
  return matrixMultiply(
    [linearR, linearG, linearB],
    SRGB_TO_XYZ
  );
}

// Convert XYZ to linear RGB
function xyzToLinearRgb(xyz) {
  const linearRgb = matrixMultiply(
    [xyz[0], xyz[1], xyz[2]],
    XYZ_TO_SRGB
  );
  
  return {
    r: delinearized(linearRgb[0]),
    g: delinearized(linearRgb[1]),
    b: delinearized(linearRgb[2])
  };
}

// XYZ to LAB conversion helper
function xyzToLabHelper(component) {
  if (component > 0.008856) {
    return Math.pow(component, 1/3);
  } else {
    return (903.3 * component + 16) / 116;
  }
}

// XYZ to LAB
function xyzToLab(xyz) {
  const fx = xyzToLabHelper(xyz[0] / WHITE_POINT_D65.X);
  const fy = xyzToLabHelper(xyz[1] / WHITE_POINT_D65.Y);
  const fz = xyzToLabHelper(xyz[2] / WHITE_POINT_D65.Z);
  
  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);
  
  return {l, a, b};
}

// Lab component to XYZ component helper
function labToXyzHelper(component) {
  const cube = Math.pow(component, 3);
  if (cube > 0.008856) {
    return cube;
  } else {
    return (component - 16 / 116) / 7.787;
  }
}

// LAB to XYZ
function labToXyz(lab) {
  const fy = (lab.l + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;
  
  const X = WHITE_POINT_D65.X * labToXyzHelper(fx);
  const Y = WHITE_POINT_D65.Y * labToXyzHelper(fy);
  const Z = WHITE_POINT_D65.Z * labToXyzHelper(fz);
  
  return [X, Y, Z];
}

// LAB to LCH conversion
function labToLch(lab) {
  const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let h = Math.atan2(lab.b, lab.a) * 180 / Math.PI;
  if (h < 0) h += 360;
  
  return {l: lab.l, c, h};
}

// LCH to LAB conversion
function lchToLab(lch) {
  const hRad = lch.h * Math.PI / 180;
  const a = lch.c * Math.cos(hRad);
  const b = lch.c * Math.sin(hRad);
  
  return {l: lch.l, a, b};
}

// ========================================
// HCT Color Model
// ========================================

// Convert RGB to HCT
function rgbToHct(rgb) {
  const xyz = linearRgbToXyz(rgb);
  const lab = xyzToLab(xyz);
  const lch = labToLch(lab);
  
  return {
    hue: lch.h,
    chroma: lch.c,
    tone: lab.l
  };
}

// Determine if RGB values are in displayable gamut
function inGamut(rgb) {
  const epsilon = 0.0001;
  return rgb.r >= 0 - epsilon && rgb.r <= 1 + epsilon &&
         rgb.g >= 0 - epsilon && rgb.g <= 1 + epsilon &&
         rgb.b >= 0 - epsilon && rgb.b <= 1 + epsilon;
}

// Binary search to find maximum chroma at given hue and tone
function findMaxChroma(hue, tone) {
  if (tone <= 0.0001) return {rgb: {r: 0, g: 0, b: 0}, chroma: 0};
  if (tone >= 99.9999) return {rgb: {r: 1, g: 1, b: 1}, chroma: 0};

  let low = 0;
  let high = 150; // Starting with a reasonably high chroma
  let mid = 0;
  let bestChroma = 0;
  let bestRgb = {r: 0, g: 0, b: 0};
  
  for (let i = 0; i < 20; i++) { // Binary search iterations
    mid = (low + high) / 2;
    
    // Convert HCT to RGB
    const lch = {l: tone, c: mid, h: hue};
    const lab = lchToLab(lch);
    const xyz = labToXyz(lab);
    const rgb = xyzToLinearRgb(xyz);
    
    // Check if within displayable gamut
    if (inGamut(rgb)) {
      bestChroma = mid;
      bestRgb = rgb;
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return {rgb: bestRgb, chroma: bestChroma};
}

// Convert HCT to RGB
function hctToRgb(hue, chroma, tone) {
  // Handle special cases
  if (tone <= 0) return {r: 0, g: 0, b: 0};
  if (tone >= 100) return {r: 1, g: 1, b: 1};
  
  // Normalize hue to 0-360 range
  hue = ((hue % 360) + 360) % 360;
  
  // Find maximum possible chroma at this hue and tone
  const maxChromaResult = findMaxChroma(hue, tone);
  
  // If requested chroma is higher than maximum, use maximum
  const actualChroma = Math.min(chroma, maxChromaResult.chroma);
  
  if (actualChroma < 0.0001) {
    // For near-zero chroma, directly calculate RGB from tone (grayscale)
    const value = tone / 100;
    return {r: value, g: value, b: value};
  }
  
  // Scale the RGB based on the requested chroma
  if (chroma <= maxChromaResult.chroma) {
    // Convert HCT to RGB
    const lch = {l: tone, c: actualChroma, h: hue};
    const lab = lchToLab(lch);
    const xyz = labToXyz(lab);
    return xyzToLinearRgb(xyz);
  }
  
  return maxChromaResult.rgb;
}

// HCT color object
function createHctColor(hue, chroma, tone) {
  // Normalize hue to 0-360 range
  hue = ((hue % 360) + 360) % 360;
  
  // Ensure tone is in 0-100 range
  tone = Math.max(0, Math.min(100, tone));
  
  // Convert HCT to RGB
  const rgb = hctToRgb(hue, chroma, tone);
  
  // Convert RGB to ARGB
  const argb = argbFromRgb(rgb);
  
  // Recalculate actual HCT values from the RGB
  const actualHct = rgbToHct(rgb);
  
  return {
    hue: actualHct.hue,
    chroma: actualHct.chroma,
    tone: actualHct.tone,
    toInt: function() {
      return argb;
    }
  };
}

// ========================================
// HCT Color Palette Generator
// ========================================

// HCT object for API compatibility
const Hct = {
  // Create HCT object from hue, chroma, tone
  from: function(hue, chroma, tone) {
    return createHctColor(hue, chroma, tone);
  },
  
  // Create HCT object from ARGB integer
  fromInt: function(argb) {
    const rgb = rgbFromArgb(argb);
    const hct = rgbToHct(rgb);
    return createHctColor(hct.hue, hct.chroma, hct.tone);
  }
};

// Convert hex color to HCT
function hexToHct(hex) {
  const argb = argbFromHex(hex);
  const hct = Hct.fromInt(argb);
  return {
    hue: hct.hue,
    chroma: hct.chroma,
    tone: hct.tone,
  };
}

// Generate a tonal palette from a base color
function generateTonalPalette(baseHex) {
  console.log(`Generating HCT palette for base color: ${baseHex}`);
  
  try {
    // Extract HCT values from base color
    const { hue, chroma } = hexToHct(baseHex);
    
    console.log(`Base HCT values - H: ${hue.toFixed(2)}, C: ${chroma.toFixed(2)}, T: ${hexToHct(baseHex).tone.toFixed(2)}`);
    
    // Generate the tonal palette by keeping hue and chroma constant
    return TONE_STEPS.map(tone => {
      try {
        // Create HCT color with the same hue and chroma, but different tone
        const hctColor = Hct.from(hue, chroma, tone);
        const hex = hexFromArgb(hctColor.toInt());
        
        console.log(`Tone ${tone} hex: ${hex}`);
        return { tone, hex };
      } catch (error) {
        console.error(`Error generating tone ${tone}: ${error.message}`);
        // Fallback for error cases
        if (tone <= 0) return { tone, hex: "#000000" };
        if (tone >= 100) return { tone, hex: "#FFFFFF" };
        
        const grayLevel = Math.round(tone * 2.55);
        const grayHex = `#${grayLevel.toString(16).padStart(2, '0').repeat(3)}`;
        return { tone, hex: grayHex };
      }
    });
  } catch (error) {
    console.error(`Error in generateTonalPalette: ${error.message}`);
    // Fallback to grayscale palette
    return TONE_STEPS.map(tone => {
      if (tone <= 0) return { tone, hex: "#000000" };
      if (tone >= 100) return { tone, hex: "#FFFFFF" };
      
      const grayLevel = Math.round(tone * 2.55);
      const grayHex = `#${grayLevel.toString(16).padStart(2, '0').repeat(3)}`;
      return { tone, hex: grayHex };
    });
  }
}

// Generate alpha variants for a hex color
function generateAlphaVariants(hex) {
  try {
    // Convert hex to RGB values
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    // Generate alpha variants
    return ALPHA_STEPS.map(alpha => ({
      alpha,
      rgba: { r, g, b, a: alpha }
    }));
  } catch (error) {
    console.error(`Error in generateAlphaVariants: ${error.message}`);
    return ALPHA_STEPS.map(alpha => ({
      alpha,
      rgba: { r: 0.5, g: 0.5, b: 0.5, a: alpha }
    }));
  }
}

// Generate approximated colors for UI preview
function approximateTonalPalette(baseHex, tones) {
  try {
    // Extract RGB values
    const r = parseInt(baseHex.slice(1, 3), 16) / 255;
    const g = parseInt(baseHex.slice(3, 5), 16) / 255;
    const b = parseInt(baseHex.slice(5, 7), 16) / 255;
    
    // Calculate base luminance
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
    // Generate tones
    return tones.map(tone => {
      try {
        // Special cases for black and white
        if (tone <= 0) return { tone, hex: '#000000' };
        if (tone >= 100) return { tone, hex: '#FFFFFF' };
        
        // Tone as percentage
        const factor = tone / 100;
        
        // Darker tones
        if (factor < luminance) {
          const t = factor / luminance;
          const newR = Math.round(r * t * 255);
          const newG = Math.round(g * t * 255);
          const newB = Math.round(b * t * 255);
          return {
            tone,
            hex: `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
          };
        } 
        // Lighter tones
        else {
          const t = (factor - luminance) / (1 - luminance);
          const newR = Math.round((r + (1 - r) * t) * 255);
          const newG = Math.round((g + (1 - g) * t) * 255);
          const newB = Math.round((b + (1 - b) * t) * 255);
          return {
            tone,
            hex: `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
          };
        }
      } catch (error) {
        // Fallback to grayscale
        const grayValue = Math.round(tone * 2.55);
        const grayHex = grayValue.toString(16).padStart(2, '0');
        return {
          tone,
          hex: `#${grayHex}${grayHex}${grayHex}`
        };
      }
    });
  } catch (error) {
    console.error(`Error in approximateTonalPalette: ${error.message}`);
    // Fallback to grayscale palette
    return tones.map(tone => {
      const grayValue = Math.round(tone * 2.55);
      const grayHex = grayValue.toString(16).padStart(2, '0');
      return {
        tone,
        hex: `#${grayHex}${grayHex}${grayHex}`
      };
    });
  }
}

// === Figma Plugin Implementation ===

// Default color state
let lastBaseColor = '#1E88E5';

// Initialize the plugin
figma.showUI(__html__, { width: 320, height: 580 });

// Send initial data to the UI
figma.ui.postMessage({
  type: 'init',
  baseColor: lastBaseColor
});

// Update Figma styles
function updateFigmaStyles(palette, includeAlpha) {
  return new Promise((resolve) => {
    try {
      const namespace = 'HCT';
      let createdStyles = 0;
      let updatedStyles = 0;
      
      // Process styles in batches to prevent UI freezing
      function processNextBatch(index) {
        try {
          // Report progress
          const progressPercent = Math.round((index / palette.length) * 100);
          figma.ui.postMessage({
            type: 'progress',
            message: `Creating color styles... ${progressPercent}%`,
            progress: progressPercent
          });
          
          // Check if we've processed all styles
          if (index >= palette.length) {
            figma.ui.postMessage({
              type: 'progress',
              message: 'Finalizing styles...',
              progress: 100
            });
            
            // Return results
            setTimeout(() => {
              resolve({ createdStyles, updatedStyles });
            }, 100);
            return;
          }
          
          // Process current batch
          const batchSize = 1;
          const endIndex = Math.min(index + batchSize, palette.length);
          
          for (let i = index; i < endIndex; i++) {
            try {
              const item = palette[i];
              if (!item || item.tone === undefined || !item.hex) {
                console.warn(`Skipping invalid palette item at index ${i}`);
                continue;
              }
              
              const tone = item.tone;
              const hex = item.hex;
              console.log(`Creating style for T${tone}: ${hex}`);
              
              // Parse color from hex
              const r = parseInt(hex.slice(1, 3), 16) / 255;
              const g = parseInt(hex.slice(3, 5), 16) / 255;
              const b = parseInt(hex.slice(5, 7), 16) / 255;
              
              const styleName = `${namespace}/T${tone}`;
              
              // Find existing style if any
              let style = null;
              try {
                const localStyles = figma.getLocalPaintStyles();
                style = localStyles.find(s => s.name === styleName) || null;
              } catch (error) {
                console.error(`Error looking up style: ${error.message}`);
              }
              
              try {
                // Create solid paint
                const paint = {
                  type: 'SOLID',
                  color: { r, g, b }
                };
                
                if (!style) {
                  // Create new style
                  style = figma.createPaintStyle();
                  style.name = styleName;
                  createdStyles++;
                } else {
                  // Update existing style
                  updatedStyles++;
                }
                
                // Update the style with the new color
                style.paints = [paint];
              } catch (error) {
                console.error(`Error updating style: ${error.message}`);
              }
              
              // Create alpha variants if requested
              if (includeAlpha) {
                try {
                  const alphaVariants = generateAlphaVariants(hex);
                  
                  for (const variant of alphaVariants) {
                    try {
                      const alpha = variant.alpha;
                      const rgba = variant.rgba;
                      
                      const alphaName = `${namespace}/T${tone}/Alpha ${alpha * 100}%`;
                      let alphaStyle = null;
                      
                      // Find if style exists
                      try {
                        const alphaLocalStyles = figma.getLocalPaintStyles();
                        alphaStyle = alphaLocalStyles.find(s => s.name === alphaName) || null;
                      } catch (error) {
                        console.error(`Error looking up alpha style: ${error.message}`);
                      }
                      
                      // Create or update alpha style
                      const alphaPaint = {
                        type: 'SOLID',
                        color: { r: rgba.r, g: rgba.g, b: rgba.b },
                        opacity: rgba.a
                      };
                      
                      if (!alphaStyle) {
                        alphaStyle = figma.createPaintStyle();
                        alphaStyle.name = alphaName;
                        createdStyles++;
                      } else {
                        updatedStyles++;
                      }
                      
                      alphaStyle.paints = [alphaPaint];
                    } catch (error) {
                      console.error(`Error processing alpha variant: ${error.message}`);
                    }
                  }
                } catch (error) {
                  console.error(`Error creating alpha variants: ${error.message}`);
                }
              }
            } catch (error) {
              console.error(`Error processing palette item: ${error.message}`);
            }
          }
          
          // Schedule next batch
          setTimeout(() => processNextBatch(endIndex), 200);
        } catch (error) {
          console.error(`Batch processing error: ${error.message}`);
          // Try to continue with the next batch
          setTimeout(() => processNextBatch(index + 1), 300);
        }
      }
      
      // Start processing from the first style
      setTimeout(() => processNextBatch(0), 100);
    } catch (error) {
      console.error(`Error in updateFigmaStyles: ${error.message}`);
      resolve({ createdStyles: 0, updatedStyles: 0 });
    }
  });
}

// Handle messages from the UI
figma.ui.onmessage = function(msg) {
  console.log("Received message:", msg.type);
  
  try {
    if (msg.type === 'generate') {
      // Report that we've started processing
      figma.ui.postMessage({
        type: 'progress',
        message: 'Starting palette generation...',
        progress: 0
      });
      
      // Store the base color for persistence
      lastBaseColor = msg.baseColor || '#1E88E5';
      
      // Generate the tonal palette
      console.log("Generating palette using tone steps:", TONE_STEPS);
      const palette = generateTonalPalette(lastBaseColor);
      console.log("Generated palette:", palette);
      
      // Debug mode - just send back palette information
      if (msg.debug) {
        try {
          const approxPalette = approximateTonalPalette(lastBaseColor, TONE_STEPS);
          const hctValues = hexToHct(lastBaseColor);
          
          // Send both palettes back to UI
          figma.ui.postMessage({
            type: 'debug',
            actualPalette: palette,
            approxPalette: approxPalette,
            baseHct: [hctValues.hue, hctValues.chroma, hctValues.tone]
          });
        } catch (error) {
          console.error(`Debug error: ${error.message}`);
          figma.ui.postMessage({
            type: 'error',
            message: `Error in debug mode: ${error.message}`
          });
        }
        return;
      }
      
      // Create or update Figma styles if requested
      if (msg.createStyles) {
        figma.ui.postMessage({
          type: 'progress',
          message: 'Processing color styles...',
          progress: 10
        });
        
        // Update Figma styles using the palette
        updateFigmaStyles(palette, msg.includeAlpha)
          .then((result) => {
            figma.ui.postMessage({
              type: 'done',
              message: `Created ${result.createdStyles} and updated ${result.updatedStyles} styles.`,
              palette: palette
            });
          })
          .catch((error) => {
            console.error(`Style update error: ${error.message}`);
            figma.ui.postMessage({
              type: 'error',
              message: `Error creating styles: ${error.message}`
            });
          });
      } else {
        // Just return the palette without creating styles
        figma.ui.postMessage({
          type: 'done',
          message: 'Palette generated without creating styles.',
          palette: palette
        });
      }
    } else {
      console.log(`Unknown message type: ${msg.type}`);
    }
  } catch (error) {
    console.error(`Error handling message: ${error.message}`);
    figma.ui.postMessage({
      type: 'error',
      message: `Error: ${error.message}`
    });
  }
}; 