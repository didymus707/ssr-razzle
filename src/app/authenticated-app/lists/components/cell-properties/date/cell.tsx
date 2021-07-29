import React from 'react';
import { CustomCellWrapper as Wrapper } from '../../grid/custom-cell/index.styles';
import { parseDate } from '../../../lists.utils';
import { calendarOutputFormat } from '../../../list.data';

export const DateCell = (props: any) => {
  const column = props._column;

  const date_format = column?.customization?.date_format || 'D/MM/YYYY';
  const time_format = column?.customization?.time_format || 'h:mm A';
  const include_time = column?.customization?.include_time || false;

  const value = parseDate(props.value);

  let formatted_date =
    date_format !== 'relative'
      ? value.format(date_format)
      : value.calendar(null, calendarOutputFormat);

  if (include_time) {
    if (date_format === 'relative') formatted_date += ' at';
    formatted_date += ` ${value.format(time_format)}`;
  }

  return (
    <Wrapper onClick={e => e.stopPropagation()}>
      <div className="email-cell" onClick={e => e.stopPropagation()}>
        {props.value && value.isValid() && formatted_date}
      </div>
    </Wrapper>
  );
};
