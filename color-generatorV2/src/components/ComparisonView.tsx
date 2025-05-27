import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { spacing, typography, borders } from '../styles/tokens';
import {
  generateTonalPalette,
  hexToHct,
  TONE_STEPS
} from '../utils/colorUtils';

const Container = styled.div`
  padding: ${spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.xl};
  font-weight: ${typography.fontWeights.semibold};
  margin-bottom: ${spacing.md};
`;

const Subtitle = styled.h3`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.fontWeights.medium};
  margin-top: ${spacing.lg};
  margin-bottom: ${spacing.md};
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
`;

const ColorInput = styled.input`
  width: 48px;
  height: 48px;
  border-radius: ${borders.radius.md};
  border: ${borders.width.thin} solid #ddd;
  padding: 0;
  cursor: pointer;
`;

const HexInput = styled.input`
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borders.radius.md};
  border: ${borders.width.thin} solid #ddd;
  font-family: monospace;
  width: 100px;
`;

const PaletteGrid = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(2, 1fr);
  gap: ${spacing.md};
  margin-bottom: ${spacing.xl};
`;

const GridHeader = styled.div`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.md};
  font-weight: ${typography.fontWeights.semibold};
  padding: ${spacing.sm};
`;

const GridCell = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.xs};
`;

const ToneLabel = styled.div`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.md};
  font-weight: ${typography.fontWeights.medium};
`;

const ColorSwatch = styled.div<{ bgColor: string }>`
  width: 100%;
  height: 40px;
  background-color: ${props => props.bgColor};
  border: ${borders.width.thin} solid rgba(0, 0, 0, 0.1);
  border-radius: ${borders.radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ColorHex = styled.div<{ isDark: boolean }>`
  font-family: monospace;
  font-size: ${typography.sizes.sm};
  color: ${props => props.isDark ? 'white' : 'black'};
  text-shadow: 0 0 2px ${props => props.isDark ? 'black' : 'white'};
`;

// Simple luminance calculation to determine text color
const isColorDark = (hex: string): boolean => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.5;
};

// Plugin's simplified preview approximation
const approximateTonalPalette = (baseHex: string, tones: number[]) => {
  // Get base color
  const r = parseInt(baseHex.slice(1, 3), 16) / 255;
  const g = parseInt(baseHex.slice(3, 5), 16) / 255;
  const b = parseInt(baseHex.slice(5, 7), 16) / 255;
  
  // Extract base color luminance (very simplified)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
  // Simple tone mapping (not accurate HCT, just for preview)
  return tones.map(tone => {
    // Special cases for extremes
    if (tone <= 0) return { tone, hex: '#000000' };
    if (tone >= 100) return { tone, hex: '#FFFFFF' };
    
    // Approximate tonal mapping
    const factor = tone / 100;
    
    // For tones below the base color luminance
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
    // For tones above the base color luminance
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
  });
};

const ComparisonView: React.FC = () => {
  const [baseColor, setBaseColor] = useState('#FF0000');
  const [actualPalette, setActualPalette] = useState<Array<{ tone: number; hex: string }>>([]);
  const [approximatedPalette, setApproximatedPalette] = useState<Array<{ tone: number; hex: string }>>([]);

  useEffect(() => {
    // Generate actual HCT-based palette
    setActualPalette(generateTonalPalette(baseColor));
    
    // Generate approximated palette (like the plugin preview)
    setApproximatedPalette(approximateTonalPalette(baseColor, TONE_STEPS));
  }, [baseColor]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor(e.target.value);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(e.target.value)) {
      setBaseColor(e.target.value);
    }
  };

  return (
    <Container>
      <Title>Plugin vs. Actual HCT Color Comparison</Title>
      
      <InputRow>
        <ColorInput 
          type="color" 
          value={baseColor} 
          onChange={handleColorChange} 
        />
        <HexInput 
          type="text" 
          value={baseColor} 
          onChange={handleHexChange} 
          placeholder="#000000" 
        />
      </InputRow>

      <Subtitle>Base Color: {baseColor}</Subtitle>
      <p>HCT Values: H: {hexToHct(baseColor).hue.toFixed(1)}° C: {hexToHct(baseColor).chroma.toFixed(1)} T: {hexToHct(baseColor).tone.toFixed(1)}</p>
      
      <PaletteGrid>
        <GridHeader>Tone</GridHeader>
        <GridHeader>Plugin Preview (Approximated)</GridHeader>
        <GridHeader>Actual HCT Color</GridHeader>
        
        {TONE_STEPS.map((tone, index) => {
          const approxColor = approximatedPalette[index]?.hex || '#CCCCCC';
          const actualColor = actualPalette[index]?.hex || '#CCCCCC';
          
          return (
            <React.Fragment key={tone}>
              <GridCell>
                <ToneLabel>T{tone}</ToneLabel>
              </GridCell>
              <GridCell>
                <ColorSwatch bgColor={approxColor}>
                  <ColorHex isDark={isColorDark(approxColor)}>{approxColor.toUpperCase()}</ColorHex>
                </ColorSwatch>
              </GridCell>
              <GridCell>
                <ColorSwatch bgColor={actualColor}>
                  <ColorHex isDark={isColorDark(actualColor)}>{actualColor.toUpperCase()}</ColorHex>
                </ColorSwatch>
              </GridCell>
            </React.Fragment>
          );
        })}
      </PaletteGrid>
    </Container>
  );
};

export default ComparisonView; 