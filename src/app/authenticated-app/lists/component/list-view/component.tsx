import React, { useEffect } from 'react';
import { Box, Spinner, useDisclosure, useToast } from '@chakra-ui/core/dist';
import { ConfirmModal, ContentWrapper, ToastBox } from '../../../../components';
import { ListViewStyles as Wrapper } from './component.styles';
import { ListHeading } from './components';
import { ListGrid } from '../../components';

export const Component = (props: any) => {
  const {
    selected_list,
    rows_loading,
    lists_fetched,
    selectList,
    fetchRows,
    lists,
    rows,
    columns,
    rows_by_id,
    columns_by_id,
    column_id_map,
    meta,
    updateColumnArrangement,
    updateRowCell,
    list_syncing,
    createColumn,
    createRow,
    selectRows,
    clearRows,
    deleteRows,
    updateListName,
    deleteColumn,
    hideColumn,
    showColumn,
    updateColumnLabel,
    updateColumnType,
    addFilter,
    filters,
    filters_by_id,
    updateFilter,
    deleteFilter,
    sorts,
    sorts_by_id,
    addSort,
    deleteSort,
    updateSort,
    deleteList,
    addSelectOption,
    getRowByIndex,
    updateSelectOption,
    selected_rows,
    updateColumnCustomization,
    updateColumn,
    createSmartList,
    smart_lists,
    is_smart_list,
    selected_smart_list,
    smart_lists_fetched,
    selectSmartList,
    updateSmartList,
    deleteSmartList,
    selectSmartListID,
    updateSmartListFilters,
    clearFilters,
    search_query,
    updateSearchQuery,
    initial_list,
    openNoSubscriptionModal,
    enrichColumnData,
  } = props;

  useEffect(() => {
    if (!is_smart_list) {
      const {
        match: { params },
        history,
      } = props;
      const list_id: string = params.id;
      if (!props.lists[list_id] && lists_fetched) history.push('/s/lists');
      else if (props.lists[list_id]) selectList(list_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (is_smart_list) {
      const {
        match: { params },
        history,
      } = props;
      const smart_list_id: string = params.id;
      if (!props.smart_lists[smart_list_id] && smart_lists_fetched) history.push('/s/lists');
      else if (props.smart_lists[smart_list_id]) selectSmartList(smart_list_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    attachDisableScrollListener();
    return detachDisableScrollListener;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const attachDisableScrollListener = () => {
    // @ts-ignore
    document.body.style.overscrollBehaviorX = 'none';
  };

  const detachDisableScrollListener = () => {
    // @ts-ignore
    document.body.style.overscrollBehaviorX = 'initial';
  };

  const {
    isOpen: clearRowsDialogOpen,
    onClose: closeClearRowsDialog,
    onOpen: openClearRowsDialog,
  } = useDisclosure();

  const {
    isOpen: deleteRowsDialogOpen,
    onClose: closeDeleteRowsDialog,
    onOpen: openDeleteRowsDialog,
  } = useDisclosure();

  const toast = useToast();

  const handleClearRows = () => {
    props.clearRows();
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox onClose={onClose} status="success" message="Rows cleared successfully" />
      ),
    });
    closeClearRowsDialog();
  };

  const handleDeleteRows = () => {
    props.deleteRows();
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox onClose={onClose} status="success" message="Rows deleted successfully" />
      ),
    });
    closeDeleteRowsDialog();
  };

  if (!selected_list && !selected_smart_list) {
    return (
      <ContentWrapper paddingBottom="8rem">
        <Box display="flex" height="100vh">
          <Spinner margin="auto" />
        </Box>
      </ContentWrapper>
    );
  }

  const list = lists[selected_list];
  const smart_list = smart_lists[selected_smart_list];

  return (
    <>
      <ContentWrapper style={{ overscrollBehaviorX: 'none' }}>
        <Wrapper>
          <ListHeading
            {...{
              columns,
              columns_by_id,
              rows_loading,
              list,
              smart_list,
              updateColumnArrangement,
              list_syncing,
              history: props.history,
              updateListName,
              hideColumn,
              showColumn,
              addFilter,
              filters,
              filters_by_id,
              updateFilter,
              deleteFilter,
              sorts,
              sorts_by_id,
              addSort,
              deleteSort,
              updateSort,
              deleteList,
              createSmartList,
              updateSmartList,
              deleteSmartList,
              selectSmartList,
              selectSmartListID,
              updateSmartListFilters,
              clearFilters,
              is_smart_list,
              search_query,
              updateSearchQuery,
              initial_list,
              selected_rows,
              openClearRowsDialog,
              openDeleteRowsDialog,
            }}
          />
          <Box className="list-content">
            <ListGrid
              {...{
                meta,
                rows,
                columns,
                rows_by_id,
                columns_by_id,
                column_id_map,
                rows_loading,
                fetchRows,
                updateRowCell,
                list,
                updateColumnArrangement,
                createColumn,
                createRow,
                selectRows,
                clearRows,
                deleteRows,
                deleteColumn,
                hideColumn,
                updateColumnLabel,
                updateColumnType,
                addSelectOption,
                getRowByIndex,
                updateSelectOption,
                selected_rows,
                updateColumnCustomization,
                updateColumn,
                is_smart_list,
                search_query,
                filters,
                filters_by_id,
                sorts,
                sorts_by_id,
                openNoSubscriptionModal,
                enrichColumnData,
              }}
            />
          </Box>
        </Wrapper>
      </ContentWrapper>
      <ConfirmModal
        isOpen={clearRowsDialogOpen}
        onClose={closeClearRowsDialog}
        title="Clear rows"
        description="All cells currently occupied by the selected rows would be completely emptied"
        onConfirm={handleClearRows}
      />
      <ConfirmModal
        isOpen={deleteRowsDialogOpen}
        onClose={closeDeleteRowsDialog}
        title="Delete rows"
        description="All selected rows would be permanently deleted"
        onConfirm={handleDeleteRows}
      />
    </>
  );
};
