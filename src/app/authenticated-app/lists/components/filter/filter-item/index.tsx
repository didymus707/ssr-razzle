// @ts-nocheck
import React from 'react';
import { Box, Icon } from '@chakra-ui/core';
import { ColumnSelect } from './column-select';
import { OperatorSelect } from './operator-select';
import { ValueInput } from './value-input';
import { ConjunctionSelect } from './conjunction-select';
import { SubOperatorSelect } from './suboperator-select';

export const FilterItem = (props: any) => {
  const {
    index,
    columns,
    columns_by_id,
    columnID,
    updateFilter,
    uid: filter_id,
    operator: selected_operator,
    value,
    deleteFilter,
    conjunction: selected_conjunction,
    subOperator,
    allow_conjunction_select,
    debounceUpdate = true,
  } = props;

  const handleColumnChange = (columnID: string) => {
    updateFilter(filter_id, { columnID: columnID });
  };

  const handleOperatorChange = (operator: string) => {
    updateFilter(filter_id, { operator });
  };

  const handleValueChange = (value: string) => {
    updateFilter(filter_id, { value });
  };

  const handleConjunctionChange = (conjunction: string) => {
    updateFilter(filter_id, { conjunction });
  };

  const handleSubOperatorChange = (_subOperator: string) => {
    updateFilter(filter_id, { subOperator: _subOperator });
  };

  const column = columns[columnID];

  return (
    <Box className="filter-item" justifyContent="space-between">
      {allow_conjunction_select ? (
        <ConjunctionSelect
          {...{
            selected_conjunction,
            onChange: handleConjunctionChange,
            allow_select: index === 1,
          }}
        />
      ) : (
        <div className="conjunction">Where</div>
      )}

      <ColumnSelect
        {...{
          selected_column: columnID,
          columns,
          columns_by_id,
          onChange: handleColumnChange,
        }}
      />
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        maxWidth="205px"
      >
        <OperatorSelect
          {...{
            selected_operator,
            onChange: handleOperatorChange,
            column,
          }}
        />
        {column['type'] === 'DATE' && (
          <SubOperatorSelect
            operator={selected_operator}
            onChange={handleSubOperatorChange}
            subOperator={subOperator}
          />
        )}
      </Box>

      <ValueInput
        column={columns[columnID]}
        selected_operator={selected_operator}
        subOperator={subOperator}
        value={value}
        onChange={handleValueChange}
        debounceUpdate={debounceUpdate}
      />

      <Box className="icon-menu">
        <Icon name="trash" onClick={() => deleteFilter(filter_id)} />
      </Box>
    </Box>
  );
};
