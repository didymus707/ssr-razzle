import { client } from '../../../../utils'

export const listAPIKeys = () => {
  return client(`organisations/api-keys`)
}

export const createAPIKey = () => {
  return client('organisations/generate-api-key', { method: 'POST' })
}

export const removeAPIKey = (id: string) => {
  return client('organisations/revoke-api-key', { method: 'DELETE', data: { id } })
}
