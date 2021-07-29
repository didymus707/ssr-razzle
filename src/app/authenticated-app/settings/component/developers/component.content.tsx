import React from 'react';
import { Box } from '@chakra-ui/core';
import { APIKeys } from './api-keys';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ContentWrapper } from '../../../../components';
import { Logs } from './Logs';
import DetailsPage from './components/logs/component/logDetails/links/DetailsPage';
import { APIEvents } from './events';
import { APIWebhooks } from './web-hooks';

interface Props {
  match: any;
}

export const DeveloperContent = (props: Props) => {
  const { match } = props;

  return (
    <ContentWrapper style={{ height: '100%' }}>
      <Box className="content">
        <Box className="content-section">
          <Switch>
            <Route
              path={`${match.path}/api-keys`}
              render={routeProps => (
                <APIKeys
                  {...{
                    ...routeProps,
                  }}
                />
              )}
            />
            <Route path={`${match.path}/logs/:id`} render={() => <DetailsPage />} />
            <Route exact path={`${match.path}/logs`} render={() => <Logs />} />
            <Route exact path={`${match.path}/events`} render={() => <APIEvents />} />
            <Route exact path={`${match.path}/webhooks`} render={() => <APIWebhooks />} />
            <Route path="*">
              <Redirect to={`${match.path}/api-keys`} />
            </Route>
          </Switch>
        </Box>
      </Box>
    </ContentWrapper>
  );
};
