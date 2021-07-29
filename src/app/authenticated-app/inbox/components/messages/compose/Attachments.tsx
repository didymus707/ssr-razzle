import { Box, Stack } from '@chakra-ui/core';
import React from 'react';
import { ComposeAttachments } from '../../../inbox.types';
import { AttachmentItem } from './AttachmentItem';

export function Attachments({
  files,
  setFiles,
  onClick,
  onUpload,
  showDeleteButton,
}: ComposeAttachments) {
  if (files.length === 0) {
    return <Box />;
  }

  const handleDelete = (index: number) => {
    setFiles([...files.slice(0, index), ...files.slice(index + 1, files.length)]);
  };

  return (
    <Stack isInline flexWrap="wrap" pb="0.2rem">
      {files.map((file: any, index: number) => (
        <AttachmentItem
          file={file}
          index={index}
          onClick={onClick}
          onDelete={handleDelete}
          showDeleteButton={showDeleteButton}
          key={`${file.name}-${file.size}-${file.type}`}
        />
      ))}
    </Stack>
  );
}
