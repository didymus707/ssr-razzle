import {
  Box,
  Icon,
  IconButton,
  Image,
  ImageProps,
  Link,
  LinkProps,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/core';
import { SmallText } from 'app/components';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { buildConversationUrl } from '../../../../../utils';
import { selectOrganisationID } from '../../../../unauthenticated-app/authentication';
import { AttachmentProps } from '../../inbox.types';

type AttachmetTypeProps = {
  item: any;
  isOrgUser: boolean;
};

type AttachmentSchema = {
  index: number;
  status: boolean;
};

type AttachmentTypes = {
  items: any[];
  isOrgUser: boolean;
  organisation_id: string;
  channel: string;
  receiver_id: string;
};

function FileAttachment({ item, isOrgUser, ...rest }: AttachmetTypeProps & LinkProps) {
  const { name, data: { url = '' } = {} } = item;
  let file_name = url.split('?');

  if (file_name[0]) {
    file_name = file_name[0].split('/');
    file_name = file_name[file_name.length - 1];
  }

  return (
    <Stack px="1rem" py="1.25rem" isInline alignItems="center">
      <Icon name="inbox-mark-unread" color="gray.500" size="1.5rem" />
      <SmallText>{name || file_name || url.substr(0, 30)}</SmallText>
      <Link
        href={url}
        width="40px"
        rounded="50%"
        height="40px"
        display="flex"
        target="_blank"
        borderWidth="1px"
        alignItems="center"
        justifyContent="center"
        _focus={{ boxShadow: 'none' }}
        _hover={{ textDecoration: 'none' }}
        {...rest}
      >
        <Icon name="download" color="gray.500" />
      </Link>
    </Stack>
  );
}

function VideoAttachment({
  item,
  marginTop,
}: Omit<AttachmetTypeProps, 'isOrgUser'> & {
  marginTop: string;
}) {
  const { data: { url = '' } = {} } = item;

  return (
    <video
      loop
      controls={true}
      style={{ borderRadius: 12, marginTop, maxWidth: '62.54vh', height: '16.75rem' }}
    >
      <source src={url} />
      Your browser does not support the video tag.
    </video>
  );
}

function AudioAttachment({
  item,
  marginTop,
}: Omit<AttachmetTypeProps, 'isOrgUser'> & {
  marginTop: string;
}) {
  const { data: { url = '' } = {} } = item;

  return (
    <audio controls style={{ borderRadius: 12, marginTop, minHeight: '3.375rem' }}>
      <source src={url} />
      Your browser does not support the audio element.
    </audio>
  );
}

function ImageAttachment({
  item,
  organisation_id,
  channel,
  receiver_id,
  setAttachment,
  index,
  ...rest
}: {
  index: number;
  item: any;
  setAttachment: (v: AttachmentSchema) => void;
} & Omit<AttachmentTypes, 'isOrgUser' | 'items'> &
  ImageProps) {
  const { data: { url = '', preview_url = '' } = {} } = item;
  const iUrl = ['twitter', 'gmail', 'outlook'].includes(channel)
    ? buildConversationUrl(`messages/attachment/${item.id}`)
    : preview_url || url;

  return (
    <Image
      src={iUrl}
      width="100%"
      height="30vh"
      border="none"
      rounded="12px"
      cursor="pointer"
      objectFit="cover"
      onClick={() => setAttachment({ status: true, index })}
    />
  );
}

function ImageAttachments({
  items,
  organisation_id,
  channel,
  receiver_id,
  isOrgUser,
  setAttachment,
}: AttachmentTypes & { setAttachment: (v: AttachmentSchema) => void }) {
  return items.length === 1 ? (
    <ImageAttachment
      index={0}
      item={items[0]}
      channel={channel}
      receiver_id={receiver_id}
      setAttachment={setAttachment}
      organisation_id={organisation_id}
    />
  ) : (
    <Stack
      isInline
      spacing="0.1rem"
      flexWrap="wrap"
      flexDirection={isOrgUser ? 'row-reverse' : 'row'}
    >
      {items.map((item, index) => (
        <Box mb="0.1rem" width={'calc(50% - 0.1rem)'} key={item.data.url}>
          <ImageAttachment
            item={item}
            index={index}
            objectFit="cover"
            channel={channel}
            receiver_id={receiver_id}
            setAttachment={setAttachment}
            organisation_id={organisation_id}
            marginTop={index >= 2 ? '1rem' : '0'}
          />
        </Box>
      ))}
    </Stack>
  );
}

function AttachmentViewComponent({
  items,
  attachment,
  setAttachment,
  channel,
  organisation_id,
  receiver_id,
}: {
  attachment: AttachmentSchema;
  setAttachment: (v: AttachmentSchema) => void;
} & Omit<AttachmentTypes, 'isOrgUser'>) {
  const initialRef = useRef<HTMLImageElement>(null);
  let View = (
    <Text as="span" backgroundColor="#ffffff" padding="1rem">
      Failed to load items
    </Text>
  );
  const { index, status } = attachment;
  const lastIndex = items.length - 1;
  const keysPressed: any = {};

  const handleLeftClick = () =>
    setAttachment({ ...attachment, index: index === 0 ? 0 : index - 1 });
  const handleRightClick = () =>
    setAttachment({ ...attachment, index: index === lastIndex ? lastIndex : index + 1 });

  const handleKeyDown = (e: any) => {
    keysPressed[e.key] = true;

    if (keysPressed['ArrowLeft']) {
      handleLeftClick();
    } else if (keysPressed['ArrowRight']) {
      handleRightClick();
    }
  };

  const handleKeyUp = (v: string) => {
    keysPressed[v] = false;
  };

  if (items && items.length > 0) {
    const [{ type }] = items;

    if (type === 'image') {
      const item = items[index];
      const {
        data: { preview_url, url },
      } = item;
      const iUrl =
        channel === 'twitter'
          ? buildConversationUrl(
              `messages/attachment/load/${receiver_id}?url=${preview_url || url}`,
            )
          : url || preview_url;

      View = (
        <>
          <ModalContent backgroundColor="transparent" boxShadow="none">
            <Image
              ref={initialRef}
              objectFit="contain"
              height="80vh"
              src={iUrl}
              zIndex={1400}
              onKeyDown={handleKeyDown}
              onKeyUp={(e: any) => handleKeyUp(e.key)}
            />
          </ModalContent>

          {items.length > 1 && (
            <>
              <IconButton
                aria-label="navigate left"
                icon="arrow-left"
                zIndex={160000}
                position="absolute"
                top="50%"
                variant="ghost"
                variantColor="green"
                size="lg"
                marginLeft="1rem"
                display={index === 0 ? 'none' : 'inline-flex'}
                onClick={handleLeftClick}
              />

              <IconButton
                aria-label="navigate right"
                icon="arrow-right"
                zIndex={160000}
                position="absolute"
                top="50%"
                right="0"
                variant="ghost"
                variantColor="green"
                size="lg"
                marginRight="1rem"
                display={index === lastIndex ? 'none' : 'inline-flex'}
                onClick={handleRightClick}
              />
            </>
          )}
        </>
      );
    }
  }

  return (
    <Modal size="full" isOpen={status} onClose={() => setAttachment({ status: false, index: -1 })}>
      <ModalOverlay className="overlay" backgroundColor="rgba(40, 64, 48, 0.9)" />

      <ModalCloseButton color="#fff" zIndex={160000} rounded="50%" size="sm" />

      {View}
    </Modal>
  );
}

export function Attachment({ isOrgUser, receiver, attachments }: AttachmentProps) {
  const receiver_id = receiver.uuid;
  const items: any[] = attachments;
  const channel = receiver?.channel_name || '';

  const organisation_id = useSelector(selectOrganisationID) || '';

  const [attachment, setAttachment] = useState({
    status: false,
    index: -1,
  });

  if (!organisation_id || (items && items.length === 0)) {
    return <Box height="0" />;
  }

  const [{ type }] = items;

  let View = null;

  if (type === 'file') {
    View = (
      <Stack>
        {items.map((item, index) => (
          <FileAttachment
            item={item}
            key={item.id}
            isOrgUser={isOrgUser}
            marginTop={index === 0 ? '0' : '.875rem'}
          />
        ))}
      </Stack>
    );
  } else if (type === 'video') {
    View = (
      <Stack>
        {items.map((item, index) => (
          <VideoAttachment item={item} key={item.id} marginTop={index === 0 ? '0' : '.875rem'} />
        ))}
      </Stack>
    );
  } else if (type === 'audio') {
    View = (
      <Stack>
        {items.map((item, index) => (
          <AudioAttachment item={item} key={item.id} marginTop={index === 0 ? '0' : '.875rem'} />
        ))}
      </Stack>
    );
  } else if (type === 'image') {
    View = (
      <ImageAttachments
        items={items}
        channel={channel}
        isOrgUser={isOrgUser}
        receiver_id={receiver_id}
        organisation_id={organisation_id}
        setAttachment={setAttachment}
      />
    );
  } else {
    View = <Box height="0" />;
  }

  return (
    <>
      {View}

      {attachment.status && type === 'image' && (
        <AttachmentViewComponent
          items={items}
          channel={channel}
          receiver_id={receiver_id}
          organisation_id={organisation_id}
          attachment={attachment}
          setAttachment={setAttachment}
        />
      )}
    </>
  );
}
