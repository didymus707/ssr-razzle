//@ts-nocheck
import { Box, Skeleton, Stack } from '@chakra-ui/core';
import { Meta, Story } from '@storybook/react';
import React from 'react';

const Loader = () => {
  return (
    <Stack>
      {Array.from({ length: 15 }, (v, i) => (
        <Stack
          isInline
          py="0.5rem"
          px="0.75rem"
          borderBottomWidth="1px"
          key={`${i.toString()}-${new Date().getTime()}`}
        >
          <Box width="100%">
            <Skeleton height="10px" width="80%" my="10px" />
            <Skeleton height="10px" width="50%" my="10px" />
            <Skeleton height="10px" width="25%" my="10px" />
          </Box>
          <Box width="100%">
            <Skeleton height="10px" width="60px" my="10px" />
          </Box>
          <Box width="100%">
            <Skeleton height="10px" width="60px" my="10px" />
          </Box>
        </Stack>
      ))}
    </Stack>
  );
};

export default {
  title: 'Design System/Loader',
  component: Loader,
} as Meta;

const Template: Story<any> = args => <Loader {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
