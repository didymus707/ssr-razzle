import { buildPaymentURL, client } from '../../../../utils'
import {
  setSubscription,
  setSubscriptionLoading,
  setSubscriptionPlansLoading,
  setSubscriptionPlans,
} from '../settings.reducers'
import { AppThunk } from '../../../../root'

export const fetchSubscription = (organization_id: string): AppThunk => async dispatch => {
  dispatch(setSubscriptionLoading(true))
  try {
    const response = await client('', {
      url: buildPaymentURL(`/subscription/${organization_id}`),
      method: 'GET',
    })
    dispatch(setSubscription(response.data))
    dispatch(setSubscriptionLoading(false))
    return response.data
  } catch (e) {
    dispatch(setSubscriptionLoading(false))
    return null
  }
}

export const fetchSubscriptionPlans = (): AppThunk => async dispatch => {
  dispatch(setSubscriptionPlansLoading(true))
  try {
    const response = await client('', {
      url: buildPaymentURL(`/subscription_plan/`),
      method: 'GET',
    })
    const data: { [key: string]: any } = {}
    const by_id: string[] = []

    response.data.forEach((i: any) => {
      data[i.id] = i
      by_id.push(i.id)
    })

    dispatch(setSubscriptionPlans({ data, by_id }))
    dispatch(setSubscriptionPlansLoading(false))
    return response.data
  } catch (e) {
    dispatch(setSubscriptionPlansLoading(false))
    return null
  }
}

export const createSubscription = (payload: {
  subscription_plan: string
  card: string
  auto_renew: boolean
  billing_period: 'monthly' | 'yearly'
}): AppThunk => async dispatch => {
  try {
    const response = await client('', {
      url: buildPaymentURL(`/subscription/`),
      method: 'POST',
      data: payload,
    })
    dispatch(setSubscription(response.data))
    return response.data
  } catch (e) {
    return null
  }
}
