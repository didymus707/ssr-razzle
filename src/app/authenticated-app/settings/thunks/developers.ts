import { AppThunk } from '../../../../root'
import { getAPIKeys, revokeAPIKeyItem } from '../reducers/developers'
import { createAPIKey, listAPIKeys, removeAPIKey } from '../service/developers'
import { APIKey } from '../settings.types'

export const fetchAPIKeys = (): AppThunk => async dispatch => {
  try {
    const response = await listAPIKeys()
    const { keys } = response.data
    dispatch(getAPIKeys({ keys }))
    return response.data
  } catch (e) {
    return null
  }
}

export const generateAPIKey = (): AppThunk => async dispatch => {
  try {
    const response = await createAPIKey()
    dispatch(fetchAPIKeys())
    return response.data
  } catch (e) {
    return null
  }
}

export const revokeAPIKey = (apiKey: APIKey): AppThunk => async dispatch => {
  try {
    const response = await removeAPIKey(apiKey.id)
    const { auth_key } = response.data
    dispatch(revokeAPIKeyItem({ id: auth_key.id }))
    dispatch(fetchAPIKeys())
    return response.data
  } catch (e) {
    return null
  }
}
