import { ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { campaignAnalyticsConnector } from "./analytics.container";

type PropsWithRedux = ConnectedProps<typeof campaignAnalyticsConnector>;
export type CampaignAnalyticsProps = PropsWithRedux &
  RouteComponentProps;
export type CampaignAnalyticsUIProps = CampaignAnalyticsProps;

export type LocationData = {
  country?: string;
  totalClicks?: string
}

export type StatsOtherInfoData = {
  smsSent?: number;
  smsUnsent?: number;
  linkOpenRates?: number;
  conversion?: number;
  totalVisitors?: number;
  locations: LocationData[];
};

export type StatsData = {
  id: string;
  created_datetime: string;
    smsSent?: number;
    smsUnsent?: number;
    linkOpenRates?: number;
    conversion?: number;
    totalVisitors?: number;
    locations?: LocationData[];
};

export type StatsState = {
  statsData: StatsData[];
};
