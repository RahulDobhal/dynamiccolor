import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { hexToHct, CurveFunction } from '../utils/colorUtils';
import styled from 'styled-components';
import { spacing, borders, shadows, typography } from '../styles/tokens';

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

interface HCTGraphProps {
  baseColor: string;
  palette: Array<{ tone: number; hex: string; chroma: number }>;
  curveFunction: CurveFunction;
  onCurveFunctionChange: (curve: CurveFunction) => void;
}

type CurveType = 'hue' | 'chroma' | 'tone';

const HCTGraph: React.FC<HCTGraphProps> = ({ 
  baseColor, 
  palette, 
  curveFunction,
  onCurveFunctionChange 
}) => {
  const [activeCurve, setActiveCurve] = useState<CurveType>('tone');
  
  const data = palette.map(({ tone, hex, chroma }) => {
    const hct = hexToHct(hex);
    return {
      tone,
      hue: hct.hue,
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
        case 'hue': return [0, 360];
        case 'chroma': return [0, 150];
        case 'tone': return [0, 100];
        default: return [0, 100];
      }
    };

    const dataKey = getYAxisDataKey();

    return (
      <ChartContainer>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
            domain={[0, 360]}
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
            range={[50, 400]}
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
                </div>
              );
            }}
          />
          <Scatter
            data={data}
            fill="#0D99FF"
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  );

  return (
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
          <option value="material">Material Design</option>
          <option value="linear">Linear</option>
          <option value="sine">Sine</option>
          <option value="cosine">Cosine</option>
          <option value="quadratic">Quadratic</option>
        </Select>
      </ControlsContainer>
      
      <GraphSection>
        {renderCurveChart()}
        {renderScatterPlot()}
      </GraphSection>
    </GraphContainer>
  );
};

export default HCTGraph; 