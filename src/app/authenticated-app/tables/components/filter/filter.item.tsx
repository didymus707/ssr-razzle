import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  IconButton,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Stack,
} from '@chakra-ui/core';
import format from 'date-fns/format';
import * as React from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { DatePickerComponent, DragHandle } from '../../../../components';
import { SelectOptions } from '../../tables.types';
import {
  DATE_FIELD_SUB_FILTERS,
  FILTER_CONJUCTIONS,
  PROPERTY_TYPE_OPERATORS,
} from './filter.data';
import {
  FilterItemInputProps,
  FilterItemProps,
  FilterItemSelectProps,
  FilterProps,
} from './filter.types';

function FilterItemSelect({
  data,
  options,
  onChange,
  multiple,
  ...rest
}: FilterItemSelectProps) {
  let [value, setValue] = React.useState(data || '');

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    let value = e.target.value;
    setValue(value);
    onChange && onChange(value);
  }

  return (
    <Select multiple={multiple} {...rest} value={value} onChange={handleSelect}>
      <option value="">Select option</option>
      {options &&
        options.map(({ label, value }, index) => (
          <option key={index} value={value}>
            {label}
          </option>
        ))}
    </Select>
  );
}

function FilterItemMultiSelect({
  data,
  options,
  onChange,
}: {
  data: string[];
  options?: SelectOptions[];
  onChange(data: (string | number | undefined)[]): void;
}) {
  let [value, setValue] = React.useState<(string | number | undefined)[]>(
    data || []
  );

  function handleSelect(data: (string | number | undefined)[]) {
    setValue(data);
    onChange && onChange(data);
  }

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button
          size="sm"
          isFullWidth
          variant="outline"
          fontWeight="normal"
          borderRadius="0.125rem"
          rightIcon="chevron-down"
          _hover={{
            bg: 'none',
            borderColor: '#CBD5E0',
          }}
          _focus={{
            borderColor: 'blue.500',
            boxShadow: '0 0 0 1px #3182ce',
          }}
        >
          {value.length} Selected
        </Button>
      </PopoverTrigger>
      <PopoverContent maxWidth="10rem" zIndex={99999}>
        <PopoverBody padding="0">
          <CheckboxGroup
            size="sm"
            value={value}
            variantColor="blue"
            onChange={handleSelect}
          >
            {options?.map((option, i) => (
              <Checkbox
                key={i}
                width="100%"
                marginBottom="0"
                padding="0.4rem"
                paddingBottom="0"
                value={option.value}
                isChecked={value.includes(option.value)}
              >
                {option.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export function FilterItemOperator({
  data,
  options,
  onChange,
  ...rest
}: FilterItemSelectProps) {
  return (
    <FilterItemSelect
      {...rest}
      data={data}
      options={options}
      onChange={onChange}
    />
  );
}

export function FilterItemConjuction({
  data,
  options,
  onChange,
  ...rest
}: FilterItemSelectProps) {
  return (
    <FilterItemSelect
      {...rest}
      data={data}
      options={options}
      onChange={onChange}
    />
  );
}

export function FilterItemInput({
  value: valueProp,
  onChange,
  ...rest
}: FilterItemInputProps) {
  const [value, setValue] = React.useState(valueProp || '');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;
    setValue(value);
    onChange && onChange(value);
  }

  return (
    <Input
      {...rest}
      value={value}
      placeholder="value"
      onChange={handleChange}
    />
  );
}

export const FilterItem = SortableElement(
  ({
    filter,
    onRemove,
    onChange,
    properties,
    isFirst = false,
  }: FilterItemProps<FilterProps>) => {
    const [filterValue, setFilterValue] = React.useState<FilterProps | null>(
      filter || null
    );
    const [exactValue, setExactValue] = React.useState(false);

    const [propertyOptions, setPropertyOptions] = React.useState<
      SelectOptions[] | undefined
    >();

    const PROPERTIES =
      properties &&
      (properties.map(({ label, name }) => ({
        label,
        value: name,
      })) as SelectOptions[]);

    React.useEffect(() => {
      if (filterValue) {
        const { name } = filterValue;
        const property = properties?.find((item) => item.name === name);
        const options = property?.options?.map(({ name }) => ({
          label: name,
          value: name,
        }));

        setPropertyOptions(options);
      }
    }, [filterValue, properties]);

    function handleConjuctionChange(conjunction: string) {
      let data = { ...filterValue, conjunction };
      setFilterValue(data);
      onChange && onChange(data);
    }

    function handleOperatorChange(operator: string) {
      let data = { ...filterValue, operator };
      setFilterValue(data);
      onChange && onChange(data);
    }

    function handleNameChange(name: string) {
      const property = properties?.find((item) => item.name === name);
      if (property) {
        let data = {
          ...filterValue,
          name,
          value: '',
          columnID: property?.id,
          operator:
            PROPERTY_TYPE_OPERATORS[property.type.toLowerCase()][0].value,
        };
        setFilterValue(data);
        onChange && onChange(data);
      }
    }

    function handleInputChange(value: string) {
      const data = { ...filterValue, value };
      setFilterValue(data);
      if (value === 'exact date') {
        setExactValue(true);
      } else {
        onChange && onChange(data);
      }
    }

    function handleMultiSelectChange(value: string[]) {
      const data = { ...filterValue, value };
      setFilterValue(data);
      onChange && onChange(data);
    }

    function handleDatePickerChange(date: any) {
      const value = format(date, 'dd-MM-yyyy');
      const data = { ...filterValue, value };
      setFilterValue(data);
      onChange && onChange(data);
    }

    function getOperatorList() {
      let operatorList: SelectOptions[] = [];
      if (filterValue && filterValue.name) {
        const propertyType =
          properties &&
          properties.find(({ name }) => name === filterValue.name);
        const type = propertyType && propertyType.type.toLowerCase();
        if (type) {
          operatorList = PROPERTY_TYPE_OPERATORS[type];
        }
      }
      return operatorList;
    }

    function renderFilterInputComponent() {
      /**
       * this method will handle rendering the sub-filters component and filter value
       * component
       *
       * Also account for the date based filter scenarios where you don't have
       * to show the filter value component
       */
      if (filterValue && filterValue.name) {
        const propertyType =
          properties &&
          properties.find(({ name }) => name === filterValue.name);
        const type = propertyType && propertyType.type.toLowerCase();
        switch (type) {
          case 'select':
            return (
              <FilterItemSelect
                size="sm"
                options={propertyOptions}
                onChange={handleInputChange}
                data={filter && filter.value}
              />
            );

          case 'multi select':
            return (
              <FilterItemMultiSelect
                options={propertyOptions}
                data={filter && filter.value}
                onChange={handleMultiSelectChange}
              />
            );

          case 'date':
            return (
              <Stack width="100%" isInline alignItems="center">
                <Box width={filterValue.value ? '100%' : '50%'}>
                  <FilterItemSelect
                    size="sm"
                    onChange={handleInputChange}
                    data={filter && filter.value}
                    options={DATE_FIELD_SUB_FILTERS}
                  />
                </Box>
                {(!filterValue.value || exactValue) && (
                  <Box width="50%">
                    <DatePickerComponent
                      size="sm"
                      showIcon={false}
                      value={filter && filter.value}
                      onDayChange={handleDatePickerChange}
                      dayPickerProps={{ disabledDays: { before: new Date() } }}
                    />
                  </Box>
                )}
              </Stack>
            );

          default:
            return (
              <FilterItemInput
                size="sm"
                onChange={handleInputChange}
                value={filter && filter.value}
              />
            );
        }
      }
    }

    return (
      <Stack
        isInline
        zIndex={100000000}
        spacing="0.25rem"
        marginBottom="0.5rem"
      >
        <Box>
          <DragHandle />
        </Box>
        {!isFirst && (
          <Box flex="1">
            <FilterItemConjuction
              size="sm"
              options={FILTER_CONJUCTIONS}
              onChange={handleConjuctionChange}
              data={filter && filter.conjunction}
            />
          </Box>
        )}
        <Box flex="1">
          <FilterItemConjuction
            size="sm"
            options={PROPERTIES}
            onChange={handleNameChange}
            data={filter && filter.name}
          />
        </Box>
        <Box flex="1">
          <FilterItemOperator
            size="sm"
            options={getOperatorList()}
            onChange={handleOperatorChange}
            data={filter && filter.operator}
          />
        </Box>
        {!(
          filterValue?.operator === 'empty' ||
          filterValue?.operator === 'notEmpty'
        ) && <Box flex="1">{renderFilterInputComponent()}</Box>}
        <Box>
          <IconButton
            size="xs"
            icon="close"
            fontSize="8px"
            variant="ghost"
            aria-label="ghost"
            onClick={onRemove}
          />
        </Box>
      </Stack>
    );
  }
);
