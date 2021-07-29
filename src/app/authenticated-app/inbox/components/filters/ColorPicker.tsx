import React, { useState } from 'react';
import styled from '@emotion/styled';

type ColorPickerProps = {
  color: string;
  colors?: string[];
  onChange(color: string): void;
};

export const ColorPicker = (props: ColorPickerProps) => {
  const { color, colors = defaultColors, onChange } = props;

  const [selectedColor, setSelectedColor] = useState(color ?? '#DA9728');

  const handleColorClick = (e: React.MouseEvent<HTMLElement>, color: string) => {
    e.stopPropagation();
    setSelectedColor(color);
    onChange(color);
  };

  return (
    <Wrapper onClick={e => e.stopPropagation()}>
      {colors.map(color => {
        return (
          <ColorCircle
            key={color}
            color={color}
            isSelected={color === selectedColor}
            onClick={e => handleColorClick(e, color)}
          />
        );
      })}
    </Wrapper>
  );
};

type ColorCircleProps = {
  color: string;
  isSelected: boolean;
};

const ColorCircle = styled.div<ColorCircleProps>`
  box-sizing: border-box;
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  max-width: 100%;
  border-radius: 2px;
  cursor: pointer;
  ${p => p.color && `background: ${p.color};`};
  ${p =>
    p.isSelected &&
    `border: 5px solid ${p.color}; 
    background: white; 
    transition: all .2s ease-in-out; 
    transform: scale(1.2);`}
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > div {
    margin: 0 4px 4px 0px;
  }
`;

const defaultColors = [
  '#DA9728',
  '#1CD53B',
  '#B2334D',
  '#E183A8',
  '#4071D8',
  '#996F75',
  '#892BEE',
  '#EA396F',
  '#D8EAF9',
  '#7B515A',
  '#67217E',
  '#4DE6BB',
  '#402ADB',
  '#676EE0',
  '#13F077',
  '#8FDC5F',
  '#97476D',
  '#175B09',
  '#3E655C',
  '#947E19',
  '#8AD579',
  '#4ECAE9',
  '#503208',
  '#021376',
  '#BB090A',
  '#9B0558',
  '#916E99',
  '#899712',
  '#72E3F2',
  '#568DEB',
  '#540DDF',
  '#0671A4',
];
