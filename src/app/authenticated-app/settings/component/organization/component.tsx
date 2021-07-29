import React from 'react';
import { Avatar, Box, Heading, Input, Stack } from '@chakra-ui/core/dist';
import { useSelector } from 'react-redux';
import { selectOrganisationID } from '../../../../unauthenticated-app/authentication';
import { selectOrganisations } from '../../slices';
import { OrganizationWrapper as Wrapper } from './index.styles';
import { Button } from 'app/components';

export const OrganizationComponent = () => {
  const organizations = useSelector(selectOrganisations);
  const organizationID = useSelector(selectOrganisationID);
  const currentOrganization = organizations.find((i: any) => i.id === organizationID);

  return (
    <Wrapper>
      <Stack isInline alignItems="center" marginBottom="1.5rem">
        <Heading size="sm" color="#333333" fontWeight="semibold">
          Workspace Settings
        </Heading>
      </Stack>

      <Box display="flex" alignItems="center">
        <Avatar size="lg" name={currentOrganization?.name} />
        <Input
          isDisabled
          width="100%"
          size="lg"
          marginLeft="20px"
          variant="flushed"
          value={currentOrganization?.name}
        />
      </Box>

      <Box display="flex" justifyContent="flex-end" marginTop="20px">
        <Button size="lg" isDisabled>
          Saved
        </Button>
      </Box>
    </Wrapper>
  );
};
