import camelCase from 'lodash/camelCase'
import * as React from 'react'
import { arrayMove } from 'react-sortable-hoc'
import { PropertySchema } from '../../property'

/**
 * Hook for managing table columns.
 * Manages add, update, delete, reorder actions for table columns
 */

export function useProperties ({
  properties
}: {
  properties: PropertySchema[]
}) {
  const [columns, setColumns] = React.useState<PropertySchema[]>(properties)

  async function handlePropertyAdd (
    value?: Pick<PropertySchema, 'label' | 'type'>
  ) {
    let column = {} as PropertySchema
    if (value) {
      column = {
        hidden: false,
        label: value.label,
        name: camelCase(value.label),
        type: value.type.toUpperCase()
      } as PropertySchema
    } else {
      column = {
        hidden: false,
        label: 'Column',
        type: 'text'.toUpperCase(),
        name: `column ${columns.length}`
      } as PropertySchema
    }
    if (value?.type.toLowerCase().includes('select')) {
      column.options = []
    }
    const data = [...columns, column]
    setColumns(data)
  }

  async function handlePropertyUpdate (value: PropertySchema, index: number) {
    const data = [...columns]
    if (value.type.toLowerCase().includes('select') && !value.options) {
      value.options = []
    }
    if (!value.type.toLowerCase().includes('select') && value.options) {
      delete value.options
    }
    data[index] = value
    setColumns([...data])
  }

  async function handlePropertyDelete (index: number) {
    const data = columns.filter(
      (x: PropertySchema, idx: number) => index !== idx
    )
    setColumns(data)
  }

  async function handlePropertyDuplicate (value: PropertySchema) {
    const { id, name, label, ...rest } = value
    const property = {
      ...rest,
      name: `${name}${columns.length + 1}`,
      label: `${label} ${columns.length + 1}`
    }
    const data = [...columns, property]
    setColumns(data)
  }

  async function handlePropertyDrag ({
    oldIndex,
    newIndex
  }: {
    oldIndex: number
    newIndex: number
  }) {
    const data = arrayMove(columns, oldIndex, newIndex)
    setColumns(data)
  }

  return {
    properties: columns,
    onPropertyAdd: handlePropertyAdd,
    onPropertyDrag: handlePropertyDrag,
    onPropertyUpdate: handlePropertyUpdate,
    onPropertyDelete: handlePropertyDelete,
    onPropertyDuplicate: handlePropertyDuplicate
  }
}
