import React, { useEffect, useState } from 'react';
import { Box, Checkbox, IconButton } from '@chakra-ui/core/dist';
import { ListImportType } from '../../../../../../lists.types';
import { FileUploader, Button } from 'app/components';

const description_map = {
  csv:
    'Get started quickly by importing a CSV file. Most spreadsheets can be easily exported as a CSV.',
  'ms-excel': 'Get started quickly by importing an .xls or .xlsx file.',
  'apple-numbers':
    'You will first need to export the from Apple Numbers as a .CSV file in order to import it into a new list.',
  asana:
    'You will first need to export the data from Asana as a .CSV file in order to import it into a new list.',
  trello:
    'You will first need to export the data from Trello as a .CSV file in order to import it into a new list.',
  'ms-access':
    'You will first need to export the data as a .CSV file in order to import it into a new list.',
  'google-sheets': 'Import data from Google Sheets',
  calendar: 'Import data from your Calendar',
  contacts: 'Import data from your Contacts',
  mysql: 'Import data from your MySQL database',
};

interface Props {
  file: File | null;
  importType: ListImportType | null;
  handleUpload: Function;
  handleFileImport: Function;
  uploadLoading: boolean;
}

export const CreateListUploadPrompt = (props: Props) => {
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);

  const { importType, file, uploadLoading, handleFileImport } = props;

  const handleUpload = ([uploaded_file]: File[]) => props.handleUpload(uploaded_file);
  const clearFile = () => props.handleUpload(null);

  useEffect(() => {
    setTermsAgreed(false);
  }, [file]);

  if (!importType) return <Box />;

  return (
    <Box>
      <Box className="description">{description_map[importType]}</Box>

      <Box
        display="flex"
        flexDirection="row"
        marginTop="25px"
        width="fit-content"
        alignItems="center"
      >
        <FileUploader
          maxSize={52428800}
          onUpload={handleUpload}
          accept={importType === 'ms-excel' ? '.xls, .xlsx' : '.csv'}
        >
          <Button variant="link" variantColor="blue" size="sm">
            {importType === 'ms-excel' ? 'Select an Excel file' : 'Select a .CSV file'}
          </Button>
        </FileUploader>

        {file && (
          <Box className="file-name">
            {file.name}
            <IconButton
              aria-label="clear"
              icon="small-close"
              size="xs"
              ml="10px"
              onClick={clearFile}
            />
          </Box>
        )}
      </Box>
      {file && (
        <Box>
          <Box display="flex" flexDirection="row" alignItems="flex-start" mt="20px">
            <Checkbox
              mr="15px"
              mt="3px"
              isChecked={termsAgreed}
              onChange={() => setTermsAgreed(!termsAgreed)}
            />
            <Box className="description">
              I agree that all contacts in this import are expecting to hear from me or my
              organisation. I have a prior relationship with these contacts and I have emailed or
              messaged them at least once in the past year. I can confirm that this list wasn’t
              purchased, rented, appended, or provided by a third party.
            </Box>
          </Box>

          <Box mt="15px">
            <Button
              variant="solid"
              variantColor="blue"
              size="sm"
              isDisabled={!termsAgreed}
              onClick={() => handleFileImport()}
              isLoading={uploadLoading}
            >
              Upload
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
