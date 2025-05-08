import { Hct, hexFromArgb, argbFromHex } from '@material/material-color-utilities';

// Define fixed tone steps
export const TONE_STEPS = [4, 8, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99];

// Define alpha steps
export const ALPHA_STEPS = [0.05, 0.1, 0.2, 0.4, 0.6, 0.8];

export type CurveFunction = 'linear' | 'sine' | 'cosine' | 'quadratic' | 'material';

/**
 * Apply a curve function to a value
 */
export function applyCurveFunction(value: number, maxValue: number, curveType: CurveFunction): number {
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
 */
export function generateTonalPalette(baseHex: string, curveType: CurveFunction = 'material') {
  const { hue, chroma } = hexToHct(baseHex);
  
  return TONE_STEPS.map(tone => {
    // Apply curve function to tone instead of chroma
    const curvedTone = applyCurveFunction(tone, 100, curveType);
    const hctColor = Hct.from(hue, chroma, curvedTone);
    const hex = hexFromArgb(hctColor.toInt());
    return {
      tone: curvedTone,
      hex,
      chroma,
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
 * Find the nearest tone value from the fixed steps
 */
export function findNearestTone(inputTone: number) {
  return TONE_STEPS.reduce((prev, curr) => 
    Math.abs(curr - inputTone) < Math.abs(prev - inputTone) ? curr : prev
  );
}

/**
 * Find the index of the nearest tone in the TONE_STEPS array
 */
export function findNearestToneIndex(inputTone: number) {
  const nearestTone = findNearestTone(inputTone);
  return TONE_STEPS.indexOf(nearestTone);
}

/**
 * Generate a neutral palette based on the primary color
 * Creates a series of greys that maintain the hue of the primary color
 * but with very low chroma to appear neutral
 */
export function generateNeutralPalette(baseHex: string, curveType: CurveFunction = 'material') {
  const { hue } = hexToHct(baseHex);
  
  // Define the chroma values - lower in the middle for more neutral appearance
  const getChromaForTone = (tone: number) => {
    const midPoint = 50;
    const maxChroma = 8;
    const minChroma = 2;
    
    const distanceFromMid = Math.abs(tone - midPoint);
    const normalizedDistance = distanceFromMid / midPoint;
    
    return minChroma + (maxChroma - minChroma) * normalizedDistance;
  };

  return TONE_STEPS.map(tone => {
    const chroma = getChromaForTone(tone);
    // Apply curve function to tone instead of chroma
    const curvedTone = applyCurveFunction(tone, 100, curveType);
    const hctColor = Hct.from(hue, chroma, curvedTone);
    const hex = hexFromArgb(hctColor.toInt());
    
    return {
      tone: curvedTone,
      chroma,
      hex,
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