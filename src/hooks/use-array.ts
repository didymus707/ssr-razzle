import * as React from 'react'
import { arrayMove } from 'react-sortable-hoc'
import useControllableProp from './use-controllable-props'

export function useArray<T> ({
  max,
  array,
  onChange,
  defaultValue,
  keepWithinMax
}: {
  max?: number
  array?: T[]
  defaultValue?: T[]
  keepWithinMax?: boolean
  onChange?: (nextValue: T[]) => void
}) {
  const [data, setData] = React.useState<T[]>(defaultValue || [])
  const [isControlled, value] = useControllableProp(array, data)

  const isAtMax = Boolean(max && value.length === max)
  const isOutOfRange = Boolean(max && value.length > max)

  const updateState = React.useCallback(
    nextState => {
      if (max && nextState.length > max && keepWithinMax) {
        return
      }
      if (!isControlled) setData(nextState)
      if (onChange) onChange(nextState)
    },
    [isControlled, max, onChange, keepWithinMax]
  )

  const add = React.useCallback(
    (item: T) => {
      updateState([...value, item])
    },
    [value, updateState]
  )

  const update = React.useCallback(
    (item: T, index: number) => {
      const newData = [...value]
      newData[index] = item
      updateState([...newData])
    },
    [value, updateState]
  )

  const remove = React.useCallback(
    (index: number) => {
      const newData = value.filter((x: T, idx: number) => index !== idx)
      updateState(newData)
    },
    [value, updateState]
  )

  const reorder = React.useCallback(
    (oldIndex: number, newIndex: number) => {
      const newData = arrayMove(value, oldIndex, newIndex)
      updateState(newData)
    },
    [value, updateState]
  )

  return { data: value, isAtMax, isOutOfRange, add, reorder, update, remove }
}
