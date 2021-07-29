import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../../root';

export const selectTemplateCategories = createSelector(
  (state: RootState) => state.templates,
  templates => templates.templateCategories.map(item => item.category),
);
