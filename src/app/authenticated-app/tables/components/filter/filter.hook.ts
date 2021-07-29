import debounce from 'lodash/debounce';
import * as React from 'react';
import { arrayMove } from 'react-sortable-hoc';
import { FilterProps, FiltersDropdownProps } from './filter.types';
import { FILTER_CONJUCTIONS, PROPERTY_TYPE_OPERATORS } from './filter.data';

export const useFilter = ({
  properties,
  onChange,
}: Pick<FiltersDropdownProps, 'onChange' | 'properties'>) => {
  const [filters, setFilters] = React.useState<FilterProps[]>([]);

  function reset() {
    setFilters([]);
  }

  function add() {
    const initialProperty = properties[0];
    if (initialProperty) {
      const { id, name, type } = initialProperty;
      const filter = {
        name: name,
        columnID: id,
        operator: PROPERTY_TYPE_OPERATORS[type.toLowerCase()][0].value,
      } as FilterProps;

      if (!!filters.length) {
        filter.conjunction = FILTER_CONJUCTIONS[0].value;
      }

      setFilters([...filters, filter]);
    }
  }

  function update(value: FilterProps, index: number) {
    const newData = [...filters];
    newData[index] = value;
    setFilters(newData);
    const conditionToCallAPI =
      value.value || value.operator === 'empty' || value.operator === 'notEmpty';
    if (conditionToCallAPI && onChange) {
      debounce(() => {
        onChange(newData);
      }, 2000)();
    }
  }

  function remove(index: number) {
    const newData = filters.filter((x: FilterProps, idx: number) => index !== idx);
    setFilters(newData);
    onChange && onChange(newData);
  }

  function reorder({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) {
    const newData = arrayMove(filters, oldIndex, newIndex);
    setFilters(newData);
    onChange && onChange(newData);
  }

  return { filters, actions: { add, reset, update, remove, reorder } };
};
