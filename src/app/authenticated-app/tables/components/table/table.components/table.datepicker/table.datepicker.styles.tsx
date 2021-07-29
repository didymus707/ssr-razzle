import { Box } from '@chakra-ui/core';
import styled from '@emotion/styled';

export const TableDatePickerStyles = styled(Box)`
  width: 100%;
  height: 100%;
  position: relative;

  .DayPicker {
    width: 100%;
  }

  .DayPicker-Month {
    width: 100%;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }

  .DayPicker-NavButton {
    top: 0.8em;
  }

  .DayPicker-Day {
    display: table-cell;
    padding: 0.5em;
    border-radius: 5px;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
    font-size: 0.75rem;
    outline: none;
  }

  .DayPicker,
  .DayPicker-Months,
  .DayPicker-wrapper,
  .DayPicker-NavButton {
    outline: none;
  }

  .DayPicker-Caption {
    font-size: 0.7rem;
  }

  section[id*='popover'] {
    top: -10px !important;
  }
`;
