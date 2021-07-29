import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../../root';
import { PaymentsComponent as Component } from './component';
import {
  fetchPaymentRequests,
  cancelPaymentRequest,
  markPaymentRequestPaid,
  requestCreateManagedAccount,
  validateCreateManagedAccount,
} from '../../thunks';

const mapStateToProps = (state: RootState) => ({
  ...state.payments,
});

const stateConnector = connect(mapStateToProps, {
  fetchPaymentRequests,
  cancelPaymentRequest,
  markPaymentRequestPaid,
  requestCreateManagedAccount,
  validateCreateManagedAccount,
});

const Container = (props: any) => {
  return <Component {...props} />;
};

export const Payments = stateConnector(Container);
