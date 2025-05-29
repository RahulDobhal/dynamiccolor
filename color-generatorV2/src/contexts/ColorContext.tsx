import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { generateTonalPalette, generateNeutralPalette } from '../utils/colorUtils';
import type { CurveFunction } from '../utils/colorUtils';

// Types for our color system
export interface ColorTone {
  tone: number;
  hex: string;
  chroma: number;
}

export interface NeutralTone {
  tone: number;
  chroma: number;
  hex: string;
  name?: string;
}

export interface ColorSystem {
  primary: ColorTone[];
  neutral: NeutralTone[];
  baseColor: string;
  curveFunction: CurveFunction;
  stepCount: number;
  includeExtremes: boolean;
}

export interface ColorContextType {
  colorSystem: ColorSystem;
  updateBaseColor: (color: string) => void;
  updateCurveFunction: (curve: CurveFunction) => void;
  updateStepCount: (count: number) => void;
  updateIncludeExtremes: (include: boolean) => void;
  getToneByValue: (tones: ColorTone[], targetTone: number) => ColorTone | undefined;
  getNeutralByValue: (tones: NeutralTone[], targetTone: number) => NeutralTone | undefined;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

// Helper functions to find specific tones
const findToneByValue = (tones: ColorTone[], targetTone: number): ColorTone | undefined => {
  return tones.find(tone => Math.abs(tone.tone - targetTone) < 5) || 
         tones.reduce((prev, curr) => 
           Math.abs(curr.tone - targetTone) < Math.abs(prev.tone - targetTone) ? curr : prev
         );
};

const findNeutralByValue = (tones: NeutralTone[], targetTone: number): NeutralTone | undefined => {
  return tones.find(tone => Math.abs(tone.tone - targetTone) < 5) || 
         tones.reduce((prev, curr) => 
           Math.abs(curr.tone - targetTone) < Math.abs(prev.tone - targetTone) ? curr : prev
         );
};

// Function to update CSS custom properties
const updateCSSCustomProperties = (colorSystem: ColorSystem) => {
  const root = document.documentElement;
  
  // Primary palette CSS variables
  colorSystem.primary.forEach((color) => {
    root.style.setProperty(`--primary-${color.tone}`, color.hex);
  });
  
  // Neutral palette CSS variables
  colorSystem.neutral.forEach((color) => {
    root.style.setProperty(`--neutral-${color.tone}`, color.hex);
  });
  
  // Semantic color mappings for Chat theme
  const primary40 = findToneByValue(colorSystem.primary, 40);
  const primary80 = findToneByValue(colorSystem.primary, 80);
  const primary90 = findToneByValue(colorSystem.primary, 90);
  const primary95 = findToneByValue(colorSystem.primary, 95);
  
  const neutral10 = findNeutralByValue(colorSystem.neutral, 10);
  const neutral20 = findNeutralByValue(colorSystem.neutral, 20);
  const neutral25 = findNeutralByValue(colorSystem.neutral, 25);
  const neutral30 = findNeutralByValue(colorSystem.neutral, 30);
  const neutral40 = findNeutralByValue(colorSystem.neutral, 40);
  const neutral50 = findNeutralByValue(colorSystem.neutral, 50);
  const neutral60 = findNeutralByValue(colorSystem.neutral, 60);
  const neutral80 = findNeutralByValue(colorSystem.neutral, 80);
  const neutral90 = findNeutralByValue(colorSystem.neutral, 90);
  const neutral95 = findNeutralByValue(colorSystem.neutral, 95);
  const neutral98 = findNeutralByValue(colorSystem.neutral, 98);
  
  // Chat theme semantic colors
  root.style.setProperty('--background-fills', neutral10?.hex || '#1C1C1C');
  root.style.setProperty('--container-fills', neutral20?.hex || '#2B2B2B');
  root.style.setProperty('--container-hover-fills', neutral25?.hex || '#333333');
  root.style.setProperty('--chat-container-bg', neutral10?.hex || '#191919');
  root.style.setProperty('--chat-assistant-response-bg', neutral20?.hex || '#292929');
  root.style.setProperty('--chat-user-response-bg', primary95?.hex || '#FFFFFF');
  
  // Brand colors
  root.style.setProperty('--brand-el-fills', primary80?.hex || '#FFFFFF');
  root.style.setProperty('--brand-el-hover-fills', primary90?.hex || 'rgba(255, 255, 255, 0.8)');
  
  // Text colors
  root.style.setProperty('--primary-text', neutral95?.hex || '#FFFFFF');
  root.style.setProperty('--secondary-text', neutral80?.hex || 'rgba(255, 255, 255, 0.6)');
  root.style.setProperty('--chat-assistant-response-text', neutral95?.hex || '#FFFFFF');
  root.style.setProperty('--chat-user-response-text', neutral10?.hex || '#191919');
  
  // Stroke colors
  root.style.setProperty('--stroke-default', `${neutral50?.hex || '#FFFFFF'}10`); // 10% opacity
  root.style.setProperty('--stroke-interactive-el', `${neutral60?.hex || '#FFFFFF'}20`); // 20% opacity
  root.style.setProperty('--stroke-interactive-el-hover', `${neutral80?.hex || '#FFFFFF'}66`); // 40% opacity
  root.style.setProperty('--stroke-interactive-el-selected', neutral95?.hex || '#FFFFFF');
};

interface ColorProviderProps {
  children: ReactNode;
}

export const ColorProvider: React.FC<ColorProviderProps> = ({ children }) => {
  const [colorSystem, setColorSystem] = useState<ColorSystem>({
    primary: [],
    neutral: [],
    baseColor: '#1E88E5',
    curveFunction: 's-shaped' as CurveFunction,
    stepCount: 22,
    includeExtremes: false,
  });

  // Generate initial palettes
  useEffect(() => {
    const primary = generateTonalPalette(
      colorSystem.baseColor,
      colorSystem.curveFunction,
      colorSystem.stepCount,
      colorSystem.includeExtremes
    );
    const neutral = generateNeutralPalette(
      colorSystem.baseColor,
      colorSystem.curveFunction,
      colorSystem.stepCount,
      true // Always include extremes for neutral
    );

    const newColorSystem = {
      ...colorSystem,
      primary,
      neutral,
    };

    setColorSystem(newColorSystem);
    updateCSSCustomProperties(newColorSystem);
  }, [colorSystem.baseColor, colorSystem.curveFunction, colorSystem.stepCount, colorSystem.includeExtremes]);

  const updateBaseColor = (color: string) => {
    setColorSystem(prev => ({ ...prev, baseColor: color }));
  };

  const updateCurveFunction = (curve: CurveFunction) => {
    setColorSystem(prev => ({ ...prev, curveFunction: curve }));
  };

  const updateStepCount = (count: number) => {
    setColorSystem(prev => ({ ...prev, stepCount: count }));
  };

  const updateIncludeExtremes = (include: boolean) => {
    setColorSystem(prev => ({ ...prev, includeExtremes: include }));
  };

  const getToneByValue = (tones: ColorTone[], targetTone: number) => {
    return findToneByValue(tones, targetTone);
  };

  const getNeutralByValue = (tones: NeutralTone[], targetTone: number) => {
    return findNeutralByValue(tones, targetTone);
  };

  const contextValue: ColorContextType = {
    colorSystem,
    updateBaseColor,
    updateCurveFunction,
    updateStepCount,
    updateIncludeExtremes,
    getToneByValue,
    getNeutralByValue,
  };

  return (
    <ColorContext.Provider value={contextValue}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColorSystem = (): ColorContextType => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColorSystem must be used within a ColorProvider');
  }
  return context;
}; 