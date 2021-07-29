import React, { useEffect } from 'react';
import { CustomCellWrapper as Wrapper } from '../../grid/custom-cell/index.styles';
import { Icon } from '@chakra-ui/core';

export const PhoneCell = (props: any) => {
  const handleActionClick = (event: any) => {
    event.stopPropagation();
    props.api.stopEditing();
    window.location.href = `tel:${props.value}`;
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
      <div className="phone-cell" onClick={e => e.stopPropagation()}>
        {props.value}
        {props.value && (
          <div className="icon-button" onClick={handleActionClick}>
            <Icon name="phone" size="10px" color="black" />
          </div>
        )}
      </div>
    </Wrapper>
  );
};
