import {
  Box,
  Flex,
  Icon,
  Image,
  List,
  ListItem,
  Stack,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import styled from '@emotion/styled';
import {
  fetchCredentials,
  getIntegrationUrl,
  getUserChannelConnectedAccounts,
  removeCredential,
} from 'app/authenticated-app/channels';
import { apps, requestAccessUrls } from 'app/authenticated-app/channels/channels.data';
import {
  BodyText,
  Button,
  ConfirmModal,
  Heading2,
  PreTitle,
  SmallText,
  Subtitle,
  ToastBox,
} from 'app/components';
import { selectOrganisationID } from 'app/unauthenticated-app/authentication';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { RootState } from 'root';
import { WhatsappSetupModal } from '../components';
import { QRCodeSetupModal } from '../components/qr-code-setup-modal';
import { PageBack, PotentialChannelsModal } from './component';
import googleBtnImage from './btn_google_signin.png';

export const InboxSettingsChannelPreview = () => {
  const { id, channel } = useParams<{ id?: string; channel: string }>();
  const { name, key, icon, category, description, previewImages, permissions, status } = apps[
    channel
  ];

  const isActive = status === 'ready';

  const queryClient = useQueryClient();

  const toast = useToast();
  const history = useHistory();
  const organisation_id = useSelector(selectOrganisationID);
  const token = useSelector((state: RootState) => state.auth.token);

  const {
    isOpen: isQRCodeSetupModalOpen,
    onClose: onCloseQRCodeSetupModal,
    onOpen: onOpenQRCodeSetupModal,
  } = useDisclosure();
  const { isOpen, onClose, onOpen: onOpenWhatsappModal } = useDisclosure();

  const [channelToDisconnect, setChannelToDisconnect] = useState();
  const [qrCodeChannelId, setQrCodeChannelId] = useState<string | undefined>();
  const [isPotentialChannelsModalOpen, setIsPotentialChannelsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      //open modal to fetch potential channels
      setIsPotentialChannelsModalOpen(true);
    }
  }, [id]);

  const { data: { channels: simpuSupportedChannels = [] } = {} } = useQuery(
    'simpu-supported-channels',
    fetchCredentials,
    {
      initialData: queryClient.getQueryData('simpu-supported-channels'),
    },
  );
  const { data: connectedAccounts } = useQuery(['channel-connected-accounts', key], () =>
    getUserChannelConnectedAccounts(key),
  );
  const { isLoading: isDisconnectingChannel, mutate: disconnectChannel } = useMutation<
    any,
    AxiosError,
    any,
    any
  >(channel => removeCredential({ credential_id: channel.uuid }), {
    onMutate: async data => {
      await queryClient.cancelQueries(['channel-connected-accounts', key]);
      const previousChannels = queryClient.getQueryData(['channel-connected-accounts', key]);
      queryClient.setQueryData(['channel-connected-accounts', key], old =>
        //@ts-ignore
        old?.filter(item => item.uuid !== data.uuid),
      );
      return { previousChannels };
    },
    onError: (error, newData, context) => {
      queryClient.setQueryData(['channel-connected-accounts', key], context.previousChannels);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
      });
    },
    onSuccess: () => {
      setChannelToDisconnect(undefined);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message="Channel disconnected successfully"
          />
        ),
      });
      queryClient.invalidateQueries(['channel-connected-accounts', key]);
    },
  });

  let obj = {} as { [key: string]: any };

  for (const iterator of simpuSupportedChannels) {
    //@ts-ignore
    obj[iterator.name] = iterator;
  }

  const handleDisconnectChannel = () => {
    disconnectChannel(channelToDisconnect);
  };

  const handleOpenQRCodeModal = () => {
    if (key === 'whatsapp') {
      setQrCodeChannelId(obj['whatsapp-web'].uuid);
    } else {
      setQrCodeChannelId(obj[key].uuid);
    }
    onOpenQRCodeSetupModal();
  };

  const handleClick = () => {
    if (status === 'request') {
      window.open(requestAccessUrls[key], '_blank');
    } else {
      if (['gmail', 'outlook', 'messenger', 'twitter'].includes(key)) {
        window.open(
          getIntegrationUrl({
            key,
            token: token || '',
            channel: obj[key].uuid,
            organisation_id: organisation_id || '',
          }),
          '_blank',
        );
      } else if (key === 'sms') {
        console.log('here');
      } else {
        onOpenWhatsappModal();
      }
    }
  };

  return (
    <Box height="100%" bg="white" overflowY="auto">
      <PageBack
        title="Back to Channels"
        onClick={() => history.push('/s/inbox/settings/channels')}
      />
      <Box maxW="800px">
        <Stack pb="1rem" mb="1.875rem" isInline spacing="1.2rem" borderBottomWidth="1px">
          <Icon name={icon} size="6.25rem" color={key === 'sms' ? '#3525E6' : undefined} />
          <Box>
            <Box mb="1rem" pb="1.875rem" borderBottomWidth="1px">
              <Heading2 color="gray.900">{name}</Heading2>
              <BodyText pb="0.5rem" color="gray.500" fontWeight="bold">
                {category}
              </BodyText>
              {key === 'gmail' ? (
                <Button variant="unstyled" onClick={handleClick} isDisabled={!isActive}>
                  <Image width="200px" src={googleBtnImage} />
                </Button>
              ) : (
                <Button
                  width="100px"
                  size="xs"
                  rounded="100px"
                  variantColor="blue"
                  onClick={handleClick}
                  isDisabled={!isActive}
                >
                  Add
                </Button>
              )}
              {!!connectedAccounts && !!connectedAccounts?.length && (
                <Box pt="2rem">
                  <PreTitle pb="0.5rem">Connected Accounts</PreTitle>
                  <Stack alignItems="flex-start">
                    {connectedAccounts.map((item: any) => (
                      <Box key={item.uuid}>
                        <ConnectedAccount
                          channel={key}
                          platform_nick={item.user.platform_nick}
                          platform_name={item.user.platform_name}
                          onDelete={() => setChannelToDisconnect(item)}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
            <BodyText lineHeight="28px" color="gray.500">
              {description}
            </BodyText>
          </Box>
        </Stack>
        {!!previewImages?.length && (
          <Box pb="3rem">
            <Subtitle pb="1rem" fontSize="1.125rem" color="gray.900">
              Preview
            </Subtitle>
            <Stack spacing="1rem" isInline alignItems="center">
              {previewImages.map((item, index) => (
                <Box
                  width="100%"
                  backgroundColor="#c4c4c4"
                  backgroundSize="cover"
                  backgroundPosition="center"
                  backgroundRepeat="no-repeat"
                  bgImage={`url(${item})`}
                  key={`${item}-${index}`}
                  rounded="8px"
                  height="162px"
                />
              ))}
            </Stack>
          </Box>
        )}
        {!!permissions?.length && (
          <Box pb="3rem">
            <Subtitle pb="1rem" fontSize="1.125rem" color="gray.900">
              Permissions
            </Subtitle>
            <List styleType="disc">
              {permissions.map((item, index) => (
                <ListItem fontSize="1rem" color="gray.500" key={`${item}-${index}`}>
                  {item}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
      <WhatsappSetupModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenQrCodeModal={handleOpenQRCodeModal}
      />
      <QRCodeSetupModal
        channelID={qrCodeChannelId}
        isOpen={isQRCodeSetupModalOpen}
        onClose={onCloseQRCodeSetupModal}
      />
      <ConfirmModal
        title="Disconnect channel"
        isOpen={!!channelToDisconnect}
        isLoading={isDisconnectingChannel}
        onConfirm={handleDisconnectChannel}
        onClose={() => setChannelToDisconnect(undefined)}
      />
      <PotentialChannelsModal
        id={id}
        channel={obj?.[key]?.uuid}
        isOpen={isPotentialChannelsModalOpen}
        onClose={() => setIsPotentialChannelsModalOpen(false)}
      />
    </Box>
  );
};

type ConnectedAccountProps = {
  channel?: string;
  onDelete?(): void;
  platform_name?: string;
  platform_nick?: string;
};

const ConnectedAccount = (props: ConnectedAccountProps) => {
  const { channel, platform_name, platform_nick, onDelete } = props;

  return (
    <ConnectedAccountContainer rounded="0.5rem" cursor="pointer" position="relative">
      <Flex
        top="0"
        left="0"
        zIndex={5}
        bottom="0"
        opacity={0}
        width="100%"
        position="absolute"
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        className="delete-button"
        willChange="opacity, background"
        transition="opacity 0.2s, background 0.2s"
      >
        <Button px="0" minW="unset" height="unset" variant="unstyled" onClick={onDelete}>
          <Icon size="1.5rem" name="inbox-trash" color="#DA1414" />
        </Button>
      </Flex>

      <BodyText color="gray.700">{platform_name ?? platform_nick ?? 'N/A'}</BodyText>
      {channel && ['outlook', 'gmail'].includes(channel) && (
        <SmallText color="gray.500">{platform_nick}</SmallText>
      )}
    </ConnectedAccountContainer>
  );
};

const ConnectedAccountContainer = styled(Box)`
  &:hover {
    opacity: 0.7;
    padding: 0 0.2rem;
    background: #f0eefd;
    .delete-button {
      opacity: 1;
    }
  }
`;
