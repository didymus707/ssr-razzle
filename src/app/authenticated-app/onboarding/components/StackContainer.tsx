import { Box, BoxProps, Flex, Heading, Icon, Stack, Text } from '@chakra-ui/core';
import { Button } from 'app/components';
import React from 'react';

type FeatureProps = BoxProps & {
  title?: string;
  onClick?: () => void;
};

type CommunicationFeatureProps = FeatureProps & {
  email?: string;
  userId?: string;
  organisation_id?: string;
  channel: string;
  btnTitle?: string;
  name?: string;
  description?: string;
};

export function Feature({ title, onClick, ...rest }: FeatureProps) {
  return (
    <Box p={2} width="60%" margin="auto" textAlign="center" border="1px solid #e9edf0" {...rest}>
      <Button
        size="xs"
        width="100%"
        padding="5px"
        variant="link"
        color="#212242"
        onClick={onClick}
        textAlign="center"
        fontSize="0.85rem"
        textDecoration="none"
        variantColor="#212242"
        background="transparent"
        _hover={{ textDecoration: 'none' }}
        _active={{ textDecoration: 'none' }}
        _focus={{ textDecoration: 'none' }}
      >
        {title}
      </Button>
    </Box>
  );
}

export function CommunicationFeature({
  name,
  title,
  email,
  organisation_id,
  userId,
  onClick,
  channel,
  btnTitle,
  description,
  ...rest
}: CommunicationFeatureProps) {
  return (
    <Box p={2} width="100%" {...rest}>
      <Box
        display="flex"
        flexDirection="column"
        width="60%"
        margin=" 0.5rem auto"
        justifyContent="center"
      >
        <Flex justifySelf="center" width="100%" alignItems="center" margin="0.4rem 0">
          <Box marginRight="0.3rem">
            <Icon name={name} size="2rem" />
          </Box>
          <Heading color="#212242" fontSize="1rem">
            {title}
          </Heading>
        </Flex>
        <Text fontSize="14px" color="lightBlack">
          {description}
        </Text>
        <Button
          size="xs"
          isFullWidth
          color="#212242"
          padding="0.6rem"
          onClick={onClick}
          marginTop="0.5rem"
          background="#f2f3ff"
        >
          {btnTitle}
        </Button>
      </Box>
    </Box>
  );
}

export function StackContainer({ children }: { children: React.ReactNode }) {
  return (
    <Stack spacing={0} marginTop="1.5rem" marginBottom="2.5rem">
      {children}
    </Stack>
  );
}
