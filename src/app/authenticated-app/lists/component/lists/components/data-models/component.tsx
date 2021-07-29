import React from 'react';
import { Route, Switch } from 'react-router';
import { ListDataModels } from './list-data-models';
import { CreateDataModel } from './create-data-model';

interface Props {
  searchValue: string;
  fetchResourceSchema: Function;
  createDataModel: Function;
  deleteDataModel: Function;
}

export const Component = (props: Props) => {
  return (
    <Switch>
      <Route exact path="/s/lists/data-models">
        <ListDataModels searchValue={props.searchValue} deleteDataModel={props.deleteDataModel} />
      </Route>
      <Route exact path="/s/lists/data-models/new">
        <CreateDataModel
          createDataModel={props.createDataModel}
          fetchResourceSchema={props.fetchResourceSchema}
          fetchResourceSubSchema={() => {}}
        />
      </Route>
    </Switch>
  );
};
