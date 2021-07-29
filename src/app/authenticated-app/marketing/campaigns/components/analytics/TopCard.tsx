import React from 'react';
import { Box, Flex, Text, Image, BoxProps } from '@chakra-ui/core';

type TopCardProps = {
  label?: string;
  image?: string;
  children?: React.ReactNode;
};

export const TopCard = ({
  label,
  image,
  children,
  ...props
}: TopCardProps & BoxProps) => {
  return (
    <Box
      fontSize="xs"
      padding="1rem"
      color="gray.500"
      background="#fff"
      marginBottom="0.5rem"
      fontWeight="semibold"
      boxShadow="0 9px 35px 4px rgba(0, 0, 0, 0.03)"
      {...props}
    >
      <Flex>
        <Image
          src={image}
          width="3.4rem"
          height="3.4rem"
          marginRight="1.3rem"
        />
        <Box>
          <Text color="#595e8a" fontSize="0.8rem">
            {label}
          </Text>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};
