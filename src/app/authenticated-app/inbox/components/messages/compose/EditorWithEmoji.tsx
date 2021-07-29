import { Box } from '@chakra-ui/core';
import React from 'react';
import { EditorWithEmojiProps } from '../../../inbox.types';
import { Editor } from './Editor';

export function EditorWithEmoji({ children, ...props }: EditorWithEmojiProps) {
  return (
    <Box position="relative" marginRight="-1.5rem">
      <Editor {...props} />
    </Box>
  );
}
