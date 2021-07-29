import { Heading, PseudoBox, Text } from '@chakra-ui/core';
import React from 'react';

type ReportCardProps = {
  heading: string;
  caption: string;
  onClick?(): void;
};

export const ReportCard = (props: ReportCardProps) => {
  const { heading, caption, onClick } = props;
  return (
    <PseudoBox
      p="1rem"
      mb="1rem"
      height="90px"
      cursor="pointer"
      borderWidth="1px"
      onClick={onClick}
      borderRadius="5px"
      transition="all 0.2s"
      _hover={{ bg: 'gray.200' }}
    >
      <Heading as="h4" pb="0.2rem" fontSize="0.875rem" fontWeight={600} color="black">
        {heading}
      </Heading>
      <Text fontWeight={400} color="#4f4f4f" fontSize="0.75rem">
        {caption}
      </Text>
    </PseudoBox>
  );
};
