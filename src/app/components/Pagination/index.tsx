import React from 'react';
import { Box, Button, IconButton } from '@chakra-ui/core';
import { range } from 'lodash';

interface Props {
  page: number;
  total: number;
  pageSize: number;
  onNext: Function;
  onPrev: Function;
  onGoTo: Function;
}

export const Pagination = ({ page = 1, total, pageSize = 10, onNext, onPrev, onGoTo }: Props) => {
  const totalPages = Math.ceil(total / pageSize);
  const items = range(1, totalPages + 1);

  return (
    <Box width="100%" display="flex" justifyContent="center">
      <Box justifySelf="center" display="flex" justifyContent="space-between" alignItems="center">
        <IconButton
          aria-label="Previous"
          icon="arrow-back"
          marginRight="1rem"
          size="sm"
          variantColor="blue"
          variant="ghost"
          // @ts-ignore
          onClick={onPrev}
          isDisabled={page === 1}
        />
        {items.map(i => (
          <Button
            key={i}
            size="sm"
            marginX="2px"
            variantColor="blue"
            onClick={() => onGoTo(i)}
            variant={page === i ? 'solid' : 'ghost'}
          >
            {i}
          </Button>
        ))}
        <IconButton
          aria-label="Next"
          marginLeft="1rem"
          size="sm"
          icon="arrow-forward"
          variantColor="blue"
          variant="ghost"
          // @ts-ignore
          onClick={onNext}
          isDisabled={page === totalPages}
        />
      </Box>
    </Box>
  );
};
