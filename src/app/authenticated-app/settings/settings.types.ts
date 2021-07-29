export type TeamMember = {
  id: string
  first_name: string
  last_name: string
}

export type Organization = {
  id: string
  name: string
}

export type TeamInvite = {
  id: string
  email: string
  status: string
  created_datetime: string
}

export type Team = {
  id?: string
  name: string
  color?: string
  organisation_id?: string
  created_datetime?: string
  updated_datetime?: string
  members?: TeamMember[]
  invites?: TeamInvite[]
}

export type Card = {
  id?: string
  last4: string
  exp_month: string
  exp_year: string
  brand: string
}

export type TeamsState = {
  team: Team
  teams: Team[]
  organisationMembers: TeamMember[]
  organizations: Organization[]
}

export type PaymentState = {
  cards: Card[]
  bank_accounts: []
  default_card: string | null
  default_bank_account: string | null
}

export type BillingState = {}

export type APIKey = {
  id: string
  revoked: number
  key_prefix: string
  key_postfix: string
  created_datetime: string
  'auth_keys.created_datetime': string
}
