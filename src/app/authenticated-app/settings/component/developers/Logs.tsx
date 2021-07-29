import { Heading, Stack } from '@chakra-ui/core';
import { EmptyState } from 'app/components';
import React from 'react';
import launchApp from './launch-app.svg';

export const Logs = () => {
  // const [selectedId, setSelectedId] = useState(logs[0]?.meta.id);
  // const handleSelectedId = (id: string) => setSelectedId(id);

  return (
    <Stack color="black">
      <Heading fontSize="1.2rem">API Logs</Heading>
      {/* <LogsTabs />
      <Filter />
      <Stack width="100%" fontSize="sm" isInline>
        <LsContainer logs={logs} selectedId={selectedId} setSelected={handleSelectedId} />
        <Divider orientation="vertical" ml="0" />
        <RsContainer logs={logs} selectedId={selectedId} />
      </Stack> */}

      <EmptyState
        py="100px"
        imageSize="120px"
        image={launchApp}
        heading="Coming soon"
        contentContainerProps={{ mt: '1rem' }}
        subheading="View and debug calls made to Simpu APIs from your integrations"
      />
    </Stack>
  );
};
