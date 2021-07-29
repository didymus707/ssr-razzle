import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { APIKey } from '../settings.types'

const developersInitialState = {
  apiKeys: [],
} as { apiKeys: APIKey[] }

export const developersSlice = createSlice({
  name: 'developers',
  initialState: developersInitialState,
  reducers: {
    getAPIKeys (state, action: PayloadAction<{ keys: APIKey[] }>) {
      const { keys } = action.payload
      state.apiKeys = keys
    },
    revokeAPIKeyItem (state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload
      state.apiKeys = state.apiKeys.filter(i => i.id !== id)
    },
  },
})
