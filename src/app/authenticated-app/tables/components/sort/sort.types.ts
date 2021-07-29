import { PropertySchema } from '../property'

export interface SortItemOptions {
  name?: string
  order?: string
}

export interface SortItemOrderProps {
  value: string | null | undefined
  options: any[]
  onSelect: (val: string) => void
}

export type SortItemPropertyNameProps = SortItemOrderProps

export interface SortItemProps {
  value: SortItemOptions
  onRemove: () => void
  properties: PropertySchema[]
  onChange: (value: SortItemOptions) => void
}

export interface SortListProps {
  sortList: SortItemOptions[] | object[]
  properties: PropertySchema[]
  onRemove?: (index: number) => void
  onChange?: (value: SortItemOptions, index: number) => void
}

export interface SortDropdownProps {
  actions: any
  children?: React.ReactNode
  sortList: SortItemOptions[]
  properties: PropertySchema[]
  onChange: (data: SortItemOptions[]) => void
}
