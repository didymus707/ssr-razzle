import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { DeveloperSidebar } from './component.sidebar';
import { Wrapper } from './component.styles';
import { DeveloperContent } from './component.content';

export const DevelopersHomeUi = (props: RouteComponentProps) => {
  const { match } = props;
  return (
    <Wrapper>
      <DeveloperSidebar {...props} />
      <DeveloperContent match={match} />
    </Wrapper>
  );
};
