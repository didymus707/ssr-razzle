import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Stack,
  Text,
  Tooltip,
  useClipboard,
  useToast,
} from '@chakra-ui/core';
import { useFormik } from 'formik';
import * as React from 'react';
import * as yup from 'yup';
import { validURL } from '../../../../../utils';
import { useLoading } from '../../../../../hooks';
import { AdvancedSelect, ToastBox, Button, Input } from 'app/components';
import { SelectOptions } from '../../../tables';
import { shortenLink } from '../templates.service';
import { Editable } from './Editable';
import { TemplateFormProps, TemplateFormValues } from './types';
import { html2Text } from '../templates.utils';

export const templateFormValidationSchema = yup.object().shape({
  name: yup.string().required('Template name is required'),
  template: yup.string().required('Template content is required'),
});

const defaultInitialValues = {
  id: '',
  name: '',
  table_id: '',
  template: '',
  smart_list_id: '',
};

export function TemplateForm({
  lists,
  onClose,
  onSubmit,
  isLoading,
  listOptions,
  lists_by_id,
  initialValues,
}: TemplateFormProps) {
  const [link, setLink] = React.useState('');
  const [countText, setCountText] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState('');
  const [shortendLink, setShortendLink] = React.useState('');
  const [tags, setTags] = React.useState<SelectOptions[]>([]);

  const toast = useToast();
  const editorRef = React.useRef<any>(null);
  const { loading, dispatch } = useLoading();
  const { onCopy, hasCopied } = useClipboard(shortendLink);
  const formik = useFormik({
    validationSchema: templateFormValidationSchema,
    initialValues: initialValues || defaultInitialValues,
    onSubmit: (values: TemplateFormValues) =>
      onSubmit({ ...values, template: html2Text(values.template) }),
  });

  React.useEffect(() => {
    const selectedListId = formik.values.table_id;
    if (selectedListId && lists_by_id?.includes(selectedListId)) {
      const properties = lists[selectedListId].columns.map(
        ({ name, label }: { name: string; label: string }) => ({
          label,
          value: name,
        }),
      );

      setTags(properties);
    }
  }, [formik.values.table_id, lists, lists_by_id]);

  async function handleShortenLink() {
    try {
      dispatch({ type: 'LOADING_STARTED' });
      const response = await shortenLink({ link });
      const { link: shortenedLink } = response.data;

      dispatch({ type: 'LOADING_RESOLVED' });
      setLink(shortenedLink.link.short);
      setShortendLink(shortenedLink.link.short);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} status="success" message={'Link shortened'} />
        ),
      });
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  function handleLinkChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setLink(value);
  }

  function handleTagChange(value: string | undefined) {
    if (value) {
      const updatedContent = `${formik.values.template} {{${value}}}`;

      setSelectedTag(value);
      formik.setFieldValue('template', updatedContent);
    }
  }

  function handleEditableBlur(value: string) {
    formik.setFieldValue('template', value);
    getCharacterCountText(value);
  }

  function getCharacterCountText(value: string) {
    const characterCount = value.length;
    const smsCount = Math.ceil(characterCount / 160);
    const countText = `${characterCount}/${smsCount * 160}, ${smsCount} SMS`;

    setCountText(countText);
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box width="50%">
        <FormControl isInvalid={!!formik.touched.name && !!formik.errors.name}>
          <Input
            size="sm"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder="Give template a name"
          />
          <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
        </FormControl>
      </Box>
      <Flex width="100%" marginTop="1.1rem" alignItems="center" flexWrap="wrap">
        <Box color="#212242" marginRight="1.3rem" width={['100%', '100%', '60%']}>
          <FormLabel fontSize="0.85rem">Template Message</FormLabel>
          <Editable
            innerRef={editorRef}
            placeholder="Write here..."
            onBlur={handleEditableBlur}
            value={formik.values.template}
            onChange={getCharacterCountText}
          />
          <Text fontSize="0.75rem" marginTop="0.5rem">
            {countText}
          </Text>
        </Box>
        <Box color="#212242" width={['100%', '100%', '30%']}>
          <Box marginBottom="0.6rem">
            <FormLabel fontSize="0.85rem">List</FormLabel>
            <AdvancedSelect
              size="sm"
              isSearchable
              isClearable={true}
              options={listOptions}
              placeholder="Select list"
              value={formik.values.table_id}
              onChange={option => {
                if (option) {
                  formik.setFieldValue('table_id', option.value);
                }
              }}
            />
          </Box>
          <Box marginBottom="0.6rem">
            <FormLabel fontSize="0.85rem">Personalise with tags</FormLabel>

            <AdvancedSelect
              size="sm"
              isSearchable
              options={tags}
              isClearable={false}
              placeholder="Choose a tag"
              onChange={option => handleTagChange(option.value)}
              value={selectedTag}
            />
          </Box>
          <Box marginTop="0.9rem">
            <FormLabel fontSize="0.85rem">
              <Stack isInline alignItems="center">
                <Text>Embed a trackable link</Text>
                <Tooltip
                  zIndex={10000}
                  placement="top"
                  aria-label="info"
                  shouldWrapChildren
                  label="Adding an embed trackable link means we'll track the message and provide analytics."
                >
                  <Icon name="info" color="#a2a2a2" />
                </Tooltip>
              </Stack>
            </FormLabel>
            <Input
              size="sm"
              type="url"
              value={link}
              color="#212242"
              paddingLeft="0.5rem"
              onChange={handleLinkChange}
              placeholder="Paste link here to shorten…"
            />
            <Button
              size="xs"
              type="button"
              fontWeight="normal"
              marginTop="0.5rem"
              variantColor="blue"
              isDisabled={!validURL(link)}
              isLoading={loading === 'pending'}
              onClick={shortendLink ? onCopy : handleShortenLink}
            >
              {shortendLink ? (hasCopied ? 'Copied' : 'Copy') : 'Shorten'}
            </Button>
          </Box>
        </Box>
      </Flex>

      <Stack isInline paddingTop="2rem" paddingBottom="1rem" justifyContent="flex-end">
        <Button type="button" size="sm" onClick={onClose}>
          Close
        </Button>
        <Button size="sm" type="submit" variantColor="blue" isLoading={isLoading}>
          Save Template
        </Button>
      </Stack>
    </form>
  );
}
