import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  List,
  ListItem,
  PseudoBox,
} from '@chakra-ui/core';
import { FileUploader } from '../../../../../components';

export function TableNewButton({
  children,
  onUpload,
  onNewUpload,
  onNewTableClick,
}: {
  children: React.ReactNode;
  onNewTableClick?: () => void;
  onUpload?: (file: any) => void;
  onNewUpload?: (file: any) => void;
}) {
  return (
    <Popover placement="bottom-end" closeOnBlur={false}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent zIndex={1000} width="fit-content">
        <List>
          <ListItem>
            <PseudoBox
              as="button"
              border="0"
              width="100%"
              outline="none"
              textAlign="left"
              paddingY="0.2rem"
              paddingX="0.5rem"
              fontSize="0.75rem"
              onClick={onNewTableClick}
              _hover={{ bg: 'gray.100' }}
            >
              New table
            </PseudoBox>
          </ListItem>
          <ListItem>
            <FileUploader onUpload={onNewUpload}>
              <PseudoBox
                as="button"
                border="0"
                width="100%"
                outline="none"
                textAlign="left"
                paddingY="0.2rem"
                paddingX="0.5rem"
                fontSize="0.75rem"
                _hover={{ bg: 'gray.100' }}
              >
                New import
              </PseudoBox>
            </FileUploader>
          </ListItem>
          <ListItem>
            <FileUploader onUpload={onUpload}>
              <PseudoBox
                as="button"
                border="0"
                width="100%"
                outline="none"
                textAlign="left"
                paddingY="0.2rem"
                paddingX="0.5rem"
                fontSize="0.75rem"
                _hover={{ bg: 'gray.100' }}
              >
                Add from file
              </PseudoBox>
            </FileUploader>
          </ListItem>
        </List>
      </PopoverContent>
    </Popover>
  );
}
