import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash';
import { RootState } from '../../../../root';
import { loadState, saveState } from '../../../../utils';
import { TablePropertiesOptions } from '../../tables';
import { MessageSchema } from '../inbox.types';
import {
  addContact, addTableColumn, assignThread, fetchContactTable, fetchThreadMessages,
  loadScrollMemory, onNewWebsocketEvent, sendMessage, subscribeToWebsocket, updateContact
} from './global';

export const conversationTabControls: { [key: string]: number } = {
  queued: 0,
  assigned: 1,
  resolved: 2
};

const uiInitialState = {
  conversationTabIndex: conversationTabControls.assigned,
  websocketSubscribedOrgs: {} as ({ [k: string]: boolean }),
  shouldPopSound: false,
  shouldGoInboxHome: false,
  isAssigning: {} as ({ [k: string]: 'pending' | 'fulfilled' | 'rejected' }),
  messageStatus: {} as ({ [k: string]: 'pending' | 'fulfilled' | 'rejected' }),
  firstUnreadMessageIDs: {} as ({ [k: string]: string | null }),
  scrollTops: {} as ({ [k: string]: number }), 
  errors: {} as ({ [k: string]: string }),
  contacTable: undefined as (TablePropertiesOptions | undefined),
  loadingMessages: {} as { [k: string]: MessageSchema[] },
  threadMessageMeta: {} as { [k: string]: ({
    count: number;
    pageSize: number;
    pageCount: number;
    page: number;
  })},
};

const uiSlice = createSlice({
  name: 'inbox_ui',
  initialState: uiInitialState,
  reducers: {
    changeConversationTabIndex(state, action: PayloadAction<{ tabIndex: number }>) {
      const { tabIndex } = action.payload;

      if (tabIndex >= 0 && tabIndex <= 2) {
        state.conversationTabIndex = tabIndex;
      }
    },
    stopPopSound(state) {
      state.shouldPopSound = false;
    },
    resetShouldGoHome(state) {
      state.shouldGoInboxHome = false;
    },
    onOrganisationSwitch(state) {
      state.shouldGoInboxHome = true;
    },
    updateScrollTop(state, action: PayloadAction<{ thread_id: string, scrollTop: number }>) {
      const { thread_id, scrollTop } = action.payload;

      if (thread_id && typeof scrollTop === 'number') {
        state.scrollTops[thread_id] = scrollTop;

        const currentLocalState = loadState();
        currentLocalState && saveState({
          ...currentLocalState,
          scrollMemory: {
            ...currentLocalState?.scrollMemory,
            [thread_id]: scrollTop
          }
        });
      }
    },
    addLoadingMessage(state, action: PayloadAction<{
      message: MessageSchema, messageMarker: string
    }>) {
      const { message, messageMarker } = action.payload;

      if (message && messageMarker) {
        if (!state.loadingMessages[messageMarker]) {
          state.loadingMessages[messageMarker] = [];
        }
        state.loadingMessages[messageMarker].push(message);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(subscribeToWebsocket.fulfilled, (state, action) => {
        if (action.payload) {
          state.websocketSubscribedOrgs[action.payload] = true;
        }
      })
      .addCase(addContact.fulfilled, (state, action) => {
        if (action.payload?.table) {
          state.contacTable = action.payload.table;
        }
      })
      .addCase(addTableColumn.fulfilled, (state, action) => {
        if (action.payload?.table) {
          state.contacTable = action.payload.table;
        }
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        if (action.payload?.table) {
          state.contacTable = action.payload.table;
        }
      })
      .addCase(loadScrollMemory.fulfilled, (state, action) => {
        if (!isEmpty(action.payload)) {
          state.scrollTops = { ...state.scrollTops, ...action.payload };
        }
      })
      .addCase(onNewWebsocketEvent, (state) => {
        state.shouldPopSound = true;
      })
      .addCase(assignThread.pending, (state, action) => {
        state.isAssigning[action.meta.arg.thread_id] = 'pending';
      })
      .addCase(assignThread.rejected, (state, action) => {
        state.isAssigning[action.meta.arg.thread_id] = 'rejected';
      })
      .addCase(assignThread.fulfilled, (state, action) => {
        state.isAssigning[action.meta.arg.thread_id] = 'fulfilled';
      })
      .addCase(fetchContactTable.fulfilled, (state, action) => {
        if (action.payload) {
          state.contacTable = action.payload;
        }
      })
      .addCase(fetchThreadMessages.pending, (state, action) => {
        const { thread_id } = action.meta.arg;

        if (thread_id && !thread_id.includes('unknown')) {
          state.messageStatus[thread_id] = 'pending';
          state.threadMessageMeta[thread_id] = {
            count: 0,
            page: 0,
            pageSize: 0,
            pageCount: 0,
          };
          state.firstUnreadMessageIDs[action.meta.arg.thread_id] = null;
        }
      })
      .addCase(fetchThreadMessages.fulfilled, (state, action) => {
        state.messageStatus[action.meta.arg.thread_id] = 'fulfilled';
        const { firstUnreadMessgeID, thread_id, meta } = action.payload.ui || {};
        if (thread_id) {
          state.firstUnreadMessageIDs[thread_id] = firstUnreadMessgeID;
          state.threadMessageMeta[thread_id] = meta;
        }
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { marker, thread_id } = action.meta.arg;
        
        state.loadingMessages[thread_id] = state.loadingMessages[thread_id]?.filter(
          ({ uuid }) => uuid !== marker
        );
      });
  },
});

export const {
  changeConversationTabIndex,
  stopPopSound,
  updateScrollTop,
  addLoadingMessage,
  onOrganisationSwitch,
  resetShouldGoHome,
} = uiSlice.actions;

export const inboxUiReducer = uiSlice.reducer;

export const selectInboxState = createSelector(
  (state: RootState) => state.inbox,
  (inbo) => inbo
);

export const selectInboxEntitiesState = createSelector(
  selectInboxState, (inbo) => inbo.entities
);

export const selectInboxUiState = createSelector(
  selectInboxState, (inbo) => inbo.inboxUi
);

export const selectConversationTabIndex = createSelector(
  selectInboxUiState,
  (inboxUi) => inboxUi.conversationTabIndex
);

export const selectContactTableID = createSelector(
  selectInboxUiState,
  (inboxUi) => inboxUi.contacTable?.id
);

export const selectContactTable = createSelector(
  selectInboxUiState,
  (inboxUi) => inboxUi.contacTable
);

export const selectThreadAssigningState = createSelector(
  selectInboxUiState,
  (_: RootState, thread_id: string) => thread_id,
  (inboxUi, thread_id) => inboxUi.isAssigning[thread_id]
);

export const selectMessageMeta = createSelector(
  (_: RootState, payload: { thread_id: string }) => payload.thread_id,
  selectInboxUiState,
  (thread_id, inboxUi) => ({
    status: inboxUi.messageStatus[thread_id],
    meta: inboxUi.threadMessageMeta[thread_id],
    firstUnreadMessageID: inboxUi.firstUnreadMessageIDs[thread_id],
  })
);

export const selectScrollTop = createSelector(
  (_: RootState, payload: { thread_id: string }) => payload.thread_id,
  selectInboxUiState,
  (thread_id, inboxUi) => inboxUi.scrollTops[thread_id]
);

export const selectFirstUnreadMessageID = createSelector(
  (_: RootState, payload: { thread_id: string }) => payload.thread_id,
  selectInboxUiState,
  (thread_id, inboxUi) => inboxUi.firstUnreadMessageIDs[thread_id]
)

export const selectLoadingMessage = createSelector(
  (_: RootState, payload: { messageMarker: string }) => payload.messageMarker,
  (_: RootState, payload: { thread_id: string }) => payload.thread_id,
  selectInboxUiState,
  (messageMarker, thread_id, inboxUi) => inboxUi.loadingMessages[thread_id].find(({ uuid }) => uuid === messageMarker)
);

export const selectLoadingMessageIDs = createSelector(
  (_: RootState, payload: { thread_id: string }) => payload.thread_id,
  selectInboxUiState,
  (thread_id, inboxUi) => (
    [...(inboxUi.loadingMessages[thread_id] || ([] as MessageSchema[]))]
  ).reverse().map(
    ({ uuid }) => uuid
  )
);

export const selectShouldGoHomeValue = createSelector(
  selectInboxUiState,
  uiState => uiState.shouldGoInboxHome
);
