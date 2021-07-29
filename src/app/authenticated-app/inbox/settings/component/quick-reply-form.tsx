import { Box, Flex, FormHelperText, Icon, Stack } from '@chakra-ui/core';
import { Button, FormLabel, Input } from 'app/components';
import { ContentState, convertFromHTML, EditorState, RichUtils } from 'draft-js';
import { FormikConfig, useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import {
  BlockStyleControls,
  DraftEditor,
  DraftEditorContainer,
  InlineStyleControls,
} from '../../components';

export type QuickReplyFormValues = {
  id?: string;
  name: string;
  subject?: string;
  content?: EditorState;
};

export type QuickReplyFormProps = {
  isLoading?: boolean;
  initialValues?: {
    id?: string;
    name: string;
    subject?: string;
    content?: string;
  };
  onDelete?(): void;
  onCancel?(): void;
  isDeleting?: boolean;
  onSubmit: FormikConfig<QuickReplyFormValues>['onSubmit'];
};

export const QuickReplyForm = (props: QuickReplyFormProps) => {
  const { onSubmit, onDelete, onCancel, isLoading, isDeleting, initialValues } = props;
  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    setFieldValue,
  } = useFormik<QuickReplyFormValues>({
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
      : { name: '', content: EditorState.createEmpty() },
    onSubmit,
    validationSchema: yup.object().shape({
      name: yup.string().required('Name is required'),
    }),
  });
  const [editorState, setEditorState] = useState(values.content ?? EditorState.createEmpty());

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

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Box pb="2.5rem">
        <FormLabel>Name</FormLabel>
        <Input
          name="name"
          ref={inputRef}
          value={values.name}
          onChange={handleChange}
          errorMessage={errors.name}
          placeholder="Enter name"
          isInvalid={!!touched.name && !!errors.name}
        />
      </Box>
      <Box pb="2.5rem">
        <FormLabel>Subject</FormLabel>
        <Input
          name="subject"
          value={values.subject}
          onChange={handleChange}
          errorMessage={errors.subject}
          placeholder=""
          isInvalid={!!touched.subject && !!errors.subject}
        />
        <Stack pt="0.5rem" isInline alignItems="center">
          <Icon name="warning" color="gray.800" />
          <FormHelperText mt="0" color="gray.800">
            Optional: Will be placed in the subject when the message template is used in an email
          </FormHelperText>
        </Stack>
      </Box>
      <DraftEditorContainer mb="4rem" activeButtonColor={'#d2cef9'}>
        <Box
          px="0.5rem"
          height="150px"
          borderWidth="1px"
          roundedTopLeft="8px"
          roundedTopRight="8px"
          borderColor="gray.500"
          borderBottomColor="transparent"
        >
          <DraftEditor editorState={editorState} onChange={handleContentChange} />
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
            <Button isLoading={isDeleting} variantColor="red" variant="outline" onClick={onDelete}>
              Delete
            </Button>
          )}
          <Button type="submit" isLoading={isLoading} variantColor="blue">
            Save
          </Button>
        </Stack>
      </Flex>
    </form>
  );
};
