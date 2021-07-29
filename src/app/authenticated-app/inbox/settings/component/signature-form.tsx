import { Box, Flex, Stack } from '@chakra-ui/core';
import { Button } from 'app/components';
import { ContentState, convertFromHTML, Editor, EditorState, RichUtils } from 'draft-js';
import { FormikConfig, useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import {
  BlockStyleControls,
  DraftEditor,
  DraftEditorContainer,
  InlineStyleControls,
} from '../../components';

export type SignatureFormValues = {
  content?: EditorState;
};

export type SignatureFormProps = {
  isLoading?: boolean;
  isDeleting?: boolean;
  initialValues?: {
    id?: string;
    content?: string;
  };
  onDelete?(): void;
  onCancel?(): void;
  onSubmit: FormikConfig<SignatureFormValues>['onSubmit'];
};

export const SignatureForm = (props: SignatureFormProps) => {
  const { onSubmit, onDelete, onCancel, isLoading, isDeleting, initialValues } = props;
  const { values, handleSubmit, setFieldValue } = useFormik<SignatureFormValues>({
    initialValues: initialValues
      ? {
          ...initialValues,
          content: EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(initialValues.content ?? '').contentBlocks,
              convertFromHTML(initialValues.content ?? '').entityMap,
            ),
          ),
        }
      : { content: EditorState.createEmpty() },
    onSubmit,
  });
  const [editorState, setEditorState] = useState(values.content ?? EditorState.createEmpty());

  const editorRef = useRef<Editor>(null);

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const handleContentChange = (state: EditorState) => {
    setEditorState(state);
    setFieldValue('content', state);
  };

  const handleEditorFocus = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  useEffect(() => {
    handleEditorFocus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <DraftEditorContainer mb="4rem" onClick={handleEditorFocus} activeButtonColor={'#d2cef9'}>
        <Box
          px="0.5rem"
          height="150px"
          borderWidth="1px"
          roundedTopLeft="8px"
          roundedTopRight="8px"
          borderColor="gray.500"
          borderBottomColor="transparent"
        >
          <DraftEditor ref={editorRef} editorState={editorState} onChange={handleContentChange} />
        </Box>
        <Flex
          py="1rem"
          px="1.5rem"
          bg="gray.200"
          borderWidth="1px"
          alignItems="center"
          borderColor="gray.500"
          roundedBottomLeft="8px"
          roundedBottomRight="8px"
          borderTopColor="transparent"
          justifyContent="space-between"
        >
          <Stack spacing="1rem" isInline alignItems="center">
            <Box>
              <InlineStyleControls editorState={editorState} onToggle={toggleInlineStyle} />
            </Box>
            <Box>
              <BlockStyleControls editorState={editorState} onToggle={toggleBlockType} />
            </Box>
          </Stack>
        </Flex>
      </DraftEditorContainer>
      <Flex pt="1.5rem" borderTopWidth="1px" alignItems="center" justifyContent="space-between">
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Stack isInline alignItems="center">
          {initialValues && (
            <Button isLoading={isDeleting} onClick={onDelete} variantColor="red" variant="outline">
              Delete
            </Button>
          )}
          <Button
            type="submit"
            variantColor="blue"
            isLoading={isLoading}
            isDisabled={!editorState.getCurrentContent().hasText()}
          >
            Save
          </Button>
        </Stack>
      </Flex>
    </form>
  );
};
