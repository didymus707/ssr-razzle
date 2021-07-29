import * as React from 'react';
import styled from '@emotion/styled';
import { Icon } from '@chakra-ui/core';
import { SortableHandle } from 'react-sortable-hoc';

const StyledDragHandle = styled.div`
  cursor: move;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

export const DragHandle = SortableHandle(() => (
  <StyledDragHandle>
    <Icon size="0.7rem" name="drag-handle" color="rgba(55, 53, 47, 0.4)" />
  </StyledDragHandle>
));
