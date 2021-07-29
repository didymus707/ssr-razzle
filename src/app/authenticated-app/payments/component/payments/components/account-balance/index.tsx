import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../../../../root';
import { AccountBalanceComponent as Component } from './component';
import { fetchManagedAccount } from '../../../../thunks';
import { fetchBanks } from '../../../../thunks';

const mapStateToProps = (state: RootState) => ({
  ...state.payments,
});

const stateConnector = connect(mapStateToProps, {
  fetchManagedAccount,
  fetchBanks,
});

const Container = (props: any) => {
  return <Component {...props} />;
};

export const AccountBalance = stateConnector(Container);
