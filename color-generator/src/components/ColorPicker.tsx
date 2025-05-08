import React from 'react';
import styled from 'styled-components';
import { spacing, typography, borders } from '../styles/tokens';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const Label = styled.label`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.md};
  font-weight: ${typography.fontWeights.medium};
`;

const PickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${borders.radius.md};
  background-color: ${props => props.color};
  border: ${borders.width.thin} solid #ddd;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  opacity: 0;
  position: absolute;
  pointer-events: none;
`;

const HexInput = styled.input`
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borders.radius.md};
  border: ${borders.width.thin} solid #ddd;
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.md};
  width: 100px;
`;

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label = 'Base Color' }) => {
  const colorInputRef = React.useRef<HTMLInputElement>(null);

  const handleColorPreviewClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Make sure the hex value starts with #
    let newValue = e.target.value;
    if (!newValue.startsWith('#')) {
      newValue = '#' + newValue;
    }
    
    // Validate hex format
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <PickerContainer>
        <ColorPreview color={value} onClick={handleColorPreviewClick} />
        <HiddenInput
          ref={colorInputRef}
          type="color"
          value={value}
          onChange={handleColorChange}
        />
        <HexInput
          type="text"
          value={value}
          onChange={handleHexChange}
          placeholder="#000000"
        />
      </PickerContainer>
    </Container>
  );
};

export default ColorPicker; 