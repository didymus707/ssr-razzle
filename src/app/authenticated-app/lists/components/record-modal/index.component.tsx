// @ts-nocheck
import React, { useRef, useState } from 'react';
import {
  Modal,
  Box,
  ModalOverlay,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import { useReactToPrint } from 'react-to-print';
import { RecordModalWrapper as Wrapper } from './index.styles';
import { getColumnHeaderIcon, getFieldRenderer } from '../../lists.utils';
import { GridColumnMenu } from '../grid/column-menu';
import { ToastBox, Button } from 'app/components';
import { ModalCloseButton } from '@chakra-ui/core/dist';

interface FieldProps {
  value: any;
  column: any;
  updateCellValue: Function;
  updateSelectOption: Function;
}

export const Field = (props: FieldProps) => {
  const FieldComponent = getFieldRenderer(props.column.type);
  return <FieldComponent {...props} />;
};

const Header = (props: any) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [triggerPosition, setTriggerPosition] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  const { column } = props;
  const triggerRef = useRef(null);

  const handleTriggerPressed = () => {
    const rect = triggerRef.current.getBoundingClientRect();
    setTriggerPosition({ ...rect, top: rect.top - 20, bottom: rect.bottom - 20 });
    onOpen();
  };

  const handleClose = () => {
    onClose();
  };

  const handleUpdateLabel = (columnID: string, label: string) => {
    props.updateColumnLabel(columnID, label);
  };

  const handleUpdateType = (columnID: string, type: string) => {
    props.updateColumnType(columnID, type);
  };

  const handleDelete = (columnID: string) => {
    handleClose();
    props.deleteColumn(columnID);
  };

  const handleHide = (columnID: string) => {
    handleClose();
    props.hideColumn(columnID);
  };
  const handleUpdate = (columnID: string, payload: {}) => {
    props.updateColumn(columnID, payload);
  };

  return (
    <>
      <Box className="label" display="flex" flexDirection="row" alignItems="center">
        <Icon className="icon" name={getColumnHeaderIcon(column.type)} size="14px" />
        <Box className="column-name">{column.label}</Box>
        <IconButton
          ref={triggerRef}
          mx="15px"
          className="icon"
          icon="chevron-down"
          size="12px"
          onClick={handleTriggerPressed}
        />
      </Box>
      <GridColumnMenu
        parent_type="field"
        column={column}
        columns={props.columns}
        isOpen={isOpen}
        close={handleClose}
        columnID={column.uid}
        field_position={triggerPosition}
        deleteColumn={handleDelete}
        hideColumn={handleHide}
        updateLabel={handleUpdateLabel}
        updateType={handleUpdateType}
        updateColumn={handleUpdate}
        updateCustomization={props.updateColumnCustomization}
      />
    </>
  );
};

export const RecordModalComponent = (props: any) => {
  const modalRef = useRef();
  const {
    isOpen,
    onClose,
    node: { data, rowIndex },
    row_count,
    createColumn,
    deleteColumn,
    updateColumnCustomization,
    updateColumnLabel,
    updateColumnType,
    updateColumn,
    hideColumn,
    selectRows,
    deleteRows,
  } = props;

  const toast = useToast();

  const { updateSelectOption, addSelectOption } = props;

  const title_column = props.columns_by_id[0];

  const columns = props.columns_by_id.map((col_id: string) => props.columns[col_id]);

  const updateCellValue = (value, columnID) => {
    props.updateRowCell({
      row_id: data.uid,
      columnID,
      value,
    });
  };

  const handleCreateColumn = async () => {
    await createColumn();
    await modalRef.current.scrollTo({
      top: 100000000000,
      behavior: 'auto',
    });
  };

  const deleteRow = async () => {
    await selectRows([data.uid], 'id');
    onClose();
    deleteRows();
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox status="success" onClose={onClose} message="Record deleted" />
      ),
    });
  };

  const handlePrint = useReactToPrint({
    content: () => modalRef.current,
  });

  return (
    <Modal
      preserveScrollBarGap
      scrollBehavior="inside"
      isCentered
      size="sm"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />

      <Wrapper borderRadius="5px" ref={modalRef}>
        <ModalCloseButton
          borderRadius="15px"
          position="fixed"
          top="calc(10vh - 10px)"
          right="calc(50vw - 305px)"
          backgroundColor="#3d43df"
          color="white"
          _hover={{
            backgroundColor: '#3d43df',
          }}
          size="sm"
        />
        <Box className="section-header">
          <Box className="actions">
            <IconButton
              borderRadius="15px"
              variant="outline"
              variantColor="blue"
              aria-label="close"
              size="xs"
              icon="chevron-up"
              isDisabled={rowIndex === 0}
              onClick={() => props.openRow(rowIndex - 1)}
            />
            <IconButton
              marginX="5px"
              borderRadius="15px"
              variant="outline"
              variantColor="blue"
              aria-label="close"
              size="xs"
              icon="chevron-down"
              isDisabled={rowIndex === row_count - 1}
              onClick={() => props.openRow(rowIndex + 1)}
            />

            <Menu>
              <MenuButton
                as={IconButton}
                // @ts-ignore
                icon="overflow"
                marginX="5px"
                borderRadius="15px"
                variant="ghost"
                variantColor="blue"
                aria-label="close"
                size="xs"
              />
              <MenuList>
                <MenuItem color="red" fontSize="12px" onClick={handlePrint}>
                  <Icon name="download" size="14px" mr="10px" />
                  Print record
                </MenuItem>
                <MenuItem color="#E73D51" fontSize="12px" onClick={deleteRow}>
                  <Icon name="trash" size="14px" mr="10px" color="#E73D51" />
                  Delete record
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>

          <Box display="flex">
            <Box className="heading">{data[title_column]}</Box>
          </Box>
        </Box>

        <Box className="section-info">
          {columns.map((column: any) => (
            <div key={column.uid} className="info-item">
              <Header
                {...{
                  column,
                  columns: props.columns,
                  deleteColumn,
                  updateColumnCustomization,
                  updateColumnLabel,
                  updateColumnType,
                  hideColumn,
                  updateColumn,
                }}
              />
              <div className="value">
                <Field
                  {...{
                    value: data[column.uid],
                    columns: props.columns,
                    column,
                    updateCellValue,
                    updateSelectOption,
                    addSelectOption,
                  }}
                />
              </div>
            </div>
          ))}
        </Box>
        <Button
          size="sm"
          variant="link"
          variantColor="blue"
          className="add-button"
          onClick={handleCreateColumn}
        >
          Add a column to this list
        </Button>
      </Wrapper>
    </Modal>
  );
};
