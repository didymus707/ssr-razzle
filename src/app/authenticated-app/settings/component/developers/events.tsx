import { Heading, Stack } from '@chakra-ui/core';
import { EmptyState } from 'app/components';
import React from 'react';
import launchApp from './launch-app.svg';

export const APIEvents = () => {
  return (
    <Stack color="black">
      <Heading fontSize="1.2rem">API Events</Heading>

      <EmptyState
        py="100px"
        imageSize="120px"
        image={launchApp}
        heading="Coming soon"
        contentContainerProps={{ mt: '1rem' }}
        subheading="View and debug API events made to Simpu APIs from your integrations"
      />
    </Stack>
  );
};
