import { RouteComponentProps } from "react-router-dom";
import { ConnectedProps } from "react-redux";
import { stateConnector } from "./integrations.container";

export type IntegrationProps = RouteComponentProps<{ id: string }> & ConnectedProps<typeof stateConnector>

export type PhoneSchema = {
  friendly_name: string;
  iso_country: string;
  phone_number: string;
  region: string | null;
  locality?: string;
  capabilities: string[];
  type: string
}

export type UseCaseDataSchema = {
  company_name: string;
  industry: string;
  role: string;
  company_size: string;
}

export type FeatureSchema = {
  left: string;
  right?: string;
}

export type IntegrationState = {
  channel: string;
  supported_countries: { country: string; country_code: string }[];
  random_phone: PhoneSchema;
  selected_phone_types: string[];
  phones: PhoneSchema[];
  use_case_data: UseCaseDataSchema;
}

export type IntegrationCommonProps = RouteComponentProps<{ id: string }>;

export type ChannelIntegrationProps = IntegrationCommonProps & {
  profile: IntegrationProps['profile'];
  user: IntegrationProps['user'];
  fetchSupportedChannels: IntegrationProps['fetchSupportedChannels'];
  fetchFBPages: IntegrationProps['fetchFBPages'];
  selectAcctItem: IntegrationProps['selectAcctItem'];
  fetchTemp: IntegrationProps['fetchTemp'];
  forceConnect: IntegrationProps['forceConnect'];
}

export type SubscriptionProps = IntegrationCommonProps & {
  random_phone: IntegrationProps['randomPhone'];
  resetRandomPhone: IntegrationProps['resetRandomPhone'];
  use_case_data: IntegrationProps['useCaseData'];
  resetUseCaseData: IntegrationProps['resetUseCaseData'];
  buyPhone: IntegrationProps['buyPhone'];
  profile: IntegrationProps['profile'];
  user: IntegrationProps['user'];
}

export type PhoneIntegrationProps = IntegrationCommonProps & {
  channel: string;
  profile: IntegrationProps['profile'];
  user: IntegrationProps['user'];
}

export type PlatformIntegrationProps = IntegrationCommonProps & {
  channel: string;
}

export type ConnectedAccountDataProps = {
  subHeading: string;
  baseUrl?: string;
  disconnectBtnText?: string;
  organisation_id: string;
}

export type ConnectedAccountProps = IntegrationCommonProps & {
  disconnectAccount: (platform_nick: string, credential_id: string) => Promise<void>;
  isDisconnectLoading: boolean;
  isModalOpen: boolean;
  handleModelOpen: (v: boolean) => void;
  channel: string;
  data: ConnectedAccountDataProps;
}
