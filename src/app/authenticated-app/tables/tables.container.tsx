import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../../root";
import {
  addRow,
  editRow,
  addTable,
  addGroup,
  editGroup,
  fetchRows,
  editTable,
  removeRow,
  fetchGroups,
  removeGroup,
  removeTable,
  sortRowsData,
  importRowsCSV,
  searchRowsData,
  filterRowsData,
  fetchGroupRows,
  importRowsMapping,
} from "./tables.reducer";
import { TableContainerProps } from "./tables.types";
import { TablesComponent } from "./tables.ui";

const mapState = (state: RootState) => ({
  rows: state.rows.rows,
  user: state.auth.user,
  tables: state.tables.tables,
  groups: state.groups.groups,
  rowsTable: state.rows.table,
  importedData: state.tables.importedData,
});

export const stateConnector = connect(mapState, {
  addRow,
  editRow,
  addGroup,
  addTable,
  editGroup,
  editTable,
  fetchRows,
  removeRow,
  removeGroup,
  removeTable,
  fetchGroups,
  sortRowsData,
  importRowsCSV,
  fetchGroupRows,
  searchRowsData,
  filterRowsData,
  importRowsMapping,
});

export function TablesContainer(props: TableContainerProps) {
  return <TablesComponent {...props} />;
}

export const Tables = stateConnector(TablesContainer);
