import * as React from 'react'

export function useControllableProp<T> (
  propValue: T | undefined,
  stateValue: T
) {
  const { current: isControlled } = React.useRef(propValue !== undefined)
  const value = isControlled ? propValue : stateValue
  return [isControlled, value] as [boolean, T]
}

export default useControllableProp
