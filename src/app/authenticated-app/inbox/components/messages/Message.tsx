import { Box, Flex } from '@chakra-ui/core';
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState } from '../../../../components';
import emptyViewImage from '../../empty.svg';
import { MessageProps, TwoWayPayloadSchema } from '../../inbox.types';
import { Content } from './Content';
import { ThreadStarter } from './ThreadStarter';

export function Message({
  textAreaRef,
  onUserOverViewToggled,
  onMobileUserOverViewOpen,
  onCloseMobileMessageDrawer,
  ...rest
}: MessageProps) {
  const params = useParams<{ id: string }>();

  const [text, setText] = useState('');
  const [shouldShowContentCompose, setShouldShowContentCompose] = useState(false);
  const [shouldShowStarterCompose, setShouldShowStarterCompose] = useState(false);
  const [twoWayPayload, setTwoWayPayload] = useState<TwoWayPayloadSchema>({
    senderPlatformNick: '',
  });

  const currentThreadID = params.id === 'new' ? '' : params.id;

  const threadRef = useRef<HTMLDivElement>(null);

  const handleTextChange = (text: string, isTemplateMode?: boolean) => {
    setText(text);
  };

  useEffect(() => {
    if (
      currentThreadID !== 'start' ||
      (parsePhoneNumberFromString(twoWayPayload.senderPlatformNick || '') &&
        currentThreadID === 'start')
    ) {
      textAreaRef?.current?.focus();
      setText('');
    }
  }, [currentThreadID, shouldShowStarterCompose, textAreaRef, twoWayPayload.senderPlatformNick]);

  return (
    <Flex
      bg="#fff"
      flexDirection="column"
      borderRadius=".3125rem"
      borderRight="1px solid rgba(213, 219, 230, 0.27)"
      position="relative"
      {...rest}
    >
      {params.id === 'start' ? (
        <ThreadStarter
          flex="1"
          text={text}
          setText={handleTextChange}
          twoWayPayload={twoWayPayload}
          setTwoWayPayload={setTwoWayPayload as any}
          showCompose={shouldShowStarterCompose}
          setShowCompose={setShouldShowStarterCompose}
        />
      ) : !params.id ? (
        <Box flex="1" borderLeft="1px solid #e9edf0">
          <EmptyState image={emptyViewImage} subheading="No messages" />
        </Box>
      ) : (
        <Content
          threadRef={threadRef}
          currentThreadID={currentThreadID}
          showCompose={shouldShowContentCompose}
          setShowCompose={setShouldShowContentCompose}
          onCloseMobileMessageDrawer={onCloseMobileMessageDrawer}
        />
      )}
    </Flex>
  );
}
