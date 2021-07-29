import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Box, Checkbox, Icon } from '@chakra-ui/core';
import { RootState } from '../../../../../root';
import { connect } from 'react-redux';

const getRowElement = (row_id: string) => {
  const target = document.querySelectorAll(`[row-id="${row_id}"]`);
  return target[1];
};

const mapStateToProps = (state: RootState) => ({
  selected_rows: state.lists.selected_rows,
  row_count: state.lists.rows_by_id.length,
});

const connector = connect(mapStateToProps, {}, null, { forwardRef: true });

const Container = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({}));
  return <Component {...props} />;
});

const Component = (props: any) => {
  const [checkboxShown, setCheckboxShown] = useState(false);

  const { node, openRow } = props;
  const selected = props.selected_rows.includes(props.node.id);

  const handleChange = () => {
    if (selected) props.selectRows(props.selected_rows.filter((i: string) => i !== node.id));
    else props.selectRows([...props.selected_rows, node.id]);
  };

  const showCheckBox = () => setCheckboxShown(true);

  const hideCheckBox = () => setCheckboxShown(false);

  const attachRowOnHoverListener = () => {
    const target = getRowElement(props.node.id);
    if (target) target.addEventListener('mouseenter', showCheckBox);
  };
  const detachRowOnHoverListener = () => {
    const target = getRowElement(props.node.id);
    if (target) target.addEventListener('mouseenter', showCheckBox);
  };

  const attachRowNoHoverListener = () => {
    const target = getRowElement(props.node.id);
    if (target) target.addEventListener('mouseleave', hideCheckBox);
  };
  const detachRowNoHoverListener = () => {
    const target = getRowElement(props.node.id);
    if (target) target.addEventListener('mouseleave', hideCheckBox);
  };

  const handleExpandClicked = () => {
    openRow(node.rowIndex);
  };

  useEffect(() => {
    attachRowOnHoverListener();
    return detachRowOnHoverListener;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    attachRowNoHoverListener();
    return detachRowNoHoverListener;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box className="row-select-cell" display="flex" flexDirection="row" alignItems="center">
        <Checkbox
          border="1px solid #8c8c8c !important"
          borderRadius="3px"
          boxShadow="none"
          isChecked={selected}
          size="sm"
          onChange={handleChange}
          marginTop="15px"
          className="row-select-checkbox"
          style={{
            display: (selected || checkboxShown) && 'flex',
          }}
        />
        <Icon
          marginTop="16px"
          marginLeft="20px"
          position="absolute"
          size="14px"
          name="expand"
          className="row-expand-btn"
          cursor="pointer"
          style={{
            display: (selected || checkboxShown) && 'flex',
          }}
          borderRadius="6px"
          onClick={handleExpandClicked}
        />
        <Box
          color="#8c8c8c"
          fontWeight="500"
          fontSize="12px"
          className="row-select-index"
          style={{
            display: (selected || checkboxShown) && 'none',
          }}
        >
          {node.rowIndex + 1}
        </Box>
      </Box>
    </>
  );
};

export const RowSelectCell = connector(Container);
