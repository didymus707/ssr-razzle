import { Box, FormLabel, Icon, Text } from '@chakra-ui/core';
import * as React from 'react';
import Select, { components } from 'react-select';

type Option = {
  label?: string;
  value?: string;
  options?: any[];
};

export type AdvancedSelectProps<T> = {
  value?: string | string[] | null;
  name?: string;
  label?: string | React.ReactNode;
  labelColor?: string;
  isGroup?: boolean;
  defaultValue?: T;
  isMulti?: boolean;
  onBlur?: () => void;
  isInvalid?: boolean;
  placeholder?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  defaultInputValue?: string;
  closeMenuOnSelect?: boolean;
  onChange?: (value: any) => void;
  options: Option[] | undefined;
  onInputChange?: (value: string) => void;
};

const sizes = {
  inputHeight: { sm: '2rem', md: '2.5rem', lg: '3rem' },
  placeholder: { sm: '45%', md: '50%', lg: '50%' },
  multiValueTopPosition: { sm: '0', md: '0', lg: '0' },
} as { [key: string]: { [key: string]: string } };

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <Icon
        size="1.25rem"
        color="gray.600"
        name={props.selectProps.menuIsOpen ? 'select-arrow-up' : 'select-arrow-up'}
      />
    </components.DropdownIndicator>
  );
};

const ClearIndicator = (props: any) => {
  return (
    <components.ClearIndicator {...props}>
      <Icon size="0.5rem" color="gray.600" name="close" />
    </components.ClearIndicator>
  );
};

export function AdvancedSelect({
  name,
  label,
  onBlur,
  isMulti,
  isGroup,
  options,
  onChange,
  isInvalid,
  isClearable,
  size = 'md',
  placeholder,
  isSearchable,
  defaultValue,
  onInputChange,
  value: valueProp,
  closeMenuOnSelect,
  defaultInputValue,
  labelColor = 'gray.900',
}: AdvancedSelectProps<Option>) {
  const [value, setValue] = React.useState(getValue(valueProp));

  const groupStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };
  const groupBadgeStyles = {
    minWidth: 1,
    fontSize: 12,
    color: 'white',
    lineHeight: '1',
    fontWeight: 400,
    borderRadius: '2em',
    display: 'inline-block',
    backgroundColor: '#3525E6',
    padding: '0.16666666666667em 0.5em',
  };

  function handleChange(newValue: any) {
    setValue(newValue);
    onChange && onChange(newValue);
  }

  function handleInputChange(inputValue: any) {
    onInputChange && onInputChange(inputValue);
  }

  function getValue(stringValue?: string | string[] | null) {
    if (stringValue) {
      if (isGroup) {
        return options
          ?.reduce((acc, item) => [...acc, ...(item?.options as any[])], [] as any[])
          .find(item => item.value === stringValue);
      }
      if (isMulti) {
        return [];
      }
      return options?.find(item => item.value === stringValue);
    }
    return null;
  }

  function formatGroupLabel(data: any) {
    return (
      <div style={groupStyles}>
        <Text color="primary">{data.label}</Text>
        {data.showBadge && <span style={groupBadgeStyles}>{data.options.length}</span>}
      </div>
    );
  }

  const styles = {
    valueContainer: (styles: any) => ({
      ...styles,
      fontSize: '0.875rem',
    }),
    menu: (styles: any) => ({
      ...styles,
      zIndex: 10000,
    }),
    control: (styles: any) => ({
      ...styles,
      // minHeight: 'unset',
      borderRadius: '8px',
      minHeight: sizes.inputHeight[size],
      boxShadow: isInvalid ? '0 0 0 1px #e53e3e' : 'none',
      border: `1px solid ${isInvalid ? '#e53e3e' : '#858C94'}`,
      '&:hover': {
        border: `1px solid ${isInvalid ? '#e53e3e' : '#DADEE3'}`,
      },
      '&:focus': {
        boxShadow: `0 0 0 1px ${isInvalid ? '#e53e3e' : '#3525E6'}`,
        border: `1px solid ${isInvalid ? '#e53e3e' : '#3525E6'}`,
      },
      '&:active': {
        boxShadow: `0 0 0 1px ${isInvalid ? '#e53e3e' : '#3525E6'}`,
        border: `1px solid ${isInvalid ? '#e53e3e' : '#3525E6'}`,
      },
    }),
    multiValue: (styles: any) => ({
      ...styles,
      position: 'relative',
      backgroundColor: '#edf2f7',
      top: sizes.multiValueTopPosition[size],
    }),
    singleValue: (styles: any) => ({
      ...styles,
      top: sizes.placeholder[size],
    }),
    multiValueRemove: (styles: any) => ({
      ...styles,
      ':hover': {
        cursor: 'pointer',
        backgroundColor: '#e2e8f0',
      },
    }),
    option: (styles: any, { isSelected }: any) => ({
      ...styles,
      cursor: 'pointer',
      padding: '0.2rem 0.5rem',
      fontSize: '0.875rem',
      color: isSelected ? '#ffffff' : '#333333',
      backgroundColor: isSelected ? '#3525E6' : 'transparent',
      '&:hover': {
        color: isSelected ? '#ffffff' : '#333333',
        backgroundColor: isSelected ? '#3525E6' : '#f7fafc',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: (styles: any) => ({
      ...styles,
      '&:hover': {
        opacity: 1,
        color: '#212121',
      },
    }),
    placeholder: (styles: any) => ({
      ...styles,
      color: '#8ca0b5',
      top: sizes.placeholder[size],
    }),
    dropdownIndicator: (styles: any) => ({
      ...styles,
      opacity: 1,
      color: '#212121',
      padding: '0 8px',
      '&:hover': {
        opacity: 1,
        color: '#212121',
      },
    }),
    clearIndicator: (styles: any) => ({
      ...styles,
      opacity: 1,
      color: '#212121',
      paddingRight: 0,
      '&:hover': {
        opacity: 1,
        color: '#212121',
      },
    }),
  };

  React.useEffect(() => {
    setValue(getValue(valueProp));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueProp]);

  return (
    <Box width="100%" position="relative">
      <Select
        name={name}
        value={value}
        styles={styles}
        onBlur={onBlur}
        isMulti={isMulti}
        options={options}
        onChange={handleChange}
        isClearable={isClearable}
        placeholder={placeholder}
        isSearchable={isSearchable}
        aria-label="advanced-select"
        defaultValue={defaultValue}
        onInputChange={handleInputChange}
        formatGroupLabel={formatGroupLabel}
        defaultInputValue={defaultInputValue}
        closeMenuOnSelect={closeMenuOnSelect}
        components={{ DropdownIndicator, ClearIndicator }}
      />
      {label && (
        <FormLabel
          p="0 8px"
          top="-4px"
          left="16px"
          zIndex={2}
          rounded="8px"
          fontWeight="400"
          color={labelColor}
          fontSize="0.75rem"
          position="absolute"
          transition="all 200ms"
          backgroundColor="white"
          transform="translate3d(0, -30%, 0)"
        >
          {label}
        </FormLabel>
      )}
    </Box>
  );
}
