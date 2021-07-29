import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { ListResources } from './list-resources';
import { CreateResource } from './create-resource';

interface Props {
  searchValue: string;
  deleteResource: Function;
  updateResource: Function;
  testResourceConnection: Function;
  createResource: Function;
  requestResourceAuth: Function;
  requestAppResourceAuth: Function;
  submitAppResourceAuth: Function;
  enableResourceWebhook: Function;
  disableResourceWebhook: Function;
}

export const Component = (props: Props) => {
  const {
    searchValue,
    deleteResource,
    updateResource,
    requestResourceAuth,
    testResourceConnection,
    createResource,
    requestAppResourceAuth,
    submitAppResourceAuth,
    enableResourceWebhook,
    disableResourceWebhook,
  } = props;

  return (
    <Switch>
      <Route exact path="/s/lists/connections">
        <ListResources
          searchValue={searchValue}
          deleteResource={deleteResource}
          updateResource={updateResource}
          enableResourceWebhook={enableResourceWebhook}
          disableResourceWebhook={disableResourceWebhook}
        />
      </Route>
      <Route exact path="/s/lists/connections/new">
        <CreateResource
          requestResourceAuth={requestResourceAuth}
          requestAppResourceAuth={requestAppResourceAuth}
          submitAppResourceAuth={submitAppResourceAuth}
          testResourceConnection={testResourceConnection}
          createResource={createResource}
        />
      </Route>
    </Switch>
  );
};
