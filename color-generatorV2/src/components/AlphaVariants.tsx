import React from 'react';
import styled from 'styled-components';
import { spacing, typography, borders } from '../styles/tokens';

interface AlphaVariant {
  alpha: number;
  rgba: string;
}

interface AlphaVariantsProps {
  hex: string;
  tone: number;
  variants: AlphaVariant[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  padding: ${spacing.md};
  border-radius: ${borders.radius.md};
  border: ${borders.width.thin} solid #ddd;
  background-color: #fff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${borders.radius.md};
  background-color: ${props => props.color};
  border: ${borders.width.thin} solid #ddd;
`;

const Title = styled.h3`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.md};
  font-weight: ${typography.fontWeights.semibold};
  margin: 0;
`;

const VariantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: ${spacing.sm};
`;

const AlphaVariantItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const AlphaColorPreview = styled.div<{ color: string }>`
  width: 100%;
  height: 48px;
  border-radius: ${borders.radius.sm};
  background-color: ${props => props.color};
  border: ${borders.width.thin} solid #ddd;
`;

const AlphaLabel = styled.div`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.xs};
  color: #666;
`;

const RgbaValue = styled.div`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.xs};
  color: #666;
  word-break: break-all;
`;

const AlphaVariants: React.FC<AlphaVariantsProps> = ({ hex, tone, variants }) => {
  return (
    <Container>
      <Header>
        <ColorPreview color={hex} />
        <Title>Alpha Variants for T{tone}</Title>
      </Header>
      
      <VariantsGrid>
        {variants.map(variant => (
          <AlphaVariantItem key={variant.alpha}>
            <AlphaColorPreview color={variant.rgba} />
            <AlphaLabel>Alpha: {variant.alpha * 100}%</AlphaLabel>
            <RgbaValue>{variant.rgba}</RgbaValue>
          </AlphaVariantItem>
        ))}
      </VariantsGrid>
    </Container>
  );
};

export default AlphaVariants; 