import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../../root';
import { PaymentsOnboardingComponent as Component } from './component';
import { updatePaymentSetup, fetchWallet } from '../../thunks';

const mapStateToProps = (state: RootState) => ({
  payment_setup: state.payments.payment_setup,
  wallet: state.payments.wallet,
});

const stateConnector = connect(mapStateToProps, {
  updatePaymentSetup,
  fetchWallet,
});

const Container = (props: any) => {
  return <Component {...props} />;
};

export const PaymentsOnboarding = stateConnector(Container);
