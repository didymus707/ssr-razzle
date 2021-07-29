import * as React from 'react';
import { arrayMove } from 'react-sortable-hoc';
import { PROPERTIES } from '../property';
import { SORT_ORDER_LIST } from './sort.data';
import { SortDropdownProps, SortItemOptions } from './sort.types';

export const useSort = ({
  properties,
  onChange,
}: Pick<SortDropdownProps, 'onChange' | 'properties'>) => {
  const [sortList, setSortList] = React.useState<SortItemOptions[]>([]);

  const SORT_PROPERTIES = properties.map(property => {
    const selectProperty = PROPERTIES.find(
      item => item.label.toLowerCase() === property.type.toLowerCase()
    );
    const propertyIcon = selectProperty && selectProperty.icon;
    return {
      label: property.label,
      value: property.name,
      icon: propertyIcon,
    };
  });

  function reset() {
    setSortList([]);
  }

  function add() {
    const newData = [
      ...sortList,
      {
        name: SORT_PROPERTIES[0].value,
        order: SORT_ORDER_LIST[0].value,
      },
    ];
    setSortList(newData);
    onChange && onChange(newData);
  }

  function update(value: SortItemOptions, index: number) {
    const newData = [...sortList];
    newData[index] = value;
    setSortList(newData);
    onChange && onChange(newData);
  }

  function remove(index: number) {
    const newData = sortList.filter((x: SortItemOptions, idx: number) => index !== idx);
    setSortList(newData);
    onChange && onChange(newData);
  }

  function reorder({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) {
    const newData = arrayMove(sortList, oldIndex, newIndex);
    setSortList(newData);
    onChange && onChange(newData);
  }

  return { sortList, actions: { add, reset, update, remove, reorder } };
};
