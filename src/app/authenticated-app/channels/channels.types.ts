import { IModal } from '@chakra-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import { CustomerSchema } from '../inbox';

export interface ChannelItemSchema {
  name: string;
  which: string;
  description: string;
  pathname?: string;
}

export interface AppSchema {
  key: string;
  name: string;
  icon?: string;
  category: string;
  caption?: string;
  description: string;
  isMultipleClick?: boolean;
  previewImages?: string[];
  permissions?: string[];
  status: 'undone' | 'ready' | 'request';
}

export type ChannelConnectivitySchema = {
  id: number;
  uuid: string;
  credential_id: string;
  connector_id: string;
  disconnector_id?: string;
  disconnected_datetime?: string;
  connected_datetime: string;
  created_datetime?: string;
  updated_datetime?: string;
};

export type ChannelSchema = {
  id: string;
  status: string;
  organisation_id: string;
  uuid: string;
  created_datetime?: string;
  updated_datetime?: string;
  user_id: string;
  connectivities: ChannelConnectivitySchema[];
  user_detail: CustomerSchema;
};

export type SupportedChannelSchemas = {
  [key: string]: ChannelSchema[];
};

export type SupportCountrySchema = {
  country: string;
  country_code: string;
};

export type ChannelState = {
  supportedChannels: SupportedChannelSchemas;
  supportedCountries: SupportCountrySchema[];
};

export interface ChannelDataSchema {
  title: string;
  data: ChannelItemSchema[];
}

export type ChannelProps = {
  metaData?: ChannelDataSchema[];
} & RouteComponentProps;

export type ChannelItemProps = ChannelItemSchema;

export type ErrorModalProps = Omit<IModal, 'children'> & {
  title: string;
  isOpen: boolean;
  description: string;
  setIsOpen: (k: boolean) => void;
};

export type CredentialSchema = {
  id?: number;
  uuid: string;
  status: string;
  user_id: string;
  organisation_id: string;
  created_datetime?: string;
  updated_datetime: string;
};

export type ConnectivitySchema = {
  id?: number;
  uuid: string;
  connector_id: string;
  credential_id: string;
  disconnector_id: string;
  updated_datetime: string;
  created_datetime?: string;
  connected_datetime: string;
  disconnected_datetime: string;
};
