import * as React from 'react'

export type LoadingStateProps = {
  loading: string
  tableLoading: string
  globalLoading: string
  actionsLoading: string
}

export type LoadingActions =
  | { type: 'LOADING_STARTED' }
  | { type: 'LOADING_RESOLVED' }
  | { type: 'GLOBAL_LOADING_STARTED' }
  | { type: 'GLOBAL_LOADING_RESOLVED' }
  | { type: 'TABLE_LOADING_STARTED' }
  | { type: 'TABLE_LOADING_RESOLVED' }
  | { type: 'ACTIONS_LOADING_STARTED' }
  | { type: 'ACTIONS_LOADING_RESOLVED' }

const initialState = {
  loading: 'resolved',
  tableLoading: 'resolved',
  globalLoading: 'resolved',
  actionsLoading: 'resolved'
}

/**
 * Default loading reducer
 */

const loadingReducer = (
  state: LoadingStateProps,
  action: LoadingActions
): LoadingStateProps => {
  switch (action.type) {
    case 'GLOBAL_LOADING_STARTED':
      return {
        ...state,
        globalLoading: 'pending'
      }
    case 'GLOBAL_LOADING_RESOLVED':
      return {
        ...state,
        globalLoading: 'resolved'
      }
    case 'TABLE_LOADING_STARTED':
      return {
        ...state,
        tableLoading: 'pending'
      }
    case 'TABLE_LOADING_RESOLVED':
      return {
        ...state,
        tableLoading: 'resolved'
      }
    case 'LOADING_STARTED':
      return {
        ...state,
        loading: 'pending'
      }
    case 'LOADING_RESOLVED':
      return {
        ...state,
        loading: 'resolved'
      }
    case 'ACTIONS_LOADING_STARTED':
      return {
        ...state,
        actionsLoading: 'pending'
      }
    case 'ACTIONS_LOADING_RESOLVED':
      return {
        ...state,
        actionsLoading: 'resolved'
      }

    default:
      return initialState
  }
}

/**
 * Hook for managing loading states using the reducer pattern
 * @param reducer user can pass a custom reducer for loading states
 */

export const useLoading = ({ reducer = loadingReducer } = {}) => {
  const [
    { loading, globalLoading, actionsLoading, tableLoading },
    dispatch
  ] = React.useReducer(reducer, initialState)

  return { dispatch, loading, tableLoading, actionsLoading, globalLoading }
}
