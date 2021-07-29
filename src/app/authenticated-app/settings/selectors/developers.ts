import { createSelector } from '@reduxjs/toolkit'
import { orderBy } from 'lodash'
import { RootState } from '../../../../root'

export const selectApiKeys = createSelector(
  (state: RootState) => state.developers,
  developers => orderBy(developers.apiKeys, 'created_datetime', 'desc'),
)
