import React from 'react';
import { Box } from '@chakra-ui/core/dist';

export const DNDCell = (props: any) => {
  const { value } = props;

  if (value !== true && value !== false) return <Box />;

  const styles = {
    fontSize: '12px',
    padding: '1.5px 3px',
    backgroundColor: value ? '#00876b33' : '#ff001a33',
    borderColor: value ? '#00876b33' : '#ff001a33',
    borderRadius: '5px',
    color: '#333333',
  };

  return (
    <Box lineHeight="normal" display="inline-flex">
      <Box {...styles}>{value ? 'Yes' : 'No'}</Box>
    </Box>
  );
};
