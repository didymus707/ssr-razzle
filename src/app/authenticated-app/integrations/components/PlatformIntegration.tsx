import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  Link,
  useToast,
  Stack,
  Spinner,
  ModalBody,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
} from '@chakra-ui/core';
import { PlatformIntegrationProps } from '../integrations.type';
import { SocialIcon, ToastBox, Button } from 'app/components';
import {
  connectChannelAcct,
  disconnectCredential,
  getErrorMessage,
  getPotentialAccts,
} from '../../channels';
import { getQueryParams } from '../integrations.utis';
import { ConnectedAccounts } from './ConnectedAccts';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrganisationID } from '../../../unauthenticated-app/authentication';

type FBPageSchema = { id: string; name: string };

export function PlatformIntegration({ channel, ...props }: PlatformIntegrationProps) {
  const [pageLoader] = useState(false);
  const [isDisconnectLoading, setIsDisconnectLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [temp, setTemp] = useState<{
    data: any;
    status: string;
  }>({ data: {}, status: 'none' });
  const toast = useToast();

  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const organisation_id = useSelector(selectOrganisationID) || '';
  const { list: tempList } = temp?.data || {
    image_url: '',
    platform_name: '',
    platform_nick: '',
    list: [],
  };

  const meta: {
    [keys: string]: {
      title: string;
      subHeading: string;
      baseUrl: string;
      disconnectBtnText?: string;
    };
  } = {
    twitter: {
      title: 'Twitter DMs',
      subHeading: 'Handles',
      baseUrl: 'https://twitter.com',
    },
    messenger: {
      title: 'Facebook Mesenger',
      subHeading: 'Facebook Pages',
      baseUrl: 'https://web.facebook.com',
    },
  };

  const { title, subHeading, disconnectBtnText, baseUrl } = meta[channel] || {
    title: '',
    subHeading: '',
    disconnectBtnText: '',
    baseUrl: '',
  };

  const pathNameArray = location.pathname.split('/');
  const locationParam = pathNameArray[pathNameArray.length - 1];
  const { status, name: statusName, code: statusCode } = getQueryParams(location.search);
  const isStatusPageList = status === 'page-list';
  const isStatusReconfirm = status === 'reconfirm';
  const isStatusError = status === 'error';
  let isStatus = false;

  if (status) {
    isStatus = true;
  }

  const handleAccountDisconnection = async (platform_nick: string, credential_id: string) => {
    setIsDisconnectLoading(true);

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
              message={`${platform_nick} account disconnected successfully`}
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

    setIsDisconnectLoading(false);
  };

  const handlePageSelection = async (pageID: string) => {
    try {
      await dispatch(connectChannelAcct({ pageID, channel, id: locationParam }));
      history.push(`/s/integrations/${channel}-integration`);
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  useEffect(() => {
    if (organisation_id && isStatusError && statusName) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message={getErrorMessage(statusName, statusCode)} />
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (isStatusReconfirm || isStatusPageList) {
        try {
          setTemp({ ...temp, status: 'loading' });
          const result: any = await dispatch(
            getPotentialAccts({
              channel,
              id: locationParam,
            }),
          );

          setTemp({ data: { ...temp.data, list: result.payload.list }, status: 'none' });
        } catch (error) {
          setTemp({ data: null, status: 'error' });
          toast({
            position: 'bottom-left',
            render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
          });

          history.push(`/s/integrations/${channel}-integration`);
        }
      }
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStatusReconfirm, isStatusPageList]);

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

      <Box paddingTop="1.25rem" marginX="auto" maxWidth="20.125rem" color="brandBlack">
        {pageLoader ? (
          <Box textAlign="center" paddingTop="2rem">
            <Spinner color="blue.500" size="md" />
          </Box>
        ) : (
          <>
            <Flex justifyContent="center" marginBottom=".875rem">
              <SocialIcon which={channel} size="2.875rem" />
            </Flex>

            <Text fontSize="1.125rem" fontWeight="bold" textAlign="center" marginBottom="2.8125rem">
              {title}
            </Text>

            <ConnectedAccounts
              channel={channel}
              disconnectAccount={handleAccountDisconnection}
              isDisconnectLoading={isDisconnectLoading}
              isModalOpen={isModalOpen}
              handleModelOpen={setIsModalOpen}
              data={{
                organisation_id,
                subHeading,
                baseUrl,
                disconnectBtnText,
              }}
              {...props}
            />
          </>
        )}
      </Box>

      <Modal
        closeOnOverlayClick={false}
        onClose={() => history.push(`/s/integrations/${channel}-integration`)}
        size={isStatusPageList ? 'sm' : 'lg'}
        isOpen={isStatus && !isStatusError}
      >
        <ModalOverlay />

        <ModalContent>
          {isStatusPageList && (
            <>
              <ModalHeader>Select Facebook Page</ModalHeader>

              <ModalCloseButton />

              <ModalBody paddingBottom="1rem">
                <Stack>
                  {(tempList || []).length === 0 ? (
                    <Text fontSize=".875rem" textAlign="left">
                      It seems you are not an admin on any Facebook pages. Please click the
                      <Link
                        href="https://web.facebook.com/pages/create"
                        isExternal
                        marginX=".25rem"
                      >
                        link
                      </Link>
                      to create one.
                    </Text>
                  ) : (
                    (tempList as FBPageSchema[]).map(({ id, name }) => (
                      <Button
                        key={id}
                        justifyContent="flex-start"
                        variant="ghost"
                        fontSize=".875rem"
                        marginLeft="-1rem"
                        onClick={() => handlePageSelection(id)}
                      >
                        {name}
                      </Button>
                    ))
                  )}
                </Stack>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
}
