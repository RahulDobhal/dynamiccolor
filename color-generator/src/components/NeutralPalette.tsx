import React from 'react';
import styled from 'styled-components';
import { spacing, borders, shadows, typography } from '../styles/tokens';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const SwatchesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${spacing.md};
  background: white;
  border-radius: ${borders.radius.lg};
  box-shadow: ${shadows.md};
  padding: ${spacing.lg};
`;

const Swatch = styled.div<{ color: string; textColor: string }>`
  display: flex;
  flex-direction: column;
  aspect-ratio: 1;
  background-color: ${props => props.color};
  color: ${props => props.textColor};
  border-radius: ${borders.radius.md};
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.sm};
  transition: transform 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.02);
  }
`;

const SwatchContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${spacing.sm};
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
`;

const SwatchLabel = styled.div`
  font-weight: ${typography.fontWeights.medium};
  margin-bottom: ${spacing.xs};
`;

const SwatchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  font-size: ${typography.sizes.xs};
  opacity: 0.9;
`;

const InfoItem = styled.span`
  font-family: ${typography.fontFamily};
`;

interface NeutralPaletteProps {
  palette: Array<{
    tone: number;
    chroma: number;
    hex: string;
  }>;
  getBestTextColor: (hex: string) => string;
}

const NeutralPalette: React.FC<NeutralPaletteProps> = ({ palette, getBestTextColor }) => {
  return (
    <Container>
      <SwatchesContainer>
        {palette.map(({ tone, chroma, hex }) => (
          <Swatch 
            key={tone} 
            color={hex}
            textColor={getBestTextColor(hex)}
          >
            <SwatchContent>
              <SwatchLabel>T{tone}</SwatchLabel>
              <SwatchInfo>
                <InfoItem>{hex.toUpperCase()}</InfoItem>
                <InfoItem>C{chroma.toFixed(1)}</InfoItem>
              </SwatchInfo>
            </SwatchContent>
          </Swatch>
        ))}
      </SwatchesContainer>
    </Container>
  );
};

export default NeutralPalette; 