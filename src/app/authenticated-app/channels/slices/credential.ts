import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../../root';
import { selectOrganisationID } from '../../../unauthenticated-app/authentication';
import {
  fetchThreadsByState, selectCustomerEntities, selectThreadById, fetchThreadByID,
  onWebSocketWhatsAppAccountStatusChange, searchInbox, onWebSocketAccountDisconnected,
  onWebSocketAccountStatusChanged
} from '../../inbox';
import {
  connectChannelAcct, disconnectCredential, fetchSupportedChannels, useChannelInstance
} from '../channel.thunks';
import { CredentialSchema } from '../channels.types';

const credentialsAdapter = createEntityAdapter<CredentialSchema>({
  selectId: credential => credential.uuid,
  sortComparer: (a, b) => (b.updated_datetime || '').localeCompare(a.updated_datetime || ''),
});

const upsertCallback = (state: any, action: any) => {
  const { credentials } = action.payload;
  credentials && credentialsAdapter.upsertMany(state, credentials);
};

export const credentialsSlice = createSlice({
  name: 'credentials',
  initialState: credentialsAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
    .addCase(fetchSupportedChannels.fulfilled, upsertCallback)
    .addCase(disconnectCredential.fulfilled, upsertCallback)
    .addCase(connectChannelAcct.fulfilled, upsertCallback)
    .addCase(fetchThreadsByState.fulfilled, upsertCallback)
    .addCase(searchInbox.fulfilled, upsertCallback)
    .addCase(fetchThreadByID.fulfilled, upsertCallback)
    .addCase(useChannelInstance.fulfilled, upsertCallback)
    .addCase(onWebSocketAccountDisconnected, upsertCallback)
    .addCase(onWebSocketAccountStatusChanged, upsertCallback)
    .addCase(onWebSocketWhatsAppAccountStatusChange, upsertCallback);
  }
});

export const credentialsReducer = credentialsSlice.reducer;

export const {
  selectById: selectCredentialById,
  selectIds: selectCredentialIds,
  selectEntities: selectCredentialEntities,
  selectAll: selectAllCredentials,
  selectTotal: selectTotalCredentials,
} = credentialsAdapter.getSelectors<RootState>((state) => state.channel.entities.credentials);

export const selectActiveOrgCredentials = createSelector(
  selectOrganisationID,
  selectAllCredentials,
  (orgID, credentials) => credentials.filter(
    ({ organisation_id, status }) => (organisation_id === orgID && status !== 'disconnected')
  )
);

export const selectActiveOrgChannelCredentials = createSelector(
  (_: RootState, channel: string) => channel,
  selectActiveOrgCredentials,
  selectCustomerEntities,
  (channel, orgCredentials, customerObj) => orgCredentials.filter(
    ({ user_id }) => {
      let credentialChannel = customerObj[user_id]?.channel;
      if (credentialChannel === 'whatsappWeb') {
        credentialChannel = 'whatsapp';
      }

      return credentialChannel === channel;
    }
  )
);

export const selectActiveOrgChannelCredentialIDs = createSelector(
  selectActiveOrgChannelCredentials,
  (credentials) => credentials.map(
    ({ uuid: credential_id, user_id }) => ({ credential_id, user_id })
  )
);

export const selectIsCredentialConnected = createSelector(
  selectActiveOrgChannelCredentials,
  (orgChannelCredentials) => orgChannelCredentials.length > 0
);

export const selectThreadReceiverPlatformID = createSelector(
  selectThreadById,
  selectCredentialEntities,
  (thread, credentials) => credentials[thread?.receiver_id || '']?.user_id
);

export const selectOrgCredentials = createSelector(
  selectOrganisationID,
  selectAllCredentials,
  (orgID, credentials) => credentials.filter(
    ({ organisation_id }) => orgID === organisation_id
  )
);

export const selectCredentialsWithIssue = createSelector(
  selectOrgCredentials,
  orgCredentials => orgCredentials.filter(
    ({ status }) => !['active', 'disconnected'].includes(status)
  )
);
