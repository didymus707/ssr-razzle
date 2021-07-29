import * as yup from 'yup'
import { validationSchema } from './group.components'
import { LoadingActions } from '../../../../../hooks'

export interface GroupSchema {
  id?: string
  name: string
  created_datetime?: string
  updated_datetime?: string
}

export interface GroupItemProps {
  group: GroupSchema
  isActive?: boolean
  onEdit?: () => void
  onClick?: () => void
  onDelete?: () => void
}

export interface GroupsDropdownProps {
  data: GroupSchema[]
  isLoading?: boolean
  children: React.ReactNode
  activeGroup?: GroupSchema
  onFetchTableRows?: () => void
  onClick: (group: GroupSchema) => void
  loadingDispatch: React.Dispatch<LoadingActions>
  onEdit?: ({ id, name }: GroupSchema, callback: () => void) => Promise<any>
  onDelete?: (
    { id }: { id: GroupSchema['id'] },
    callback: () => void
  ) => Promise<any>
}

export type GroupFormValues = yup.InferType<typeof validationSchema> & {
  id?: string
}

export type GroupModalProps = {
  title?: string
  isOpen: boolean
  onClose: () => void
  isLoading?: boolean
  initialValues?: GroupFormValues
  onSubmit: (values: GroupFormValues, callback: () => void) => void
}
