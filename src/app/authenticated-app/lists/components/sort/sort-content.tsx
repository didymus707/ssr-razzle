import React from 'react';
import { SortItem } from './sort-item';

export const ListSortContent = (props: any) => {
  const sorts = props.sorts_by_id.map((sort_id: string) => props.sorts[sort_id]);

  return (
    <>
      {sorts.map((sort: any, index: number) => (
        <SortItem
          {...sort}
          index={index}
          key={sort.uid}
          columns={props.columns}
          columns_by_id={props.columns_by_id}
          updateSort={props.updateSort}
          deleteSort={props.deleteSort}
          sorted_columns={props.sorted_columns}
        />
      ))}
    </>
  );
};
