import { Box } from '@chakra-ui/core';
import styled from '@emotion/styled';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUploaderProps } from './types';

const FileUploaderContainer = styled(Box)`
  cursor: pointer;

  .fileupload-container {
    width: 100%;
    height: 100%;
    outline: none;
  }

  .container {
    &:focus {
      outline: none;
    }
  }
`;

export function FileUploader({
  accept,
  maxSize,
  children,
  onUpload = console.log,
  ...rest
}: FileUploaderProps) {
  const onDrop = React.useCallback(
    acceptedFiles => {
      onUpload(acceptedFiles);
    },
    [onUpload]
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept,
    onDrop,
  });

  return (
    <FileUploaderContainer {...rest}>
      <div {...getRootProps({ className: 'fileupload-container' })}>
        <input {...getInputProps()} />
        {children}
      </div>
    </FileUploaderContainer>
  );
}
