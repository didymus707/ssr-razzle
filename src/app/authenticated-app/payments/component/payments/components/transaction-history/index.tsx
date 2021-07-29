import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../../../../root';
import { TransactionHistoryComponent as Component } from './component';
import { fetchManagedAccountTransactions } from '../../../../thunks';



const mapStateToProps = (state: RootState) => ({
  ...state.payments,
});

const stateConnector = connect(mapStateToProps, {
  fetchManagedAccountTransactions
});

const Container = (props: any) => {
  return <Component {...props} />;
};

export const TransactionHistory = stateConnector(Container);
