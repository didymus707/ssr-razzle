import { Box, Flex, Icon, Image, Link, Stack, Text } from '@chakra-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../../../../root';
import { TextWithLink, Button } from 'app/components';
import { TeamMember } from '../../../settings/settings.types';
import { INBOX_INIT } from '../../inbox.data';
import { MessageItemViewProps } from '../../inbox.types';
import { formatMessageDateTime, isOnlyEmoji } from '../../inbox.utils';
import { messageSend, retrySendingMessage, selectName } from '../../slices';
import { selectUserDetailByID } from '../../slices/inboxUser';

export const MessageItemView = ({
  messageRef,
  itemID,
  isOrgUser,
  type: t,
  author_id,
  status,
  content,
  attachments,
  linkMetaDatas,
  threadReceiverUserID,
  isChannelAcct,
  hasAttachment,
  nextItemID = '',
  previousItemID = '',
  timeViewRef,
  time,
  threadSenderID,
}: MessageItemViewProps) => {
  const type = t || 'normal';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const history = useHistory();
  const dispatch = useDispatch();

  const author = useSelector((state: RootState) => selectUserDetailByID(state, author_id)) || {
    ...INBOX_INIT.inboxUser,
    userInfo: INBOX_INIT.customer,
  };
  const authorName = useSelector((state: RootState) =>
    selectName(state, 
      { 
        id: author_id,
        // @ts-ignore
        credentialUserID: threadReceiverUserID 
      }),
  );

  let { userInfo } = author;
  let avatarName = '';
  if (userInfo) {
    if ('channel' in userInfo) {
      avatarName = authorName;
    } else {
      const { first_name, last_name } = userInfo as TeamMember;
      avatarName = `${first_name} ${last_name}`;
    }
  }

  const isRhs = !!(isOrgUser || (isChannelAcct && type !== 'payment_received'));

  const retryMessage = () => {
    dispatch(messageSend({ message_id: itemID }));
    dispatch(retrySendingMessage({ message_id: itemID }));
  };

  return (
    <Flex flexDirection={isRhs ? 'row-reverse' : 'row'}>
      <Stack maxWidth="65.4%" alignItems={isRhs ? 'flex-end' : 'unset'}>
        {/* {(hasAttachment && status === 'loading') || (status === 'unsent' && !content) ? (
          <Flex
            backgroundColor="#F2F2F2"
            size="12.875rem"
            justifyContent="center"
            alignItems="center"
            marginTop=".625rem"
          >
            {status === 'loading' && <Spinner emptyColor="gray.200" color="blue.500" size="sm" />}
            {status === 'unsent' && <Icon name="warning-2" size="2.5rem" color="red.500" />}
          </Flex>
        ) : (
          <Attachment
            message_id={itemID}
            isOrgUser={isRhs}
            receiverUserID={threadReceiverUserID || ''}
          />
        )} */}

        <Stack alignItems={isRhs ? 'flex-end' : 'flex-start'}>
          {isOnlyEmoji(content || '') ? (
            <Text textAlign="justify" fontSize="2.25rem">
              {content}
            </Text>
          ) : content ? (
            <Box>
              <Flex
                display="inline-flex"
                padding=".75rem .875rem"
                borderRadius=".625rem"
                borderBottomLeftRadius={isRhs ? '.625rem' : '0'}
                borderBottomRightRadius={isRhs ? '0' : '.625rem'}
                backgroundColor={isRhs ? 'rgba(119, 131, 253, 0.16)' : '#fdfdfd'}
                border={isRhs ? 'solid 1px #e9edf0' : 'solid 1px rgba(0, 0, 0, 0.03)'}
                opacity={isRhs ? 1 : 0.7}
                marginTop={(attachments || []).length > 0 ? '.625rem' : '0'}
                alignItems="center"
              >
                {type === 'payment_received' && (
                  <Box marginRight="1.25rem">
                    <Icon name="money" size="2rem" />
                  </Box>
                )}

                <TextWithLink
                  lineHeight="1.25"
                  text={content}
                  fontSize="1rem"
                  color="#1c252c"
                  whiteSpace="pre-wrap"
                  overflowWrap="anywhere"
                />
              </Flex>
            </Box>
          ) : (
            <Box />
          )}

          {(linkMetaDatas || []).length > 0 &&
            (linkMetaDatas || []).map(
              ({ url, description, image, site_name: siteName, title }, index) => (
                <Flex key={`${index}-${url}`} fontSize=".875rem" marginTop=".875rem">
                  <Box borderLeft=".25rem solid rgb(53, 55, 59)" borderRadius=".5rem" />

                  <Box marginX=".75rem">
                    <Text fontWeight="bold">{siteName}</Text>
                    <Link href={url} isExternal fontWeight={400} textDecoration="underline">
                      {title}
                    </Link>
                    <Text>{description}</Text>
                  </Box>

                  <Image src={image} size="5rem" />
                </Flex>
              ),
            )}

          <Flex
            width="100%"
            lineHeight=".875rem"
            alignItems="center"
            justifyContent={status === 'unsent' ? 'space-between' : undefined}
            flexDirection={isRhs ? 'row-reverse' : 'row'}
          >
            <Flex alignItems="center" flexDirection={isRhs ? 'row' : 'row-reverse'}>
              {status === 'unsent' && (
                <Text fontSize=".75rem" color="#EB5757" fontWeight={400} marginX=".25rem">
                  Failed
                </Text>
              )}
              {author_id !== threadSenderID && (
                <Text
                  opacity={0.5}
                  fontSize=".75rem"
                  color="brandBlack"
                  fontWeight={600}
                  marginX=".25rem"
                >
                  {avatarName}
                </Text>
              )}
              <Text color="#212242" opacity={0.5} fontSize=".75rem" ref={timeViewRef}>
                {formatMessageDateTime(time ? new Date(time) : new Date())}
              </Text>
            </Flex>

            {status === 'unsent' && (
              <Button
                variant="ghost"
                color="#BDBDBD"
                fontSize=".75rem"
                height="auto"
                padding=".25rem"
                onClick={() => retryMessage()}
              >
                Retry
              </Button>
            )}
          </Flex>
        </Stack>
      </Stack>
    </Flex>
  );
};
