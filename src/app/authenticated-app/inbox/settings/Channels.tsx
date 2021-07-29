import { Box, Button, Icon, IconProps, PseudoBox, Stack, useDisclosure } from '@chakra-ui/core';
import { fetchCredentials, getIntegrationUrl } from 'app/authenticated-app/channels';
import { apps, requestAccessUrls } from 'app/authenticated-app/channels/channels.data';
import { BodyText, Subtitle, XSmallText } from 'app/components';
import { selectOrganisationID } from 'app/unauthenticated-app/authentication';
import React, { MouseEvent, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router';
import { RootState } from 'root';
import { WhatsappSetupModal } from '../components';
import { QRCodeSetupModal } from '../components/qr-code-setup-modal';
import { InboxSettingsPage } from './component';

export const InboxSettingsChannels = () => {
  const channelsData = Object.values(apps).filter(
    item => item.category.toLowerCase() === 'simpu integration',
  );
  const history = useHistory();
  const match = useRouteMatch();
  const { isOpen, onClose, onOpen: onOpenWhatsappModal } = useDisclosure();
  const {
    isOpen: isQRCodeSetupModalOpen,
    onClose: onCloseQRCodeSetupModal,
    onOpen: onOpenQRCodeSetupModal,
  } = useDisclosure();

  const organisation_id = useSelector(selectOrganisationID);
  const token = useSelector((state: RootState) => state.auth.token);

  const { data: { channels: simpuSupportedChannels = [] } = {} } = useQuery(
    'simpu-supported-channels',
    fetchCredentials,
  );

  const [qrCodeChannelId, setQrCodeChannelId] = useState<string | undefined>();

  let obj = {} as { [key: string]: any };

  for (const iterator of simpuSupportedChannels) {
    //@ts-ignore
    obj[iterator.name] = iterator;
  }

  const onChannelClick = (key: string) => {
    history.push(`${match.path}/${key}`);
  };

  const handleAdd = ({ key, status }: { key: string; status: string }) => {
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
        setQrCodeChannelId(obj['whatsapp-web'].uuid);
        onOpenWhatsappModal();
      }
    }
  };

  return (
    <InboxSettingsPage title="Channels">
      <Stack isInline flexWrap="wrap" spacing="4rem">
        {channelsData.map(channel => {
          const { icon, key, name, caption, status, category } = channel;
          const iconProps = { name: icon ?? key, color: key === 'sms' ? '#3525E6' : undefined };

          return (
            <Box
              key={key}
              maxH="150px"
              mb="1.25rem"
              width={['100%', 'calc(33.33% - 4rem)', 'calc(33.33% - 4rem)']}
            >
              <InboxSettingsChannelItem
                name={name}
                caption={caption}
                category={category}
                iconProps={iconProps}
                isActive={status === 'ready'}
                onClick={() => onChannelClick(key)}
                onAdd={() => {
                  if (key === 'gmail') {
                    onChannelClick(key);
                  } else {
                    handleAdd({ key, status });
                  }
                }}
              />
            </Box>
          );
        })}
      </Stack>
      <WhatsappSetupModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenQrCodeModal={onOpenQRCodeSetupModal}
      />
      <QRCodeSetupModal
        channelID={qrCodeChannelId}
        isOpen={isQRCodeSetupModalOpen}
        onClose={onCloseQRCodeSetupModal}
      />
    </InboxSettingsPage>
  );
};

type ChannelItemProps = {
  name?: string;
  iconProps?: IconProps;
  category?: string;
  caption?: string;
  isActive?: boolean;
  onAdd?(): void;
  onClick?(): void;
};

export const InboxSettingsChannelItem = (props: ChannelItemProps) => {
  const { name, caption, onAdd, onClick, isActive, iconProps, category } = props;

  const handleAdd = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onAdd?.();
  };

  return (
    <Stack
      isInline
      width="100%"
      height="150px"
      cursor="pointer"
      onClick={onClick}
      alignItems="center"
    >
      <Box>
        <Icon size="6.25rem" {...iconProps} />
      </Box>
      <PseudoBox pb="1.25rem" borderBottomWidth="1px" flex={1}>
        <Subtitle pb="0.25rem" color="gray.900" fontWeight="normal">
          {name}
        </Subtitle>
        <BodyText color="gray.500">{caption}</BodyText>
        <XSmallText pb="0.5rem" color="gray.500">
          {category}
        </XSmallText>
        <Button
          size="xs"
          width="80px"
          rounded="100px"
          onClick={handleAdd}
          isDisabled={!isActive}
          _focus={{ boxShadow: 'none' }}
        >
          Add
        </Button>
      </PseudoBox>
    </Stack>
  );
};
