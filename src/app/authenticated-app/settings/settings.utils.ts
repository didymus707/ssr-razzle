import { Team } from './settings.types'

export function sortTeamsFunc (a: Team, b: Team) {
  const dateA = a.created_datetime && new Date(a.created_datetime).getTime()
  const dateB = b.created_datetime && new Date(b.created_datetime).getTime()
  if (dateA && dateB) {
    return dateB - dateA
  }
  return null
}
