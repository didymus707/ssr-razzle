import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../root';
import { TemplatesContainerProps } from './templates.types';
import { TemplatesComponent } from './templates.ui';
import {
  addTemplate,
  editTemplate,
  removeTemplate,
  fetchTemplates,
  fetchSampleTemplates,
  templatesSearchResults,
} from './templates.reducers';

export const stateConnector = connect(
  (state: RootState) => ({
    ...state.lists,
    ...state.templates,
  }),
  {
    addTemplate,
    editTemplate,
    removeTemplate,
    fetchTemplates,
    fetchSampleTemplates,
    templatesSearchResults,
  },
);

export function TemplatesContainer(props: TemplatesContainerProps) {
  return <TemplatesComponent {...props} />;
}

export const MarketingTemplates = stateConnector(TemplatesContainer);
