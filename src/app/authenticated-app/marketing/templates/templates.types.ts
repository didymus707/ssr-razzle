import { ConnectedProps } from 'react-redux'
import { stateConnector } from './templates.container'
import { RouteComponentProps } from 'react-router-dom'

type PropsWithRedux = ConnectedProps<typeof stateConnector>
export type TemplatesContainerProps = PropsWithRedux & RouteComponentProps

export interface TemplateData {
  id?: string
  name: string
  type?: string
  template: string
  table_id?: string
  smart_list_id?: string
  created_datetime?: string
  updated_datetime?: string
}

export interface TemplateCategory {
  category: string
}

export type TemplatesState = {
  templates: TemplateData[]
  template: TemplateData
  sampleTemplates: TemplateData[]
  templateCategories: TemplateCategory[]
}
