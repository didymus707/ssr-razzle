import React, { useEffect } from 'react';
import { Box, Icon } from '@chakra-ui/core';

export const Header = (props: any) => {
  const {
    column: { colId },
    handleColumnClick,
    icon,
    setActiveColumn,
  } = props;

  const disableContextMenu = (event: Event) => {
    event.preventDefault();
    // event.stopPropagation();
    return false;
  };

  const attachColumnClickListener = () => {
    const column_header_element = document.querySelectorAll(`[col-id="${colId}"]`)[0];
    if (!column_header_element) return;
    column_header_element.addEventListener('contextmenu', disableContextMenu);
    column_header_element.addEventListener('mousedown', handleColumnClick);
  };

  const detachColumnClickListener = () => {
    const column_header_element = document.querySelectorAll(`[col-id="${colId}"]`)[0];
    if (!column_header_element) return;
    column_header_element.removeEventListener('contextmenu', disableContextMenu);
    column_header_element.removeEventListener('mousedown', handleColumnClick);
  };

  useEffect(() => {
    attachColumnClickListener();
    return detachColumnClickListener;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="row"
      fontSize="14px"
      alignItems="center"
      fontWeight="500"
      color="#8c8c8c"
      overflow="hidden"
      whiteSpace="nowrap"
      onContextMenu={event => {
        event.preventDefault();
        setActiveColumn(colId);
        return false;
      }}
    >
      <Icon name={icon} size="12px" marginRight="5px" color="#8c8c8c" />
      {props.displayName}
    </Box>
  );
};
