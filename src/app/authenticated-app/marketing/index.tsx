import { Box, Icon, Stack, Text } from '@chakra-ui/core';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { NavLink } from 'react-router-dom';
import { ContentWrapper } from '../../components';
import { Campaigns, CreditTopupCard } from './campaigns';
import { MarketingLayout } from './components/layout';
import { MarketingCoupons } from './coupons';
import { MarketingDashboard } from './dashboard';
import { MarketingReports } from './reports';
import { MarketingSettings } from './settings';
import { MarketingTemplates } from './templates';

export const MarketingUI = () => {
  const match = useRouteMatch();
  return (
    <ContentWrapper paddingBottom="8rem">
      <MarketingLayout>
        <Box className="side-bar">
          <NavLink to={`${match.url}/dashboard`} className="option-item">
            <Stack className="navlink-container" width="100%" isInline alignItems="center">
              <Icon size="24px" name="marketing-dashboard" />
              <Text>Dashboard</Text>
            </Stack>
          </NavLink>
          <NavLink to={`${match.url}/campaigns`} className="option-item">
            <Stack className="navlink-container" width="100%" isInline alignItems="center">
              <Icon size="24px" name="marketing-campaign" />
              <Text>Campaigns</Text>
            </Stack>
          </NavLink>
          <NavLink to={`${match.url}/coupons`} className="option-item">
            <Stack className="navlink-container" width="100%" isInline alignItems="center">
              <Icon size="24px" name="marketing-coupon" />
              <Text>Coupons</Text>
            </Stack>
          </NavLink>
          <NavLink to={`${match.url}/templates`} className="option-item">
            <Stack className="navlink-container" width="100%" isInline alignItems="center">
              <Icon size="24px" name="inbox-compose-quote" />
              <Text>Templates</Text>
            </Stack>
          </NavLink>
          <NavLink to={`${match.url}/reports`} className="option-item">
            <Stack className="navlink-container" width="100%" isInline alignItems="center">
              <Icon size="24px" name="marketing-reports" />
              <Text>Reports</Text>
            </Stack>
          </NavLink>
          <NavLink to={`${match.url}/settings`} className="option-item">
            <Stack className="navlink-container" width="100%" isInline alignItems="center">
              <Icon size="24px" name="marketing-settings" />
              <Text>Settings</Text>
            </Stack>
          </NavLink>
          <CreditTopupCard content="This is the credit you have for sending out campaign messages" />
        </Box>
        <Box className="content">
          <Switch>
            <Route path={`${match.path}/dashboard`} render={() => <MarketingDashboard />} />
            <Route
              exact
              path={`${match.path}/campaigns`}
              render={props => <Campaigns {...props} />}
            />
            <Route path={`${match.path}/reports`} render={() => <MarketingReports />}></Route>
            <Route path={`${match.path}/coupons`} render={() => <MarketingCoupons />}></Route>
            <Route
              path={`${match.path}/templates`}
              render={props => <MarketingTemplates {...props} />}
            ></Route>
            <Route path={`${match.path}/settings`} render={() => <MarketingSettings />}></Route>
          </Switch>
        </Box>
      </MarketingLayout>
    </ContentWrapper>
  );
};
