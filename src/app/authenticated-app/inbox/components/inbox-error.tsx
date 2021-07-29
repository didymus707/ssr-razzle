import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
} from '@chakra-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import QRCode from 'qrcode.react';
import { capitalize } from 'lodash';
import { RootState } from '../../../../root';
import { selectCustomerById } from '../slices';
import { INBOX_INIT } from '../inbox.data';
import { getChannelGroupName } from '../inbox.utils';
import { connectChannelAcct, selectCredentialById, selectWhatsAppQrCode } from '../../channels';

export function AccountError({ title, body, customerID, credentialID, status, closeModal }: any) {
  const dispatch = useDispatch();
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const { platform_name, platform_nick, channel } =
    useSelector((state: RootState) => selectCustomerById(state, customerID)) || INBOX_INIT.customer;
  const { status: credentialStatus } = useSelector((state: RootState) =>
    selectCredentialById(state, credentialID),
  ) || { status: '' };
  const qrcode = useSelector(selectWhatsAppQrCode);
  const bodyText =
    status === 'invalid_token'
      ? `Seems like your authentication  for ${platform_name || platform_nick} of ${capitalize(
          getChannelGroupName(channel),
        )} have been invalidated. Please re-authenticate.`
      : body;

  const getQrCode = () => {
    dispatch(
      connectChannelAcct({
        channel,
        isReAuth: true,
        receiverID: credentialID,
      }),
    );
  };

  useEffect(() => {
    setIsLoadingQr(true);
    getQrCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (credentialStatus === 'active') {
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentialStatus]);

  useEffect(() => {
    if (isLoadingQr && qrcode) {
      setIsLoadingQr(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingQr, qrcode]);

  return (
    <>
      <ModalHeader>{title}</ModalHeader>

      <ModalBody>
        <Text marginBottom="1rem">{bodyText}</Text>

        {status === 'invalid_token' && isLoadingQr ? (
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
      </ModalBody>
    </>
  );
}

export function InboxError({ isModalOpened, closeModal, title, body, data }: any) {
  let view = (
    <>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <Text>{body}</Text>
      </ModalBody>
    </>
  );

  if (data?.type === 'ACCOUNT_ERROR') {
    view = <AccountError closeModal={closeModal} title={title} body={body} {...data} />;
  }

  return (
    <Modal size="md" isCentered isOpen={isModalOpened} onClose={() => closeModal()}>
      <ModalOverlay />
      <ModalContent borderRadius="4px">
        {view}
        <ModalCloseButton size="sm" onClick={() => closeModal()} />
      </ModalContent>
    </Modal>
  );
}
