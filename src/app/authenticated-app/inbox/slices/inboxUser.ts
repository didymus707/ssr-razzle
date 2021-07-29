import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../root'
import { connectChannelAcct, fetchSupportedChannels } from '../../channels/channel.thunks';
import { selectOrgMemberByID } from '../../settings/slices';
import { INBOX_INIT } from '../inbox.data';
import { InboxUserSchema } from '../inbox.types';
import { selectCustomerById } from './customer';
import {
  fetchThreadByID, fetchThreadMessages, fetchThreadsByState, onWebSocketAssignedThread,
  onWebSocketNewMessage, onWebSocketNewThread, onWebSocketResolvedThread,
  onWebSocketWhatsAppAccountStatusChange,
  searchInbox,
  sendInboxTemplate, sendMessage
} from './global';

const inboxUsersAdapter = createEntityAdapter<InboxUserSchema>({
  selectId: inboxUser => inboxUser.uuid,
});

const websocketCallback = (state: any, action: any) => {
  const { inboxUsers } = action.payload;
  inboxUsers && inboxUsersAdapter.upsertMany(state, inboxUsers);
};

const updateFromCustomer = (state: any, action: any) => {
  const { customers } = action.payload;
  customers && inboxUsersAdapter.upsertMany(state, Object.keys(customers).reduce(
    (acc, key: string) => {
      acc[key] = { uuid: key, is_customer: true };

      return acc;
    }, ({} as { [k: string]: InboxUserSchema })
  ));
}

export const inboxUsersSlice = createSlice({
  name: "inboxUsers",
  initialState: inboxUsersAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
    .addCase(fetchThreadsByState.fulfilled, websocketCallback)
    .addCase(fetchThreadByID.fulfilled, websocketCallback)
    .addCase(searchInbox.fulfilled, websocketCallback)
    .addCase(fetchThreadMessages.fulfilled, websocketCallback)
    .addCase(sendInboxTemplate.fulfilled, websocketCallback)
    .addCase(sendMessage.fulfilled, websocketCallback)
    .addCase(onWebSocketNewThread, websocketCallback)
    .addCase(onWebSocketResolvedThread, websocketCallback)
    .addCase(onWebSocketAssignedThread, websocketCallback)
    .addCase(onWebSocketNewMessage, websocketCallback)
    .addCase(connectChannelAcct.fulfilled, updateFromCustomer)
    .addCase(fetchSupportedChannels.fulfilled, updateFromCustomer)
    .addCase(onWebSocketWhatsAppAccountStatusChange, updateFromCustomer);
  }
});

export const inboxUsersReducer = inboxUsersSlice.reducer;

export const {
  selectById: selectInboxUserById,
  selectIds: selectInboxUserIds,
  selectEntities: selectInboxUserEntities,
  selectAll: selectAllInboxUsers,
  selectTotal: selectTotalInboxUsers,
} = inboxUsersAdapter.getSelectors<RootState>((state) => state.inbox.entities.inboxUsers);

export const selectUserDetailByID = createSelector(
  selectInboxUserById,
  selectCustomerById,
  selectOrgMemberByID,
  (user, customer, orgMember) => ({
    ...(user || INBOX_INIT.inboxUser),
    userInfo: user?.is_customer ? customer : orgMember
  })
);
