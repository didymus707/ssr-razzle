import {
  Flex,
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  Button,
  Icon,
} from '@chakra-ui/core';
import * as React from 'react';
import { components, OptionProps } from 'react-select';
import CreateSelect from 'react-select/creatable';
import { SelectOptions } from '../../../tables.types';

export interface TableSelectProps<T> {
  value?: T;
  defaultValue?: T;
  isMulti?: boolean;
  onBlur?: () => void;
  placeholder?: string;
  defaultInputValue?: string;
  closeMenuOnSelect?: boolean;
  onChange?: (value: T | T[]) => void;
  onInputChange?: (value: string) => void;
  options: any | undefined;
  onCreateOptions?: (options: T[], value?: string | string[]) => void;
}

export function TableSelect({
  onBlur,
  isMulti,
  options,
  onChange,
  placeholder,
  defaultValue,
  onInputChange,
  onCreateOptions,
  value: valueProp,
  closeMenuOnSelect,
  defaultInputValue,
}: TableSelectProps<SelectOptions>) {
  const [value, setValue] = React.useState<SelectOptions | SelectOptions[] | undefined>(valueProp);
  const [updatedOptions, setUpdatedOptions] = React.useState<SelectOptions[] | undefined>(options);

  const styles = {
    control: (styles: any) => ({
      ...styles,
      border: 'none',
      boxShadow: 'none',
      borderRadius: '0',
      minHeight: '32px',
      ':focus': {
        border: '1px solid #6554c0',
      },
    }),
    multiValue: (styles: any) => ({
      ...styles,
      backgroundColor: '#edf2f7',
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
      fontSize: '0.875rem',
      padding: '0.2rem 0.5rem',
      color: isSelected ? '#ffffff' : '#333333',
      backgroundColor: isSelected ? '#2034c5' : 'transparent',
      '&:hover': {
        color: isSelected ? '#ffffff' : '#333333',
        backgroundColor: isSelected ? '#2034c5' : '#f7fafc',
      },
    }),
    indicatorsContainer: () => ({
      display: 'none',
    }),
  };

  function createOption(label: string) {
    return {
      label,
      value: label,
    };
  }

  function handleChange(newValue: any) {
    setValue(newValue);
    onChange && onChange(newValue);
  }

  function handleInputChange(inputValue: any) {
    onInputChange && onInputChange(inputValue);
  }

  function handleCreateOption(inputValue: any) {
    const newOption = createOption(inputValue);
    const newOptions = updatedOptions ? [...updatedOptions, newOption] : [newOption];
    const newValue = Array.isArray(value) ? [...value, newOption] : newOption;
    const newValueString = Array.isArray(newValue)
      ? newValue.map((item: SelectOptions) => item.value)
      : newValue.value;

    setUpdatedOptions(newOptions);
    handleChange(newValue);
    onCreateOptions && onCreateOptions(newOptions, newValueString);
  }

  function handleDeleteOption(data: SelectOptions) {
    const emptyOption = { label: '', value: '' };
    const newOptions = updatedOptions?.filter(item => item.value !== data.value);
    if (newOptions) {
      const newValue = Array.isArray(value) ? [...value] : emptyOption;
      const newValueString = Array.isArray(newValue)
        ? newValue.map((item: SelectOptions) => item.value)
        : newValue.value;

      setUpdatedOptions(newOptions);
      handleChange(newValue);
      onCreateOptions && onCreateOptions(newOptions, newValueString);
    } else {
      const newValueString = isMulti ? [] : '';

      setUpdatedOptions([]);
      handleChange(emptyOption);
      onCreateOptions && onCreateOptions([], newValueString);
    }
  }

  return (
    <>
      <CreateSelect
        isClearable
        value={value}
        styles={styles}
        onBlur={onBlur}
        isMulti={isMulti}
        options={options}
        components={{ Option }}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="table-select"
        defaultValue={defaultValue}
        onInputChange={handleInputChange}
        onCreateOption={handleCreateOption}
        defaultInputValue={defaultInputValue}
        closeMenuOnSelect={closeMenuOnSelect}
        onDeleteOption={handleDeleteOption}
      />
    </>
  );
}

const Option = (props: OptionProps<SelectOptions, true>) => {
  const { data, isSelected, selectProps } = props;

  return (
    <Flex position="relative">
      <components.Option {...props} />
      {!data.__isNew__ && (
        <Popover usePortal trigger="hover" placement="bottom-end">
          <PopoverTrigger>
            <Button
              size="xs"
              top="0.3rem"
              right="0.5rem"
              display="flex"
              variant="ghost"
              position="absolute"
              alignItems="center"
              _hover={{ bg: 'none' }}
              justifyContent="center"
              color={isSelected ? 'white' : 'black'}
            >
              <Icon name="more" />
            </Button>
          </PopoverTrigger>
          <PopoverContent zIndex={100000} maxWidth="200px" position="absolute">
            <PopoverBody padding="0.5rem 0">
              <List>
                <ListItem
                  cursor="pointer"
                  fontSize="0.875rem"
                  padding="0.2rem 0.5rem"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => selectProps.onDeleteOption(data)}
                >
                  <Stack isInline alignItems="center">
                    <ListIcon size="0.75rem" icon="delete" color="#66788a" />
                    <Text>Delete</Text>
                  </Stack>
                </ListItem>
              </List>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </Flex>
  );
};
