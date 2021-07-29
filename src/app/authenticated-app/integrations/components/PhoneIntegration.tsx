import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { Box, Text, useToast } from '@chakra-ui/core';
import { PhoneIntegrationProps } from '../integrations.type';
import { ToastBox, Button } from 'app/components';
import { ConnectedAccounts } from './ConnectedAccts';
import { disconnectCredential } from '../../channels';
import { selectOrganisationID } from '../../../unauthenticated-app/authentication';

export function PhoneIntegration({ channel, ...props }: PhoneIntegrationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalBtnLoading, setIsModalBtnLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();

  const history = useHistory();
  const organisation_id = useSelector(selectOrganisationID);

  const handleChannelDisconnction = async (platform_nick: string, credential_id: string) => {
    setIsModalBtnLoading(true);

    try {
      if (platform_nick) {
        await dispatch(disconnectCredential({ credential_id }));

        setIsModalOpen(false);

        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox
              status="success"
              onClose={onClose}
              message={`${platform_nick} has been disconnected`}
            />
          ),
        });
      }
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }

    setIsModalBtnLoading(false);
  };

  return (
    <Box height="100vh" backgroundColor="white">
      <NavLink to="/s/channels">
        <Text
          as="span"
          fontWeight={500}
          color="rgba(17, 17, 17, 0.5)"
          marginTop="2rem"
          display="inline-block"
          marginLeft="2.5rem"
        >
          Back to Apps
        </Text>
      </NavLink>

      <Box px="1rem" paddingTop="1.875rem" marginX="auto" maxWidth="20.125rem" color="brandBlack">
        <Text textAlign="center" marginBottom="2.375rem" fontWeight="bold" fontSize="1.125rem">
          Get Started with Numbers
        </Text>

        <Button fontSize=".75rem" isFullWidth variantColor="blue">
          Make a demo call
        </Button>

        <Button
          isFullWidth
          fontWeight={600}
          fontSize=".75rem"
          variantColor="blue"
          marginTop=".375rem"
          marginBottom="3.125rem"
          onClick={() => history.push('/s/inbox')}
        >
          Send a text message
        </Button>

        {organisation_id && (
          <ConnectedAccounts
            channel={channel}
            disconnectAccount={handleChannelDisconnction}
            isDisconnectLoading={isModalBtnLoading}
            isModalOpen={isModalOpen}
            handleModelOpen={setIsModalOpen}
            data={{
              organisation_id,
              subHeading: 'Phone number(s) List',
              disconnectBtnText: 'Remove Number',
            }}
            {...props}
          />
        )}
      </Box>
    </Box>
  );
}
