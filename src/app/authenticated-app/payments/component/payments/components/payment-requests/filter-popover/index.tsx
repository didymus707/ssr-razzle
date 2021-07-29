import React, { useState } from 'react';
import { Button, Select } from 'app/components';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from '@chakra-ui/core';
import { Box, Divider, useDisclosure } from '@chakra-ui/core/dist';
import { DateFieldComponent } from '../../../../../../lists/components/cell-properties';
import moment from 'moment';

interface Props {
  filterActive: boolean;
  handleDateRangeChange: Function;
}

export const FilterPopover = (props: Props) => {
  const [selectedOption, setSelectedOption] = useState('all');
  const [tempValue, setTempValue] = useState({
    value: null,
    from: null,
    to: null,
  });

  const { isOpen, onClose, onOpen } = useDisclosure();

  const inputProps = {
    size: 'sm',
    height: '30px',
  };

  const handleReset = () => {
    setSelectedOption('all');
    setTempValue({
      value: null,
      from: null,
      to: null,
    });
    props.handleDateRangeChange({ from: null, to: null, on: null });
    onClose();
  };

  const dateFormat = 'YYYY-MM-DD';

  const applyFilter = () => {
    if (selectedOption === 'all') {
      props.handleDateRangeChange({ from: null, to: null });
    } else if (selectedOption === 'today') {
      const date = moment().format('YYYY-MM-DD');
      props.handleDateRangeChange({ on: date });
    } else if (selectedOption === 'day') {
      let date = null;
      if (tempValue.value) date = moment(tempValue.value).format(dateFormat);
      props.handleDateRangeChange({ on: date });
    } else if (selectedOption === 'range') {
      let from = null;
      if (tempValue.from) from = moment(tempValue.from).format(dateFormat);
      let to = null;
      if (tempValue.to) to = moment(tempValue.to).format(dateFormat);
      props.handleDateRangeChange({ from, to });
    }
    onClose();
  };

  return (
    <>
      <Popover {...{ isOpen, onClose, onOpen, closeOnBlur: true, closeOnEsc: true }}>
        <PopoverTrigger>
          <Button
            variant="ghost"
            color={props.filterActive ? 'green' : '#4f4f4f'}
            fontWeight="500"
            size="xs"
            backgroundColor={props.filterActive ? '#c3f7c3' : 'inherit'}
            // @ts-ignore
            leftIcon="filter"
          >
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent zIndex={4} width="250px">
          <PopoverArrow />
          <PopoverBody display="flex" flexDirection="column" padding="1rem 0.75rem">
            <Box mb="0.5rem">
              <Box fontSize="12px" fontWeight="500" mb="0.5rem">
                Date Period
              </Box>
              <Select
                label=""
                size="sm"
                height="30px"
                onChange={event => {
                  setTempValue({
                    value: null,
                    from: null,
                    to: null,
                  });
                  setSelectedOption(event.target.value);
                }}
                value={selectedOption}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="day">Specific day</option>
                <option value="range">Date range</option>
              </Select>
            </Box>

            {selectedOption === 'day' && (
              <Box my="0.5rem">
                <Box fontSize="12px" fontWeight="500" mb="0.5rem">
                  Choose a day
                </Box>

                <DateFieldComponent
                  value={tempValue.value}
                  inputProps={{ ...inputProps }}
                  updateCellValue={(value: any) => setTempValue({ value, from: null, to: null })}
                />
              </Box>
            )}

            {selectedOption === 'range' && (
              <Box my="0.5rem">
                <Box fontSize="12px" fontWeight="500" mb="0.5rem">
                  Choose range
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <DateFieldComponent
                    value={tempValue.from}
                    inputProps={{ ...inputProps, width: '97.5%', placeholder: 'From' }}
                    updateCellValue={(value: any) => setTempValue({ ...tempValue, from: value })}
                  />
                  <DateFieldComponent
                    value={tempValue.to}
                    inputProps={{ ...inputProps, width: '97.5%', placeholder: 'To' }}
                    updateCellValue={(value: any) => setTempValue({ ...tempValue, to: value })}
                  />
                </Box>
              </Box>
            )}

            <Divider width="100%" my="1rem" />
            <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
              <Button size="sm" variant="outline" fontWeight="500" onClick={handleReset}>
                Reset
              </Button>
              <Button
                size="sm"
                variant="solid"
                variantColor="green"
                fontWeight="500"
                onClick={applyFilter}
              >
                Filter
              </Button>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
