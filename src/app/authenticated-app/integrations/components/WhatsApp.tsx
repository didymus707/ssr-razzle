import {
  Box,
  Stack,
  Text,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  List,
  ListItem,
  Flex,
  Input,
  Icon,
  Skeleton,
  useToast,
  PseudoBox,
} from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { SocialIcon, ToastBox, Button } from 'app/components';
import { requestAccessUrls } from '../../channels/channels.data';
import { useDispatch, useSelector } from 'react-redux';
import {
  connectChannelAcct,
  resetQrCode,
  selectWhatsAppQrCode,
  setChannelName,
  selectWhatsAppQrCodeStatus,
  setQrcodeStatus,
  selectWhatsAppQrError,
  setQRError,
  setIsQrErrorModal,
} from '../../channels';
import { ErrorModal } from '../../channels/components';

type ViewControl = 'qr-code' | 'set_name' | 'internet' | 'warning';
type QrCodeStatus = 'none' | 'pending' | 'rejected';
type CommonProps = {
  newCredentialID: string;
  viewControl: ViewControl;
  setNewCredentialID: (v: string) => void;
  setViewControl: (v: ViewControl) => void;
};

function QrCode({
  setViewControl,
  setNewCredentialID,
  mirrorWhatsApp,
}: Pick<CommonProps, 'setViewControl' | 'setNewCredentialID'> & {
  mirrorWhatsApp: () => void;
}) {
  const dispatch = useDispatch();

  const qrcode = useSelector(selectWhatsAppQrCode);
  const qrcodeStatus = useSelector(selectWhatsAppQrCodeStatus);

  useEffect(() => {
    if (qrcodeStatus === 'connected') {
      setViewControl('internet');
      dispatch(resetQrCode());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrcodeStatus]);

  return (
    <>
      <SocialIcon size="2.5rem" which="whatsapp" />

      <Text
        color="#000"
        fontWeight={500}
        fontSize="1.375rem"
        lineHeight="1.625rem"
        marginTop="1.5625rem"
      >
        To use WhatsApp on Simpu:
      </Text>

      <Stack
        isInline
        spacing="2rem"
        marginTop="1.25rem"
        marginBottom="5rem"
        alignItems="center"
        justifyContent="space-between"
      >
        <List as="ol" fontSize="1rem" styleType="decimal" lineHeight="1.5rem">
          <ListItem>
            Open <strong>WhatsApp</strong> or <strong>WhatsApp Business App</strong> on your Phone
          </ListItem>
          <ListItem>
            Tap <strong>Menu</strong> or Settings and select <strong>WhatsApp Web/ Desktop</strong>
          </ListItem>
          <ListItem>Log out from all devices and click Scan QR Code</ListItem>
          <ListItem>Point your phone to this screen to capture code</ListItem>
        </List>

        <Box>
          {qrcodeStatus === 'connecting' && !qrcode ? (
            <Skeleton size="9.375rem" />
          ) : (
            <QRCode
              level="L"
              size={264}
              value={qrcode}
              renderAs="canvas"
              bgColor="#ffffff"
              fgColor="#000000"
              includeMargin={false}
              style={{ border: '1px solid black' }}
            />
          )}
        </Box>
      </Stack>
    </>
  );
}

function SetUpChannelName({
  setViewControl,
  newCredentialID,
}: Pick<CommonProps, 'setViewControl' | 'newCredentialID'>) {
  const toast = useToast();
  const dispatch = useDispatch();
  const [platform_name, setPlatformName] = useState('');
  const [isSettingName, setIsSettingName] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSettingName(true);
    const response: any = await dispatch(
      setChannelName({
        platform_name,
        credential_id: newCredentialID,
      }),
    );
    if (setChannelName.fulfilled.match(response)) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Channel name updated" />
        ),
      });
      setViewControl('internet');
    } else {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Error: Failed to set the channel name" />
        ),
      });
    }

    setIsSettingName(true);
  };

  return (
    <>
      <SocialIcon size="2.5rem" which="whatsapp" />

      <Text
        color="#000"
        fontWeight={500}
        fontSize="1.375rem"
        lineHeight="1.625rem"
        marginTop="1.5625rem"
      >
        WhatsApp Integration is processing now.
      </Text>

      <List
        as="ol"
        fontSize="1rem"
        marginTop="2rem"
        styleType="decimal"
        lineHeight="1.5rem"
        marginBottom="1.5rem"
      >
        <ListItem>
          Keep your phone <strong>charged</strong> and <strong>connected</strong> to the internet.
        </ListItem>
        <ListItem>
          Do not use <strong>WhatsApp Web/Desktop</strong> simultaneously.
        </ListItem>
        <ListItem>By default, Simpu only syncs your 10 most recent conversations.</ListItem>
      </List>

      <Text marginBottom=".5rem" color="#333">
        Channel Name
      </Text>

      <form onSubmit={handleSubmit}>
        <Input
          isRequired
          border="none"
          marginBottom="2.5rem"
          padding=".625rem 1rem"
          backgroundColor="#F6F6F6"
          placeholder="Enter channel name"
          value={platform_name}
          onChange={(e: any) => setPlatformName(e.target.value)}
        />

        <Flex justifyContent="flex-end" marginBottom="1.875rem">
          <Button
            type="submit"
            variant="solid"
            textAlign="right"
            paddingX="1.5rem"
            variantColor="blue"
            isLoading={isSettingName}
          >
            Next
          </Button>
        </Flex>
      </form>
    </>
  );
}

function Internet({ setViewControl }: Pick<CommonProps, 'setViewControl'>) {
  return (
    <>
      <Text
        color="#000"
        fontWeight={500}
        fontSize="1.375rem"
        lineHeight="1.625rem"
        marginTop="1.5625rem"
      >
        Keep your phone connected to Wi-Fi
      </Text>

      <Icon name="wifi" width="8.5rem" color="#bdbdbd" height="6.375rem" marginY="3.25rem" />

      <Text>
        This WhatsApp (Third-Party) integration depends on the internet connection of your phone.
        Please keep your phone connected to Wi-Fi at all times to avoid disconnection.
      </Text>

      <Flex justifyContent="flex-end" marginBottom="1.875rem" marginTop="1.5rem">
        <Button
          type="submit"
          variant="solid"
          textAlign="right"
          paddingX="1.5rem"
          variantColor="blue"
          onClick={() => setViewControl('warning')}
        >
          Next
        </Button>
      </Flex>
    </>
  );
}

function Warning({ onClose }: { onClose: () => void }) {
  const history = useHistory();

  const handleClose = () => {
    onClose();
    history.push('/s/integrations/whatsapp');
  };

  return (
    <>
      <Text
        color="#000"
        fontWeight={500}
        fontSize="1.375rem"
        lineHeight="1.625rem"
        marginTop="1.5625rem"
      >
        Do not use WhatsApp Web/Desktop
      </Text>

      <Icon name="monitor" width="8.5rem" color="#bdbdbd" height="6.375rem" marginY="3.25rem" />

      <Text>
        Since WhatsApp only allows 1 active web session, using WhatsApp Desktop elsewhere will
        disconnect Simpu. However, the system will reconnect every hour automatically.
      </Text>

      <Flex justifyContent="flex-end" marginBottom="1.875rem" marginTop="1.5rem">
        <Button
          type="submit"
          variant="solid"
          textAlign="right"
          paddingX="1.5rem"
          variantColor="blue"
          onClick={() => handleClose()}
        >
          Finish
        </Button>
      </Flex>
    </>
  );
}

export function WhatsApp() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [newCredentialID, setNewCredentialID] = useState('');
  const [viewControl, setViewControl] = useState<ViewControl>('qr-code');

  const { isModalOpen: isErrorModalOpen, ...errorDetail } = useSelector(selectWhatsAppQrError);

  const handleClosed = () => {
    setIsModalOpened(false);
    setViewControl('qr-code');
  };

  const mirrorWhatsApp = async () => {
    setIsModalOpened(true);
    dispatch(setQrcodeStatus('connecting'));
    const r: any = await dispatch(
      connectChannelAcct({
        channel: 'whatsappWeb',
      }),
    );

    if (!connectChannelAcct.fulfilled.match(r)) {
      if (r?.error?.message) {
        setIsModalOpened(false);
        dispatch(
          setQRError({
            message: r.error.message,
          }),
        );
      }
    }
  };

  let view = <Box />;
  if (viewControl === 'qr-code') {
    view = (
      <QrCode
        mirrorWhatsApp={mirrorWhatsApp}
        setViewControl={setViewControl}
        setNewCredentialID={setNewCredentialID}
      />
    );
  } else if (viewControl === 'set_name') {
    view = <SetUpChannelName setViewControl={setViewControl} newCredentialID={newCredentialID} />;
  } else if (viewControl === 'internet') {
    view = <Internet setViewControl={setViewControl} />;
  } else if (viewControl === 'warning') {
    view = <Warning onClose={handleClosed} />;
  }

  return (
    <Box backgroundColor="white">
      <Box p="1rem">
        <Button size="sm" variant="ghost" leftIcon="chevron-left" onClick={() => history.goBack()}>
          Go back to directory
        </Button>
      </Box>

      <Stack color="brandBlack" alignItems="center" paddingTop="3.25rem" justifyContent="center">
        <Text fontSize="1.125rem" fontWeight={600}>
          Choose your preferred setup
        </Text>

        <Stack isInline spacing="1.5rem" paddingTop="3.25rem">
          <PseudoBox
            as="button"
            padding="3rem .8rem"
            width="17rem"
            textAlign="center"
            borderRadius=".25rem"
            flexDirection="column"
            display="block"
            onClick={() => mirrorWhatsApp()}
            border="1px solid rgb(226, 232, 240)"
          >
            <Icon name="mirror" size="8rem" />
            <Text fontSize="1rem" fontWeight={500}>
              Mirror Current WhatsApp
            </Text>
            <Text fontSize=".8rem" marginTop=".5rem" textAlign="center" opacity={0.8}>
              Use your existing WhatsApp number. Sync your contacts and groups directly into Simpu.
            </Text>
          </PseudoBox>

          <Link
            isExternal
            display="flex"
            padding=".8rem"
            maxWidth="17rem"
            textAlign="center"
            alignItems="center"
            borderRadius=".25rem"
            flexDirection="column"
            justifyContent="center"
            href={requestAccessUrls.whatsapp}
            border="1px solid rgb(226, 232, 240)"
            _hover={{ textDecoration: 'none' }}
          >
            <Icon name="request" size="8rem" />
            <Text fontSize="1rem" fontWeight={500}>
              Setup New WhatsApp Business
            </Text>
            <Text fontSize=".8rem" marginTop=".5rem" opacity={0.8}>
              Get your personalized WhatsApp for Business Number. Perfect for large enterprises and
              brands.
            </Text>
          </Link>
        </Stack>
      </Stack>

      <Modal isOpen={isModalOpened} onClose={handleClosed}>
        <ModalOverlay />

        <ModalContent
          width="auto"
          marginTop="5rem"
          paddingTop="2rem"
          paddingX="1.875rem"
          maxWidth="48rem"
          borderRadius=".3125rem"
          boxShadow="0px 0px 1px rgba(67, 90, 111, 0.47)"
        >
          <ModalCloseButton
            top=".625rem"
            right=".625rem"
            width="1.5rem"
            height="1.5rem"
            color="#333333"
            padding=".25rem"
          />

          {view}
        </ModalContent>
      </Modal>

      <ErrorModal
        {...errorDetail}
        isOpen={isErrorModalOpen}
        setIsOpen={value => dispatch(setIsQrErrorModal(value))}
      />
    </Box>
  );
}
