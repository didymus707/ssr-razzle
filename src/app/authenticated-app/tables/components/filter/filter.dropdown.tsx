import { Box, Button, Divider, List, Popover, PopoverTrigger, Stack } from '@chakra-ui/core'
import * as React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import { PopoverContentCard } from '../../../../components'
import { FilterItem } from './filter.item'
import { FilterListProps, FiltersDropdownProps } from './filter.types'

export const FilterList = SortableContainer(
  ({ filters, onChange, onRemove, properties }: FilterListProps) => {
    return (
      <Box>
        <List>
          {filters.map((filter, index) => (
            <FilterItem
              index={index}
              filter={filter}
              isFirst={index === 0}
              properties={properties}
              key={`filter-${index}-${filter.name}`}
              onRemove={() => onRemove && onRemove(index)}
              onChange={value => onChange && onChange(value, index)}
            />
          ))}
        </List>
      </Box>
    )
  }
)

export function FiltersDropdown ({
  actions,
  filters,
  children,
  properties,
  openGroupModal,
}: FiltersDropdownProps) {
  return (
    <Popover placement='bottom-end'>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContentCard padding='1rem' title='Filter' maxWidth='30rem'>
        <Box paddingTop='0.5rem'>
          <FilterList
            lockAxis='y'
            useDragHandle
            filters={filters}
            properties={properties}
            onChange={actions.update}
            onRemove={actions.remove}
            onSortEnd={actions.reorder}
          />
          <Button
            size='xs'
            isFullWidth
            variant='ghost'
            textAlign='left'
            leftIcon='small-add'
            onClick={actions.add}
            justifyContent='flex-start'
          >
            Add a filter
          </Button>
        </Box>
        <Divider borderColor='gray.100' />
        <Stack isInline spacing='0.5rem' paddingY='0.5rem'>
          <Button
            size='xs'
            fontWeight='normal'
            variantColor='blue'
            leftIcon='small-add'
            onClick={openGroupModal}
          >
            New group
          </Button>
        </Stack>
      </PopoverContentCard>
    </Popover>
  )
}
