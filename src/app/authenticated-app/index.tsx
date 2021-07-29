import { useToast } from '@chakra-ui/core';
import { fromUnixTime, isAfter } from 'date-fns';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { useQuery } from 'react-query';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { OptionTypeBase } from 'react-select';
import { RootState } from '../../root/';
import { loadState, toFormData } from '../../utils';
import { initializePusher } from '../../utils/pusher';
import {
  ErrorBoundary,
  ErrorPage,
  PreloadedStateProvider,
  ProtectedRoute,
  SimpuDashboard,
  ToastBox,
} from '../components';
import { NoSubscriptionDialog } from '../components/NoSubscriptionDialog';
import {
  authLoading,
  fetchProfile,
  logout,
  logUserOut,
  OnboardingTasksInfo,
} from '../unauthenticated-app/authentication';
import { getUserChannels } from './channels';
import { openNoSubscriptionModal } from './globals';
import { Home } from './home';
import {
  InboxComponent,
  selectOrgInboxStatusCount,
  stopPopSound,
  subscribeToWebsocket,
} from './inbox';
import { InboxProvider } from './inbox/components/Provider';
import { useReactQuerySubscription } from './inbox/inbox.hooks';
import { InboxSettings } from './inbox/settings';
import { Integrations } from './integrations';
import { generateRandomListColor, generateRandomListIcon, Lists, ListView } from './lists';
import { MarketingUI } from './marketing';
import {
  CampaignAnalytics,
  CreateCampaign,
  filterCampaigns,
  ViewCampaign,
} from './marketing/campaigns';
import { CreateCoupon, ViewCoupon } from './marketing/coupons/components';
import { Onboarding } from './onboarding';
import { Payments, PaymentsOnboarding } from './payments';
// @ts-ignore
import popSound from './pop_sound.mp3';
import { SettingsContainer } from './settings';
import { DevelopersHomeUi } from './settings/component/developers';
import {
  addTable,
  addTableFromTemplate,
  importRowsCSV,
  importRowsMapping,
  ImportRowsMappingOptions,
  ImportRowsOptions,
  TablePropertiesOptions,
} from './tables';
import { PropertySchema } from './tables/components';

const connector = connect(
  (state: RootState) => ({
    user: state.auth.user,
    token: state.auth.token,
    organizations: state.teams.organizations,
    state,
    tables: state.tables.tables,
    profile: state.auth.profile,
    importedData: state.tables.importedData,
    createTableModalIsOpen: state.globals.createTableModalIsOpen,
    noSubscriptionModalIsOpen: state.globals.noSubscriptionModalIsOpen,
    shouldPopSound: state.inbox.inboxUi.shouldPopSound,
    websocketSubscribedOrgs: state.inbox.inboxUi.websocketSubscribedOrgs,
  }),
  {
    authLoading,
    fetchProfile,
    addTable,
    logUserOut,
    importRowsCSV,
    importRowsMapping,
    addTableFromTemplate,
    openNoSubscriptionModal,
    stopPopSound,
    subscribeToWebsocket,
  },
);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = RouteComponentProps & PropsFromRedux;

function App(props: Props) {
  const {
    user,
    tables,
    history,
    profile,
    token,
    organizations,
    addTable,
    logUserOut,
    importedData,
    importRowsCSV,
    importRowsMapping,
    addTableFromTemplate,
    shouldPopSound,
    stopPopSound,
    subscribeToWebsocket,
    websocketSubscribedOrgs,
    authLoading,
    fetchProfile,
  } = props;

  const { data: campaigns } = useQuery('campaigns', () =>
    filterCampaigns({ page: 1, query: undefined }),
  );

  const { data: channels } = useQuery('channels', getUserChannels);

  const onboarding_task_info: OnboardingTasksInfo = {
    channels: !!channels?.length,
    teams: !!props.state.teams.teams.length,
    lists: !!props.state.lists.lists_by_id.length,
    campaigns: !!campaigns?.data?.campaigns.length,
  };

  const isLoggedIn = () => {
    if (token && !isEmpty(user)) {
      const decoded = jwt_decode<JwtPayload>(token);
      if (decoded && decoded.exp && isAfter(fromUnixTime(decoded.exp), new Date())) {
        return true;
      }
    }
    return false;
  };

  const toast = useToast();
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const unReadThreadCount = useSelector((state: RootState) =>
    selectOrgInboxStatusCount(state, {
      organisation_id: profile?.organisation_id,
      user_id: user?.id,
    }),
  );

  React.useEffect(() => {
    initializePusher(user?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    organizations.forEach(({ id }) => {
      if (id && profile?.id && !websocketSubscribedOrgs[id]) {
        subscribeToWebsocket({
          organisation_id: id,
          profile_id: profile?.id,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizations, profile?.id, websocketSubscribedOrgs]);

  React.useEffect(() => {
    document.title = unReadThreadCount > 0 ? `(${unReadThreadCount}) Simpu` : 'Simpu';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unReadThreadCount]);

  React.useEffect(() => {
    try {
      if (audioRef && audioRef.current && shouldPopSound) {
        audioRef.current.play();
        stopPopSound();
      }
    } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPopSound]);

  useReactQuerySubscription();

  async function handleLogout() {
    await logout(user?.id);
    logUserOut();
    history.push('/login');
  }

  async function handleImport(payload: ImportRowsOptions) {
    let { file, ...rest } = payload;
    try {
      await importRowsCSV(toFormData(rest, file, 'file'));
      toast({
        position: 'bottom-left',
        render: () => <ToastBox status="success" message="File upload successful" />,
      });
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message={error} />,
      });
    }
  }

  async function handleImportMapping(payload: ImportRowsMappingOptions) {
    try {
      await importRowsMapping(payload);
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  async function handleImportNewTable(properties: PropertySchema[]) {
    let mapping = {} as OptionTypeBase;
    const { table }: { table: TablePropertiesOptions } = await addTable({
      user_id: user?.id,
      columns: properties,
      name: 'Untitled',
      color: generateRandomListColor(),
      icon: generateRandomListIcon(),
    });
    table.columns.forEach(({ id }) => {
      if (id) {
        mapping[id] = id;
      }
    });
    await handleImportMapping({
      mapping,
      table_id: table.id,
      id: importedData.id,
    });
    return table;
  }

  async function reloadOrganization(org_id: string) {
    if (!!loadState()) {
      authLoading(true);
      try {
        await fetchProfile(org_id);
      } catch (e) {}
      window.location.reload();
    }
  }

  return (
    <PreloadedStateProvider>
      <SimpuDashboard
        onboarding_task_info={onboarding_task_info}
        tables={tables}
        organizations={organizations}
        profile={profile}
        user={user}
        onLogout={handleLogout}
        unReadThreadCount={unReadThreadCount}
      >
        <audio controls ref={audioRef} style={{ display: 'none' }}>
          <source src={popSound} />
          Your browser does not support the audio element.
        </audio>
        <ErrorBoundary>
          <Switch>
            <ProtectedRoute
              path="/s/home"
              isLoggedIn={isLoggedIn()}
              render={props => <Home {...props} />}
            />
            <ProtectedRoute
              path="/s/onboarding"
              isLoggedIn={isLoggedIn()}
              render={props => <Onboarding {...{ user, profile, ...props }} />}
            />
            <ProtectedRoute
              exact
              path="/s/lists/view/:id/smart"
              isLoggedIn={isLoggedIn()}
              render={props => <ListView {...{ ...props, is_smart_list: true }} />}
            />
            <ProtectedRoute
              exact
              path="/s/lists/view/:id"
              isLoggedIn={isLoggedIn()}
              render={props => <ListView {...{ ...props, is_smart_list: false }} />}
            />
            <ProtectedRoute
              path="/s/lists"
              isLoggedIn={isLoggedIn()}
              render={props => (
                <Lists
                  {...{
                    ...props,
                    addList: addTable,
                    addListFromTemplate: addTableFromTemplate,
                    handleImport,
                    handleImportMapping,
                    handleImportNewTable,
                    importedData,
                  }}
                />
              )}
            />
            <ProtectedRoute
              path="/s/payments/onboarding"
              isLoggedIn={isLoggedIn()}
              render={props => <PaymentsOnboarding {...props} />}
            />
            <ProtectedRoute
              path="/s/payments"
              isLoggedIn={isLoggedIn()}
              render={props => <Payments {...props} />}
            />
            <ProtectedRoute exact path="/s/marketing" isLoggedIn={isLoggedIn()}>
              <Redirect to="/s/marketing/dashboard" />
            </ProtectedRoute>
            <ProtectedRoute
              exact
              path="/s/marketing/campaigns/new/:type"
              isLoggedIn={isLoggedIn()}
              render={props => <CreateCampaign {...props} />}
            />
            <ProtectedRoute
              exact
              path="/s/marketing/campaigns/:id"
              isLoggedIn={isLoggedIn()}
              render={props => <ViewCampaign {...props} />}
            />
            <ProtectedRoute
              exact
              path="/s/marketing/campaigns/:id/analytics"
              isLoggedIn={isLoggedIn()}
              render={props => <CampaignAnalytics {...props} />}
            />
            <ProtectedRoute
              exact
              path="/s/marketing/coupons/new"
              isLoggedIn={isLoggedIn()}
              render={() => <CreateCoupon />}
            />
            <ProtectedRoute
              exact
              path="/s/marketing/coupons/:id"
              isLoggedIn={isLoggedIn()}
              render={() => <ViewCoupon />}
            />
            <ProtectedRoute
              path="/s/marketing"
              isLoggedIn={isLoggedIn()}
              render={() => <MarketingUI />}
            />
            <Route exact path="/s/inbox/settings">
              <Redirect to="/s/inbox/settings/channels" />
            </Route>
            <ProtectedRoute
              path="/s/inbox/settings"
              isLoggedIn={isLoggedIn()}
              render={() => <InboxSettings />}
            />
            {/* <ProtectedRoute
              path="/s/inbox/:id"
              isLoggedIn={isLoggedIn()}
              // @ts-ignore
              render={props => <InboxComponent {...props} />}
            /> */}
            <ProtectedRoute
              exact
              path="/s/inbox"
              isLoggedIn={isLoggedIn()}
              render={() => (
                <InboxProvider>
                  <InboxComponent />
                </InboxProvider>
              )}
            />
            <ProtectedRoute
              path="/s/integrations"
              isLoggedIn={isLoggedIn()}
              // @ts-ignore
              render={props => <Integrations {...props} />}
            />
            <ProtectedRoute
              path="/s/settings"
              isLoggedIn={isLoggedIn()}
              render={props => (
                <SettingsContainer {...{ ...props, handleLogout, reloadOrganization }} />
              )}
            />
            <ProtectedRoute
              path="/s/developers"
              isLoggedIn={isLoggedIn()}
              render={props => <DevelopersHomeUi {...{ ...props }} />}
            />
            <Route component={ErrorPage} />
          </Switch>
          <NoSubscriptionDialog />
        </ErrorBoundary>
      </SimpuDashboard>
    </PreloadedStateProvider>
  );
}

export default connector(App);
