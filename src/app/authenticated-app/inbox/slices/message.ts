import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../../../root';
import {
  AttachmentSchema,  MessageSchema, AttachmentDataSchema, MessageMetaSchema
} from '../inbox.types';
import {
  fetchThreadMessages, fetchThreadsByState, onWebSocketAssignedThread,
  onWebSocketNewMessage, onWebSocketNewThread, onWebSocketResolvedThread,
  sendInboxTemplate, fetchThreadByID, sendMessage, searchInbox,
  retrySendingMessage, onWebSocketAccountDisconnected
} from './global';

const messageMetasAdapter = createEntityAdapter<MessageMetaSchema>({
  selectId: messageMeta => messageMeta.message_id,
});

const maWebsocketCallback = (state: any, action: any) => {
  const { messageMetas } = action.payload;
  messageMetas && messageMetasAdapter.upsertMany(state, messageMetas);
};

export const messageMetasSlice = createSlice({
  name: "messageMetas",
  initialState: messageMetasAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchThreadsByState.fulfilled, maWebsocketCallback)
      .addCase(fetchThreadMessages.fulfilled, maWebsocketCallback)
      .addCase(fetchThreadByID.fulfilled, maWebsocketCallback)
      .addCase(sendInboxTemplate.fulfilled, maWebsocketCallback)
      .addCase(searchInbox.fulfilled, maWebsocketCallback)
      .addCase(sendMessage.fulfilled, maWebsocketCallback)
      .addCase(onWebSocketNewThread, maWebsocketCallback)
      .addCase(onWebSocketResolvedThread, maWebsocketCallback)
      .addCase(onWebSocketAssignedThread, maWebsocketCallback)
      .addCase(onWebSocketAccountDisconnected, (state, action) => {
        const { messageIDs } = action.payload;
        
        messageIDs?.length > 0 && messageMetasAdapter.removeMany(state, messageIDs);
      })
      .addCase(onWebSocketNewMessage, maWebsocketCallback);
  },
});

export const messageMetasReducer = messageMetasSlice.reducer;

export const {
  selectById: selectMessageMetaById,
  selectIds: selectMessageMetaIds,
  selectEntities: selectMessageMetaEntities,
  selectAll: selectAllMessageMetas,
  selectTotal: selectTotalMessageMetas,
} = messageMetasAdapter.getSelectors<RootState>((state) => state.inbox.entities.messageMetas);

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const attachmentDataAdapter = createEntityAdapter<AttachmentDataSchema>({
  selectId: (attachmentData) => attachmentData.attachment_id
});

const adWebsocketCallback = (state: any, action: any) => {
  const { attachmentData } = action.payload;
  attachmentData && attachmentDataAdapter.upsertMany(state, attachmentData);
};

export const attachmentDataSlice = createSlice({
  name: "inbox_attachmentData",
  initialState: attachmentDataAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchThreadsByState.fulfilled, adWebsocketCallback)
      .addCase(fetchThreadMessages.fulfilled, adWebsocketCallback)
      .addCase(sendMessage.fulfilled, adWebsocketCallback)
      .addCase(fetchThreadByID.fulfilled, adWebsocketCallback)
      .addCase(searchInbox.fulfilled, adWebsocketCallback)
      .addCase(onWebSocketNewThread, adWebsocketCallback)
      .addCase(onWebSocketResolvedThread, adWebsocketCallback)
      .addCase(onWebSocketAssignedThread, adWebsocketCallback)
      .addCase(onWebSocketNewMessage, adWebsocketCallback);
  },
});

export const attachmentDataReducer = attachmentDataSlice.reducer;

export const {
  selectById: selectAttachmentDataById,
  selectIds: selectAttachmentDataIds,
  selectEntities: selectAttachmentDataEntities,
  selectAll: selectAllAttachmentDatas,
  selectTotal: selectTotalAttachmentDatas,
} = attachmentDataAdapter.getSelectors<RootState>((state) => state.inbox.entities.attachmentData);

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const attachmentsAdapter = createEntityAdapter<AttachmentSchema>();

const aWebsocketCallback = (state: any, action: any) => {
  const { attachments } = action.payload;
  attachments && attachmentsAdapter.upsertMany(state, attachments);
};

export const attachmentsSlice = createSlice({
  name: "inbox_attachments",
  initialState: attachmentsAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchThreadsByState.fulfilled, aWebsocketCallback)
      .addCase(fetchThreadMessages.fulfilled, aWebsocketCallback)
      .addCase(fetchThreadByID.fulfilled, aWebsocketCallback)
      .addCase(sendMessage.fulfilled, aWebsocketCallback)
      .addCase(searchInbox.fulfilled, aWebsocketCallback)
      .addCase(onWebSocketNewThread, aWebsocketCallback)
      .addCase(onWebSocketResolvedThread, aWebsocketCallback)
      .addCase(onWebSocketAssignedThread, aWebsocketCallback)
      .addCase(onWebSocketNewMessage, aWebsocketCallback);
  },
});

export const attachmentsReducer = attachmentsSlice.reducer;

export const {
  selectById: selectAttachmentById,
  selectIds: selectAttachmentIds,
  selectEntities: selectAttachmentEntities,
  selectAll: selectAllAttachments,
  selectTotal: selectTotalAttachments,
} = attachmentsAdapter.getSelectors<RootState>((state) => state.inbox.entities.attachments);

export const selectMessageAttahments = createSelector(
  selectAllAttachments,
  selectAttachmentDataEntities,
  (_: RootState, payload: { message_id: string }) => payload.message_id,
  (attactments, data, message_id) => attactments.filter(
    ({ message_id: mid }) => mid === message_id
  ).map((item) => {
    const itemData = data[item.id];

    return { ...item, data: itemData };
  })
);

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const messagesAdapter = createEntityAdapter<MessageSchema>({
  selectId: message => message.uuid,
  sortComparer: (a, b) => b.created_datetime.localeCompare(a.created_datetime),
});

const messageWebsocketCallback = (state: any, action: any) => {
  const { messages } = action.payload;
  messages && messagesAdapter.upsertMany(state, messages);
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    messageSend(state, action: PayloadAction<{ message_id: string }>) {
      const { message_id } = action.payload;
      messagesAdapter.upsertOne(state, ({
        uuid: message_id,
        status: 'loading',
        created_datetime: (new Date()).toISOString(),
      } as any));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchThreadsByState.fulfilled, messageWebsocketCallback)
      .addCase(fetchThreadMessages.fulfilled, messageWebsocketCallback)
      .addCase(sendInboxTemplate.fulfilled, messageWebsocketCallback)
      .addCase(sendMessage.fulfilled, messageWebsocketCallback)
      .addCase(retrySendingMessage.fulfilled, messageWebsocketCallback)
      .addCase(searchInbox.fulfilled, messageWebsocketCallback)
      .addCase(fetchThreadByID.fulfilled, messageWebsocketCallback)
      .addCase(onWebSocketNewThread, messageWebsocketCallback)
      .addCase(onWebSocketResolvedThread, messageWebsocketCallback)
      .addCase(onWebSocketAssignedThread, messageWebsocketCallback)
      .addCase(onWebSocketAccountDisconnected, (state, action) => {
        const { messageIDs } = action.payload;
        
        messageIDs?.length > 0 && messagesAdapter.removeMany(state, messageIDs);
      })
      .addCase(onWebSocketNewMessage, messageWebsocketCallback);
  },
});

export const messagesReducer = messagesSlice.reducer;
export const { messageSend } = messagesSlice.actions;

export const {
  selectById: selectMessageById,
  selectIds: selectMessageIds,
  selectEntities: selectMessageEntities,
  selectAll: selectAllMessages,
  selectTotal: selectTotalMessages,
} = messagesAdapter.getSelectors<RootState>((state) => state.inbox.entities.messages);

export const selectThreadMessages = createSelector(
  selectAllMessages,
  (_: RootState, thread_id: string) => thread_id,
  (messages, tID) => {
    return messages.filter(({ thread_id }) => thread_id === tID);
  }
);

export const selectThreadMessageIDs = createSelector(
  selectThreadMessages,
  (messages) => messages.map(({ uuid }) => uuid)
);

export const selectLatestMessage = createSelector(
  selectThreadMessages,
  (threadMessages) => {
    const lastMessage = threadMessages[0];
    // const { content, attachments } = lastMessage;
    // console.log(content);
    // lastMessage.content = content ? content ? attachments && attachments ? '[Attachment]' : '';

    return lastMessage;
  }
);

export const makeSelectLatestMessage = () => selectLatestMessage;
