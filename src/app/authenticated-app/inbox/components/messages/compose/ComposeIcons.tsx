import { Stack } from '@chakra-ui/core';
import { IEmojiData } from 'emoji-picker-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../../../../../root';
import { INBOX_INIT } from '../../../inbox.data';
import { ComposeIconsProps } from '../../../inbox.types';
import { selectCustomerByID, selectThreadDetailByID } from '../../../slices';
import { Emoji } from './Emoji';
import { FilePicker } from './FilePicker';
import { Request } from './Request';
import { Template } from './Template';

export function ComposeIcons({
  value,
  setText,
  textAreaRef,
  paymentItems,
  attachedFiles,
  isModalOpened,
  isCreatingLink,
  paymentRequest,
  paymentLinkMeta,
  setPaymentItems,
  setAttachedFiles,
  setIsModalOpened,
  setIsTemplateMode,
  setPaymentRequest,
  setPaymentLinkMeta,
  onSendPaymentRequest,
}: ComposeIconsProps) {
  const params = useParams<{ id: string }>();
  const { sender_id } =
    useSelector((state: RootState) => selectThreadDetailByID(state, params.id)) ||
    INBOX_INIT.thread;
  const { channel } =
    useSelector((state: RootState) => selectCustomerByID(state, sender_id)) || INBOX_INIT.customer;

  const onEmojiClick = (event: MouseEvent, emojiObject: IEmojiData) => {
    if (textAreaRef?.current && emojiObject.emoji && typeof value === 'string') {
      const { selectionStart } = textAreaRef.current;
      setText &&
        setText(
          `${value.substring(0, selectionStart)}${emojiObject.emoji}${value.substring(
            selectionStart,
            value.length,
          )}`,
        );
    }
  };

  return (
    <Stack spacing="1rem" isInline alignItems="center">
      <Template setText={setText} sender_id={sender_id} setIsTemplateMode={setIsTemplateMode} />
      <Emoji onEmojiClick={onEmojiClick} />
      <Request
        paymentItems={paymentItems}
        isModalOpened={isModalOpened}
        paymentRequest={paymentRequest}
        isCreatingLink={isCreatingLink}
        setPaymentItems={setPaymentItems}
        paymentLinkMeta={paymentLinkMeta}
        setIsModalOpened={setIsModalOpened}
        setPaymentRequest={setPaymentRequest}
        setPaymentLinkMeta={setPaymentLinkMeta}
        onSendPaymentRequest={onSendPaymentRequest}
      />
      {!['sms'].includes(channel) && (
        <FilePicker
          channel={channel}
          files={attachedFiles}
          textAreaRef={textAreaRef}
          setFiles={setAttachedFiles}
        />
      )}
    </Stack>
  );
}
