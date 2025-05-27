import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { hexToHct, applyBellCurveToChroma, generateFunctionalPalette } from '../utils/colorUtils';
import type { CurveFunction, FunctionalPaletteType } from '../utils/colorUtils';
import styled from 'styled-components';
import { spacing, borders, shadows, typography } from '../styles/tokens';
import { Hct, hexFromArgb } from '@material/material-color-utilities';

const GraphContainer = styled.div`
  width: 100%;
  height: 500px;
  margin: 20px 0;
  padding: 20px;
  background: white;
  border-radius: ${borders.radius.lg};
  box-shadow: ${shadows.md};
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-bottom: ${spacing.md};
  flex-wrap: wrap;
  align-items: center;
`;

const ControlButton = styled.button<{ active: boolean }>`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${props => props.active ? '#0D99FF' : '#e0e0e0'};
  border-radius: ${borders.radius.md};
  background: ${props => props.active ? '#0D99FF' : 'white'};
  color: ${props => props.active ? 'white' : 'black'};
  cursor: pointer;
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.sm};
  transition: all 0.2s ease;

  &:hover {
    border-color: #0D99FF;
  }
`;

const Select = styled.select`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid #e0e0e0;
  border-radius: ${borders.radius.md};
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.sm};
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0D99FF;
  }
`;

const GraphSection = styled.div`
  display: flex;
  gap: ${spacing.lg};
  height: 400px;
`;

const ChartContainer = styled.div`
  flex: 1;
  min-width: 300px;
`;

const CurveInfo = styled.div`
  font-family: ${typography.fontFamily};
  font-size: ${typography.sizes.sm};
  color: #666;
  margin-top: ${spacing.xs};
  flex: 100%;
`;

interface HCTGraphProps {
  baseColor: string;
  palette: Array<{ tone: number; hex: string; chroma: number }>;
  curveFunction: CurveFunction;
  onCurveFunctionChange: (curve: CurveFunction) => void;
}

type CurveType = 'hue' | 'chroma' | 'tone';

interface ScatterPointProps {
  cx?: number;
  cy?: number;
  r?: number;
  fill?: string;
  stroke?: string;
  payload?: {
    tone: number;
    hue: number;
    chroma: number;
    hex: string;
  };
}

const HCTGraph: React.FC<HCTGraphProps> = ({ 
  baseColor, 
  palette, 
  curveFunction,
  onCurveFunctionChange 
}) => {
  const [activeCurve, setActiveCurve] = useState<CurveType>('tone');
  
  const baseHctValues = hexToHct(baseColor);
  const baseHue = baseHctValues.hue;
  const baseChroma = baseHctValues.chroma;
  
  // Create consistent data for all visualizations regardless of curve function
  const toneData = palette.map(({ tone, hex, chroma }) => {
    return {
      tone,
      hue: baseHue,
      chroma,
      hex,
    };
  });
  
  // Create a separate dataset for chroma visualization that's always the same
  // This ensures the chroma curve is identical regardless of selected curve function
  const chromaData = Array.from({ length: 101 }, (_, i) => {
    const tone = i;
    const chroma = applyBellCurveToChroma(baseChroma, tone);
    const hctColor = Hct.from(baseHue, chroma, tone);
    const hex = hexFromArgb(hctColor.toInt());
    
    return {
      tone,
      hue: baseHue,
      chroma,
      hex,
    };
  });

  const renderCurveChart = () => {
    const getYAxisDataKey = () => {
      switch (activeCurve) {
        case 'hue': return 'hue';
        case 'chroma': return 'chroma';
        case 'tone': return 'tone';
        default: return 'tone';
      }
    };

    const getYAxisDomain = () => {
      switch (activeCurve) {
        case 'hue': return [Math.floor(baseHue) - 5, Math.ceil(baseHue) + 5];
        case 'chroma': return [0, 150];
        case 'tone': return [0, 100];
        default: return [0, 100];
      }
    };

    const dataKey = getYAxisDataKey();
    
    // Use the correct dataset based on which curve we're viewing
    // Always use chromaData for chroma curve, regardless of selected curve function
    const chartData = activeCurve === 'chroma' ? chromaData : toneData;

    return (
      <ChartContainer>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="tone" 
              label={{ value: 'Tone', position: 'bottom' }}
            />
            <YAxis 
              dataKey={dataKey}
              domain={getYAxisDomain()}
              label={{ 
                value: activeCurve.charAt(0).toUpperCase() + activeCurve.slice(1), 
                angle: -90, 
                position: 'left' 
              }}
            />
            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '10px', 
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}>
                    <p>Tone: {Math.round(data.tone)}</p>
                    <p>Hue: {Math.round(data.hue)}°</p>
                    <p>Chroma: {Math.round(data.chroma)}</p>
                    <p>Hex: {data.hex}</p>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      backgroundColor: data.hex,
                      border: '1px solid #ccc',
                      margin: '5px 0'
                    }} />
                  </div>
                );
              }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke="#0D99FF" 
              strokeWidth={2}
              dot={{ fill: '#0D99FF', r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  };

  const renderScatterPlot = () => (
    <ChartContainer>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="hue" 
            name="Hue" 
            domain={[Math.floor(baseHue) - 5, Math.ceil(baseHue) + 5]}
            label={{ value: 'Hue', position: 'bottom' }}
          />
          <YAxis 
            type="number" 
            dataKey="chroma" 
            name="Chroma" 
            domain={[0, 150]}
            label={{ value: 'Chroma', angle: -90, position: 'left' }}
          />
          <ZAxis 
            type="number" 
            dataKey="tone" 
            name="Tone" 
            range={[60, 400]}
            domain={[0, 100]}
          />
          <Tooltip
            content={({ payload }) => {
              if (!payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '10px', 
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}>
                  <p>Hue: {Math.round(data.hue)}°</p>
                  <p>Chroma: {Math.round(data.chroma)}</p>
                  <p>Tone: {Math.round(data.tone)}</p>
                  <p>Hex: {data.hex}</p>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: data.hex,
                    border: '1px solid #ccc',
                    margin: '5px 0'
                  }} />
                </div>
              );
            }}
          />
          <Scatter
            data={activeCurve === 'chroma' ? chromaData : toneData}
            shape={(props: ScatterPointProps) => {
              const { cx, cy, payload } = props;
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={8} 
                  fill={payload?.hex} 
                  stroke="#333"
                  strokeWidth={1}
                />
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  );

  const FunctionalGeneratedSection = () => {
    const [type, setType] = React.useState<FunctionalPaletteType>('pastel');
    const palettes = generateFunctionalPalette(type, 5);
    const baseColors = {
      negative: '#D32F2F',
      positive: '#388E3C',
      informational: '#1976D2',
      warning: '#FFA000',
    } as const;
    const scaleNames: (keyof typeof baseColors)[] = ['negative', 'positive', 'informational', 'warning'];
    return (
      <div style={{ marginTop: 48 }}>
        <h2>Functional Color Palettes (Generated)</h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ marginRight: 8 }}>Type:</label>
          <select value={type} onChange={e => setType(e.target.value as FunctionalPaletteType)}>
            <option value="pastel">Pastel</option>
            <option value="bright">Bright</option>
            <option value="vivid">Vivid</option>
            <option value="muted">Muted</option>
            <option value="deep">Deep</option>
          </select>
        </div>
        {scaleNames.map((name) => (
          <div key={name} style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, textTransform: 'capitalize' }}>{name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 32, height: 32, background: baseColors[name], borderRadius: 8, border: '2px solid #333', marginBottom: 2 }} />
                <div style={{ fontSize: 11, color: '#888' }}>Source</div>
                <div style={{ fontSize: 11 }}>{baseColors[name]}</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {palettes[name].map((swatch) => (
                  <div key={swatch.hex} style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, background: swatch.hex, borderRadius: 8, border: '1px solid #eee', marginBottom: 4 }} />
                    <div style={{ fontSize: 12 }}>{swatch.hex}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>T{swatch.tone}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <GraphContainer>
        <ControlsContainer>
          <ControlButton 
            active={activeCurve === 'hue'} 
            onClick={() => setActiveCurve('hue')}
          >
            Hue Curve
          </ControlButton>
          <ControlButton 
            active={activeCurve === 'chroma'} 
            onClick={() => setActiveCurve('chroma')}
          >
            Chroma Curve
          </ControlButton>
          <ControlButton 
            active={activeCurve === 'tone'} 
            onClick={() => setActiveCurve('tone')}
          >
            Tone Curve
          </ControlButton>
          <Select 
            value={curveFunction}
            onChange={(e) => onCurveFunctionChange(e.target.value as CurveFunction)}
          >
            <option value="s-shaped">S-shaped</option>
            <option value="material">Material Design</option>
            <option value="linear">Linear</option>
            <option value="sine">Sine</option>
            <option value="cosine">Cosine</option>
            <option value="quadratic">Quadratic</option>
          </Select>
          <CurveInfo>
            Distribution curve only affects tone spacing - not chroma or hue values
          </CurveInfo>
        </ControlsContainer>
        
        <GraphSection>
          {renderCurveChart()}
          {renderScatterPlot()}
        </GraphSection>
      </GraphContainer>
      <FunctionalGeneratedSection />
    </>
  );
};

export default HCTGraph; 