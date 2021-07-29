import React, { useEffect } from 'react';
import { Icon } from '@chakra-ui/core';
import { CustomCellWrapper as Wrapper } from '../../grid/custom-cell/index.styles';

export const EmailCell = (props: any) => {
  const handleActionClick = (event: any) => {
    event.stopPropagation();
    props.api.stopEditing();
    window.location.href = `mailto:${props.value}`;
  };

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

  return (
    <Wrapper onClick={e => e.stopPropagation()}>
      <div className="email-cell" onClick={e => e.stopPropagation()}>
        {props.value}
        {props.value && (
          <div className="icon-button" onClick={handleActionClick}>
            <Icon name="email" size="10px" color="black" />
          </div>
        )}
      </div>
    </Wrapper>
  );
};
