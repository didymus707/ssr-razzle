import { developersSlice } from '../slices'

export const { getAPIKeys, revokeAPIKeyItem } = developersSlice.actions

export const developersReducer = developersSlice.reducer
