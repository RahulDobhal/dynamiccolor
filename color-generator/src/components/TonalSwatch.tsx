import React from 'react';
import styled from 'styled-components';
import { spacing, typography, borders } from '../styles/tokens';

interface TonalSwatchProps {
  tone: number;
  hex: string;
  isInputTone?: boolean;
  onClick?: () => void;
}

interface SwatchContainerProps {
  isInputTone?: boolean;
  hex: string;
}

const SwatchContainer = styled.div<SwatchContainerProps>`
  display: flex;
  flex-direction: column;
  border-radius: ${borders.radius.md};
  overflow: hidden;
  border: ${props => props.isInputTone ? '2px solid #000' : borders.width.thin + ' solid #ddd'};
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ColorBlock = styled.div<{ hex: string }>`
  background-color: ${props => props.hex};
  height: 80px;
  width: 100%;
`;

const SwatchInfo = styled.div`
  padding: ${spacing.xs} ${spacing.sm};
  background-color: #fff;
`;

const ToneLabel = styled.div`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.sm};
  font-weight: ${typography.fontWeights.semibold};
`;

const HexValue = styled.div`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.xs};
  color: #666;
  margin-top: ${spacing.xs};
`;

const TonalSwatch: React.FC<TonalSwatchProps> = ({ 
  tone, 
  hex, 
  isInputTone = false,
  onClick
}) => {
  return (
    <SwatchContainer isInputTone={isInputTone} hex={hex} onClick={onClick}>
      <ColorBlock hex={hex} />
      <SwatchInfo>
        <ToneLabel>T{tone}</ToneLabel>
        <HexValue>{hex.toUpperCase()}</HexValue>
      </SwatchInfo>
    </SwatchContainer>
  );
};

export default TonalSwatch; 