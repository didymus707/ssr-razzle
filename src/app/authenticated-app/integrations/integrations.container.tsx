import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../root';
import { IntegrationsComponent } from "./integrations.component";
import {
  setChannel, fetchSupportedCountries, fetchRandomPhone, setRandomPhone,
  resetRandomPhone, searchPhones, resetPhones, setUseCaseData, resetUseCaseData,
  buyPhone, fetchFBPages, selectAcctItem, fetchTemp, forceConnect
} from "./integrations.reducer";
import { fetchSupportedChannels } from '../channels';
import { IntegrationProps } from './integrations.type';

const mapState = (state: RootState) => ({
  user: state.auth.user,
  profile: state.auth.profile,
  organisations: state.auth.organisations,
  channel: state.integration.channel,
  supportedCountries: state.integration.supported_countries,
  randomPhone: state.integration.random_phone,
  selectedPhoneTypes: state.integration.selected_phone_types,
  phones: state.integration.phones,
  useCaseData: state.integration.use_case_data,
});

export const stateConnector = connect(mapState, {
  setChannel,
  fetchSupportedCountries,
  fetchRandomPhone,
  setRandomPhone,
  resetRandomPhone,
  searchPhones,
  resetPhones,
  setUseCaseData,
  resetUseCaseData,
  buyPhone,
  fetchSupportedChannels,
  fetchFBPages,
  selectAcctItem,
  fetchTemp,
  forceConnect
});

export function IntegrationsContainer(props: IntegrationProps) {
  return <IntegrationsComponent {...props} />
}

export const Integrations = stateConnector(IntegrationsContainer);
