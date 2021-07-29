import { MouseEventHandler } from 'react'
import { TableInstance, TableOptions } from 'react-table'
import * as yup from 'yup'
import { TemplateData } from '../templates.types'
import { templateFormValidationSchema } from './TemplateForm'

export interface TemplateModalProps {
  lists?: any
  title?: string
  isOpen: boolean
  onClose: () => void
  isLoading?: boolean
  lists_by_id?: string[]
  initialValues?: TemplateFormValues
  listOptions?: { label: string; value: string }[]
  onSubmit: (template: TemplateFormValues) => void
}

export interface TableExtendProps {
  pageIndex?: number
}

export interface TemplateTableProps<T extends object = {}> extends TableOptions<T | {}> {
  name?: string
  onEdit?: (instance: TableInstance<T>) => MouseEventHandler
  onDelete?: (instance: TableInstance<T>) => MouseEventHandler
  onDuplicate?: (instance: TableInstance<T>) => MouseEventHandler
}

export type TemplateFormValues = yup.InferType<typeof templateFormValidationSchema> & {
  id?: string
  table_id?: string
}

export type TemplateFormProps = {
  lists?: any
  isLoading?: boolean
  onClose?: () => void
  lists_by_id?: string[]
  initialValues?: TemplateFormValues
  listOptions?: TemplateModalProps['listOptions']
  onSubmit: (payload: TemplateFormValues) => void
}
