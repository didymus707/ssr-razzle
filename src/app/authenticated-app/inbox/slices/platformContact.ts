import {
  createEntityAdapter, createSelector, createSlice
} from '@reduxjs/toolkit'
import { RootState } from '../../../../root'
import { selectOrganisationID } from '../../../unauthenticated-app/authentication';
import { connectChannelAcct, fetchSupportedChannels, setChannelName } from '../../channels/channel.thunks';
import { INBOX_INIT } from '../inbox.data';
import { PlatformContactSchema } from '../inbox.types';
import { selectCustomerEntities } from './customer';
import {
fetchThreadMessages, fetchThreadsByState, onWebSocketAssignedThread,
onWebSocketNewMessage, onWebSocketNewThread, onWebSocketResolvedThread,
onWebSocketWhatsAppAccountStatusChange, fetchThreadByID, sendMessage, searchInbox
} from './global';

const platformContactsAdapter = createEntityAdapter<PlatformContactSchema>({
selectId: platformContact => platformContact.uuid,
});

const platformContactsUpsertCallback = (state: any, action: any) => {
const { platformContacts } = action.payload;
platformContacts && platformContactsAdapter.upsertMany(state, platformContacts);
};

export const platformContactsSlice = createSlice({
name: "platformContacts",
initialState: platformContactsAdapter.getInitialState(),
reducers: {},
extraReducers(builder) {
  builder
    .addCase(fetchThreadsByState.fulfilled, platformContactsUpsertCallback)
    .addCase(fetchThreadMessages.fulfilled, platformContactsUpsertCallback)
    .addCase(searchInbox.fulfilled, platformContactsUpsertCallback)
    .addCase(sendMessage.fulfilled, platformContactsUpsertCallback)
    .addCase(onWebSocketNewThread, platformContactsUpsertCallback)
    .addCase(onWebSocketResolvedThread, platformContactsUpsertCallback)
    .addCase(onWebSocketAssignedThread, platformContactsUpsertCallback)
    .addCase(onWebSocketNewMessage, platformContactsUpsertCallback)
    .addCase(fetchSupportedChannels.fulfilled, platformContactsUpsertCallback)
    .addCase(connectChannelAcct.fulfilled, platformContactsUpsertCallback)
    .addCase(setChannelName.fulfilled, platformContactsUpsertCallback)
    .addCase(fetchThreadByID.fulfilled, platformContactsUpsertCallback)
    .addCase(onWebSocketWhatsAppAccountStatusChange, platformContactsUpsertCallback);
},
});

export const platformContactsReducer = platformContactsSlice.reducer;

export const {
selectById: selectPlatformContactById,
selectIds: selectPlatformContactIds,
selectEntities: selectPlatformContactEntities,
selectAll: selectAllPlatformContacts,
selectTotal: selectTotalPlatformContacts,
} = platformContactsAdapter.getSelectors<RootState>((state) => state.inbox.entities.platformContacts);

export const selectPlatformContact = createSelector(
  (_: RootState, payload: { id: string }) => payload.id,
  (_: RootState, payload: { credentialUserID?: string }) => payload.credentialUserID,
  selectOrganisationID,
  selectAllPlatformContacts,
  selectCustomerEntities,
  (cusID, credentialUserID, orgID, platformContacts, customersObj) => {
    const platformContact = platformContacts.find(
      ({ organisation_id, customer_id, receiver_platform_id }) => (
        orgID === organisation_id && customer_id === cusID && (
          !receiver_platform_id || !credentialUserID || customersObj[credentialUserID]?.platform_nick === receiver_platform_id
        )
      )
    ) || INBOX_INIT.platformContact;

    return platformContact;
  }
)

export const selectPlatformContactName = createSelector(
  selectPlatformContact,
  p => p.name
);
