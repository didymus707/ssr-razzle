import React from 'react';
import { Box, Stack } from '@chakra-ui/core';

interface Props {
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  selectedTab: string;
}

export const TabNavigator = (props: Props) => {
  const { options, onChange, selectedTab } = props;

  return (
    <Stack spacing="0" isInline rounded="4px" borderWidth="1px" alignItems="center">
      {options.map((item: any, index: number) => {
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        let borderRadiusStyles = {};

        if (isFirst) {
          borderRadiusStyles = {
            roundedTopLeft: '4px',
            roundedBottomLeft: '4px',
          };
        }
        if (isLast) {
          borderRadiusStyles = {
            roundedTopRight: '4px',
            roundedBottomRight: '4px',
          };
        }

        return (
          <Box
            key={index}
            py="0.4rem"
            width="94px"
            fontWeight="500"
            cursor="pointer"
            textAlign="center"
            fontSize="0.875rem"
            borderRightWidth={isLast ? '0' : '1px'}
            onClick={() => onChange(item.value)}
            color={selectedTab === item.value ? 'white' : 'black'}
            backgroundColor={selectedTab === item.value ? 'blue.500' : 'transparent'}
            {...borderRadiusStyles}
          >
            {item.label}
          </Box>
        );
      })}
    </Stack>
  );
};
