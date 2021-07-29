import { ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { campaignStateConnector } from './campaigns.container';

type PropsWithRedux = ConnectedProps<typeof campaignStateConnector>;
export type CampaignContainerProps = PropsWithRedux & RouteComponentProps;
export type CampaignComponentProps = CampaignContainerProps;

export type CampaignTypes = 'scheduled' | 'sent' | 'draft' | undefined;

export type CampaignVariant = {
  id?: string;
  content: string;
  template_id?: string | null;
  action: 'create' | 'update' | 'delete';
};

export type CampaignData = {
  id?: string;
  name?: string;
  count?: number;
  table?: string;
  group?: string;
  user_id?: string;
  budget?: number;
  link?: string | null;
  content?: string | null;
  contents?: CampaignVariant[] | null;
  table_id?: string | null;
  group_id?: string | null;
  sender_id?: string;
  import_id?: string | null;
  audience_id?: string | null;
  segment_id?: string | null;
  audience?: { count: number };
  template?: string;
  frequency?: number;
  timezone?: string;
  audience_type?: any;
  group_table?: string;
  send_time?: string[] | null;
  total_sent?: number;
  total_dnd?: number;
  schedule_end?: string | null;
  schedule_start?: string | null;
  reports?: {
    [key: string]: {
      total_dnd: number;
      total_sent: number;
      total_click: number;
      total_delivered: number;
    };
  };
  created_datetime?: string;
  updated_datetime?: string;
  total_delivered?: number;
  status?: string | boolean;
  template_id?: string | null;
  is_smart_send?: boolean;
  smart_list_id?: string | null;
  clicks?: { total_clicks: number; links: any[] };
  state?: 'pristine' | 'stopped' | 'started' | 'paused' | 'draft' | 'completed';
  template_content?: string | null;
};

export type CampaignState = {
  budget: number;
  importedData: any;
  total_count: number;
  campaign: CampaignData;
  allCampaigns: CampaignData[];
  campaignsList: CampaignData[];
  audience: CampaignData['audience'];
  states: string[];
  genders: string[];
  ethnicGroups: string[];
  religions: string[];
};

export type MarketingSettingsSchema = {
  id: string;
  marketing: {
    smart_send: number;
    quiet_hour: {
      from: string;
      to: string;
    };
  };
  created_datetime: string | null;
  updated_datetime: string | null;
};

export type MarketingReportSchema = {
  recipient: string;
  from?: string;
  to?: string;
  type: string;
};
