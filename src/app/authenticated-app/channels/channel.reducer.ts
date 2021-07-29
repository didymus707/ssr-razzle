import { combineReducers, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getSupportedCountries } from './channel.thunks'
import { ChannelState } from './channels.types'
import { connectivitysReducer, credentialsReducer, uiReducer } from './slices'

////////////////////////////////////////////////////////////////////////////////////
// Channel Reducer and Actions
const channelInitialState: ChannelState = {
  supportedChannels: {},
  supportedCountries: [],
}

const channelSlice = createSlice({
  name: 'channel',
  initialState: channelInitialState,
  reducers: {
    getAllSupportedChannels (
      state,
      action: PayloadAction<{ supportedChannels: ChannelState['supportedChannels'] }>
    ) {
      const { supportedChannels } = action.payload
      state.supportedChannels = supportedChannels
    }
  },
  extraReducers(builder) {
    builder
    .addCase(getSupportedCountries.fulfilled, (state, action: any) => {
      const { supportedCountries } = action.payload;
      state.supportedCountries = supportedCountries;
    });
  },
})

export const { getAllSupportedChannels } = channelSlice.actions
export const reducer = channelSlice.reducer

export const channelReducer = combineReducers({
  ui: uiReducer,
  entities: combineReducers({
    credentials: credentialsReducer,
    connectivities: connectivitysReducer,
  }),
});
