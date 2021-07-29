import {
    createEntityAdapter, createSelector, createSlice
  } from '@reduxjs/toolkit'
import { RootState } from '../../../../root'
import { connectChannelAcct, fetchSupportedChannels, setChannelName } from '../../channels/channel.thunks';
import { INBOX_INIT } from '../inbox.data';
import { CustomerSchema } from '../inbox.types';
import {
  fetchThreadMessages, fetchThreadsByState, onWebSocketAssignedThread,
  onWebSocketNewMessage, onWebSocketNewThread, onWebSocketResolvedThread,
  onWebSocketWhatsAppAccountStatusChange, fetchThreadByID, sendMessage, searchInbox
} from './global';

const customersAdapter = createEntityAdapter<CustomerSchema>({
  selectId: customer => customer.uuid,
});

const websocketCallback = (state: any, action: any) => {
  const { customers } = action.payload;
  customers && customersAdapter.upsertMany(state, customers);
};

const upsertCallback = (state: any, action: any) => {
  const { customers } = action.payload;
  customers && customersAdapter.upsertMany(state, customers);
};

export const customersSlice = createSlice({
  name: "customers",
  initialState: customersAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchThreadsByState.fulfilled, websocketCallback)
      .addCase(fetchThreadMessages.fulfilled, websocketCallback)
      .addCase(searchInbox.fulfilled, websocketCallback)
      .addCase(sendMessage.fulfilled, websocketCallback)
      .addCase(onWebSocketNewThread, websocketCallback)
      .addCase(onWebSocketResolvedThread, websocketCallback)
      .addCase(onWebSocketAssignedThread, websocketCallback)
      .addCase(onWebSocketNewMessage, websocketCallback)
      .addCase(fetchSupportedChannels.fulfilled, upsertCallback)
      .addCase(connectChannelAcct.fulfilled, upsertCallback)
      .addCase(setChannelName.fulfilled, upsertCallback)
      .addCase(fetchThreadByID.fulfilled, upsertCallback)
      .addCase(onWebSocketWhatsAppAccountStatusChange, websocketCallback);
  },
});

export const customersReducer = customersSlice.reducer;

export const {
  selectById: selectCustomerById,
  selectIds: selectCustomerIds,
  selectEntities: selectCustomerEntities,
  selectAll: selectAllCustomers,
  selectTotal: selectTotalCustomers,
} = customersAdapter.getSelectors<RootState>((state) => state.inbox.entities.customers);

export const selectCustomerByID = createSelector(
  selectCustomerEntities,
  (_: RootState, sender_id: string) => sender_id,
  (customers, sender_id) => !sender_id ? null : customers[sender_id]
);

export const makeSelectCustomerByID = () => selectCustomerByID;

export const selectCustomer = createSelector(
  (_: RootState, payload: { id: string }) => payload.id,
  selectCustomerEntities,
  (cusID, customers) => customers[cusID] || INBOX_INIT.customer
)

export const selectCustomerName = createSelector(
  selectCustomer,
  c => c.platform_name || c.platform_nick,
);
