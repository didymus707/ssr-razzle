import { buildConversationUrl, clearState, client, loadState, saveState } from '../../../../utils'
import {
  ForgotPasswordInitialValuesProps,
  LoginFormInitialValuesProps,
  RegisterFormInitialValuesProps,
} from '../components'
import { User, UserProfile } from './types'
import {setAmplitudeUserProperties} from "../../../../utils/amplitude";

export const getToken = () => {
  if (loadState()) {
    const { token } = loadState()
    return token
  }
  return null
}

export const getUser = () => {
  if (loadState()) {
    const { user } = loadState()
    return user
  }
  return null
}

export const login = async (values: LoginFormInitialValuesProps) => {
  const response = await client('auth/login', { data: values, method: 'POST' })
  const { token, auth: user, organisations } = response.data
  setAmplitudeUserProperties(user)
  saveState({ token, user, organisations })
  return { token, user, organisations }
}

export const register = async (values: RegisterFormInitialValuesProps) => {
  const response = await client('auth/create', { data: values, method: 'POST' })
  const { token, auth: user, organisations } = response.data
  setAmplitudeUserProperties(user)
  saveState({ token, user, organisations })
  return { token, user, organisations }
}

export const verifyEmail = async (values: { token: string }) => {
  const response = await client('auth/verify', { data: values, method: 'POST' })
  return response.data
}

export const getProfile = async (organizationID: string) => {
  const response = await client(`auth/view/${organizationID}`)
  const { user, profile } = response.data
  const previouslocalStorageState = loadState()
  saveState({ ...previouslocalStorageState, user, profile })
  return { ...previouslocalStorageState, user, profile }
}

export const updateProfile = async (
  values: Partial<Pick<UserProfile, 'first_name' | 'last_name' | 'organisation_id'>> & {
    user_id: User['id']
  }
) => {
  const response = await client(`profile/save`, {
    method: 'PATCH',
    data: values,
  })
  const { profile } = response.data
  const previouslocalStorageState = loadState()
  saveState({ ...previouslocalStorageState, profile })
  return { ...previouslocalStorageState, profile }
}

export const forgotPassword = async (
  values: ForgotPasswordInitialValuesProps & { link: string }
) => {
  const response = await client('auth/send_password_reset', {
    data: values,
    method: 'POST',
  })
  return response.data
}

export const resetPassword = async (values: { password: string; token: string }) => {
  const response = await client('auth/reset_password', {
    data: values,
    method: 'POST',
  })
  return response.data
}

export const changePassword = async (values: { old_password: string; new_password: string }) => {
  const response = await client(`auth/change-password`, {
    data: values,
    method: 'PATCH',
    validateStatus: status => status >= 200 && status <= 401,
  })
  if (response.status === 401) throw new Error('Your old password is incorrect')
  return response.data
}

export const logout = async (userId?: string) => {
  const SWID = loadState().SWID
  if (userId && SWID) {
    try {
      await client('', {
        url: buildConversationUrl(`push-notifications/${userId}`),
        method: 'DELETE',
        data: { SWID },
      })
    } catch (error) {
      return error;
    }
  }
  clearState()
  return Promise.resolve({})
}
