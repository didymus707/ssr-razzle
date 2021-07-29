import { Heading, Stack } from '@chakra-ui/core';
import { EmptyState } from 'app/components';
import React from 'react';
import launchApp from './launch-app.svg';

export const APIWebhooks = () => {
  return (
    <Stack color="black">
      <Heading fontSize="1.2rem">Webhooks</Heading>

      <EmptyState
        py="100px"
        imageSize="120px"
        image={launchApp}
        heading="Coming soon"
        contentContainerProps={{ mt: '1rem' }}
        subheading="View webhooks for integration with Simpu APIs"
      />
    </Stack>
  );
};
