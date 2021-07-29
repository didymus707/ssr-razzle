import {
  Box,
  Checkbox,
  Divider,
  Flex,
  FormLabel,
  IconButton,
  ModalBody,
  Select,
  Text,
} from '@chakra-ui/core';
import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';
import * as React from 'react';
import { ModalContainer, Button } from '../../../../../components';
import { PropertyDropdown, PropertySchema } from '../../property';
import { useProperties } from '../table.hooks';
import { NewTableImportModalProps } from '../table.types';

function SectionOne({
  file,
  isLoading,
  onRemoveFile,
  handleUpload,
}: Pick<NewTableImportModalProps, 'file' | 'isLoading' | 'onRemoveFile' | 'handleUpload'>) {
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

function SectionTwo(
  props: Pick<
    NewTableImportModalProps,
    'importedData' | 'isLoading' | 'handleMapping' | 'handleCreateTable'
  >,
) {
  const { isLoading, importedData, handleCreateTable } = props;

  const columns = importedData?.columns?.map(({ name }: any) => ({
    label: name,
    hidden: false,
    type: 'TEXT',
    name: camelCase(name),
  })) as PropertySchema[];
  const { properties, onPropertyUpdate, onPropertyDelete, onPropertyDuplicate } = useProperties({
    properties: columns,
  });

  function onCreateTable() {
    if (properties && !isEmpty(properties)) {
      handleCreateTable(properties);
    }
  }

  return (
    <>
      <Text fontSize="0.875rem" marginBottom="1rem" color="black">
        Set the columns from your file as properties to create a new table
      </Text>
      <Flex
        height="auto"
        padding="1rem"
        flexWrap="wrap"
        overflowY="auto"
        marginBottom="1rem"
        justifyContent="space-between"
      >
        {properties?.map((item, i) => (
          <PropertyDropdown
            key={i}
            property={item}
            onDelete={() => onPropertyDelete(i)}
            onDuplicate={() => onPropertyDuplicate(item)}
            onChange={property => onPropertyUpdate(property, i)}
          >
            <Button
              size="sm"
              width="48%"
              isFullWidth
              variant="ghost"
              textAlign="left"
              marginBottom="1rem"
              justifyContent="flex-start"
            >
              {item.label}
            </Button>
          </PropertyDropdown>
        ))}
      </Flex>
      <Box marginBottom="2rem">
        <Button
          size="sm"
          fontWeight="normal"
          isLoading={isLoading}
          variantColor="blue"
          onClick={onCreateTable}
        >
          Create table
        </Button>
      </Box>
    </>
  );
}

export const NewTableImportModal = ({
  file,
  isOpen,
  onClose,
  isLoading,
  onRemoveFile,
  importedData,
  handleUpload,
  handleMapping,
  handleCreateTable,
}: NewTableImportModalProps) => {
  const modalTitle = !importedData ? 'Import a spreadsheet' : 'Import mapping';
  return (
    <ModalContainer isOpen={isOpen} showCloseButton onClose={onClose} title={modalTitle}>
      <ModalBody>
        {!importedData ? (
          <SectionOne
            file={file}
            isLoading={isLoading}
            handleUpload={handleUpload}
            onRemoveFile={onRemoveFile}
          />
        ) : (
          <SectionTwo
            isLoading={isLoading}
            importedData={importedData}
            handleMapping={handleMapping}
            handleCreateTable={handleCreateTable}
          />
        )}
      </ModalBody>
    </ModalContainer>
  );
};
