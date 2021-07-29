import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../root';
import { ThreadSchema, InboxStatusSchema, NotificationSchema } from '../inbox.types';
import { selectInboxEntitiesState } from './ui';
import {
  fetchThreadsByState,
  onWebSocketAssignedThread,
  onWebSocketNewMessage,
  addContact,
  onWebSocketNewThread,
  onWebSocketResolvedThread,
  sendMessage,
  fetchThreadByID,
  searchInbox,
  onWebSocketAccountDisconnected,
} from './global';
import { selectAllNotifications } from './notification';
import { selectAddressBookEntities, selectAllAddressBooks, selectColumnEntities } from './contact';
import { selectAllCustomers } from './customer';

const threadsAdapter = createEntityAdapter<ThreadSchema>({
  selectId: thread => thread.uuid,
  sortComparer: (a, b) => (b?.updated_datetime || '')?.localeCompare(a?.updated_datetime || ''),
});

type Meta = {
  count: number;
  pageSize: number;
  pageCount: number;
  page: number;
};
const INITIAL_META = {
  assigned: {
    count: 0,
    page: 0,
    pageSize: 0,
    pageCount: 0,
  },
  queued: {
    count: 0,
    page: 0,
    pageSize: 0,
    pageCount: 0,
  },
  resolved: {
    count: 0,
    page: 0,
    pageSize: 0,
    pageCount: 0,
  },
};
const INITIAL_HAS_MORE = { assigned: true, queued: true, resolved: true };
const threadInitialState = threadsAdapter.getInitialState<{
  status: { [k: string]: InboxStatusSchema };
  meta: { [v: string]: { [k: string]: Meta } };
  hasMore: { [v: string]: { [k: string]: boolean } };
}>({
  meta: {},
  status: { assigned: 'idle', queued: 'idle', resolved: 'idle' },
  hasMore: {},
});

const websocketCallback = (state: any, action: any) => {
  const { threads } = action.payload;
  threads && threadsAdapter.upsertMany(state, threads);
};

const threadsSlice = createSlice({
  name: 'inbox_threads',
  initialState: threadInitialState,
  reducers: {
    updateHasMore(
      state,
      action: PayloadAction<{ state: ThreadSchema['state']; organisation_id: string }>,
    ) {
      const { organisation_id, state: threadState } = action.payload;

      if (threadState && organisation_id) {
        if (!state.hasMore[organisation_id]) {
          state.hasMore[organisation_id] = { ...INITIAL_HAS_MORE };
        }
        state.hasMore[organisation_id][threadState] = false;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchThreadsByState.pending, (state, action) => {
        state.status[action.meta.arg.state] = 'loading';
      })
      .addCase(fetchThreadsByState.fulfilled, (state, action) => {
        const { threads, meta } = action.payload;
        threads && threadsAdapter.upsertMany(state, threads);
        state.status[action.meta.arg.state] = 'success';
        const { state: statusState, organisation_id } = action.meta.arg;
        if (statusState && organisation_id) {
          if (!state.meta[organisation_id]) {
            state.meta[organisation_id] = { ...INITIAL_META };
          }
        }

        state.meta[organisation_id][statusState] = meta || {};
      })
      .addCase(onWebSocketNewThread, websocketCallback)
      .addCase(sendMessage.fulfilled, websocketCallback)
      .addCase(fetchThreadByID.fulfilled, websocketCallback)
      .addCase(searchInbox.fulfilled, websocketCallback)
      .addCase(onWebSocketResolvedThread, websocketCallback)
      .addCase(onWebSocketAssignedThread, websocketCallback)
      .addCase(onWebSocketNewMessage, (state, action) => {
        const { messages, message_id } = action.payload;
        const message = messages[message_id];
        const { uuid: last_message_id, thread_id: id, created_datetime } = message;

        if (last_message_id && id) {
          //@ts-ignore
          threadsAdapter.updateOne(state, {
            id,
            changes: { last_message_id, updated_datetime: created_datetime },
          });
        }
      })
      .addCase(onWebSocketAccountDisconnected, (state, action) => {
        const { threadIDs } = action.payload;

        threadIDs?.length > 0 && threadsAdapter.removeMany(state, threadIDs);
      })
      .addCase(addContact.fulfilled, (state, action) => {
        const { thread_id, addressBooks: ab } = action.payload;

        const [addressBook] = ab || [];

        if (thread_id && addressBook?.uuid) {
          //@ts-ignore
          threadsAdapter.updateOne(state, {
            id: thread_id,
            changes: { address_book_id: addressBook.uuid },
          });
        }
      });
  },
});

export const threadsReducer = threadsSlice.reducer;
export const { updateHasMore } = threadsSlice.actions;

export const {
  selectById: selectThreadById,
  selectIds: selectThreadIds,
  selectEntities: selectThreadEntities,
  selectAll: selectAllThreads,
  selectTotal: selectTotalThreads,
} = threadsAdapter.getSelectors<RootState>(state => state.inbox.entities.threads);

export const selectThreadDetailByID = createSelector(
  selectThreadById,
  selectAllAddressBooks,
  selectColumnEntities,
  (thread, addressBooks, cs) => {
    const addressBook = addressBooks.find(
      ({ organisation_id, customer_id }) =>
        //@ts-ignore
        organisation_id === thread?.organisation_id && customer_id === thread?.sender_id,
    );
    const columns = cs[addressBook?.contact_id || ''];

    const sender_name = columns && columns[1];

    //@ts-ignore
    return { ...thread, sender_name, address_book_id: addressBook?.uuid } as ThreadSchema;
  },
);

export const makeSelectThreadById = () => selectThreadDetailByID;

export const selectThreadStateByID = createSelector(selectThreadById, thread => thread?.state);

export const selectThreadsState = createSelector(selectInboxEntitiesState, inbo => inbo.threads);

export const selectOrgThreadsByState = createSelector(
  selectAllThreads,
  //@ts-ignore
  (_: RootState, payload: Pick<ThreadSchema, 'state' | 'organisation_id'>) => payload.state,
  //@ts-ignore
  (_: RootState, payload: Pick<ThreadSchema, 'state' | 'organisation_id'>) =>
    payload.organisation_id,
  (threads, pState, pOrganisationID) =>
    threads.filter(
      //@ts-ignore
      ({ state: tState, organisation_id }) =>
        pOrganisationID === organisation_id && pState === tState,
    ),
);

export const selectOrgThreadsByStateStatusCount = createSelector(
  selectOrgThreadsByState,
  selectAllNotifications,
  (_: RootState, payload: Pick<NotificationSchema, 'user_id'>) => payload,
  (threads, notifications, payload) =>
    //@ts-ignore
    threads.filter(({ last_message_id }) => {
      const notification = notifications.find(
        ({ user_id: u, message_id: mID }) => last_message_id === mID && u === payload.user_id,
      );

      return ['sent', 'delivered'].includes(notification?.status || '');
    }).length,
);

export const selectOrgInboxStatusCount = createSelector(
  selectAllThreads,
  selectAllNotifications,
  (_: RootState, payload: any) => payload,
  (threads, notifications, payload) => {
    let queuedcount = 0;
    let otherCount = 0;
    threads
      //@ts-ignore
      .filter(({ organisation_id }) => organisation_id === payload.organisation_id)
      //@ts-ignore
      .forEach(({ last_message_id, state }) => {
        if (state === 'queued') {
          queuedcount += 1;
          return;
        }

        const notification = notifications.find(
          ({ user_id: u, message_id: mID }) => last_message_id === mID && u === payload.user_id,
        );

        if (['sent', 'delivered'].includes(notification?.status || '')) {
          otherCount += 1;
        }
      });

    return queuedcount + otherCount;
  },
);

export const selectThreadIdsByState = createSelector(selectOrgThreadsByState, threads =>
  threads.map(({ uuid }) => uuid),
);

export const selectOrgThreadsCount = createSelector(
  selectOrgThreadsByState,
  threads => threads.length,
);

export const makeSelectThreadIdsByState = () => selectThreadIdsByState;

export const selectFirstThread = createSelector(selectThreadIdsByState, uuids => uuids[0]);

export const selectThreadsStatus = createSelector(selectThreadsState, threads => threads.status);

export const selectThreadsMeta = createSelector(selectThreadsState, threads => threads.meta);

export const selectThreadsOrgMeta = createSelector(
  selectThreadsMeta,
  (_: RootState, payload: { statusState: string; organisation_id: string }) =>
    payload.organisation_id,
  (meta, organisation_id) => meta[organisation_id] || INITIAL_META,
);

export const selectThreadsHasMore = createSelector(selectThreadsState, threads => threads.hasMore);

export const selectThreadsOrgHasMore = createSelector(
  selectThreadsHasMore,
  (_: RootState, payload: { statusState: string; organisation_id: string }) =>
    payload.organisation_id,
  (hasMore, organisation_id) => hasMore[organisation_id] || INITIAL_HAS_MORE,
);

export const selectAssignedThreadUserMeta = createSelector(
  selectAllThreads,
  selectAllCustomers,
  selectAddressBookEntities,
  (threads, customers, addressBooksObj) => {
    const assignedThreads = threads
      .filter(({ state }) => state === 'assigned')
      //@ts-ignore
      .map(({ uuid, sender_id, receiver_id, address_book_id }) => {
        const senderPlatformID = customers.find(({ uuid }) => uuid === sender_id)?.platform_nick;
        let contact_id = null;
        if (address_book_id) {
          const addressBook = addressBooksObj[address_book_id];
          contact_id = addressBook?.contact_id;
        }

        return { thread_id: uuid, receiver_id, senderPlatformID, contact_id };
      });

    return assignedThreads;
  },
);

export const makeSelectStatusByState = () =>
  createSelector(
    selectThreadsStatus,
    selectThreadsOrgMeta,
    selectThreadsOrgHasMore,
    (_: RootState, payload: { statusState: string; organisation_id: string }) =>
      payload.statusState,
    (status, meta, hasMore, statusState) => ({
      meta: meta[statusState],
      status: (status || {})[statusState],
      hasMore: hasMore[statusState],
    }),
  );
