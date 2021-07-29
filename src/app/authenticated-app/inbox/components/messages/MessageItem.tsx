import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CustomerSchema, MessageItemProps } from '../../inbox.types';
import { INBOX_INIT } from '../../inbox.data';
import { RootState } from '../../../../../root';
import {
  selectMessageById,
  selectMessageMetaById,
  selectMessageNotificationStatus,
  selectMessageNotificationID,
  updateNotification,
} from '../../slices';
import { selectUserID } from '../../../../unauthenticated-app/authentication';
import { TeamMember } from '../../../settings/settings.types';
import { selectUserDetailByID } from '../../slices/inboxUser';
import { selectThreadReceiverPlatformID } from '../../../channels';
import { MessageItemView } from './MessageItemView';

export const MessageItem = ({
  messageRef,
  itemID,
  previousItemID,
  nextItemID,
  threadSenderID,
}: MessageItemProps) => {
  const dispatch = useDispatch();
  const timeViewRef = useRef<HTMLParagraphElement>();

  const user_id = useSelector(selectUserID) || '';
  const item =
    useSelector((state: RootState) => selectMessageById(state, itemID)) || INBOX_INIT.message;
  const { uuid, content = '', created_datetime: time, attachments, status, author_id } = item;
  const meta = useSelector((state: RootState) => selectMessageMetaById(state, itemID));

  const notificationStatus =
    useSelector((state: RootState) =>
      selectMessageNotificationStatus(state, { message_id: itemID, user_id }),
    ) || INBOX_INIT.notification.status;

  const notificationID =
    useSelector((state: RootState) =>
      selectMessageNotificationID(state, { message_id: itemID, user_id }),
    ) || INBOX_INIT.notification.uuid;

  const author = useSelector((state: RootState) => selectUserDetailByID(state, author_id)) || {
    ...INBOX_INIT.inboxUser,
    userInfo: INBOX_INIT.customer,
  };
  let { userInfo, ...inboxUser } = author;
  userInfo =
    userInfo && 'channel' in userInfo ? (userInfo as CustomerSchema) : (userInfo as TeamMember);

  const params = useParams<{ id: string }>();
  const threadReceiverUserID = useSelector((state: RootState) =>
    selectThreadReceiverPlatformID(state, params.id === 'new' ? '' : params.id),
  );

  const isOrgUser = inboxUser?.is_customer === false;
  const isChannelAcct = threadReceiverUserID === (userInfo as CustomerSchema)?.uuid;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [linkMetaDatas] = useState<any[]>([]);

  const { type } = meta || { type: 'normal' };

  useEffect(() => {
    if (
      !uuid.includes('unknown') &&
      ['sent', 'delivered'].includes(notificationStatus) &&
      messageRef &&
      messageRef.current
    ) {
      const rect = messageRef.current.getBoundingClientRect();
      const documentHeight = window.innerHeight || document.documentElement.clientHeight;
      const documentWidth = window.innerWidth || document.documentElement.clientWidth;
      const isInView =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= documentHeight &&
        rect.right <= documentWidth;

      let isTimeViewInView = false;
      if (!isInView && timeViewRef && timeViewRef.current) {
        const timeRect = timeViewRef.current.getBoundingClientRect();
        isTimeViewInView =
          timeRect.top >= 0 &&
          timeRect.left >= 0 &&
          timeRect.bottom <= documentHeight &&
          timeRect.right <= documentWidth;
      }

      if (isInView || isTimeViewInView) {
        try {
          dispatch(
            updateNotification({
              notificationID,
              status: notificationStatus,
            }),
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  // useEffect(() => {
  //   const fetch = async () => {
  //     if (content) {
  //       const links = getTextLinks(content);
  //       const lmds = await Promise.all(links.map(async (url) => {
  //         const data = await getUrlMetaData({ url });
  //         if (isEmpty(data.json)) {
  //           return null;
  //         }

  //         return { ...data.json, url }
  //       }));
  //       setLinkMetaDatas(lmds.filter((item) => item));
  //     }
  //   };

  //   fetch();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [content]);

  return (
    <MessageItemView
      messageRef={messageRef}
      timeViewRef={timeViewRef}
      itemID={itemID}
      isOrgUser={isOrgUser}
      type={type}
      status={status || ''}
      content={content}
      attachments={attachments}
      linkMetaDatas={linkMetaDatas}
      threadReceiverUserID={threadReceiverUserID}
      time={time}
      author_id={author_id}
      isChannelAcct={isChannelAcct}
      threadSenderID={threadSenderID}
    />
  );
};
