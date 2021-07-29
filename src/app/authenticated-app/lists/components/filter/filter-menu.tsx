import React, { useState } from 'react';
import {
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Box,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PopoverWrapper } from '../../list-view.styles';
import { ListFilterEmptyState } from './filter-empty-state';
import { ListFilterContent } from './filter-content';
import { CreateSmartListDialog } from './create-smart-list-dialog';
import { ToastBox, Button } from '../../../../components';

interface ListFilterActionsProps {
  filters_by_id: string[];
  filters: { [key: string]: any };
  addFilter: Function;
  openSmartListDialog: Function;
  updateSmartListFilters: Function;
  is_smart_list: boolean;
}

const ListFilterActions = (props: ListFilterActionsProps) => (
  <>
    <Box display="flex" alignItems="center">
      <button className="add-button" onClick={() => props.addFilter()}>
        <Icon name="plus-square-filled" className="icon" size="16px" />
        Add a filter
      </button>
    </Box>
    {props.filters_by_id.length > 0 && (
      <Button
        marginTop="23px"
        color="white"
        backgroundColor="#3D43DF"
        variantColor="blue"
        fontSize="14px"
        fontWeight="500"
        padding="4px 10px"
        onClick={() => {
          if (!props.is_smart_list) props.openSmartListDialog();
          else props.updateSmartListFilters();
        }}
      >
        {props.is_smart_list ? 'Update smart list' : 'Create smart list'}
      </Button>
    )}
  </>
);

export const ListFilterMenu = (props: any) => {
  const [smartListDialogLoading, setSmartListDialogLoading] = useState<boolean>(false);
  const {
    isOpen: isSmartListDialogOpen,
    onClose: closeSmartListDialog,
    onOpen: openSmartListDialog,
  } = useDisclosure();

  const {
    columns,
    columns_by_id,
    filters_by_id,
    filters,
    addFilter,
    updateFilter,
    deleteFilter,
    is_smart_list,
    updateSmartListFilters,
  } = props;

  const toast = useToast();

  const router_history = useHistory();

  const handleCreateSmartList = async (smart_list_name: string) => {
    setSmartListDialogLoading(true);
    const smart_list = await props.createSmartList(
      smart_list_name.length > 0 ? smart_list_name : 'Untitled',
    );
    setSmartListDialogLoading(false);
    if (!smart_list) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Couldn't create smart list, please try again" />
        ),
      });
    } else {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Smart list created" />
        ),
      });
      closeSmartListDialog();
      props.selectSmartListID(smart_list.id);
      router_history.push(`/s/lists/view/${smart_list.id}/smart`);
    }
  };

  const handleUpdateSmartListFilters = () => {
    updateSmartListFilters(props.smart_list.id);
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox status="success" onClose={onClose} message="Smart list filters updated" />
      ),
    });
  };

  return (
    <>
      <Popover usePortal placement="bottom">
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <Box>
                {filters_by_id.length === 0 && (
                  <Button
                    size="xs"
                    // @ts-ignore
                    leftIcon="filter"
                    variant="ghost"
                    color="#4f4f4f"
                    fontWeight="400"
                  >
                    Filter
                  </Button>
                )}
                {filters_by_id.length > 0 && (
                  <Button
                    size="xs"
                    // @ts-ignore
                    leftIcon="filter"
                    variant="solid"
                    color="#4f4f4f"
                    backgroundColor="#c3f7c3"
                    fontWeight="500"
                  >
                    {filters_by_id.length} filter(s)
                  </Button>
                )}
              </Box>
            </PopoverTrigger>
            <PopoverContent
              zIndex={4}
              minWidth={filters_by_id.length > 0 ? '725px' : '400px'}
              boxShadow="none"
              _focus={{
                boxShadow: 'none',
                outline: 'none',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scaleY: 0.5, y: -50 }}
                animate={{ opacity: 1, scaleY: 1, y: 0 }}
                transition={{ type: 'spring', duration: 0.005, stiffness: 460, damping: 30 }}
              >
                <PopoverWrapper>
                  <div className="filter-container">
                    <div className="title">FILTERS</div>
                    {filters_by_id.length === 0 && <ListFilterEmptyState />}
                    <ListFilterContent
                      {...{
                        filters_by_id,
                        filters,
                        columns,
                        columns_by_id,
                        updateFilter,
                        deleteFilter,
                      }}
                    />
                    <ListFilterActions
                      {...{
                        filters_by_id,
                        filters,
                        addFilter,
                        openSmartListDialog,
                        updateSmartListFilters: () => {
                          handleUpdateSmartListFilters();
                          if (onClose) onClose();
                        },
                        smart_list: props.smart_list,
                        is_smart_list,
                      }}
                    />
                  </div>
                </PopoverWrapper>
              </motion.div>
            </PopoverContent>
          </>
        )}
      </Popover>

      <CreateSmartListDialog
        isOpen={isSmartListDialogOpen}
        isLoading={smartListDialogLoading}
        close={closeSmartListDialog}
        onConfirm={handleCreateSmartList}
      />
    </>
  );
};
