import React from 'react';
import { Box } from '@chakra-ui/core/dist';

export const DNDFieldComponent = (props: any) => {
  const { inputProps = {}, value } = props;

  return (
    <Box
      padding="7.5px 12.5px"
      width="100%"
      borderRadius="3px"
      display="flex"
      flexWrap="wrap"
      alignItems="center"
      flexDirection="row"
      fontSize="16px"
      border="1px solid #E2E8F0"
      {...inputProps}
    >
      {(value === false || value === true) && (
        <Box
          style={{
            fontSize: 12,
            padding: '2px 5px',
            borderRadius: 2,
            lineHeight: 'normal',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: value ? '#00876b33' : '#ff001a33',
            borderColor: value ? '#00876b33' : '#ff001a33',
            color: '#333333',
          }}
        >
          {value ? 'Yes' : 'No'}
        </Box>
      )}
    </Box>
  );
};
