import { Action, ThunkAction } from '@reduxjs/toolkit'
import { rootReducer, preloadedState } from './root.reducer'
import { configureAppStore } from './root.store'

const store = configureAppStore(preloadedState)

export type RootState = ReturnType<typeof rootReducer>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
