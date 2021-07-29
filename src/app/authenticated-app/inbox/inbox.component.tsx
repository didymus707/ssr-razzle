import { Box, Stack, useToast } from '@chakra-ui/core';
import { ToastBox } from 'app/components';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { channelOptions, typeOptions } from '.';
import { selectOrganisationID, selectUserID } from '../../unauthenticated-app/authentication';
import { getUserChannels } from '../channels';
import {
  ConversationFilters,
  ConversationThread,
  MoreInfoSidebar,
  ThreadSection,
  WhatsappSetupModal,
} from './components';
import { ConnectChannelModal } from './components/connect-channel-modal';
import { useInbox } from './components/Provider';
import { QRCodeSetupModal } from './components/qr-code-setup-modal';
import {
  getConversationMessages,
  getConversationThreads,
  getTags,
  getThreadFiltersUnreadCount,
} from './inbox.service';
import { FilterTypeOptions, InboxTag, ThreadSchema, UserChannelSchema } from './inbox.types';
import { loadScrollMemory } from './slices';

export const Inbox = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isNewConversation } = useInbox();
  const user_id = useSelector(selectUserID);
  const {
    qrCodeChannelId,
    onCloseWhatsappModal,
    isWhatsappModalOpen,
    setIsNewConversation,
    isQRCodeSetupModalOpen,
    onOpenQRCodeSetupModal,
    onCloseQRCodeSetupModal,
    setActiveFilter: handleSetFilter,
  } = useInbox();

  const [activeFilter, setActiveFilter] = useState('queued');
  const [activeThread, setActiveThread] = useState<ThreadSchema | undefined>();
  const [filterIds, setFilterIds] = useState<string | string[] | undefined>(user_id);
  const [isConnectChannelsModalOpen, setIsConnectChannelsModalOpen] = useState(false);

  const fetchThreads = async ({ pageParam = 1, queryKey }: any) => {
    let params = {};
    queryClient.cancelQueries(['threads', activeFilter, filterIds], { exact: true });
    switch (queryKey[1]) {
      case 'queued':
        params = { ...params, state: 'queued' };
        break;
      case 'mentioned':
        params = {
          ...params,
          mention: filterIds,
        };
        break;
      case 'assigned':
        params = {
          ...params,
          assigned: filterIds,
        };
        break;
      case 'favorite':
        params = {
          ...params,
          favorite: filterIds,
        };
        break;
      case 'closed':
        params = {
          ...params,
          closed: filterIds,
        };
        break;
      case 'snoozed':
        params = {
          ...params,
          closed: filterIds,
        };
        break;
      case 'twitter':
        params = {
          ...params,
          channels: filterIds,
        };
        break;
      case 'whatsapp':
        params = {
          ...params,
          channels: filterIds,
        };
        break;
      case 'messenger':
        params = {
          ...params,
          channels: filterIds,
        };
        break;
      case 'phone':
        params = {
          ...params,
          channels: filterIds,
        };
        break;
      case 'email':
        params = {
          ...params,
          channels: filterIds,
        };
        break;
      default:
        params = { ...params, tag: filterIds };
        break;
    }
    const response = await getConversationThreads({ page: pageParam, ...params });
    const threads = response.data.threads;
    const meta = response.data.meta;

    if (meta.page === 1 && !activeThread) {
      setActiveThread(threads[0]);
    }

    return response;
  };

  const {
    data,
    hasNextPage,
    fetchNextPage,
    error: threadError,
    isLoading: isFetchingThreads,
  } = useInfiniteQuery<any, AxiosError>(['threads', activeFilter, filterIds], fetchThreads, {
    getNextPageParam: lastPage => {
      return lastPage.data.meta.page < lastPage.data.meta.page_count
        ? lastPage.data.meta.page + 1
        : undefined;
    },
    // cacheTime: 0,
    // refetchInterval: 2000,
    refetchOnWindowFocus: false,
  });

  const threads = data?.pages.reduce((acc, page) => [...acc, ...page.data.threads], []) ?? [];

  const fetchThreadMessages = ({ pageParam = 1, queryKey }: any) => {
    const thread = queryKey[1];
    return getConversationMessages({ page: pageParam, thread_id: thread ?? '' });
  };

  const {
    data: threadMessages,
    error: threadMessagesError,
    isLoading: isFetchingThreadMessges,
    hasNextPage: threadMessagesHasNextPage,
    fetchNextPage: threadMessagesFetchNextPage,
  } = useInfiniteQuery<any, AxiosError>(['messages', activeThread?.uuid], fetchThreadMessages, {
    getNextPageParam: lastPage => {
      return lastPage.meta.page < lastPage.meta.page_count ? lastPage.meta.page + 1 : undefined;
    },
    // refetchInterval: 2000,
    enabled: !!threads.length && !!activeThread && activeFilter !== 'queued',
  });

  const messages =
    threadMessages?.pages.reduce((acc, page) => [...acc, ...page.messages], []) ?? [];

  const { isLoading: isFetchingTags, data: tags } = useQuery('tags', getTags);
  const { data: filtersUnreadCount } = useQuery(
    'filters-unread-count',
    getThreadFiltersUnreadCount,
  );
  const { isLoading: isFetchingChannels, data: userChannels } = useQuery(
    'channels',
    getUserChannels,
  );

  let tagOptions: any = {};
  let credentialsWithIssue = userChannels?.filter(
    (item: UserChannelSchema) => item.status !== 'active',
  );

  tags?.forEach(({ name, color }: InboxTag) => {
    tagOptions[name] = {
      children: name,
      iconColor: color,
      icon: 'inbox-tag',
      label: name.toLowerCase(),
    };
  });

  const threadTypes: { [key: string]: FilterTypeOptions } = {
    ...typeOptions,
    ...channelOptions,
    ...tagOptions,
  };

  useEffect(() => {
    const showConnectChannelModal = Cookie.get('show_connect_channel_modal');

    if (typeof userChannels !== 'undefined') {
      if (!userChannels.length && !showConnectChannelModal) {
        setIsConnectChannelsModalOpen(true);
      } else {
        setIsConnectChannelsModalOpen(false);
      }
    }
  }, [userChannels]);

  const handleFilter = (filter: string, ids?: string[], thread?: any) => {
    setIsNewConversation(false);
    setActiveFilter(filter);
    handleSetFilter(filter);
    setFilterIds(ids ?? user_id);
    setActiveThread(thread);
    queryClient.invalidateQueries('filters-unread-count');
  };

  const handleAssignToSelf = (thread?: any) => {
    setIsNewConversation(false);
    setActiveFilter('assigned');
    handleSetFilter('assigned');
    setFilterIds(user_id);
    setActiveThread(thread);
    queryClient.invalidateQueries('filters-unread-count');
    queryClient.invalidateQueries(['threads', 'queued', user_id]);
  };

  const handleThreadItemClick = (thread: any) => {
    setIsNewConversation(false);
    setActiveThread(thread);
  };

  if (threadError) {
    toast({
      status: 'error',
      position: 'bottom-left',
      render: ({ onClose }) => <ToastBox onClose={onClose} message={threadError?.message} />,
    });
  }

  if (threadMessagesError) {
    toast({
      status: 'error',
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox onClose={onClose} message={threadMessagesError?.message} />
      ),
    });
  }

  return (
    <Stack isInline>
      <ConversationFilters
        tags={tags}
        onFilter={handleFilter}
        channels={userChannels}
        activeFilter={activeFilter}
        isFetchingTags={isFetchingTags}
        filtersUnreadCount={filtersUnreadCount}
        isFetchingChannels={isFetchingChannels}
      />
      <ThreadSection
        threads={threads}
        hasMore={hasNextPage}
        threadTypes={threadTypes}
        activeThread={activeThread}
        activeFilter={activeFilter}
        isFetching={isFetchingThreads}
        onFetchMoreData={fetchNextPage}
        onThreadItemAssign={handleAssignToSelf}
        onThreadItemClick={handleThreadItemClick}
        credentialsWithIssue={credentialsWithIssue}
      />
      <ConversationThread
        tags={tags}
        messages={messages}
        thread={activeThread}
        channels={userChannels}
        setActiveThread={setActiveThread}
        hasMore={threadMessagesHasNextPage}
        isFetching={isFetchingThreadMessges}
        onFetchMoreData={threadMessagesFetchNextPage}
        setActiveFilter={() => handleFilter('assigned')}
      />
      {activeThread && activeThread?.state !== 'queued' && !isNewConversation && (
        <MoreInfoSidebar thread={activeThread} />
      )}

      <WhatsappSetupModal
        isOpen={isWhatsappModalOpen}
        onClose={onCloseWhatsappModal}
        onOpenQrCodeModal={onOpenQRCodeSetupModal}
      />
      <QRCodeSetupModal
        channelID={qrCodeChannelId}
        isOpen={isQRCodeSetupModalOpen}
        onClose={onCloseQRCodeSetupModal}
      />
      <ConnectChannelModal
        isOpen={isConnectChannelsModalOpen}
        onClose={() => setIsConnectChannelsModalOpen(false)}
      />
    </Stack>
  );
};

export function InboxComponent() {
  const dispatch = useDispatch();
  const user_id = useSelector(selectUserID);
  const organisation_id = useSelector(selectOrganisationID);

  useEffect(() => {
    dispatch(loadScrollMemory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return user_id && organisation_id ? <Inbox /> : <Box />;
}
