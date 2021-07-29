import React from 'react';
import { Avatar, Box } from '@chakra-ui/core';
import { OrganizationPickerProps } from '../types';
import { loadState } from '../../../../utils';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../../root';
import { authLoading, fetchProfile } from '../../../unauthenticated-app/authentication/service';
import { fetchSupportedChannels } from '../../../authenticated-app/channels';
import { onOrganisationSwitch } from '../../../authenticated-app/inbox';
import { Organization } from '../../../authenticated-app/settings/settings.types';

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & OrganizationPickerProps;

const connector = connect(
  (state: RootState) => ({
    profile: state.auth.profile,
    isLoading: state.auth.loading,
  }),
  {
    authLoading,
    fetchProfile,
    fetchSupportedChannels,
    onOrganisationSwitch,
  },
);

export const OrganizationPicker = connector((props: Props) => {
  const { organizations, profile, authLoading, fetchProfile } = props;

  const reloadOrganization = async (id: string) => {
    if (!!loadState() && id !== profile?.organisation_id) {
      authLoading(true);
      try {
        await fetchProfile(id);
      } catch (e) {}
      window.location.reload();
    }
  };

  return (
    <div className="section-organizations">
      <Box marginBottom="10px" fontSize="14px" color="#757575">
        Organizations
      </Box>

      {organizations.map((i: Organization) => (
        <Box
          className="organization-item"
          key={i.id}
          fontSize="14px"
          fontWeight={i.id === profile?.organisation_id ? 500 : 400}
          color={i.id === profile?.organisation_id ? '#333333' : '#757575'}
          cursor={i.id === profile?.organisation_id ? 'default' : 'pointer'}
          onClick={() => {
            if (i.id === profile?.organisation_id) return;
            reloadOrganization(i.id);
          }}
        >
          <Avatar size="xs" name={i.name} mr="10px" />
          {i.name}
        </Box>
      ))}
    </div>
  );
});
