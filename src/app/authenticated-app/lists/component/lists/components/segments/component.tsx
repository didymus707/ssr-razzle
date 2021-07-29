import React from 'react';
import { Route, Switch } from 'react-router';
import { ListSegments } from './list-segments';
import { CreateSegment } from './create-segment';

interface Props {
  searchValue: string;
  fetchDataModel: Function;
  createSegment: Function;
  deleteSegment: Function;
}

export const Component = (props: Props) => {
  return (
    <Switch>
      <Route exact path="/s/lists/segments">
        <ListSegments searchValue={props.searchValue} deleteSegment={props.deleteSegment} />
      </Route>
      <Route exact path="/s/lists/segments/new">
        <CreateSegment createSegment={props.createSegment} fetchDataModel={props.fetchDataModel} />
      </Route>
    </Switch>
  );
};
