import { PopoverProps } from '@chakra-ui/core'

export interface TypeProps {
  icon: string
  label: string
  tooltip: string
}

export interface PropertyOptionsSchema {
  id?: number
  name: string
  type: string
}

export interface PropertySchema {
  id?: string | number
  name: string
  type: string
  label: string
  hidden: boolean
  width?: number
  options?: PropertyOptionsSchema[] | undefined
}

export interface PropertiesDropdownProp {
  children: React.ReactNode
  onPropertyDrag: ({
    oldIndex,
    newIndex
  }: {
    oldIndex: number
    newIndex: number
  }) => void
  properties: PropertySchema[]
  onPropertyDelete: (index: number) => void
  onPropertyAdd: (value: PropertySchema) => void
  onPropertyDuplicate: (value: PropertySchema) => void
  onPropertyUpdate: (value: PropertySchema, index: number) => void
}

export type PropertyProps = PropertySchema & {
  onDelete?: () => void
  onDuplicate?: () => void
  onChange?: (property: PropertySchema) => void
}

export interface PropertyDropdownProps {
  usePortal?: boolean
  onDelete?: () => void
  onDuplicate?: () => void
  children: React.ReactNode
  placement?: PopoverProps['placement']
  property?: PropertySchema | undefined
  onChange?: (property: PropertySchema) => void
}

export interface PropertyTypeProps {
  children: React.ReactNode
  onChange?: (type: string) => void
}

export interface PropertyTypeListProps {
  properties?: TypeProps[]
  onClick?: (type: string) => void
}

export interface PropertyItemProps {
  icon: any
  label: string
  tooltip?: string
  onClick?: (label: string) => void
}
