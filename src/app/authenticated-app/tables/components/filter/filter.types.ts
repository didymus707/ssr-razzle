import { SelectProps, InputProps } from '@chakra-ui/core'
import { PropertySchema } from '../property'
import { SelectOptions } from '../../tables.types'

export interface FilterItemSelectOptions {
  data: string | undefined
  onChange: (val: string) => void
  options: SelectOptions[] | undefined
}

export type FilterItemSelectProps = FilterItemSelectOptions &
  Omit<SelectProps, 'onChange'>

interface FilterItemInputOptions {
  value?: string
  onChange?: (val: string) => void
}

export type FilterItemInputProps = FilterItemInputOptions &
  Omit<InputProps, 'onChange'>

export interface FilterProps {
  name?: string
  value?: any
  operator?: string
  columnID?: number | string | undefined
  conjunction?: string
}

export interface FilterItemProps<T> {
  filter?: T
  isFirst?: boolean
  onRemove?: () => void
  onChange?: (val: T) => void
  properties?: PropertySchema[]
}

export interface FilterListProps {
  filters: FilterProps[]
  properties?: PropertySchema[]
  onRemove?: (index: number) => void
  onChange?: (value: FilterProps, index: number) => void
}

export interface FiltersDropdownProps {
  actions: any
  filters: FilterProps[]
  children: React.ReactNode
  openGroupModal?: () => void
  properties: PropertySchema[]
  onCreateCampaign?: () => void
  onChange?: (value: FilterProps[]) => void
}

export interface PropertyTypeConjuctionDic {
  [key: string]: SelectOptions[]
}
