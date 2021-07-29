import { CampaignData } from './campaigns.types'

export function sortCampaignsFunc (a: CampaignData, b: CampaignData) {
  var dateA = a.created_datetime && new Date(a.created_datetime).getTime()
  var dateB = b.created_datetime && new Date(b.created_datetime).getTime()
  if (dateA && dateB) {
    return dateB - dateA
  }
  return null
}
