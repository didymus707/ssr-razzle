import {
  Box,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/core';
import { removeTemplateHtmlTags } from 'app/authenticated-app/inbox/inbox.utils';
import { Button } from 'app/components';
import { endOfTomorrow } from 'date-fns';
import React, { useState } from 'react';
import { Menu, MenuItem, ToastBox } from '../../../../../components';
import { INITIAL_PAYMENT_REQUEST } from '../../../inbox.data';
import {
  ComposeIconsProps,
  MessageProps,
  PaymentItemSchema,
  PaymentLinkMetaSchema,
  PaymentRequestSchema,
  ThreadSchema,
  TwoWayPayloadSchema,
} from '../../../inbox.types';
import { useInbox } from '../../Provider';
import { Attachments } from './Attachments';
import { ComposeIcons } from './ComposeIcons';
import { EditorWithEmoji } from './EditorWithEmoji';

export type MessageComposeFormProps = {
  text: string;
  isLoading?: boolean;
  thread: ThreadSchema;
  isTemplateMode: boolean;
  currentThreadID: string;
  isCreatingLink?: boolean;
  setText(text: string): void;
  twoWayPayload: TwoWayPayloadSchema;
  textAreaRef: MessageProps['textAreaRef'];
  threadRef: React.RefObject<HTMLDivElement>;
  onSubmit?(payload: any, callback?: () => void): void;
  sendAndClose?(payload?: any, callback?: () => void): void;
  onSendPaymentRequest?(payload: any, callback: () => void): void;
  setIsTemplateMode: React.Dispatch<React.SetStateAction<boolean>>;
  setTwoWayPayload: React.Dispatch<React.SetStateAction<TwoWayPayloadSchema>>;
} & Pick<ComposeIconsProps, 'isModalOpened' | 'setIsModalOpened'>;

export const MessageComposeForm = ({
  text,
  thread,
  setText,
  onSubmit,
  threadRef,
  isLoading,
  textAreaRef,
  sendAndClose,
  isModalOpened,
  twoWayPayload,
  isCreatingLink,
  isTemplateMode,
  currentThreadID,
  setTwoWayPayload,
  setIsModalOpened,
  setIsTemplateMode,
  onSendPaymentRequest,
}: MessageComposeFormProps) => {
  const INITIAL_PAYMENT_ITEM: PaymentItemSchema = {
    name: '',
    amount: 0,
    id: new Date().getTime().toString(),
  };
  const [paymentItems, setPaymentItems] = React.useState<PaymentItemSchema[]>([
    INITIAL_PAYMENT_ITEM,
  ]);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [onSendMessageErrorData, setOnSendMessageErrorData] = useState<{
    status: boolean;
    message: string;
  }>({ status: false, message: '' });
  const [paymentLinkMeta, setPaymentLinkMeta] = useState<PaymentLinkMetaSchema>({
    provider: { value: 'paystack', text: 'Paystack' },
    expiry_date: { value: endOfTomorrow().getTime(), text: 'Tomorrow' },
  });
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequestSchema>(
    INITIAL_PAYMENT_REQUEST,
  );

  const toast = useToast();
  const { isNewConversation } = useInbox();

  const channel = thread?.receiver?.channel_name;

  const sendMessageSuccessCallback = () => {
    if (threadRef?.current) {
      threadRef.current.scrollTop = 0;
    }

    setText('');
    setAttachedFiles([]);
    setIsTemplateMode(false);
    setTwoWayPayload({
      senderPlatformNick: '',
    });
  };

  const handleSubmit = async () => {
    let content: string = removeTemplateHtmlTags(text);

    let payload: any = {
      body: content,
      type: 'message',
      files: attachedFiles,
      thread_id: isNewConversation ? undefined : currentThreadID,
    };

    if (channel === 'messenger' && text && attachedFiles && attachedFiles.length > 0) {
      return toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Cannot send attachment and text together" />
        ),
      });
    }

    if (!content.trim() && attachedFiles && attachedFiles.length === 0) {
      return;
    }

    if (isNewConversation) {
      const { contact_id, contactName, senderPlatformNick, credential_id } = twoWayPayload;
      payload = {
        ...payload,
        contact_id,
        credential_id,
        contact_name: contactName,
        user_nick: senderPlatformNick,
      };
    }

    onSubmit?.(payload);
    sendMessageSuccessCallback();
  };

  const handleSendAndClose = async () => {
    let content: string = removeTemplateHtmlTags(text);

    let payload: any = {
      body: content,
      type: 'message',
      files: attachedFiles,
      thread_id: isNewConversation ? undefined : currentThreadID,
    };

    if (channel === 'messenger' && text && attachedFiles && attachedFiles.length > 0) {
      return toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Cannot send attachment and text together" />
        ),
      });
    }

    if (!content.trim() && attachedFiles && attachedFiles.length === 0) {
      return;
    }

    sendAndClose?.(payload);
    sendMessageSuccessCallback();
  };

  const handleClearPaymentRequest = () => {
    setPaymentItems([]);
    setPaymentLinkMeta({
      provider: { value: 'paystack', text: 'Paystack' },
      expiry_date: { value: endOfTomorrow().getTime(), text: 'Tomorrow' },
    });
    setPaymentRequest(INITIAL_PAYMENT_REQUEST);
  };

  const handleMessageErrorPromptClose = () => {
    setOnSendMessageErrorData({ status: false, message: '' });
  };

  return (
    <Box
      py="1rem"
      borderRadius="8px"
      paddingLeft="1.25rem"
      paddingRight="1.5625rem"
      border="1px solid rgb(228, 233, 240)"
    >
      <Attachments files={attachedFiles} setFiles={setAttachedFiles} />

      <EditorWithEmoji
        style={{
          width: '100%',
          resize: 'none',
          border: 'none',
          outline: 'none',
          fontSize: '1rem',
          lineHeight: '22px',
          paddingRight: '3rem',
          paddingBottom: '.5rem',
        }}
        minRows={3}
        maxRows={15}
        value={text}
        setText={setText}
        textAreaRef={textAreaRef}
        handleSubmit={handleSubmit}
        placeholder="Enter message..."
        isTemplateMode={isTemplateMode}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
      />

      <Flex justifyContent="flex-end" alignItems="center">
        <ComposeIcons
          value={text}
          setText={setText}
          textAreaRef={textAreaRef}
          paymentItems={paymentItems}
          attachedFiles={attachedFiles}
          isModalOpened={isModalOpened}
          isCreatingLink={isCreatingLink}
          paymentRequest={paymentRequest}
          paymentLinkMeta={paymentLinkMeta}
          setPaymentItems={setPaymentItems}
          setIsModalOpened={setIsModalOpened}
          setAttachedFiles={setAttachedFiles}
          setPaymentRequest={setPaymentRequest}
          setIsTemplateMode={setIsTemplateMode}
          setPaymentLinkMeta={setPaymentLinkMeta}
          onSendPaymentRequest={data => onSendPaymentRequest?.(data, handleClearPaymentRequest)}
        />

        <Flex pl="0.5rem">
          <Button
            size="sm"
            roundedRight="0"
            variantColor="blue"
            isLoading={isLoading}
            onClick={handleSubmit}
            roundedTopLeft="100px"
            roundedBottomLeft="100px"
            _focus={{ boxShadow: 'none' }}
            //@ts-ignore
            leftIcon="inbox-compose-send"
            isDisabled={!(!!text.trim() || attachedFiles.length > 0)}
          >
            Send
          </Button>
          <Menu
            renderItem={(option, index) => <MenuItem key={`${index}`} {...option} />}
            menuButtonProps={{
              as: Button,
              size: 'sm',
              roundedLeft: '0',
              //@ts-ignore
              variantColor: 'blue',
              roundedTopRight: '100px',
              roundedBottomRight: '100px',
              _focus: { boxShadow: 'none' },
              children: <Icon name="chevron-down" />,
              isDisabled: !(!!text.trim() || attachedFiles.length > 0),
            }}
            options={[{ children: 'Send and close', onClick: handleSendAndClose }]}
          />
        </Flex>
      </Flex>

      <Modal
        isCentered
        size="md"
        isOpen={onSendMessageErrorData.status}
        onClose={handleMessageErrorPromptClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius="4px">
          <ModalHeader>Sending Message Error!</ModalHeader>
          <ModalCloseButton size="sm" />
          <ModalBody>
            <Text>{onSendMessageErrorData.message}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
