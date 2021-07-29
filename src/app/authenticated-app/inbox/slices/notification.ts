import { createEntityAdapter, createSelector, createSlice  } from '@reduxjs/toolkit'
import { RootState } from '../../../../root'
import { MessageSchema, NotificationSchema } from '../inbox.types';
import {
  assignThread, fetchThreadByID, fetchThreadMessages, fetchThreadsByState,
  onMessageRead, onWebSocketAccountDisconnected, onWebSocketAssignedThread,
  onWebSocketNewMessage, onWebSocketNewThread, onWebSocketResolvedThread,
  searchInbox, sendInboxTemplate, sendMessage
} from './global';
import { selectAllMessages } from './message';

const notificationsAdapter = createEntityAdapter<NotificationSchema>({
  selectId: (notification) => notification.uuid
});

const websocketCallback = (state: any, action: any) => {
  const { notifications } = action.payload;
  notifications && notificationsAdapter.upsertMany(state, notifications);
};

export const notificationsSlice = createSlice({
  name: "inbox_notifications",
  initialState: notificationsAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchThreadsByState.fulfilled, websocketCallback)
      .addCase(fetchThreadMessages.fulfilled, websocketCallback)
      .addCase(fetchThreadByID.fulfilled, websocketCallback)
      .addCase(sendInboxTemplate.fulfilled, websocketCallback)
      .addCase(assignThread.fulfilled, websocketCallback)
      .addCase(sendMessage.fulfilled, websocketCallback)
      .addCase(searchInbox.fulfilled, websocketCallback)
      .addCase(onWebSocketNewThread, websocketCallback)
      .addCase(onWebSocketResolvedThread, websocketCallback)
      .addCase(onWebSocketAssignedThread, websocketCallback)
      .addCase(onWebSocketNewMessage, websocketCallback)
      .addCase(onWebSocketAccountDisconnected, (state, action) => {
        const { notificationIDs } = action.payload;
        
        notificationIDs?.length > 0 && notificationsAdapter.removeMany(state, notificationIDs);
      })
      .addCase(onMessageRead, (state, action) => {
        const { notificationID: id, status } = action.payload;
        if (id && ['sent', 'delivered'].includes(status)) {
          notificationsAdapter.updateOne(state, { id, changes: { status: 'read' } })
        }
      });
  },
});

export const notificationsReducer = notificationsSlice.reducer;

export const {
  selectById: selectNotificationById,
  selectIds: selectNotificationIds,
  selectEntities: selectNotificationEntities,
  selectAll: selectAllNotifications,
  selectTotal: selectTotalNotifications,
} = notificationsAdapter.getSelectors<RootState>((state) => state.inbox.entities.notifications);

export const selectMessageNotificationStatus = createSelector(
  selectAllNotifications,
  (_: RootState, payload: Pick<NotificationSchema, 'message_id' | 'user_id'>) => payload,
  (notifications, payload) => payload.message_id.includes('unknown') ? null : notifications.find(
    ({ user_id, message_id }) => payload.message_id === message_id && user_id === payload.user_id
  )?.status
);

export const selectThreadUnreadCount = createSelector(
  selectAllNotifications,
  selectAllMessages,
  (_: RootState, payload: Pick<MessageSchema, 'thread_id' | 'author_id'>) => payload,
  (notifications, messages, payload) => {
    const messageIDs = messages.filter(
      ({ thread_id }) => thread_id === payload.thread_id
    ).map(({ uuid }) => uuid);

    return notifications.filter(
      ({ user_id, message_id, status }) => (
        messageIDs.includes(message_id) && user_id === payload.author_id && ['sent', 'delivered'].includes(status)
      )
    ).length;
  }
)

export const selectMessageNotificationID = createSelector(
  selectAllNotifications,
  (_: RootState, payload: Pick<NotificationSchema, 'message_id' | 'user_id'>) => payload,
  (notifications, payload) => notifications.find(
    ({ user_id, message_id }) => payload.message_id === message_id && user_id === payload.user_id
  )?.uuid
);

export const makeSelectMessageNotificationStatus = () => selectMessageNotificationStatus;
