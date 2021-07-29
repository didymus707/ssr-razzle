export type User = {
  id?: string;
  email?: string;
  company?: string;
  last_name?: string;
  first_name?: string;
  last_login?: string;
  account_type?: number;
  created_datetime: string;
  updated_datetime: string;
};

export type Organization = {
  id: string;
  name: string;
};

export type UserProfile = {
  id: string;
  user_id: string;
  last_name: string;
  first_name: string;
  organisation_id: string;
  created_datetime: string;
  updated_datetime: string;
};

export type AuthInitialState = {
  user: User | null;
  token: string | null;
  profile: UserProfile | null;
  forgotPasswordToken: string | null;
  organisations: Organization[] | null;
  loading: boolean;
};

export type OnboardingTasksInfo = {
  lists: boolean;
  campaigns: boolean;
  channels: boolean;
  teams: boolean;
};
