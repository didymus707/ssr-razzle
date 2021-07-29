import React from 'react';
import { CustomCellWrapper as Wrapper } from '../../grid/custom-cell/index.styles';
import { Icon } from '@chakra-ui/core';

export const URLCell = (props: any) => {
  const handleActionClick = (event: any) => {
    event.stopPropagation();
    props.api.stopEditing();
    let url = props.value;
    if (!url.match(/^https?:\/\//i)) url = 'http://' + url;
    return window.open(url, '_blank');
  };

  return (
    <Wrapper onClick={e => e.stopPropagation()}>
      <div className="url-cell" onClick={e => e.stopPropagation()}>
        {props.value}
        {props.value && (
          <div className="icon-button" onClick={handleActionClick}>
            <Icon name="link" size="10px" color="black" />
          </div>
        )}
      </div>
    </Wrapper>
  );
};
