import { Hct, hexFromArgb, argbFromHex } from '@material/material-color-utilities';

// Define fixed tone steps for Material Design
export const TONE_STEPS = [4, 8, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99];

// Define alpha steps
export const ALPHA_STEPS = [0.05, 0.1, 0.2, 0.4, 0.6, 0.8];

export type CurveFunction = 'linear' | 'sine' | 'cosine' | 'quadratic' | 'material' | 's-shaped';

// Functional color scales (static, not dynamically generated)
export type FunctionalScaleStyle = 'pastel' | 'bright';

export const FUNCTIONAL_COLOR_SCALES: Record<FunctionalScaleStyle, Record<string, string[]>> = {
  pastel: {
    negative: ['#FFE5E5', '#FFB8B8', '#FF7A7A', '#FF3B3B', '#D32F2F'],
    positive: ['#E6F9E6', '#B8F2B8', '#7AE87A', '#3BD43B', '#388E3C'],
    informational: ['#E5F0FF', '#B8D4FF', '#7AB8FF', '#3B9CFF', '#1976D2'],
    warning: ['#FFF7E5', '#FFE0B8', '#FFD27A', '#FFB83B', '#FFA000'],
  },
  bright: {
    negative: ['#FFEBEE', '#FF5252', '#FF1744', '#D50000', '#B71C1C'],
    positive: ['#E8F5E9', '#69F0AE', '#00E676', '#00C853', '#1B5E20'],
    informational: ['#E3F2FD', '#40C4FF', '#0091EA', '#2962FF', '#0D47A1'],
    warning: ['#FFFDE7', '#FFD600', '#FFAB00', '#FF6F00', '#FF3D00'],
  },
};

/**
 * Apply a bell curve to chroma values
 * This function is completely independent of any curve function selection
 */
export function applyBellCurveToChroma(chroma: number, tone: number): number {
  // Gaussian function: f(x) = amplitude * e^(-(x - mean)² / (2 * variance))
  const mean = 50; // Center at 50% tone
  const variance = 400; // Controls width of the bell (higher = wider)
  const amplitude = 1.0; // Max multiplier at the peak
  const minMultiplier = 0.3; // Minimum multiplier at the extremes
  
  // Calculate bell curve multiplier
  const exponent = -Math.pow(tone - mean, 2) / (2 * variance);
  const bellMultiplier = minMultiplier + (amplitude - minMultiplier) * Math.exp(exponent);
  
  return chroma * bellMultiplier;
}

/**
 * Apply a curve function to a value, but skip for hue
 */
export function applyCurveFunction(
  value: number, 
  maxValue: number, 
  curveType: CurveFunction, 
  property: 'hue' | 'chroma' | 'tone' = 'chroma'
): number {
  // Always keep hue constant regardless of curve
  if (property === 'hue') {
    return value;
  }
  
  const normalizedValue = value / maxValue;
  
  switch (curveType) {
    case 'linear':
      return value;
    case 'sine':
      return maxValue * Math.sin(normalizedValue * Math.PI / 2);
    case 'cosine':
      return maxValue * (1 - Math.cos(normalizedValue * Math.PI / 2));
    case 'quadratic':
      return maxValue * Math.pow(normalizedValue, 2);
    case 'material':
    default:
      return value;
  }
}

/**
 * Generate dynamic tone steps based on the curve function
 */
export function generateToneSteps(
  count: number, 
  curveType: CurveFunction, 
  includeExtremes: boolean = true
): number[] {
  if (curveType === 'material' && count === TONE_STEPS.length && !includeExtremes) {
    return TONE_STEPS;
  }

  const steps: number[] = [];
  
  // Adjust the range if we're excluding extremes
  const startPoint = includeExtremes ? 0 : 0.05;
  const endPoint = includeExtremes ? 1 : 0.95;
  
  for (let i = 0; i < count; i++) {
    // Generate values from startPoint to endPoint
    const t = i / (count - 1);
    const adjustedT = startPoint + t * (endPoint - startPoint);
    let value: number;
    
    switch (curveType) {
      case 'sine':
        // Sine curve: sin(t * π/2) gives a smooth progression
        value = 100 * Math.sin(adjustedT * Math.PI / 2);
        break;
      case 'cosine':
        // Cosine curve: 1 - cos(t * π/2) starts slow, then accelerates
        value = 100 * (1 - Math.cos(adjustedT * Math.PI / 2));
        break;
      case 'quadratic':
        // Quadratic curve: t² gives emphasis on lighter tones
        value = 100 * (adjustedT * adjustedT);
        break;
      case 'linear':
        // Linear: straight progression from 0 to 100
        value = 100 * adjustedT;
        break;
      case 's-shaped': {
        // S-shaped curve: use a normalized logistic sigmoid for monotonic S-curve
        // f(t) = 1 / (1 + exp(-k*(t-0.5)))
        // k controls steepness; try k=8 for a strong S
        const k = 8;
        const sigmoid = (x: number) => 1 / (1 + Math.exp(-k * (x - 0.5)));
        const min = sigmoid(0);
        const max = sigmoid(1);
        value = 100 * ((sigmoid(adjustedT) - min) / (max - min));
        break;
      }
      case 'material':
      default:
        // For material, distribute steps with more weight to extremes
        if (count <= 3) {
          // For very few steps, focus on extremes and middle
          value = 100 * adjustedT;
        } else {
          // Non-linear distribution favoring key transition points
          const positions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 100];
          const index = Math.floor(adjustedT * (positions.length - 1));
          const remainder = adjustedT * (positions.length - 1) - index;
          
          if (index < positions.length - 1) {
            value = positions[index] + remainder * (positions[index + 1] - positions[index]);
          } else {
            value = positions[positions.length - 1];
          }
        }
        break;
    }
    
    // Round to nearest integer and ensure it's within 0-100 range
    const roundedValue = Math.round(Math.min(100, Math.max(0, value)));
    steps.push(roundedValue);
  }
  
  // Set min and max values if extremes are included
  if (includeExtremes && count >= 3) {
    steps[0] = 0;
    steps[steps.length - 1] = 100;
  } else if (!includeExtremes && count >= 3) {
    // Ensure we're not including 0 or 100 when extremes are disabled
    if (steps[0] === 0) steps[0] = 5;
    if (steps[steps.length - 1] === 100) steps[steps.length - 1] = 95;
  }
  
  return steps;
}

/**
 * Convert hex color to HCT
 */
export function hexToHct(hex: string) {
  const argb = argbFromHex(hex);
  const hct = Hct.fromInt(argb);
  return {
    hue: hct.hue,
    chroma: hct.chroma,
    tone: hct.tone,
  };
}

/**
 * Generate a tonal palette from a base color
 * The curve function ONLY affects tone distribution, not chroma values
 */
export function generateTonalPalette(
  baseHex: string, 
  curveType: CurveFunction = 's-shaped', 
  stepCount: number = 13,
  includeExtremes: boolean = true
) {
  const { hue, chroma: baseChroma } = hexToHct(baseHex);
  // Generate tone steps based on the curve function
  const toneSteps = generateToneSteps(stepCount, curveType, includeExtremes);
  
  return toneSteps.map(tone => {
    // Apply bell curve to chroma - completely independent of curve function
    const modifiedChroma = applyBellCurveToChroma(baseChroma, tone);
    
    const hctColor = Hct.from(hue, modifiedChroma, tone);
    const hex = hexFromArgb(hctColor.toInt());
    return {
      tone,
      hex,
      chroma: modifiedChroma,
    };
  });
}

/**
 * Convert hex to RGB object
 */
export function hexToRgb(hex: string) {
  // Remove the # if present
  const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
  
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Generate alpha variants of a hex color
 */
export function generateAlphaVariants(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  
  return ALPHA_STEPS.map(alpha => ({
    alpha,
    rgba: `rgba(${r}, ${g}, ${b}, ${alpha})`,
  }));
}

/**
 * Generate a full color palette with tonal and alpha variants
 */
export function generateFullPalette(baseHex: string) {
  const tonalPalette = generateTonalPalette(baseHex);
  
  return tonalPalette.map(({ tone, hex }) => ({
    tone,
    hex,
    alphaVariants: generateAlphaVariants(hex),
  }));
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  // Calculate the relative luminance for each color
  const luminance1 = calculateRelativeLuminance(rgb1);
  const luminance2 = calculateRelativeLuminance(rgb2);
  
  // Calculate contrast ratio
  const contrast = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
  
  return contrast;
}

/**
 * Calculate relative luminance of an RGB color
 */
function calculateRelativeLuminance({ r, g, b }: { r: number, g: number, b: number }) {
  // Convert RGB values to the range [0, 1]
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;
  
  // Convert to linear RGB
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Find the best text color (black or white) for a given background color
 */
export function getBestTextColor(backgroundColor: string) {
  const contrastWithWhite = getContrastRatio(backgroundColor, 'FFFFFF');
  const contrastWithBlack = getContrastRatio(backgroundColor, '000000');
  
  // WCAG recommends a contrast ratio of at least 4.5:1
  const WCAG_THRESHOLD = 4.5;
  
  if (contrastWithWhite >= WCAG_THRESHOLD && contrastWithBlack >= WCAG_THRESHOLD) {
    // Both pass, use the one with better contrast
    return contrastWithWhite > contrastWithBlack ? '#FFFFFF' : '#000000';
  } else if (contrastWithWhite >= WCAG_THRESHOLD) {
    return '#FFFFFF';
  } else if (contrastWithBlack >= WCAG_THRESHOLD) {
    return '#000000';
  } else {
    // If neither passes, default to the one with better contrast
    return contrastWithWhite > contrastWithBlack ? '#FFFFFF' : '#000000';
  }
}

/**
 * Find the nearest tone value from the given steps
 */
export function findNearestTone(inputTone: number, toneSteps: number[] = TONE_STEPS) {
  return toneSteps.reduce((prev, curr) => 
    Math.abs(curr - inputTone) < Math.abs(prev - inputTone) ? curr : prev
  );
}

/**
 * Find the index of the nearest tone in the given tone steps array
 */
export function findNearestToneIndex(inputTone: number, toneSteps: number[] = TONE_STEPS) {
  const nearestTone = findNearestTone(inputTone, toneSteps);
  return toneSteps.indexOf(nearestTone);
}

/**
 * Generate a neutral palette based on the primary color
 * Curve function ONLY affects tone distribution, not chroma values
 */
export function generateNeutralPalette(
  baseHex: string, 
  curveType: CurveFunction = 's-shaped', 
  stepCount: number = 13,
  includeExtremes: boolean = true
) {
  const { hue } = hexToHct(baseHex);
  // Generate tone steps based on the curve function
  const toneSteps = generateToneSteps(stepCount, curveType, includeExtremes);
  
  // Simple linear formula for neutral palette chroma
  const getChromaForTone = (tone: number) => {
    const midPoint = 50;
    const maxChroma = 8; // Maximum chroma for neutral tones
    const minChroma = 2; // Minimum chroma at the midpoint
    
    const distanceFromMid = Math.abs(tone - midPoint);
    const normalizedDistance = distanceFromMid / midPoint;
    
    // Higher chroma at extremes for neutral palette (simple linear relationship)
    return minChroma + (maxChroma - minChroma) * normalizedDistance;
  };

  return toneSteps.map(tone => {
    const chroma = getChromaForTone(tone);
    
    const hctColor = Hct.from(hue, chroma, tone);
    const hex = hexFromArgb(hctColor.toInt());
    
    return {
      tone,
      chroma,
      hex,
      name: `n${tone}` // Add neutral naming (n + tone)
    };
  });
}

/**
 * Generate a full color system including primary and neutral palettes
 */
export function generateColorSystem(baseHex: string) {
  const tonalPalette = generateTonalPalette(baseHex);
  const neutralPalette = generateNeutralPalette(baseHex);
  
  return {
    primary: tonalPalette,
    neutral: neutralPalette,
  };
}

export function getFunctionalColorScale(style: FunctionalScaleStyle) {
  return FUNCTIONAL_COLOR_SCALES[style];
}

// Functional palette generation
export type FunctionalPaletteType = 'pastel' | 'bright' | 'vivid' | 'muted' | 'deep';

const FUNCTIONAL_BASE_COLORS = {
  negative: '#D32F2F', // red
  positive: '#388E3C', // green
  informational: '#1976D2', // blue
  warning: '#FFA000', // yellow/orange
};

const FUNCTIONAL_TYPE_SETTINGS: Record<FunctionalPaletteType, { toneRange: [number, number], chromaRange: [number, number] }> = {
  pastel: { toneRange: [85, 98], chromaRange: [10, 28] },
  bright: { toneRange: [70, 95], chromaRange: [40, 80] },
  vivid: { toneRange: [55, 85], chromaRange: [60, 90] },
  muted: { toneRange: [40, 80], chromaRange: [10, 28] },
  deep: { toneRange: [20, 60], chromaRange: [40, 80] },
};

export function generateFunctionalPalette(
  type: FunctionalPaletteType,
  steps: number = 5
) {
  const { toneRange, chromaRange } = FUNCTIONAL_TYPE_SETTINGS[type];
  const palettes: Record<string, { tone: number, chroma: number, hex: string }[]> = {};
  Object.entries(FUNCTIONAL_BASE_COLORS).forEach(([role, baseHex]) => {
    const { hue } = hexToHct(baseHex);
    const tones = Array.from({ length: steps }, (_, i) =>
      toneRange[0] + (i * (toneRange[1] - toneRange[0]) / (steps - 1))
    );
    const chromas = Array.from({ length: steps }, (_, i) =>
      chromaRange[0] + (i * (chromaRange[1] - chromaRange[0]) / (steps - 1))
    );
    palettes[role] = tones.map((tone, i) => {
      const chroma = chromas[i];
      const hctColor = Hct.from(hue, chroma, tone);
      const hex = hexFromArgb(hctColor.toInt());
      return { tone: Math.round(tone), chroma: Math.round(chroma), hex };
    });
  });
  return palettes;
} 