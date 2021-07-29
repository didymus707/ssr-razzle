import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { MessageItemProps } from '../../inbox.types';
import { INBOX_INIT } from '../../inbox.data';
import { RootState } from '../../../../../root';
import {
  selectLoadingMessage,
} from '../../slices';
import { MessageItemView } from './MessageItemView';
import { useParams } from 'react-router-dom';

export const LoadingMessageItem = ({
  messageRef, itemID, threadSenderID
}: MessageItemProps) => {
  const params = useParams<{ id: string }>();
  const item = useSelector(
    (state: RootState) => selectLoadingMessage(state, {
      messageMarker: itemID, thread_id: params.id === 'start' ? '' : params.id
    })
  ) || INBOX_INIT.message;
  const {
    content = '',
    created_datetime: time,
    status,
    author_id,
    others,
  } = item;
  const { hasAttachment } = others || { hasAttachment: false };
  const timeViewRef = useRef<HTMLParagraphElement>();

  return (
    <MessageItemView
      timeViewRef={timeViewRef}
      messageRef={messageRef}
      threadSenderID={threadSenderID}
      itemID={itemID}
      isOrgUser={true}
      status={status || ''}
      content={content}
      time={time}
      hasAttachment={hasAttachment}
      author_id={author_id}
    />
  );
}
