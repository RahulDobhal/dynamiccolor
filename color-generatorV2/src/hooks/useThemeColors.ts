import { useColorSystem } from '../contexts/ColorContext';

/**
 * Custom hook that provides easy access to theme colors
 * Returns commonly used colors from the generated palette
 */
export const useThemeColors = () => {
  const { colorSystem, getToneByValue, getNeutralByValue } = useColorSystem();

  // Primary colors
  const primary = {
    50: getToneByValue(colorSystem.primary, 50)?.hex || '#E3F2FD',
    100: getToneByValue(colorSystem.primary, 100)?.hex || '#BBDEFB',
    200: getToneByValue(colorSystem.primary, 200)?.hex || '#90CAF9',
    300: getToneByValue(colorSystem.primary, 300)?.hex || '#64B5F6',
    400: getToneByValue(colorSystem.primary, 400)?.hex || '#42A5F5',
    500: getToneByValue(colorSystem.primary, 500)?.hex || '#2196F3',
    600: getToneByValue(colorSystem.primary, 600)?.hex || '#1E88E5',
    700: getToneByValue(colorSystem.primary, 700)?.hex || '#1976D2',
    800: getToneByValue(colorSystem.primary, 800)?.hex || '#1565C0',
    900: getToneByValue(colorSystem.primary, 900)?.hex || '#0D47A1',
  };

  // Neutral colors
  const neutral = {
    0: getNeutralByValue(colorSystem.neutral, 0)?.hex || '#000000',
    10: getNeutralByValue(colorSystem.neutral, 10)?.hex || '#1A1A1A',
    20: getNeutralByValue(colorSystem.neutral, 20)?.hex || '#333333',
    30: getNeutralByValue(colorSystem.neutral, 30)?.hex || '#4D4D4D',
    40: getNeutralByValue(colorSystem.neutral, 40)?.hex || '#666666',
    50: getNeutralByValue(colorSystem.neutral, 50)?.hex || '#808080',
    60: getNeutralByValue(colorSystem.neutral, 60)?.hex || '#999999',
    70: getNeutralByValue(colorSystem.neutral, 70)?.hex || '#B3B3B3',
    80: getNeutralByValue(colorSystem.neutral, 80)?.hex || '#CCCCCC',
    90: getNeutralByValue(colorSystem.neutral, 90)?.hex || '#E6E6E6',
    95: getNeutralByValue(colorSystem.neutral, 95)?.hex || '#F3F3F3',
    100: getNeutralByValue(colorSystem.neutral, 100)?.hex || '#FFFFFF',
  };

  // Semantic colors for UI components
  const semantic = {
    background: neutral[10],
    surface: neutral[20],
    surfaceVariant: neutral[30],
    onBackground: neutral[90],
    onSurface: neutral[90],
    onSurfaceVariant: neutral[80],
    primary: getToneByValue(colorSystem.primary, 40)?.hex || primary[600],
    onPrimary: neutral[100],
    primaryContainer: getToneByValue(colorSystem.primary, 90)?.hex || primary[100],
    onPrimaryContainer: getToneByValue(colorSystem.primary, 10)?.hex || primary[900],
    outline: neutral[50],
    outlineVariant: neutral[30],
  };

  return {
    primary,
    neutral,
    semantic,
    baseColor: colorSystem.baseColor,
    // Helper function to get any tone
    getPrimaryTone: (tone: number) => getToneByValue(colorSystem.primary, tone)?.hex,
    getNeutralTone: (tone: number) => getNeutralByValue(colorSystem.neutral, tone)?.hex,
  };
}; 