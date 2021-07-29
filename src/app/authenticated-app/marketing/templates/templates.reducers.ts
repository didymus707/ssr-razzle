import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../../../root';
import {
  createTemplate,
  deleteTemplate,
  getTemplateData,
  listSampleTemplates,
  listTemplateCategories,
  listTemplates,
  searchTemplates,
  updateTemplate,
} from './templates.service';
import { TemplateCategory, TemplateData, TemplatesState } from './templates.types';
import { sortTemplatesFunc } from './templates.utils';

////////////////////////////////////////////////////////////////////////////////////

const initialState: TemplatesState = {
  templates: [],
  sampleTemplates: [],
  template: {} as TemplateData,
  templateCategories: [],
};

////////////////////////////////////////////////////////////////////////////////////

const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    getTemplates(state, action: PayloadAction<{ templates: TemplateData[] }>) {
      const { templates } = action.payload;
      state.templates = templates;
    },
    getTemplateCategories(state, action: PayloadAction<{ categories: TemplateCategory[] }>) {
      const { categories } = action.payload;
      state.templateCategories = categories;
    },
    getSampleTemplates(state, action: PayloadAction<{ templates: TemplateData[] }>) {
      const { templates } = action.payload;
      state.sampleTemplates = templates;
    },
    getTemplate(state, action: PayloadAction<{ template: TemplateData }>) {
      const { template } = action.payload;
      state.template = template;
    },
    createTemplateItem(state, action: PayloadAction<{ template: TemplateData }>) {
      const { template } = action.payload;
      state.templates?.unshift(template);
    },
    editTemplateItem(state, action: PayloadAction<{ template: TemplateData }>) {
      const { template } = action.payload;
      const index = state.templates.findIndex(item => item.id === template.id);
      state.templates[index] = template;
    },
    deleteTemplateItem(state, action: PayloadAction<{ id: TemplateData['id'] }>) {
      const { id } = action.payload;
      state.templates = state.templates.filter(item => item.id !== id);
    },
  },
});

export const {
  getTemplate,
  getTemplates,
  editTemplateItem,
  deleteTemplateItem,
  createTemplateItem,
  getSampleTemplates,
  getTemplateCategories,
} = templatesSlice.actions;

////////////////////////////////////////////////////////////////////////////////////

export const templatesReducer = templatesSlice.reducer;

////////////////////////////////////////////////////////////////////////////////////
// Template Thunks

export const fetchTemplates = (params?: any): AppThunk => async dispatch => {
  const response = await listTemplates(params);
  const { templates } = response.data;
  /**
   * sort templates based on created datetime
   * this sort should come from API actually
   */
  const sortedTemplates = templates.sort(sortTemplatesFunc);
  dispatch(getTemplates({ templates: sortedTemplates }));
  return response.data;
};

export const templatesSearchResults = (query: string): AppThunk => async dispatch => {
  const response = await searchTemplates(query);
  const { templates } = response.data;
  const sortedTemplates = templates.sort(sortTemplatesFunc);
  dispatch(getTemplates({ templates: sortedTemplates }));
  return response.data;
};

export const addTemplate = (payload: TemplateData): AppThunk => async dispatch => {
  const response = await createTemplate(payload);
  const { template } = response.data;
  dispatch(createTemplateItem({ template }));
  return response.data;
};

export const editTemplate = (payload: TemplateData): AppThunk => async dispatch => {
  const response = await updateTemplate(payload);
  const { template } = response.data;
  dispatch(editTemplateItem({ template }));
  return response.data;
};

export const removeTemplate = (payload: TemplateData['id']): AppThunk => async dispatch => {
  const response = await deleteTemplate(payload);
  dispatch(deleteTemplateItem({ id: payload }));
  return response;
};

export const fetchSampleTemplates = (params?: any): AppThunk => async dispatch => {
  const response = await listSampleTemplates(params);
  const { templates } = response.data;
  /**
   * sort templates based on created datetime
   * this sort should come from API actually
   */
  const sortedTemplates = templates.sort(sortTemplatesFunc);
  dispatch(getSampleTemplates({ templates: sortedTemplates }));
  return response.data;
};

export const sampleTemplatesSearchResults = (query: string): AppThunk => async dispatch => {
  const response = await searchTemplates(query);
  const { templates } = response.data;
  const sortedTemplates = templates.sort(sortTemplatesFunc);
  dispatch(getSampleTemplates({ templates: sortedTemplates }));
  return response.data;
};

export const fetchTemplateCategories = (): AppThunk => async dispatch => {
  const response = await listTemplateCategories();
  const { categories } = response.data;
  dispatch(getTemplateCategories({ categories }));
  return response.data;
};

export const fetchTemplate = (id: string): AppThunk => async dispatch => {
  const response = await getTemplateData(id);
  const { template } = response.data;
  dispatch(getTemplate({ template }));
  return response.data;
};
