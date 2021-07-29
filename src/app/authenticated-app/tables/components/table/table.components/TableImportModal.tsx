import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormLabel,
  IconButton,
  ModalBody,
  Select,
  Stack,
  Text,
} from '@chakra-ui/core';
import * as React from 'react';
import { OptionTypeBase } from 'react-select';
import { ModalContainer } from '../../../../../components';
import { TablePropertiesOptions } from '../../../tables.types';
import { PropertySchema } from '../../property';
import { TableImportModalProps } from '../table.types';

function TableMappingItem({
  item,
  columns,
  onChange,
}: {
  item: OptionTypeBase;
  columns?: PropertySchema[];
  onChange?: (value: OptionTypeBase) => void;
}) {
  const [value, setValue] = React.useState<string>('');
  const columnsToMap = columns?.map(item => ({
    label: item.label,
    value: item.id,
  }));

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setValue(value);
    onChange && onChange({ [value]: item.id });
  }

  return (
    <Stack width="48%" spacing="4px" marginBottom="0.8rem">
      <Text flex={1} fontSize="0.875rem">
        {item.name}
      </Text>
      <Select size="sm" value={value} onChange={handleChange}>
        <option value="">-- Select property --</option>
        {columnsToMap?.map((item, i) => (
          <option key={i} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
    </Stack>
  );
}

function TableImportModalSectionOne({
  file,
  isLoading,
  onRemoveFile,
  handleUpload,
}: Pick<TableImportModalProps, 'file' | 'isLoading' | 'onRemoveFile' | 'handleUpload'>) {
  const [date_format, setDateFormat] = React.useState<string>('');
  const [agreeCheck, setAgreeCheck] = React.useState<boolean>(false);

  function handleDateFormatChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDateFormat(e.target.value);
  }

  function handleAgreeCheck(e: React.ChangeEvent<HTMLInputElement>) {
    setAgreeCheck(e.target.checked);
  }
  return (
    <>
      {file && (
        <Box marginBottom="2rem">
          <Flex alignItems="center" justifyContent="space-between">
            <Box>
              <Text fontSize="14px" marginBottom="0.25rem">
                {file.name}
              </Text>
              <Text color="lightBlack" fontSize="0.625rem">
                {Math.ceil(file.size / 1000)} KB
              </Text>
            </Box>
            <Box>
              <IconButton
                size="xs"
                variant="ghost"
                aria-label="close"
                icon="small-close"
                onClick={onRemoveFile}
              />
            </Box>
          </Flex>
        </Box>
      )}
      <Divider />
      <Box marginY="1.5rem">
        <FormLabel fontSize="0.8rem">Date Format</FormLabel>
        <Select size="sm" value={date_format} onChange={handleDateFormatChange}>
          <option value="">-- Select date format--</option>
          <option value="dd/mm/yyyy">dd/mm/yyyy</option>
          <option value="mm/dd/yyyy">mm/dd/yyyy</option>
          <option value="yyyy/mm/dd">yyyy/mm/dd</option>
        </Select>
      </Box>
      <Box marginBottom="1rem">
        <Checkbox
          variantColor="blue"
          isChecked={agreeCheck}
          alignItems="flex-start"
          onChange={handleAgreeCheck}
        >
          <Text color="lightBlack" fontSize="0.75rem">
            I agree that all contacts in this import are expecting to hear from me or my
            organisation. I have a prior relationship with these contacts and I have emailed or
            messaged them at least once in the past year. I can confirm that this list wasn’t
            purchased, rented, appended, or provided by a third party.
          </Text>
        </Checkbox>
      </Box>
      <Box marginBottom="2rem">
        <Button
          size="sm"
          fontWeight="normal"
          isLoading={isLoading}
          variantColor="blue"
          isDisabled={!agreeCheck}
          onClick={() =>
            handleUpload({
              file,
              source: 'csv',
              name: file.name,
              agree: agreeCheck,
              date_format: date_format,
            })
          }
        >
          Upload File
        </Button>
      </Box>
    </>
  );
}

function TableImportModalSectionTwo(
  props: Pick<TableImportModalProps, 'tables' | 'importedData' | 'isLoading' | 'handleMapping'>,
) {
  const { tables, importedData, isLoading, handleMapping } = props;
  const [mapping, setMapping] = React.useState<OptionTypeBase | {}>({});
  const [selectedTableId, setSelectedTableId] = React.useState<TablePropertiesOptions['id']>();
  const [columns, setColumns] = React.useState<TablePropertiesOptions['columns']>();

  React.useEffect(() => {
    const selectedTable = tables.find(table => table.id === selectedTableId);
    const selectedTableColumns = selectedTable?.columns;
    setColumns(selectedTableColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTableId]);

  function handleTableChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setSelectedTableId(value);
  }

  function handleMappingUpdate(option: OptionTypeBase) {
    setMapping({ ...mapping, ...option });
  }

  function onMappingSubmit() {
    const payload = { id: importedData?.id, table_id: selectedTableId, mapping };
    handleMapping(payload);
  }

  return (
    <>
      <Text marginBottom="1rem" color="lightBlack">
        Map the columns from the file to the properties of the table you want to update
      </Text>

      <Select
        size="sm"
        value={selectedTableId}
        onChange={handleTableChange}
        placeholder="Select a table to import into"
      >
        {tables.map(({ id, name }, i) => (
          <option key={i} value={id}>
            {name}
          </option>
        ))}
      </Select>
      {selectedTableId && (
        <>
          <Flex
            height="400px"
            flexWrap="wrap"
            overflowY="auto"
            marginBottom="1rem"
            justifyContent="space-between"
          >
            {importedData?.columns?.map((item: OptionTypeBase, i: number) => (
              <TableMappingItem
                key={i}
                item={item}
                columns={columns}
                onChange={handleMappingUpdate}
              />
            ))}
          </Flex>
          <Box marginBottom="2rem">
            <Button
              size="sm"
              fontWeight="normal"
              variantColor="blue"
              isLoading={isLoading}
              onClick={onMappingSubmit}
            >
              Save mapping
            </Button>
          </Box>
        </>
      )}
    </>
  );
}

export function TableImportModal({
  file,
  tables,
  isOpen,
  onClose,
  isLoading,
  onRemoveFile,
  importedData,
  handleUpload,
  handleMapping,
}: TableImportModalProps) {
  const modalTitle = !importedData ? 'Import a spreadsheet' : 'Import mapping';

  return (
    <ModalContainer isOpen={isOpen} showCloseButton onClose={onClose} title={modalTitle}>
      <ModalBody>
        {!importedData ? (
          <TableImportModalSectionOne
            file={file}
            isLoading={isLoading}
            handleUpload={handleUpload}
            onRemoveFile={onRemoveFile}
          />
        ) : (
          <TableImportModalSectionTwo
            tables={tables}
            isLoading={isLoading}
            importedData={importedData}
            handleMapping={handleMapping}
          />
        )}
      </ModalBody>
    </ModalContainer>
  );
}
