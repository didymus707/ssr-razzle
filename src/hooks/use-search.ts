import * as React from 'react'

interface HookProps {
  initialValue?: undefined | string
  onChange?: (value: string) => void
}

export function useSearch ({ initialValue, onChange }: HookProps) {
  const [input, setInput] = React.useState<string>(initialValue || '')

  function handleChange (event: React.ChangeEvent<HTMLInputElement>) {
    let value = event.target.value
    setInput(value)
    onChange && onChange(value)
  }

  return { input, handleChange }
}
