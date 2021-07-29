import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../../root';
import { RecordModalComponent } from './index.component';
import {
  updateRowCell,
  updateSelectOption,
  addSelectOption,
  createColumn,
  deleteColumn,
  updateColumnCustomization,
  updateColumnLabel,
  updateColumnType,
  hideColumn,
  updateColumn,
  selectRows,
  deleteRows,
} from '../../lists.thunks';

const mapStateToProps = (state: RootState) => ({
  columns: state.lists.columns,
  columns_by_id: state.lists.columns_by_id,
  row_count: state.lists.rows_by_id.length,
});

const connector = connect(mapStateToProps, {
  updateRowCell,
  updateSelectOption,
  addSelectOption,
  createColumn,
  deleteColumn,
  updateColumnCustomization,
  updateColumnLabel,
  updateColumnType,
  hideColumn,
  updateColumn,
  selectRows,
  deleteRows,
});

const Container = (props: any) => {
  return <RecordModalComponent {...props} />;
};

export const RecordModal = connector(Container);
