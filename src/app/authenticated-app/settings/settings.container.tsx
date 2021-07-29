import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { RootState } from '../../../root';
import Settings from './settings.component';
import { editProfile, editPassword } from '../../unauthenticated-app/authentication';
import {
  addTeam,
  editTeam,
  removeTeam,
  fetchTeamMembers,
  onInviteTeamMembers,
  createTeamMember,
  deleteMemberInvite,
  initializeCard,
  fetchCards,
  changeDefaultCard,
  deleteCard,
  getBanks,
  resolveBankAccount,
  fetchBankAccounts,
  deleteTeamMember,
  fetchSubscription,
  fetchSubscriptionPlans,
} from './settings.reducers';
import { openNoSubscriptionModal } from '../globals';

import { addBankAccount, deleteBankAccount } from '../payments';

function mapStateToProps(state: RootState) {
  return {
    user: state.auth.user,
    profile: state.auth.profile,
    billing: state.billing,
    ...state.teams,
    ...state.payment,
    wallet_id: state.payments.wallet.data.id,
    wallet_email: state.payments.wallet.data.email,
    default_card: state.payments.wallet.data.card_default,
  };
}

const settingsStateConnector = connect(mapStateToProps, {
  addTeam,
  editTeam,
  removeTeam,
  editProfile,
  editPassword,
  createTeamMember,
  fetchTeamMembers,
  onInviteTeamMembers,
  deleteMemberInvite,
  fetchCards,
  changeDefaultCard,
  deleteCard,
  initializeCard,
  getBanks,
  resolveBankAccount,
  addBankAccount,
  fetchBankAccounts,
  deleteBankAccount,
  deleteTeamMember,
  fetchSubscription,
  fetchSubscriptionPlans,
  openNoSubscriptionModal,
});

type PropsWithRedux = ConnectedProps<typeof settingsStateConnector>;
export type SettingsProps = PropsWithRedux & RouteComponentProps;

const SettingsContainerUI = (props: SettingsProps) => <Settings {...props} />;

export const SettingsContainer = settingsStateConnector(SettingsContainerUI);
