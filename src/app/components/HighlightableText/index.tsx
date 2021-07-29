import React from 'react';
import { Text, BoxProps } from '@chakra-ui/core';

export function HighlightableText({ text, highlight, ...rest }: {
  text?: string;
  highlight?: string;
} & BoxProps) {
  const parts = (text || '').split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <Text {...rest}>
      {parts.map((part, index) => part.toLowerCase() === (highlight || '').toLowerCase() ? <span key={`${index}-${part}`} style={{ backgroundColor: '#fc0' }}>{part}</span> : part)}
    </Text>
  )
}
