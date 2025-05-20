import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { spacing, borders, shadows, typography } from '../styles/tokens';
import ColorPicker from './ColorPicker';
import TonalPalette from './TonalPalette';
import AlphaVariants from './AlphaVariants';
import HCTGraph from './HCTGraph';
import NeutralPalette from './NeutralPalette';
import {
  generateTonalPalette,
  generateNeutralPalette,
  hexToHct,
  findNearestToneIndex,
  getBestTextColor,
  CurveFunction,
} from '../utils/colorUtils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing.xl};
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
`;

const Title = styled.h1`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.xxxl};
  font-weight: ${typography.fontWeights.bold};
  margin: 0;
  text-align: center;
`;

const Description = styled.p`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.md};
  color: #666;
  max-width: 600px;
  text-align: center;
  margin: 0;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: ${borders.radius.lg};
  box-shadow: ${shadows.md};
  padding: ${spacing.lg};
`;

const Section = styled.section`
  margin-bottom: ${spacing.xl};
`;

const SectionTitle = styled.h2`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.xl};
  font-weight: ${typography.fontWeights.semibold};
  margin: 0 0 ${spacing.md} 0;
`;

const TextOnColorDemo = styled.div<{ backgroundColor: string; textColor: string }>`
  background-color: ${props => props.backgroundColor};
  color: ${props => props.textColor};
  padding: ${spacing.lg};
  border-radius: ${borders.radius.md};
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.fontWeights.medium};
  margin-top: ${spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const DemoText = styled.div`
  font-family: ${typography.fontFamily};
`;

const DemoDetails = styled.div`
  font-size: ${typography.sizes.sm};
  opacity: 0.8;
`;

const InfoSection = styled.div`
  display: flex;
  gap: ${spacing.lg};
  flex-wrap: wrap;
`;

const InfoCard = styled.div`
  flex: 1;
  min-width: 250px;
  background-color: #f9f9f9;
  border-radius: ${borders.radius.md};
  padding: ${spacing.md};
`;

const InfoTitle = styled.h4`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.md};
  font-weight: ${typography.fontWeights.semibold};
  margin: 0 0 ${spacing.sm} 0;
`;

const InfoContent = styled.div`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.sm};
`;

const ControlRow = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-top: ${spacing.md};
  align-items: center;
  flex-wrap: wrap;
`;

const ControlLabel = styled.label`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.sm};
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const StepInput = styled.input`
  padding: ${spacing.xs} ${spacing.sm};
  border: 1px solid #e0e0e0;
  border-radius: ${borders.radius.sm};
  width: 60px;
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.sm};
`;

const Checkbox = styled.input`
  margin: 0;
  cursor: pointer;
`;

const ColorGenerator: React.FC = () => {
  const [baseColor, setBaseColor] = useState('#1E88E5');
  const [tonalPalette, setTonalPalette] = useState<{ tone: number; hex: string; chroma: number }[]>([]);
  const [neutralPalette, setNeutralPalette] = useState<{ tone: number; chroma: number; hex: string }[]>([]);
  const [inputToneIndex, setInputToneIndex] = useState(0);
  const [selectedSwatchIndex, setSelectedSwatchIndex] = useState<number | null>(null);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [hctValues, setHctValues] = useState({ hue: 0, chroma: 0, tone: 0 });
  const [curveFunction, setCurveFunction] = useState<CurveFunction>('material');
  const [stepCount, setStepCount] = useState(13);
  const [includeExtremes, setIncludeExtremes] = useState(true);

  useEffect(() => {
    const palette = generateTonalPalette(baseColor, curveFunction, stepCount, includeExtremes);
    const neutral = generateNeutralPalette(baseColor, curveFunction, stepCount, includeExtremes);
    setTonalPalette(palette);
    setNeutralPalette(neutral);

    const { tone } = hexToHct(baseColor);
    const nearestIndex = findNearestToneIndex(tone, palette.map(p => p.tone));
    setInputToneIndex(nearestIndex);
    
    setTextColor(getBestTextColor(baseColor));
    setHctValues(hexToHct(baseColor));
    setSelectedSwatchIndex(null);
  }, [baseColor, curveFunction, stepCount, includeExtremes]);

  const handleCurveFunctionChange = (curve: CurveFunction) => {
    setCurveFunction(curve);
    // Reset selected swatch when changing curve function
    setSelectedSwatchIndex(null);
  }

  const handleSwatchClick = (index: number) => {
    setSelectedSwatchIndex(index);
  };

  const selectedSwatch = selectedSwatchIndex !== null ? tonalPalette[selectedSwatchIndex] : null;

  const handleStepCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 3 && value <= 30) {
      setStepCount(value);
    }
  };

  const handleIncludeExtremesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeExtremes(e.target.checked);
  };

  return (
    <Container>
      <Header>
        <Title>Dynamic Color Generator</Title>
        <Description>
          Generate a complete tonal palette from any base color using the HCT color space.
          Includes alpha variants, neutral palette, and automatic text color contrast calculation.
        </Description>
      </Header>

      <Card>
        <Section>
          <SectionTitle>1. Choose Your Base Color</SectionTitle>
          <ColorPicker value={baseColor} onChange={setBaseColor} />
          
          <TextOnColorDemo backgroundColor={baseColor} textColor={textColor}>
            <DemoText>Text on your selected color</DemoText>
            <DemoDetails>
              Using {textColor} for optimal contrast
            </DemoDetails>
          </TextOnColorDemo>

          <ControlRow>
            <ControlLabel>
              Number of Steps:
              <StepInput 
                type="number" 
                min="3" 
                max="30" 
                value={stepCount} 
                onChange={handleStepCountChange}
              />
            </ControlLabel>
            <ControlLabel>
              <Checkbox 
                type="checkbox" 
                checked={includeExtremes} 
                onChange={handleIncludeExtremesChange}
              />
              Include Pure Black/White (T0/T100)
            </ControlLabel>
          </ControlRow>
        </Section>

        <Section>
          <InfoSection>
            <InfoCard>
              <InfoTitle>HCT Values</InfoTitle>
              <InfoContent>
                <p>Hue: {hctValues.hue.toFixed(2)}°</p>
                <p>Chroma: {hctValues.chroma.toFixed(2)}</p>
                <p>Tone: {hctValues.tone.toFixed(2)}</p>
              </InfoContent>
            </InfoCard>
            <InfoCard>
              <InfoTitle>About This Color</InfoTitle>
              <InfoContent>
                <p>Hex: {baseColor.toUpperCase()}</p>
                <p>Nearest Tone Step: T{tonalPalette[inputToneIndex]?.tone}</p>
                <p>Best Text Color: {textColor}</p>
              </InfoContent>
            </InfoCard>
            <InfoCard>
              <InfoTitle>Curve Function</InfoTitle>
              <InfoContent>
                <p>Selected: {curveFunction.charAt(0).toUpperCase() + curveFunction.slice(1)}</p>
                <p><i>Note: Curve function only affects tone distribution, not chroma or hue values</i></p>
              </InfoContent>
            </InfoCard>
          </InfoSection>
        </Section>

        <Section>
          <SectionTitle>HCT Color Space Visualization</SectionTitle>
          <HCTGraph 
            baseColor={baseColor} 
            palette={tonalPalette}
            curveFunction={curveFunction}
            onCurveFunctionChange={handleCurveFunctionChange}
          />
        </Section>

        <Section>
          <SectionTitle>2. Tonal Palette</SectionTitle>
          <TonalPalette
            palette={tonalPalette}
            inputToneIndex={inputToneIndex}
            onSwatchClick={handleSwatchClick}
          />
        </Section>

        <Section>
          <SectionTitle>3. Brand-Toned Neutral Palette</SectionTitle>
          <NeutralPalette 
            palette={neutralPalette}
            getBestTextColor={getBestTextColor}
          />
        </Section>

        {selectedSwatch && (
          <Section>
            <SectionTitle>4. Alpha Variants</SectionTitle>
            <AlphaVariants
              hex={selectedSwatch.hex}
              tone={selectedSwatch.tone}
              variants={[0.05, 0.1, 0.2, 0.4, 0.6, 0.8].map(alpha => ({
                alpha,
                rgba: `rgba(${parseInt(selectedSwatch.hex.slice(1, 3), 16)}, ${parseInt(
                  selectedSwatch.hex.slice(3, 5),
                  16
                )}, ${parseInt(selectedSwatch.hex.slice(5, 7), 16)}, ${alpha})`,
              }))}
            />
          </Section>
        )}
      </Card>
    </Container>
  );
};

export default ColorGenerator; 