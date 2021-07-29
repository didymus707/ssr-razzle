import React from 'react';
import { FilterItem } from './filter-item';

export const ListFilterContent = (props: any) => {
  const filters = props.filters_by_id.map((filter_id: string) => props.filters[filter_id]);

  const conjunction = filters?.[1]?.['conjunction'];

  return (
    <>
      {filters.map((filter: any, index: number) => (
        <FilterItem
          {...filter}
          conjunction={conjunction}
          key={filter.uid}
          index={index}
          allow_conjunction_select={index !== 0}
          columns={props.columns}
          columns_by_id={props.columns_by_id}
          updateFilter={props.updateFilter}
          deleteFilter={props.deleteFilter}
        />
      ))}
    </>
  );
};
