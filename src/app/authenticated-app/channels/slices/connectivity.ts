import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../../root';
import { onWebSocketAccountDisconnected, onWebSocketWhatsAppAccountStatusChange } from '../../inbox';
import { connectChannelAcct, disconnectCredential, fetchSupportedChannels } from '../channel.thunks';
import { ConnectivitySchema } from '../channels.types';

const connectivitysAdapter = createEntityAdapter<ConnectivitySchema>({
  selectId: connectivity => connectivity.uuid,
  sortComparer: (a, b) => (b.updated_datetime || '').localeCompare(a.updated_datetime || ''),
});

const upsertCallback = (state: any, action: any) => {
  const { connectivities } = action.payload;
  connectivities && connectivitysAdapter.upsertMany(state, connectivities);
};

export const connectivitiesSlice = createSlice({
  name: 'connectivities',
  initialState: connectivitysAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
    .addCase(fetchSupportedChannels.fulfilled, upsertCallback)
    .addCase(disconnectCredential.fulfilled, upsertCallback)
    .addCase(connectChannelAcct.fulfilled, upsertCallback)
    .addCase(onWebSocketAccountDisconnected, upsertCallback)
    .addCase(onWebSocketWhatsAppAccountStatusChange, upsertCallback);
  }
});

export const connectivitysReducer = connectivitiesSlice.reducer;

export const {
  selectById: selectconnectivityById,
  selectIds: selectconnectivityIds,
  selectEntities: selectconnectivityEntities,
  selectAll: selectAllconnectivitys,
  selectTotal: selectTotalconnectivitys,
} = connectivitysAdapter.getSelectors<RootState>((state) => state.channel.entities.connectivities);
