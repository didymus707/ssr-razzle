import { Box, List, ListItem, ModalBody, Skeleton, useToast } from '@chakra-ui/core';
import { generateQRCode } from 'app/authenticated-app/channels';
import { Button, ModalContainer, ModalContainerOptions, Subtitle, ToastBox } from 'app/components';
import QRCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router';

export type QRCodeSetupModalProps = ModalContainerOptions & {
  channelID?: string;
};

type ViewControl = 'qr-code' | 'set_name' | 'internet' | 'warning';

export const QRCodeSetupModal = (props: QRCodeSetupModalProps) => {
  const { isOpen, onClose, channelID } = props;
  const toast = useToast();
  const [qrcode, setQrCode] = useState('');
  const [viewControl, setViewControl] = useState<ViewControl>('qr-code');

  const queryClient = useQueryClient();

  useEffect(() => {
    const mirrorWhatsApp = async () => {
      try {
        const response = await generateQRCode(channelID ?? '');
        const reader = await response.body?.getReader();

        if (reader) {
          let done, value;
          while (!done) {
            ({ value, done } = await reader.read());
            if (done) {
              console.log('The stream was already closed!');
            }
            const s = new TextDecoder().decode(value);
            if (s === 'scanned') {
            }
            if (s === 'error: Account already connected') {
              toast({
                render: ({ onClose }) => (
                  <ToastBox
                    onClose={onClose}
                    message="Whatsapp account already connected on another Simpu account"
                  />
                ),
                position: 'bottom-left',
              });
              onClose?.();
            }
            if (s.includes('{"uuid":"')) {
              setViewControl('internet');
            }
            setQrCode(s);
          }
        }
      } catch (error) {}
    };
    if (isOpen) {
      mirrorWhatsApp();
    }
  }, [channelID, isOpen, onClose, toast]);

  const handleClosed = () => {
    onClose?.();
    setViewControl('qr-code');
    queryClient.invalidateQueries(['channel-connected-accounts', 'whatsapp']);
  };

  let view = <Box />;
  if (viewControl === 'qr-code') {
    view = <QrCode qrcode={qrcode} />;
  } else {
    view = <Warning onClose={handleClosed} />;
  }

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <ModalBody>{view}</ModalBody>
    </ModalContainer>
  );
};

function QrCode({ qrcode }: { qrcode: string }) {
  return (
    <>
      <Box py="2rem">
        {!qrcode ? (
          <Skeleton size="9.375rem" />
        ) : (
          <QRCode
            level="L"
            size={200}
            value={qrcode}
            renderAs="canvas"
            bgColor="#ffffff"
            fgColor="#000000"
            includeMargin={false}
            style={{ borderRadius: '8px' }}
          />
        )}
      </Box>

      <Subtitle pb="1rem" color="gray.900" fontWeight="bold">
        To use WhatsApp on Simpu:
      </Subtitle>

      <List
        mb="5rem"
        spacing="0.5rem"
        as="ol"
        fontSize="1rem"
        styleType="decimal"
        lineHeight="1.5rem"
      >
        <ListItem color="gray.500">Open WhatsApp or WhatsApp Business App on your Phone.</ListItem>
        <ListItem color="gray.500">Tap Menu or Settings and select WhatsApp Web/ Desktop.</ListItem>
        <ListItem color="gray.500">Log out from all devices and click Scan QR code.</ListItem>
        <ListItem color="gray.500">Point your phone to this screen to capture code.</ListItem>
      </List>
    </>
  );
}

function Warning({ onClose }: { onClose: () => void }) {
  const history = useHistory();

  const handleClose = () => {
    onClose();
    history.push('/s/inbox/settings/channels/whatsapp');
  };

  return (
    <>
      <Subtitle pt="2rem" pb="2rem" color="gray.900" fontWeight="bold" lineHeight="30px">
        Your WhatsApp account has been connected.
      </Subtitle>
      <List as="ol" spacing="0.5rem" fontSize="1rem" styleType="decimal" lineHeight="1.5rem">
        <ListItem color="gray.500">
          Keep your phone charged and connected to the internet at all time to avoid disconnection.
        </ListItem>
        <ListItem color="gray.500">
          Do not use WhatsApp Web/ Desktop simultaneously since WhatsApp only allows 1 active web
          session at any given time.
        </ListItem>
        <ListItem color="gray.500">
          If you logout Simpu from Whatsapp on your phone, all your Whatsapp messages will be
          deleted from your Simpu inbox this is to ensure your privacy.
        </ListItem>
      </List>
      <Box my="1.5rem">
        <Button isFullWidth variantColor="blue" onClick={handleClose}>
          Finish
        </Button>
      </Box>
    </>
  );
}
