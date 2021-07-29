import { client } from '../../../../utils';
import { TemplateData } from './templates.types';

export const listTemplates = (params: any) => {
  return client('templates', { params });
};

export const searchTemplates = (query: string) => {
  return client('templates/search', { params: { query } });
};

export const createTemplate = (template: TemplateData) => {
  return client('templates/create', { method: 'POST', data: template });
};

export const updateTemplate = (template: TemplateData) => {
  return client('templates/update', { method: 'PATCH', data: template });
};

export const deleteTemplate = (id: TemplateData['id']) => {
  return client('templates/delete', { method: 'DELETE', data: { id } });
};

export const shortenLink = (payload: { link: string }) => {
  return client('links/create', { method: 'POST', data: payload });
};

export const listSampleTemplates = (params: any) => {
  const { category, ...rest } = params;
  return client(`templates/built-in/${category}`, { params: rest });
};

export const searchSampleTemplates = (query: string) => {
  return client('templates/search-built-in', { params: { query } });
};

export const listTemplateCategories = () => {
  return client('templates/get-categories');
};

export const getTemplateData = (id: string) => {
  return client(`template/${id}`);
};
