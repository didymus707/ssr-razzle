import { List, SmartList } from '../../../../lists.types';
import React, { useState } from 'react';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Flex,
  Icon,
  useToast,
} from '@chakra-ui/core';
import { Button, ConfirmModal, ToastBox } from 'app/components';
import { ListTitleEditable } from '../ListTitleEditable';
import { ListSearch } from '../../../../components/search';
import { ListSortMenu } from '../../../../components/sort/sort-menu';
import { ListFilterMenu } from '../../../../components/filter/filter-menu';
import { ListPropertyMenu } from '../../../../components/list-property-menu';
import { useSelector } from 'react-redux';
import { selectInitialListId } from '../../../../lists.selectors';

type Props = {
  list: List;
  smart_list: SmartList;
  list_syncing: boolean;
  rows_loading: boolean;
  columns: any;
  columns_by_id: [];
  updateColumnArrangement: () => {};
  history: any;
  updateListName: (value: string) => {};
  hideColumn: (columnID: string) => {};
  showColumn: (columnID: string) => {};
  updateFilter: (filter_id: string, payload: object) => {};
  deleteFilter: (filter_id: string, payload: object) => {};
  addFilter: () => {};
  filters: {};
  filters_by_id: [];
  sorts: {};
  sorts_by_id: [];
  addSort: () => {};
  deleteSort: (sort_id: string) => {};
  updateSort: (filter_id: string, payload: object) => {};
  deleteList: (list_id: string) => {};
  createSmartList: Function;
  updateSmartList: Function;
  deleteSmartList: Function;
  selectSmartList: Function;
  selectSmartListID: Function;
  updateSmartListFilters: Function;
  clearFilters: Function;
  is_smart_list: boolean;
  search_query: string;
  updateSearchQuery: Function;
  initial_list: string;
  selected_rows: string[];
  openClearRowsDialog: () => void;
  openDeleteRowsDialog: () => void;
};

export const ListHeading = (props: Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const {
    history,
    list,
    smart_list,
    rows_loading,
    columns,
    columns_by_id,
    updateColumnArrangement,
    list_syncing,
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
    selected_rows,
    openClearRowsDialog,
    openDeleteRowsDialog,
  } = props;

  const handleListTitleChange = (value: string) => {
    if (!is_smart_list) updateListName(value);
    else updateSmartList(smart_list.id, { name: value });
  };

  const toast = useToast();

  const handleDeleteList = () => {
    setShowDeleteDialog(false);
    if (is_smart_list) deleteSmartList(smart_list['id']);
    else deleteList(list['id']);
    history.push('/s/lists');
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox
          status="success"
          onClose={onClose}
          message={`${is_smart_list ? smart_list.name : list.name} ${
            is_smart_list ? 'smart list' : 'list'
          } deleted`}
        />
      ),
    });
  };

  const navToList = (list_id: string) => {
    history.push(`/s/lists/view/${list_id}`);
    clearFilters();
  };

  const initialListID = useSelector(selectInitialListId);

  const isInitial = initialListID === list['id'];

  return (
    <>
      <Flex className="list-header">
        <div>
          <Box>
            <Box className="icon-bg" onClick={() => history.goBack()}>
              <Icon name="arrow-back" />
            </Box>
          </Box>

          <ListTitleEditable
            isEditing={false}
            isInitial={isInitial}
            value={is_smart_list ? smart_list['name'] : list['name']}
            onChange={handleListTitleChange}
          />

          {isInitial && (
            <Box
              fontSize="10px"
              color="#32a852"
              textAlign="center"
              alignSelf="center"
              backgroundColor="rgba(50, 168, 82, 0.2)"
              borderRadius="5px"
              padding="2px 5px"
              mt="5px"
              width="fit-content"
              marginX="auto"
            >
              primary
            </Box>
          )}
        </div>
        <div className="toolbar">
          {list_syncing && (
            <Box fontSize="12px" mr="20px">
              Syncing...
            </Box>
          )}
          {rows_loading && (
            <Box fontSize="12px" mr="20px">
              Loading...
            </Box>
          )}
          {!!selected_rows.length && (
            <>
              <Box display="flex" mr="1rem" alignItems="center">
                <Button
                  aria-label="delete"
                  // @ts-ignore
                  mr="10px"
                  size="xs"
                  variant="ghost"
                  variantColor="red"
                  onClick={openClearRowsDialog}
                >
                  Clear {selected_rows.length} row(s)
                </Button>

                <Button
                  aria-label="delete"
                  // @ts-ignore
                  size="xs"
                  variant="solid"
                  variantColor="red"
                  onClick={openDeleteRowsDialog}
                >
                  Delete {selected_rows.length} row(s)
                </Button>
              </Box>
              <Divider orientation="vertical" color="#E0E0E0" height="15px" width="1.5px" />
            </>
          )}

          {is_smart_list && (
            <Breadcrumb
              marginX="5px"
              color="#757575"
              fontSize="13px"
              spacing="8px"
              separator={<Icon color="gray.300" name="chevron-right" />}
            >
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navToList(list.id)}>{list.name}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>{smart_list.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          )}
          {is_smart_list && <Box className="list-badge">SMART LIST</Box>}
          <ListSearch search_query={search_query} updateSearchQuery={updateSearchQuery} />
          <Divider orientation="vertical" color="#E0E0E0" height="15px" width="1.5px" />
          <ListSortMenu
            columns={columns}
            columns_by_id={columns_by_id}
            sorts={sorts}
            sorts_by_id={sorts_by_id}
            addSort={addSort}
            deleteSort={deleteSort}
            updateSort={updateSort}
          />
          <Divider orientation="vertical" color="#E0E0E0" height="15px" width="1.5px" />
          <ListFilterMenu
            columns={columns}
            columns_by_id={columns_by_id}
            addFilter={addFilter}
            updateFilter={updateFilter}
            filters={filters}
            filters_by_id={filters_by_id}
            deleteFilter={deleteFilter}
            createSmartList={createSmartList}
            selectSmartListID={selectSmartListID}
            selectSmartList={selectSmartList}
            updateSmartListFilters={updateSmartListFilters}
            smart_list={smart_list}
            is_smart_list={is_smart_list}
          />
          <Divider orientation="vertical" color="#E0E0E0" height="15px" width="1.5px" />
          <ListPropertyMenu
            columns={columns}
            columns_by_id={columns_by_id}
            updateColumnArrangement={updateColumnArrangement}
            hideColumn={hideColumn}
            showColumn={showColumn}
          />
        </div>
      </Flex>
      <ConfirmModal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title={is_smart_list ? 'Delete smart list' : 'Delete list'}
        description={`We'll move this ${
          smart_list ? 'smart list' : 'list'
        } to your trash for 30days`}
        onConfirm={handleDeleteList}
      />
    </>
  );
};
