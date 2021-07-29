import React, { ReactNode } from 'react';
import { Box, Flex, Text, Stack, Icon, Link } from '@chakra-ui/core';
import { SocialIcon, Button } from '../../../components';
import { ChannelItemProps } from '../channels.types';
import { NavLink } from 'react-router-dom';
import { getBtnText, getIntegrationUrl } from '../channels.utils';
import { apps, requestAccessUrls } from '../channels.data';
import { useSelector } from 'react-redux';
import { selectIsCredentialConnected } from '../slices';
import { RootState } from '../../../../root';
import { selectOrganisationID } from '../../../unauthenticated-app/authentication';

export const ChannelConnectBtn = ({ which, children }: { which: string; children: ReactNode }) => {
  const organisation_id = useSelector(selectOrganisationID);
  const token = useSelector((state: RootState) => state.auth.token);
  const { status, isMultipleClick } = apps[which];

  return isMultipleClick ? (
    <NavLink
      to={{
        pathname: `/s/integrations/${['sms', 'voice'].includes(which) ? 'phone' : `_${which}`}`,
      }}
      activeClassName="active"
    >
      {children}
    </NavLink>
  ) : (
    <Link
      isExternal={status === 'request'}
      href={
        status === 'request'
          ? requestAccessUrls[which]
          : getIntegrationUrl({
              key: '',
              channel: which,
              token: token || '',
              organisation_id: organisation_id || '',
            })
      }
      _hover={{
        textDecoration: 'none',
      }}
    >
      {children}
    </Link>
  );
};

export const ChannelItem = ({ name, which, description }: ChannelItemProps) => {
  const organisation_id = useSelector(selectOrganisationID);
  const token = useSelector((state: RootState) => state.auth.token);
  const isConnected = useSelector((state: RootState) => selectIsCredentialConnected(state, which));

  const url = `/s/integrations/${which === 'sms' || which === 'voice' ? 'phone' : which}`;
  const integrationUrl = `/s/integrations/${which}-integration`;

  const Child = (
    <Box
      p="1.3125rem"
      rounded=".375rem"
      lineHeight="1.6"
      fontSize=".9375rem"
      boxShadow="0 0 1px 0 rgba(67, 90, 111, 0.47)"
      // maxWidth={['auto', 'auto', 'auto', '19.8125rem']}
    >
      <Flex alignItems="flex-start" mb="1rem">
        <Box marginTop=".625rem">
          <SocialIcon size="1.75rem" which={which} />
        </Box>

        <Box color="brandBlack" fontSize="0.875rem" marginLeft="1.25rem">
          <Text fontWeight="bold">{name}</Text>

          <Text color="lightBlack" fontSize="0.875rem">
            {description}
          </Text>
        </Box>
      </Flex>

      {isConnected ? (
        <Stack isInline justifyContent="flex-end" spacing=".625rem" alignItems="center">
          <Icon name="check" size="1.25rem" color="#6ac803" />

          <Text fontWeight={600} fontSize=".875rem" color="#6ac803">
            Connected
          </Text>
        </Stack>
      ) : (
        <Button
          py=".5rem"
          variantColor={isConnected ? 'blue' : 'gray'}
          width="100%"
          fontSize=".875rem"
          color={isConnected ? '#fff' : 'brandBlack'}
          variant={isConnected ? 'solid' : 'ghost'}
          fontWeight={500}
          border="solid 1px rgba(0, 0, 0, 0.08)"
          borderRadius=".1875rem"
        >
          {getBtnText(which)}
        </Button>
      )}
    </Box>
  );

  return isConnected ? (
    <NavLink
      to={{
        pathname: integrationUrl,
      }}
      activeClassName="active"
    >
      {Child}
    </NavLink>
  ) : ['whatsapp', 'sms', 'voice', 'android', 'ios', 'web-chat'].includes(which) ? (
    <NavLink
      to={{
        pathname: url,
      }}
      activeClassName="active"
    >
      {Child}
    </NavLink>
  ) : (
    <Link
      isExternal={which === 'instagram'}
      href={
        which === 'instagram'
          ? requestAccessUrls[which]
          : getIntegrationUrl({
              key: '',
              channel: which,
              token: token || '',
              organisation_id: organisation_id || '',
            })
      }
      _hover={{
        textDecoration: 'none',
      }}
    >
      {Child}
    </Link>
  );
};
