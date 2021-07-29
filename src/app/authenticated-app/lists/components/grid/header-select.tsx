import React, { forwardRef, useImperativeHandle } from 'react';
import { Checkbox } from '@chakra-ui/core';
import { RootState } from '../../../../../root';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState) => ({
  selected_rows: state.lists.selected_rows,
  rows_by_id: state.lists.rows_by_id,
});

const connector = connect(mapStateToProps, {}, null, { forwardRef: true });

const Container = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({}));
  return <Component {...props} />;
});

export const Component = (props: any) => {
  const { rows_by_id, selected_rows } = props;

  const isChecked = rows_by_id.length > 0 && selected_rows.length === rows_by_id.length;
  const isIndeterminate = selected_rows.length > 0 && selected_rows.length !== rows_by_id.length;
  const isDisabled = rows_by_id.length === 0;

  const handleChange = () => {
    if (isChecked) props.selectRows([]);
    if (!isChecked) props.selectRows(rows_by_id, 'id');
  };

  return (
    <div id="col_select">
      <Checkbox
        size="sm"
        border="1px solid #8c8c8c !important"
        borderRadius="3px"
        boxShadow="none"
        isChecked={isChecked}
        isIndeterminate={isIndeterminate}
        isDisabled={isDisabled}
        onChange={handleChange}
      />
    </div>
  );
};

export const HeaderSelect = connector(Container);
