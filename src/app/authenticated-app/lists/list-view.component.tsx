import React, { useEffect } from 'react';
import { ContentWrapper } from '../../components/Dashboard/components';
import { Wrapper } from './list-view.styles';
import { Spinner, Box } from '@chakra-ui/core';
import { ListGrid } from './components/grid';

export const ListViewComponent = (props: any) => {
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
    <ContentWrapper style={{ overscrollBehaviorX: 'none' }}>
      <Wrapper>
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
  );
};
