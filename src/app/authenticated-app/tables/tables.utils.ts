import camelCase from 'lodash/camelCase'
import { OptionTypeBase } from 'react-select'
import { PropertyOptionsSchema, PropertySchema } from './components'
import {
  TableContactOptions,
  TableDataOptions,
  TableRowDataProps
} from './tables.types'

export function getTableRowDataFormat (properties: PropertySchema[]) {
  const obj = {} as TableRowDataProps
  properties.forEach(element => {
    if (element.options) {
      obj[element.name] = {
        value: '',
        name: element.name,
        type: element.type,
        label: element.label,
        columnId: element.id,
        options: element.options.map(({ name }: PropertyOptionsSchema) => ({
          label: name,
          value: name
        }))
      }
    } else {
      obj[element.name] = {
        value: '',
        name: element.name,
        type: element.type,
        columnId: element.id,
        label: element.label
      }
    }
  })
  return obj
}

export function getRowValue ({
  columns,
  rowData
}: {
  columns: OptionTypeBase
  rowData: TableRowDataProps
}) {
  const result = {} as TableRowDataProps
  Object.keys(rowData).forEach(key => {
    const columnId = rowData[key].columnId
    if (columnId) {
      result[camelCase(key)] = {
        ...rowData[key],
        value: columns[columnId] || ''
      }
    }
  })
  return result
}

export function convertToTableData ({
  data,
  properties
}: {
  data?: TableContactOptions[]
  properties: PropertySchema[]
}) {
  const rowData = getTableRowDataFormat(properties)

  if (data) {
    return data.map(({ id, columns }) => {
      const data = getRowValue({ rowData, columns })
      return { id, ...data }
    })
  }
}

export function getTableInfo (data: TableDataOptions) {
  const { rows, table } = data
  const properties = table?.columns?.map((item: any) => ({
    ...item,
    name: camelCase(item.name)
  }))
  return {
    id: table?.id,
    name: table?.name,
    type: table?.type,
    properties,
    data: convertToTableData({
      data: rows,
      properties
    })
  }
}

export function getRowApiValue (row: any) {
  const { id, ...rest } = row
  let result = { id } as any
  Object.keys(rest).forEach(item => {
    const columnId = rest[item].columnId
    if (columnId) {
      result[columnId] = rest[item].value
    }
  })
  return result
}
