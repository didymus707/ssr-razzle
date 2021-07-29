import { unescape } from 'lodash';
import { TemplateData } from './templates.types';

export function sortTemplatesFunc(a: TemplateData, b: TemplateData) {
  var dateA = a.created_datetime && new Date(a.created_datetime).getTime();
  var dateB = b.created_datetime && new Date(b.created_datetime).getTime();
  if (dateA && dateB) {
    return dateB - dateA;
  }
  return null;
}

export function html2Text(html: string) {
  return unescape(html.replace(/<\/?[^>]+>/gi, '').replace(/&nbsp;/g, ' '));
}
