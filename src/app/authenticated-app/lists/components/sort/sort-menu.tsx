import React from 'react';
import { Icon, Popover, PopoverContent, PopoverTrigger, Box } from '@chakra-ui/core';
import { motion } from 'framer-motion';
import { PopoverWrapper } from '../../list-view.styles';
import { ListSortEmptyState } from './sort-empty-state';
import { ListSortContent } from './sort-content';
import { Button } from 'app/components';

export const ListSortMenu = (props: any) => {
  const { sorts, sorts_by_id, columns, columns_by_id, addSort, updateSort, deleteSort } = props;

  const sorted_columns: any = Object.values(sorts).reduce((acc: string[], i: any) => {
    if (acc.includes(i.columnID)) return acc;
    return [...acc, i.columnID];
  }, []);

  const addButtonDisabled = (sorted_columns).length === columns_by_id.length;

  return (
    <Popover usePortal placement="bottom">
      <PopoverTrigger>
        <Box>
          {sorts_by_id.length === 0 && (
            <Button
              size="xs"
              // @ts-ignore
              leftIcon="sort"
              variant="ghost"
              color="#4f4f4f"
              fontWeight="400"
            >
              Sort
            </Button>
          )}
          {sorts_by_id.length > 0 && (
            <Button
              size="xs"
              // @ts-ignore
              leftIcon="sort"
              variant="solid"
              color="#4f4f4f"
              backgroundColor="#ffbeb3"
              fontWeight="500"
            >
              Sorted by {sorts_by_id.length} field(s)
            </Button>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent
        zIndex={4}
        width="max-content"
        minWidth="400px"
        boxShadow="none"
        _focus={{
          boxShadow: 'none',
          outline: 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scaleY: 0.5, y: -50 }}
          animate={{ opacity: 1, scaleY: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.005, stiffness: 460, damping: 30 }}
        >
          <PopoverWrapper>
            <div className="sort-container">
              <div className="title">SORTS</div>
              {sorts_by_id.length === 0 && <ListSortEmptyState />}
              <ListSortContent
                {...{
                  sorts,
                  sorts_by_id,
                  columns,
                  columns_by_id,
                  updateSort,
                  deleteSort,
                  sorted_columns,
                }}
              />
              <Box display="flex" alignItems="center">
                <button
                  className={`add-button ${addButtonDisabled && 'disabled'}`}
                  onClick={() => {
                    if (!addButtonDisabled) addSort();
                  }}
                >
                  <Icon name="plus-square-filled" className="icon" size="16px" />
                  Add a sort
                </button>
              </Box>
            </div>
          </PopoverWrapper>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};
