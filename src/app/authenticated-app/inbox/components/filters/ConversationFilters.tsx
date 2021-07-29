import {
  Box,
  Flex,
  Icon,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverContent,
  Skeleton,
  Stack,
  useToast,
} from '@chakra-ui/core';
import {
  BodyText,
  Button,
  Input,
  InputProps,
  OutsideClickHandler,
  ToastBox,
  XSmallText,
} from 'app/components';
import { AxiosError } from 'axios';
import React, { MouseEvent, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
import { channelOptions } from '../..';
import { typeOptions } from '../../inbox.data';
import { createTag } from '../../inbox.service';
import { Channel, InboxTag } from '../../inbox.types';
import { ColorPicker } from './ColorPicker';
import {
  ConversationFilterAccordion,
  ConversationFilterAccordionItem,
} from './ConversationFilterAccordion';

export type ConversationFiltersProps = {
  tags?: any[];
  channels?: any[];
  activeFilter?: string;
  isFetchingTags?: boolean;
  isFetchingChannels?: boolean;
  filtersUnreadCount?: { [key: string]: number };
  onFilter?(filter: string, ids?: string | string[]): void;
};

export const ConversationFilters = (props: ConversationFiltersProps) => {
  const {
    tags,
    onFilter,
    channels,
    activeFilter,
    isFetchingTags,
    filtersUnreadCount,
    isFetchingChannels,
  } = props;
  const uniqChannels = new Set(channels?.map((item: any) => item.user.channel_name));
  //@ts-ignore
  const userChannels: Channel[] = [...uniqChannels];
  const channelsWithId: any = {};

  channels?.forEach(({ uuid, user }: { uuid: string; user: any }) => {
    if (Object.keys(channelsWithId).includes(user.channel_name)) {
      channelsWithId[user.channel_name].push(uuid);
      return;
    }
    channelsWithId[user.channel_name] = [uuid];
  });

  const history = useHistory();

  const handleChannelFilterClick = (channel: Channel) => {
    const ids = channelsWithId[channel];
    onFilter?.(channel, ids);
  };

  const handleTagFilterClick = (tag: any) => {
    const { name, uuid } = tag;
    onFilter?.(name, uuid);
  };

  return (
    <Box
      bg="white"
      pl="1.5rem"
      pr="0.5rem"
      pt="1.5rem"
      pb="8.125rem"
      width="305px"
      height="100vh"
      overflowY="auto"
      position="relative"
      borderRightWidth="1px"
    >
      <ConversationFilterAccordion title="Inbox">
        <Stack>
          {Object.keys(typeOptions).map((item, index) => {
            const value = typeOptions[item];
            return (
              <Box key={index.toString()}>
                <ConversationFilterAccordionItem
                  onClick={onFilter}
                  isActive={activeFilter === value.label}
                  rightSection={() =>
                    !!filtersUnreadCount?.[item] ? (
                      <XSmallText color="blue.500">{filtersUnreadCount?.[item]}</XSmallText>
                    ) : null
                  }
                  {...value}
                />
              </Box>
            );
          })}
        </Stack>
      </ConversationFilterAccordion>
      <ConversationFilterAccordion title="Channels" addons={<ChannelsAccordionAddons />}>
        <Stack>
          {isFetchingChannels
            ? Array.from({ length: 6 }, (v, i) => (
                <Box key={`${i.toString()}-${new Date().getTime()}`}>
                  <Skeleton height="25px" mb="0.2rem" />
                </Box>
              ))
            : userChannels.map((item: Channel, index: number) => (
                <Box key={index.toString()}>
                  <ConversationFilterAccordionItem
                    onClick={handleChannelFilterClick}
                    isActive={activeFilter === item}
                    {...channelOptions[item]}
                  />
                </Box>
              ))}
        </Stack>
      </ConversationFilterAccordion>
      <ConversationFilterAccordion title="Tags" defaultIndex={[1]} addons={<TagsAccordionAddons />}>
        <Stack>
          {isFetchingTags
            ? Array.from({ length: 6 }, (v, i) => (
                <Box key={`${i.toString()}-${new Date().getTime()}`}>
                  <Skeleton height="25px" mb="0.2rem" />
                </Box>
              ))
            : tags?.map((item: any, index: number) => (
                <Box key={index.toString()}>
                  <ConversationFilterAccordionItem
                    icon="inbox-tag"
                    label={item.name}
                    iconColor={item.color}
                    isActive={activeFilter === item.name}
                    onClick={() => handleTagFilterClick(item)}
                  >
                    {item.name}
                  </ConversationFilterAccordionItem>
                </Box>
              ))}
        </Stack>
      </ConversationFilterAccordion>
      <Flex
        left="0"
        bottom="0"
        px="1.5rem"
        width="305px"
        bg="gray.200"
        position="fixed"
        cursor="pointer"
        height="3.125rem"
        alignItems="center"
        justifyContent="center"
        onClick={() => history.push('/s/inbox/settings')}
      >
        <Stack width="100%" isInline alignItems="center">
          <Icon color="gray.900" name="inbox-settings" size="1.5rem" />
          <BodyText color="gray.900">Settings</BodyText>
        </Stack>
      </Flex>
    </Box>
  );
};

const ChannelsAccordionAddons = () => {
  const history = useHistory();

  return (
    <Stack isInline alignItems="center">
      <Button
        size="xs"
        variant="unstyled"
        onClick={e => {
          e.stopPropagation();
          history.push('/s/inbox/settings');
        }}
      >
        <Icon size="1.5rem" color="gray.800" name="inbox-add" />
      </Button>
    </Stack>
  );
};

const TagsAccordionAddons = () => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#DA9728');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<any>();

  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const toast = useToast();
  const queryClient = useQueryClient();

  const { isLoading: isCreatingTag, mutate: mutateCreateTag } = useMutation<
    any,
    AxiosError,
    any,
    any
  >((payload: Partial<InboxTag>) => createTag(payload), {
    onMutate: async data => {
      await queryClient.cancelQueries('tags');
      const previousTags = queryClient.getQueryData('tags');
      //@ts-ignore
      queryClient.setQueryData('tags', old => [...old, data]);
      return { previousTags };
    },
    onSuccess: () => {
      handleCloseCreateTagMenu();
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Tag created successfully" />
        ),
      });
      queryClient.invalidateQueries('tags');
    },
    onError: error =>
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
      }),
  });

  const handleCreateTag = (values: Partial<InboxTag>) => {
    mutateCreateTag(values);
  };

  const handleCloseCreateTagMenu = () => {
    setName('');
    close();
  };

  const handleOpenCreateTagMenu = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    open();
  };

  const handleSubmit = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    handleCreateTag({ color, name });
  };

  return (
    <Stack isInline alignItems="center">
      <Box>
        <Button size="xs" variant="unstyled" onClick={handleOpenCreateTagMenu}>
          <Icon size="1.5rem" color="gray.800" name="inbox-add" />
        </Button>
        <Popover initialFocusRef={inputRef} isOpen={isOpen} onClose={handleCloseCreateTagMenu}>
          <OutsideClickHandler
            maxW="200px"
            display="block"
            onClickOutside={handleCloseCreateTagMenu}
          >
            <PopoverContent
              zIndex={4}
              top="2rem"
              right="0"
              maxW="200px"
              borderWidth="0"
              position="absolute"
              onClick={e => e.stopPropagation()}
              boxShadow="0px 10px 15px rgba(0, 0, 0, 0.06)"
              _focus={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.06)' }}
            >
              <FocusLock returnFocus persistentFocus={false}>
                <PopoverBody>
                  <TextInput
                    ref={inputRef}
                    isInvalid={!name}
                    onSubmit={handleSubmit}
                    isLoading={isCreatingTag}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  />
                  <ColorPicker color={color} onChange={setColor} />
                </PopoverBody>
              </FocusLock>
            </PopoverContent>
          </OutsideClickHandler>
        </Popover>
      </Box>
    </Stack>
  );
};

const TextInput = React.forwardRef(
  (
    props: Omit<InputProps, 'onSubmit'> & {
      isLoading?: boolean;
      isInvalid?: boolean;
      onSubmit(e: MouseEvent<HTMLElement>): void;
    },
    ref: any,
  ) => {
    const { isInvalid, isLoading, onSubmit, ...rest } = props;
    return (
      <InputGroup mb="0.5rem" size="md">
        <Input
          size="sm"
          ref={ref}
          pr="2.5rem"
          rounded="50px"
          isInvalid={isInvalid}
          borderColor="gray.200"
          placeholder="Tag name"
          errorMessage="Tag name is required"
          {...rest}
        />
        <InputRightElement width="2.5rem">
          <Button
            px="0"
            size="xs"
            rounded="50%"
            onClick={onSubmit}
            isLoading={isLoading}
            isDisabled={isInvalid}
            bg="rgba(57, 68, 82, 0.35)"
          >
            <svg
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 5H8C7.448 5 7 4.552 7 4V1C7 0.448 6.552 0 6 0C5.448 0 5 0.448 5 1V4C5 4.552 4.552 5 4 5H1C0.448 5 0 5.448 0 6C0 6.552 0.448 7 1 7H4C4.552 7 5 7.448 5 8V11C5 11.552 5.448 12 6 12C6.552 12 7 11.552 7 11V8C7 7.448 7.448 7 8 7H11C11.552 7 12 6.552 12 6C12 5.448 11.552 5 11 5Z"
                fill="#394452"
              />
            </svg>
          </Button>
        </InputRightElement>
      </InputGroup>
    );
  },
);
