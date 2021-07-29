import React from 'react';
import { Avatar, AvatarBadge, Box, Heading, Stack } from '@chakra-ui/core/dist';
import { useSelector } from 'react-redux';
import { selectOrganisationID } from '../../../../unauthenticated-app/authentication';
import { selectOrganisations } from '../../slices';
import { WorkspacesWrapper as Wrapper } from './index.styles';
import { Organization } from '../../settings.types';
import { useHistory } from 'react-router-dom';

export const WorkspacesComponent = (props: any) => {
  const organizations = useSelector(selectOrganisations);
  const organizationID = useSelector(selectOrganisationID);
  const currentOrganization = organizations.find((i: any) => i.id === organizationID);

  const router_history = useHistory();

  const handleOrganizationClick = (organization_id: string) => {
    if (currentOrganization?.id === organization_id) {
      router_history.push('/s/settings/organization');
    } else {
      props.reloadOrganization(organization_id);
    }
  };

  return (
    <Wrapper>
      <Stack isInline alignItems="center" marginBottom="2.5rem">
        <Heading size="sm" color="#333333" fontWeight="semibold">
          My Workspaces
        </Heading>
      </Stack>

      <Box display="flex" alignItems="center">
        {organizations.map((i: Organization, index: number) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            cursor="pointer"
            onClick={() => handleOrganizationClick(i.id)}
            marginRight="50px"
            marginBottom="50px"
          >
            <Avatar size="2xl" name={i.name}>
              {currentOrganization?.id === i.id && <AvatarBadge size="1.25em" bg="green.500" />}
            </Avatar>
            <Box color="#757575" marginTop="10px">
              {i.name}
            </Box>
          </Box>
        ))}
      </Box>
    </Wrapper>
  );
};
