import React from 'react';
import styled from 'styled-components';
import { spacing, borders, typography } from '../styles/tokens';
import { useThemeColors } from '../hooks/useThemeColors';
import { useColorSystem } from '../contexts/ColorContext';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  padding: ${spacing.lg};
  background: var(--background-fills, #1C1C1C);
  border-radius: ${borders.radius.lg};
  margin: ${spacing.lg} 0;
`;

const DemoTitle = styled.h3`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.fontWeights.semibold};
  color: var(--primary-text, #FFFFFF);
  margin: 0;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${spacing.md};
`;

const ColorCard = styled.div<{ bgColor: string; textColor: string }>`
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  padding: ${spacing.md};
  border-radius: ${borders.radius.md};
  text-align: center;
  border: 1px solid var(--stroke-default, rgba(255, 255, 255, 0.1));
`;

const ColorLabel = styled.div`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.sm};
  font-weight: ${typography.fontWeights.medium};
  margin-bottom: ${spacing.xs};
`;

const ColorValue = styled.div`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.xs};
  opacity: 0.8;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const SectionTitle = styled.h4`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.md};
  font-weight: ${typography.fontWeights.medium};
  color: var(--secondary-text, rgba(255, 255, 255, 0.6));
  margin: 0;
`;

const CurrentBrandColor = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: var(--container-fills, #2B2B2B);
  border-radius: ${borders.radius.md};
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  background-color: ${props => props.color};
  border-radius: ${borders.radius.sm};
  border: 1px solid var(--stroke-default, rgba(255, 255, 255, 0.1));
`;

const ColorInfo = styled.div`
  font-family: ${typography.fontFamily};
  color: var(--primary-text, #FFFFFF);
`;

export const ColorSystemDemo: React.FC = () => {
  const { primary, neutral, semantic, baseColor } = useThemeColors();
  const { colorSystem } = useColorSystem();

  const getContrastColor = (bgColor: string) => {
    // Simple contrast calculation
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  return (
    <DemoContainer>
      <DemoTitle>Live Color System Demo</DemoTitle>
      
      <CurrentBrandColor color={baseColor}>
        <ColorSwatch color={baseColor} />
        <ColorInfo>
          <div>Current Brand Color: {baseColor.toUpperCase()}</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            {colorSystem.primary.length} primary tones • {colorSystem.neutral.length} neutral tones
          </div>
        </ColorInfo>
      </CurrentBrandColor>

      <Section>
        <SectionTitle>Primary Colors (Auto-generated from Brand Color)</SectionTitle>
        <ColorGrid>
          {Object.entries(primary).slice(0, 6).map(([tone, color]) => (
            <ColorCard key={tone} bgColor={color} textColor={getContrastColor(color)}>
              <ColorLabel>Primary {tone}</ColorLabel>
              <ColorValue>{color}</ColorValue>
            </ColorCard>
          ))}
        </ColorGrid>
      </Section>

      <Section>
        <SectionTitle>Neutral Colors (Brand-toned)</SectionTitle>
        <ColorGrid>
          {[neutral[10], neutral[20], neutral[40], neutral[60], neutral[80], neutral[95]].map((color, index) => {
            const tones = [10, 20, 40, 60, 80, 95];
            return (
              <ColorCard key={index} bgColor={color} textColor={getContrastColor(color)}>
                <ColorLabel>Neutral {tones[index]}</ColorLabel>
                <ColorValue>{color}</ColorValue>
              </ColorCard>
            );
          })}
        </ColorGrid>
      </Section>

      <Section>
        <SectionTitle>Semantic Colors (Used in Chat UI)</SectionTitle>
        <ColorGrid>
          <ColorCard bgColor={semantic.background} textColor={semantic.onBackground}>
            <ColorLabel>Background</ColorLabel>
            <ColorValue>{semantic.background}</ColorValue>
          </ColorCard>
          <ColorCard bgColor={semantic.surface} textColor={semantic.onSurface}>
            <ColorLabel>Surface</ColorLabel>
            <ColorValue>{semantic.surface}</ColorValue>
          </ColorCard>
          <ColorCard bgColor={semantic.primary} textColor={semantic.onPrimary}>
            <ColorLabel>Primary</ColorLabel>
            <ColorValue>{semantic.primary}</ColorValue>
          </ColorCard>
          <ColorCard bgColor={semantic.primaryContainer} textColor={semantic.onPrimaryContainer}>
            <ColorLabel>Primary Container</ColorLabel>
            <ColorValue>{semantic.primaryContainer}</ColorValue>
          </ColorCard>
        </ColorGrid>
      </Section>
    </DemoContainer>
  );
}; 