import { Action, combineReducers } from 'redux';
import { campaignReducer } from '../app/authenticated-app/marketing/campaigns/campaigns.reducer';
import { channelReducer } from '../app/authenticated-app/channels/channel.reducer';
import { integrationReducer } from '../app/authenticated-app/integrations/integrations.reducer';
import {
  billingReducer,
  teamsReducer,
  paymentReducer,
  developersReducer,
} from '../app/authenticated-app/settings';
import { groupsReducer, rowsReducer, tablesReducer } from '../app/authenticated-app/tables';
import {
  dataModelsReducer,
  segmentsReducer,
  listsReducer,
  resourcesReducer,
} from '../app/authenticated-app/lists/lists.reducer';
import { templatesReducer } from '../app/authenticated-app/marketing/templates';
import {
  authReducer,
  getToken,
  getUser,
  logUserOut,
} from '../app/unauthenticated-app/authentication';
import { globalsReducer } from '../app/authenticated-app/globals';
import { inboxReducer } from '../app/authenticated-app/inbox';
import {
  paymentSetupReducer,
  paymentRequestsReducer,
  cardsReducer,
  bankAccountsReducer,
  walletReducer,
  managedAccountReducer,
} from '../app/authenticated-app/payments/reducers';

const getPreloadedState = () => {
  try {
    const user = getUser();
    const token = getToken();

    if (!user && !token) {
      return {};
    }
    return {
      auth: {
        user,
        token,
      },
    };
  } catch (e) {
    return {};
  }
};

export const preloadedState = getPreloadedState();

export const appReducers = combineReducers({
  auth: authReducer,
  rows: rowsReducer,
  teams: teamsReducer,
  billing: billingReducer,
  inbox: inboxReducer,
  tables: tablesReducer,
  lists: listsReducer,
  dataModels: dataModelsReducer,
  segments: segmentsReducer,
  resources: resourcesReducer,
  groups: groupsReducer,
  payment: paymentReducer,
  payments: combineReducers({
    payment_setup: paymentSetupReducer,
    payment_requests: paymentRequestsReducer,
    cards: cardsReducer,
    bank_accounts: bankAccountsReducer,
    managed_account: managedAccountReducer,
    wallet: walletReducer,
  }),
  channel: channelReducer,
  globals: globalsReducer,
  campaigns: campaignReducer,
  templates: templatesReducer,
  integration: integrationReducer,
  developers: developersReducer,
});

export const rootReducer = (state: any, action: Action) => {
  let appState = state;
  if (action.type === logUserOut.toString()) {
    appState = undefined;
  }
  return appReducers(appState, action);
};
