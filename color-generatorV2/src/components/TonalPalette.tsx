import React from "react";
import styled from "styled-components";
import { spacing, typography } from "../styles/tokens";
import TonalSwatch from "./TonalSwatch";

interface TonalColor {
  tone: number;
  hex: string;
}

interface TonalPaletteProps {
  palette: TonalColor[];
  inputToneIndex: number;
  onSwatchClick: (index: number) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const Title = styled.h3`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.fontWeights.semibold};
  margin: 0;
`;

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: ${spacing.md};
`;

const TonalPalette: React.FC<TonalPaletteProps> = ({
  palette,
  inputToneIndex,
  onSwatchClick,
}) => {
  console.log('TonalPalette palette:', palette);
  return (
    <Container>
      <style>
        {`
          body {
            ${palette && palette.length > 0
              ? palette
                  .map((color) => `--tone-${color.tone}: ${color.hex};`)
                  .join("\n            ")
              : "/* No palette data */"
            }
          }
        `}
      </style>
      <Title>Tonal Palette</Title>
      <SwatchGrid>
        {palette.map((color, index) => (
          <TonalSwatch
            key={color.tone}
            tone={color.tone}
            hex={color.hex}
            isInputTone={index === inputToneIndex}
            onClick={() => onSwatchClick(index)}
          />
        ))}
      </SwatchGrid>
    </Container>
  );
};

export default TonalPalette;
