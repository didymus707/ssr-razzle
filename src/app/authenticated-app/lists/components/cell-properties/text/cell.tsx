import React, { useEffect } from 'react';

export const TextCellComponent = (props: any) => {
  useEffect(() => {
    if (
      props.search_query !== '' &&
      props.value &&
      props.value?.toString().toLowerCase().includes(props.search_query.toLowerCase())
    ) {
      props.eGridCell.style.backgroundColor = '#fff3d4';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{props.value?.toString()}</>;
};
