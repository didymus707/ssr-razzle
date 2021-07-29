import { Icon } from '@chakra-ui/core';
import React from 'react';
import Select, { components } from 'react-select';

export type DropDownItemSchema = {
  label: string;
  value: string;
}

export function Dropdown({
  list, selected, setSelected, placeholder, formatOptionLabel,
  components: dComponents
}: {
  placeholder?: string
  list: DropDownItemSchema[]
  selected?: DropDownItemSchema
  setSelected?: (v: DropDownItemSchema) => void
  components?: any
  formatOptionLabel?: any
}) {
  let comps = {
    DropdownIndicator: (props: any) => (
      <components.DropdownIndicator {...props}>
        <Icon name="triangle-down" width=".875rem" height=".625rem" />
      </components.DropdownIndicator>
    )
  }

  let value: any = selected;
  if (placeholder) {
    if (selected && selected.label === '' && selected.value === '') {
      value = '';
    }
  } else if (value && value.label === '' && value.value === '') {
    value = list[0];
  }

  if (dComponents) {
    comps = { ...comps, ...dComponents };
  }

  return (
    <Select
      components={comps}
      formatOptionLabel={formatOptionLabel}
      value={value}
      onChange={(newValue: any) => setSelected && setSelected(newValue)}
      options={list}
      placeholder={placeholder}
      styles={{
        valueContainer: (styles: any) => ({
          ...styles,
          fontSize: '0.875rem',
          color: 'brandBlack',
          paddingTop: '.75rem',
          paddingBottom: '.75rem',
          paddingLeft: '0',
        }),
        singleValue: (styles: any) => ({
          ...styles,
          margin: '0'
        }),
        indicatorSeparator: () => ({
          display: 'none',
        }),
        control: (styles: any, { isFocused }) => ({
          ...styles,
          borderRadius: '0',
          border: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          paddingRight: isFocused ? '.5rem' : '0',
          paddingLeft: isFocused ? '.5rem' : '0',
          marginRight: isFocused ? '-.5rem' : '0',
          marginLeft: isFocused ? '-.5rem' : '0',
          '&:focus': {
            outline: 'none'
          }
        }),
        dropdownIndicator: (styles: any) => ({
          ...styles,
          opacity: 1,
          color: '#637381',
          paddingRight: '0',
          '&:hover': {
            opacity: 1,
            color: '#637381',
          },
        }),
        placeholder: (styles: any) => ({
          ...styles,
          color: '#8ca0b5',
        }),
      }}
    />
  )
}
