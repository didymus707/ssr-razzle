// @ts-nocheck
import React from 'react';
import {
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PseudoBox,
  Text,
  Box,
  List,
  Switch,
  Icon,
} from '@chakra-ui/core';
import { motion } from 'framer-motion';
import { DragHandle } from '../../../components/DragHandle';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { PopoverWrapper } from '../list-view.styles';

const Property = SortableElement((props: any) => {
  const { uid, label, hidden, handleHiddenChange } = props;

  return (
    <PseudoBox
      as="button"
      width="100%"
      display="flex"
      paddingX="1rem"
      paddingY="0.2rem"
      zIndex={100000000}
      alignItems="center"
      _hover={{ bg: 'gray.100' }}
    >
      <Box>
        <DragHandle />
      </Box>
      <Flex paddingLeft="0.5rem" flex={1} justifyContent="space-between">
        <Text fontSize="14px">{label}</Text>
        <Switch
          size="sm"
          aria-label="hidden"
          marginLeft="0.5rem"
          isChecked={!hidden}
          onChange={e => handleHiddenChange(uid, e.target.checked)}
        />
      </Flex>
    </PseudoBox>
  );
});

const PropertyList = SortableContainer(({ properties, onHiddenChange }) => {
  return (
    <Box>
      <List minW={200}>
        {properties.map((i, index) => (
          <Property index={index} handleHiddenChange={onHiddenChange} key={i.id} {...i} />
        ))}
      </List>
    </Box>
  );
});

export const ListPropertyMenu = (props: any) => {
  const { columns, columns_by_id, updateColumnArrangement, hideColumn, showColumn } = props;
  const properties = columns_by_id.map((i: any) => columns[i]);

  const handlePropertyPositionChange = ({ newIndex, oldIndex }) => {
    const new_arrangement = arrayMove(columns_by_id, oldIndex, newIndex);
    if (JSON.stringify(new_arrangement) === JSON.stringify(columns_by_id)) return;
    updateColumnArrangement(new_arrangement);
  };

  const handleHiddenChange = (columnID: string, checked: boolean) => {
    if (checked) showColumn(columnID);
    else hideColumn(columnID);
  };

  return (
    <Popover usePortal placement="bottom">
      <PopoverTrigger>
        <div className="toolbar-item">
          <Icon name="blocks" className="icon" size="16px" />
          Property
        </div>
      </PopoverTrigger>
      <PopoverContent
        zIndex={4}
        width="max-content"
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
            <PropertyList
              properties={properties}
              onSortEnd={handlePropertyPositionChange}
              onHiddenChange={handleHiddenChange}
            />
          </PopoverWrapper>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};
