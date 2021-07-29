import { Box, Flex, Stack, useDisclosure, useToast } from '@chakra-ui/core';
import React from 'react';
import { useLoading } from '../../../hooks';
import { ConfirmModal, ContentWrapper, FullPageSpinner, ToastBox } from '../../components';
import {
  GroupFormValues,
  GroupModal,
  GroupSchema,
  ListTable,
  TableNameEditable,
  TableSaving,
} from './components';
import { DEFAULTTABLE } from './tables.data';
import { DataTableSchema, TableComponentProps, TablePropertiesOptions } from './tables.types';
import { getTableInfo } from './tables.utils';
import { TableLoading } from './components/table/table.components/TableLoading';

export function TablesComponent({
  rows,
  user,
  match,
  tables,
  history,
  addGroup,
  removeRow,
  editTable,
  rowsTable,
  fetchRows,
  removeTable,
  fetchGroups,
  fetchGroupRows,
}: TableComponentProps) {
  const LIMIT = 1000;
  const { id: table_id } = match.params;
  const [activeGroup, setActiveGroup] = React.useState<GroupSchema | undefined>();
  const [currentData, setCurrentData] = React.useState<DataTableSchema>(DEFAULTTABLE);
  const [rowToDelete, setRowToDelete] = React.useState<string | null>(null);
  const [rowToView, setRowToView] = React.useState<any | null>(null);
  const isNextPageLoading = false;
  const page = 1;

  const toast = useToast();

  const { isOpen: showGroupModal, onClose: closeGroupModal } = useDisclosure();

  const { dispatch, loading, tableLoading, globalLoading, actionsLoading } = useLoading();

  React.useEffect(() => {
    setActiveGroup(undefined);
  }, [table_id]);

  // Effect to fetch table rows
  React.useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      if (table_id) {
        try {
          dispatch({ type: 'TABLE_LOADING_STARTED' });
          await Promise.all([
            fetchRows({ id: table_id, page, limit: LIMIT }),
            fetchGroups(table_id),
          ]);
          // Ignore if we started fetching something else
          if (!didCancel) {
            dispatch({ type: 'TABLE_LOADING_RESOLVED' });
          }
        } catch (error) {
          dispatch({ type: 'TABLE_LOADING_RESOLVED' });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to set the rows and properties of the activeTable
  React.useEffect(() => {
    if (rowsTable && Object.keys(rowsTable).length) {
      const currentDataPayload = getTableInfo({ rows, table: rowsTable });
      //@ts-ignore
      setCurrentData(currentDataPayload);
    }
  }, [rows, tables, rowsTable]);

  /**
   * Effect to run when user switches between groups
   * and when user switches back to default table
   */
  React.useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      if (activeGroup) {
        const { id } = activeGroup;
        fetchGroupRows({ id });

        try {
          dispatch({ type: 'TABLE_LOADING_STARTED' });
          await fetchGroupRows({ id });
          // Ignore if we started fetching something else
          if (!didCancel) {
            dispatch({ type: 'TABLE_LOADING_RESOLVED' });
          }
        } catch (error) {
          dispatch({ type: 'TABLE_LOADING_RESOLVED' });
        }
      } else {
        try {
          dispatch({ type: 'TABLE_LOADING_STARTED' });
          await fetchRows({ id: table_id, page: 1, limit: LIMIT });
          // Ignore if we started fetching something else
          if (!didCancel) {
            dispatch({ type: 'TABLE_LOADING_RESOLVED' });
          }
        } catch (error) {
          dispatch({ type: 'TABLE_LOADING_RESOLVED' });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [dispatch, activeGroup, fetchRows, fetchGroupRows, table_id]);

  /**
   * Effect to run when user adds new property from row details modal
   */
  React.useEffect(() => {
    if (!!rowToView) {
      const row = currentData.data.find(item => item.id === rowToView.id);
      const rowIndex = currentData.data.findIndex(item => item.id === rowToView.id);
      setRowToView({ ...row, rowIndex });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData]);

  async function handleDeleteTable({
    id,
    callback,
  }: {
    id: TablePropertiesOptions['id'];
    callback: () => void;
  }) {
    try {
      dispatch({ type: 'LOADING_STARTED' });
      await removeTable({ id, user_id: user?.id });
      dispatch({ type: 'LOADING_RESOLVED' });
      callback && callback();
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message="Table deleted" />,
      });
      const remainingTables = tables.filter(table => table.id !== id);
      if (remainingTables.length) {
        const nextTable = remainingTables[0];
        history.push(`/s/lists/view/${nextTable.id}`);
      } else {
        history.push(`/s/home`);
      }
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message={error} />,
      });
    }
  }

  async function handleEditTableName(name: TablePropertiesOptions['name']) {
    const activeTable = tables.find(table => table.id === table_id);
    const payload = { ...activeTable, name } as TablePropertiesOptions;
    setCurrentData({ ...currentData, name });

    try {
      dispatch({ type: 'GLOBAL_LOADING_STARTED' });
      await editTable(payload);
      dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message="Table name updated" />,
      });
    } catch (error) {
      dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  // async function handleEditTable(
  //   payload: Pick<TablePropertiesOptions, 'columns' | 'id' | 'userID'>,
  // ) {
  //   try {
  //     dispatch({ type: 'GLOBAL_LOADING_STARTED' });
  //     await editTable(payload);
  //     dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
  //   } catch (error) {
  //     dispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
  //     toast({
  //       position: 'bottom-left',
  //       render: ({onClose}) => <ToastBox onClose={onClose} message={error} />,
  //     });
  //   }
  // }

  async function handleAddGroup({ name }: GroupFormValues, callback: () => void) {
    const row_id = rows.map(({ id }) => id);

    try {
      dispatch({ type: 'LOADING_STARTED' });
      const { group } = await addGroup({
        name,
        row_id,
        table_id,
      });
      dispatch({ type: 'LOADING_RESOLVED' });
      callback();
      setActiveGroup(group);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message="Group added" />,
      });
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message={error} />,
      });
    }
  }

  async function handleDeleteRow() {
    if (rowToDelete) {
      try {
        dispatch({ type: 'LOADING_STARTED' });
        await removeRow(rowToDelete);
        dispatch({ type: 'LOADING_RESOLVED' });
        setRowToDelete(null);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message="Row deleted" />,
        });
      } catch (error) {
        dispatch({ type: 'LOADING_RESOLVED' });
        toast({
          position: 'bottom-left',
          render: () => <ToastBox message={error} />,
        });
      }
    }
  }

  return (
    <ContentWrapper overflowY="unset" style={{ overscrollBehaviorX: 'none' }}>
      {tableLoading === 'pending' ? (
        <FullPageSpinner height="100vh" />
      ) : (
        <>
          <Box padding="1rem" paddingLeft="4.5rem">
            <Flex marginBottom="1rem" alignItems="center" justifyContent="space-between">
              <Stack isInline alignItems="center">
                <Box>
                  <TableNameEditable
                    tables={tables}
                    onDelete={handleDeleteTable}
                    onChange={handleEditTableName}
                    isLoading={loading === 'pending'}
                    sheet={{
                      id: currentData?.id,
                      name: currentData?.name,
                      type: currentData?.type,
                    }}
                  />
                </Box>
                {globalLoading === 'pending' && (
                  <Box>
                    <TableSaving />
                  </Box>
                )}
                {isNextPageLoading && (
                  <Box>
                    <TableLoading />
                  </Box>
                )}
              </Stack>
            </Flex>
          </Box>
          {actionsLoading === 'pending' ? (
            <FullPageSpinner height="50vh" />
          ) : (
            <ListTable _rows={rows} _columns={currentData.properties} />
          )}
          <GroupModal
            title="Create group"
            isOpen={showGroupModal}
            onSubmit={handleAddGroup}
            onClose={closeGroupModal}
            isLoading={loading === 'pending'}
          />
          <ConfirmModal
            title="Delete row"
            isOpen={!!rowToDelete}
            onConfirm={handleDeleteRow}
            isLoading={loading === 'pending'}
            onClose={() => setRowToDelete(null)}
          />
        </>
      )}
    </ContentWrapper>
  );
}
