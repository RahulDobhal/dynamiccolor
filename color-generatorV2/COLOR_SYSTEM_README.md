# Dynamic Color System

This project implements a comprehensive dynamic color system that automatically generates color palettes from a brand color and applies them throughout the application, including the Chat UI.

## Features

- **HCT Color Space**: Uses Google's HCT (Hue, Chroma, Tone) color space for perceptually uniform color generation
- **Automatic Palette Generation**: Creates both primary and neutral color palettes from a single brand color
- **Real-time Updates**: All UI components update automatically when the brand color changes
- **CSS Custom Properties**: Colors are exposed as CSS variables for easy integration
- **Foundation Tokens**: Uses design system tokens for spacing, typography, and other design elements
- **Type-safe**: Full TypeScript support with proper type definitions

## Architecture

### ColorContext (`src/contexts/ColorContext.tsx`)

The central state management for the color system:

```typescript
interface ColorSystem {
  primary: ColorTone[];      // Generated primary palette
  neutral: NeutralTone[];    // Generated neutral palette
  baseColor: string;         // Current brand color
  curveFunction: CurveFunction;
  stepCount: number;
  includeExtremes: boolean;
}
```

### Key Functions

- `updateBaseColor(color: string)` - Updates the brand color and regenerates palettes
- `updateCurveFunction(curve: CurveFunction)` - Changes the tone distribution curve
- `updateStepCount(count: number)` - Adjusts the number of color steps
- `getToneByValue(tones, targetTone)` - Finds the closest tone to a target value

## Usage

### 1. Wrap Your App with ColorProvider

```typescript
import { ColorProvider } from './contexts/ColorContext';

function App() {
  return (
    <ColorProvider>
      {/* Your app components */}
    </ColorProvider>
  );
}
```

### 2. Use the Color System in Components

```typescript
import { useColorSystem } from '../contexts/ColorContext';

const MyComponent = () => {
  const { colorSystem, updateBaseColor } = useColorSystem();
  
  return (
    <div style={{ backgroundColor: colorSystem.primary[0]?.hex }}>
      <button onClick={() => updateBaseColor('#FF5722')}>
        Change Brand Color
      </button>
    </div>
  );
};
```

### 3. Use the Theme Colors Hook

```typescript
import { useThemeColors } from '../hooks/useThemeColors';

const MyComponent = () => {
  const { primary, neutral, semantic } = useThemeColors();
  
  return (
    <div style={{ 
      backgroundColor: semantic.background,
      color: semantic.onBackground 
    }}>
      Content with semantic colors
    </div>
  );
};
```

### 4. Use CSS Custom Properties

The system automatically sets CSS custom properties that you can use in styled-components or CSS:

```css
.my-component {
  background-color: var(--background-fills);
  color: var(--primary-text);
  border: 1px solid var(--stroke-default);
}
```

## Available CSS Variables

### Primary Colors
- `--primary-{tone}` (e.g., `--primary-40`, `--primary-80`)

### Neutral Colors
- `--neutral-{tone}` (e.g., `--neutral-10`, `--neutral-90`)

### Semantic Colors (Used in Chat UI)
- `--background-fills` - Main background color
- `--container-fills` - Container/surface color
- `--container-hover-fills` - Hover state for containers
- `--chat-container-bg` - Chat container background
- `--chat-assistant-response-bg` - Assistant message background
- `--chat-user-response-bg` - User message background
- `--brand-el-fills` - Brand element fills
- `--brand-el-hover-fills` - Brand element hover state
- `--primary-text` - Primary text color
- `--secondary-text` - Secondary text color
- `--chat-assistant-response-text` - Assistant message text
- `--chat-user-response-text` - User message text
- `--stroke-default` - Default border/stroke color
- `--stroke-interactive-el` - Interactive element borders
- `--stroke-interactive-el-hover` - Interactive element hover borders
- `--stroke-interactive-el-selected` - Selected element borders

## Chat UI Integration

The Chat component automatically uses the generated colors through CSS custom properties:

```typescript
<ThemeProvider
  theme={{
    backgroundFills: "var(--background-fills, #1C1C1C)",
    containerFills: "var(--container-fills, #2B2B2B)",
    primaryText: "var(--primary-text, #FFFFFF)",
    // ... other theme properties
  }}
>
```

When you change the brand color in the ColorGenerator, the Chat UI will automatically update to reflect the new color scheme.

## Color Generation Process

1. **Input**: Brand color (hex value)
2. **HCT Conversion**: Convert to HCT color space
3. **Tone Generation**: Generate tone steps using configurable curve functions
4. **Primary Palette**: Apply bell curve to chroma for natural color progression
5. **Neutral Palette**: Generate brand-toned neutrals with reduced chroma
6. **CSS Variables**: Update CSS custom properties for immediate UI updates
7. **Semantic Mapping**: Map specific tones to semantic color roles

## Tone Mapping Strategy

### Primary Colors
- **Tone 10-20**: Very dark variants
- **Tone 40**: Standard primary color
- **Tone 80-90**: Light variants for containers
- **Tone 95**: Very light variants

### Neutral Colors
- **Tone 10**: Dark backgrounds
- **Tone 20-30**: Surface colors
- **Tone 50**: Mid-tone for borders
- **Tone 80-95**: Light text and surfaces

## Best Practices

1. **Use Semantic Colors**: Prefer `semantic.background` over direct tone access
2. **Fallback Values**: Always provide fallback values in CSS custom properties
3. **Contrast Checking**: The system includes automatic contrast calculation
4. **Foundation Tokens**: Use spacing, typography, and other design tokens consistently
5. **Type Safety**: Leverage TypeScript interfaces for better development experience

## Example: Creating a Themed Component

```typescript
import React from 'react';
import styled from 'styled-components';
import { spacing, borders } from '../styles/tokens';
import { useThemeColors } from '../hooks/useThemeColors';

const ThemedCard = styled.div<{ bgColor: string; textColor: string }>`
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  padding: ${spacing.lg};
  border-radius: ${borders.radius.md};
  border: 1px solid var(--stroke-default);
`;

export const MyThemedComponent = () => {
  const { semantic } = useThemeColors();
  
  return (
    <ThemedCard 
      bgColor={semantic.surface} 
      textColor={semantic.onSurface}
    >
      This card automatically adapts to the current color scheme!
    </ThemedCard>
  );
};
```

## Development

To see the color system in action:

1. Run the application: `npm run dev`
2. Navigate to the Generator tab
3. Change the brand color using the color picker
4. Observe how the Chat UI and demo components update automatically
5. Check the browser's developer tools to see the CSS custom properties being updated

The system is designed to be scalable, maintainable, and follows design system best practices for consistent UI theming. 