import React, { useState } from 'react';
import {
  Flex, Heading, Box, Text, Button, IconButton,
} from '@chakra-ui/core';
import { ConversationSectionProps, ThreadSchema } from '../../inbox.types';
import { ConversationList } from './ConversationList';

export function ConversationSection({
  name, haveViewEntireControl = false, highlight, ...rest
}: ConversationSectionProps) {
  const [toggleView, setToggleView] = useState(haveViewEntireControl);

  const list: ThreadSchema[] = [];

  const handleViewEntireControlClicked = () => {
    setToggleView(!toggleView);
  };

  return (
    <Box textAlign="right" {...rest}>
      <Box
        bg="#f6fafd"
        top="0"
        zIndex={1100}
        position="sticky"
      >
        <Flex
          textAlign="left"
          alignItems="center"
          marginX="2.0625rem"
        >
          {!toggleView && haveViewEntireControl && (
            <IconButton
              bg="transparent"
              mr=".25rem"
              height="auto"
              minWidth="0"
              icon="chevron-up"
              aria-label="toggle view"
              onClick={() => handleViewEntireControlClicked()}
            />
          )}

          <Heading
            as="h4"
            fontSize=".875rem"
            fontWeight={500}
            py=".625rem"
          >
            {name}
          </Heading>

          {list.length > 0 && (
            <Text opacity={.5} fontSize=".75rem" ml="auto">
              {list.length}
            </Text>
          )}
        </Flex>
      </Box>


      <ConversationList
        heading={name}
        highlight={highlight}
      />

      {haveViewEntireControl && toggleView && list.length > 4 && (
        <Button
          borderRadius="0"
          fontWeight={500}
          py=".1255rem"
          px="0"
          marginRight="2.0625rem"
          height="auto"
          minWidth="0"
          bg="transparent"
          fontSize=".75rem"
          color="#3d50df"
          onClick={() => handleViewEntireControlClicked()}
        >
          View all messages
        </Button>
      )}
    </Box>
  );
}
