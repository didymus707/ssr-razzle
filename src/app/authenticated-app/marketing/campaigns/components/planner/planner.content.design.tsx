import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Icon,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PseudoBox,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import { shortenLink, TemplateData } from 'app/authenticated-app/marketing/templates';
import { Button, ToastBox } from 'app/components';
import { selectOrganisationID } from 'app/unauthenticated-app/authentication';
import Picker, { IEmojiData } from 'emoji-picker-react';
import { FormikHelpers, useFormik } from 'formik';
import { useLoading } from 'hooks';
import { isEmpty } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { sendAmplitudeData } from '../../../../../../utils/amplitude';
import { Editable } from '../../../../marketing/templates/components/Editable';
import { html2Text } from '../../../../marketing/templates/templates.utils';
import { sendTestCampaignMessage } from '../../campaigns.service';
import { CampaignVariant } from '../../campaigns.types';
import { CampaignLinkModal } from './campaign-link-modal';
import { CampaignMetaModal } from './campaign-meta-modal';
import { DesignProps } from './planner.design';
import { CampaignPayload } from './planner.index';
import { PhoneContainer, SectionFooter } from './planner.layout';
import { TemplateSelectModal } from './template-select-modal';
import { TestMessageModal } from './test-message-modal';

export type PlannerContentDesignInitialValuesProp = {
  content?: null | string | CampaignVariant;
} & Pick<CampaignPayload, 'link' | 'template_id' | 'sender_id'>;

export type PlannerContentDesignProps = Pick<
  DesignProps,
  | 'fetchWallet'
  | 'credit_balance'
  | 'fetchTemplates'
  | 'fetchSampleTemplates'
  | 'onGoBack'
  | 'goBackButtonLabel'
  | 'continueButtonLabel'
  | 'templateCategories'
  | 'handleUpdateTemplate'
> & {
  index?: number;
  initialValues: PlannerContentDesignInitialValuesProp;
  onSubmit: (data: PlannerContentDesignInitialValuesProp) => void;
  onTabChange?(index: number, values?: PlannerContentDesignInitialValuesProp): void;
};

export const PlannerContentDesign = ({
  index,
  onGoBack,
  onSubmit,
  fetchWallet,
  onTabChange,
  initialValues,
  fetchTemplates,
  credit_balance,
  templateCategories,
  continueButtonLabel,
  fetchSampleTemplates,
  handleUpdateTemplate,
  goBackButtonLabel = 'Back',
}: PlannerContentDesignProps) => {
  const editableRef = React.createRef<HTMLInputElement>();
  const designInitialValues = {
    link: null,
    content: null,
    template_id: null,
  };
  const [currentEmoji, setCurrentEmoji] = React.useState('');
  const [smsCount, setSmsCount] = React.useState(0);
  const [characterCount, setCharacterCount] = React.useState(0);
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateData | undefined>();

  const {
    isOpen: testMessageModalIsOpen,
    onOpen: onOpenTestMessageModal,
    onClose: onCloseTestMessageModal,
  } = useDisclosure();
  const {
    isOpen: metaModalIsOpen,
    onOpen: onOpenMetaModal,
    onClose: onCloseMetaModal,
  } = useDisclosure();
  const {
    isOpen: campaignLinkModalIsOpen,
    onOpen: onOpenCampaignLinkModal,
    onClose: onCloseCampaignLinkModal,
  } = useDisclosure();
  const {
    isOpen: templateModalIsOpen,
    onOpen: onOpenTemplateModal,
    onClose: onCloseTemplateModal,
  } = useDisclosure();
  const toast = useToast();
  const { loading, dispatch } = useLoading();

  const validationSchema = yup.object().shape({
    content: yup
      .string()
      .when('template_id', {
        is: value => !!value,
        then: yup.string(),
        otherwise: yup
          .string()
          .max(160, '160 character limit exceeded')
          .required('Campaign message is required'),
      })
      .nullable(),
  });

  const getContent = (value?: null | string | CampaignVariant): string => {
    if (value) {
      if (typeof value === 'string') {
        return value;
      } else {
        return value?.content ?? '';
      }
    }
    return '';
  };

  const { values, errors, touched, handleSubmit, setFieldValue } = useFormik({
    validationSchema,
    enableReinitialize: true,
    initialValues: !isEmpty(initialValues) ? { ...initialValues } : designInitialValues,

    onSubmit: values => {
      if (values.template_id && selectedTemplate && selectedTemplate?.template !== values.content) {
        handleUpdateTemplate({
          ...selectedTemplate,
          template: html2Text(getContent(values?.content)),
        });
      }
      onSubmit({
        ...values,
        content: html2Text(getContent(values.content)),
      });
    },
  });

  const isInvalid = !!touched.content && !!errors.content;

  function getCharacterCount(value: string) {
    const characterCount = value.length;
    const smsCount = Math.ceil(characterCount / 160);

    setCharacterCount(characterCount);
    setSmsCount(smsCount);
  }

  function handleChange(value: string) {
    getCharacterCount(value);
    setFieldValue('content', value);
    onTabChange?.(index ?? 0, { ...values, content: value });
  }

  function onEmojiClick(event: React.MouseEvent<Element, MouseEvent>, emojiObject: IEmojiData) {
    setCurrentEmoji(emojiObject.emoji);
    sendAmplitudeData('campaignEmojiAdded');
  }

  const organisationId = useSelector(selectOrganisationID);

  function handleOpenCampaignLinkModal() {
    onCloseMetaModal();
    onOpenCampaignLinkModal();
  }

  function handleOpenTemplateModal() {
    onCloseMetaModal();
    onOpenTemplateModal();
  }

  function handleSelectTemplate(data: TemplateData) {
    const { id, type, name, template } = data;
    setFieldValue('template_id', id);
    setFieldValue('content', template);
    setFieldValue('template_type', type);
    sendAmplitudeData('campaignTemplateSelected', { name, type, id });
    setSelectedTemplate(data);
    onCloseTemplateModal();
    onTabChange?.(index ?? 0, { template_id: id, content: template });
  }

  async function handleShortenLink({ link, analytics }: any) {
    try {
      dispatch({ type: 'LOADING_STARTED' });
      const response = await shortenLink({ link });
      const { short: shortenedLink } = response.data.link.link;
      let content = '';

      dispatch({ type: 'LOADING_RESOLVED' });
      onCloseCampaignLinkModal();
      if (values.content) {
        if (contentHasURL(getContent(values.content))) {
          content = `${contentWithoutURL(getContent(values.content))}\n${shortenedLink}`;
        } else {
          content = `${values.content}\n${shortenedLink}`;
        }
      } else {
        content = shortenedLink;
      }
      setFieldValue('link', link);
      setFieldValue('analytics', analytics);
      handleChange(content);
      onTabChange?.(index ?? 0, { ...values, link, content });
      sendAmplitudeData('campaignLinkAdded');
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  const handleSendTestMessage = async (
    { recipients }: { recipients: string },
    { resetForm }: FormikHelpers<{ recipients: string }>,
  ) => {
    if (values.content) {
      const payload = {
        recipients,
        // @ts-ignore
        sender_id: values.sender_id,
        content: typeof values.content === 'string' ? values.content : values.content.content,
      };
      try {
        dispatch({ type: 'LOADING_STARTED' });
        await sendTestCampaignMessage(payload);
        dispatch({ type: 'LOADING_RESOLVED' });
        organisationId && (await fetchWallet(organisationId));
        onCloseTestMessageModal();
        resetForm();
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" onClose={onClose} message="Test message sent successfully" />
          ),
        });
        sendAmplitudeData('campaignTestMessageSent');
      } catch (error) {
        dispatch({ type: 'LOADING_RESOLVED' });
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
        });
      }
    }
  };

  React.useEffect(() => {
    if (values.content) {
      if (typeof values.content === 'string') {
        getCharacterCount(values.content);
      } else {
        getCharacterCount(values.content.content);
      }
    }
    if (editableRef.current) {
      editableRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.content]);

  React.useEffect(() => {
    if (currentEmoji) {
      if (values.content) {
        setFieldValue('content', `${values.content}${currentEmoji}`);
      } else {
        setFieldValue('content', currentEmoji);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEmoji]);

  return (
    <>
      <Box className="content">
        <Box className="left-section">
          <FormControl isInvalid={isInvalid}>
            <Box
              p="0.5rem"
              borderWidth="1px"
              borderRadius="8px"
              borderColor={isInvalid ? '#e53e3e' : '#e2e8f0'}
              boxShadow={isInvalid ? '0 0 0 1px #e53e3e' : 'none'}
            >
              <Flex flexDirection="column">
                <Box pb="0.5rem" flex={1}>
                  <Editable
                    onBlur={handleChange}
                    // innerRef={editableRef}
                    onChange={handleChange}
                    placeholder="Write here..."
                    value={getContent(values.content)}
                  />
                </Box>
                <Flex alignItems="center" justifyContent="flex-end">
                  <PseudoBox as="span" fontSize="0.7rem">
                    {characterCount}
                  </PseudoBox>
                  <Divider mx="0.4rem" height="0.75rem" orientation="vertical" />
                  <PseudoBox as="span" fontSize="0.7rem">
                    {smsCount} SMS
                  </PseudoBox>
                </Flex>
              </Flex>
              <Stack pt="0.5rem" isInline borderTopWidth="1px" alignItems="center">
                <Box>
                  <Tooltip hasArrow placement="top" aria-label="add" label="Add link/use template">
                    <IconButton
                      size="xs"
                      rounded="8px"
                      icon="small-add"
                      aria-label="add"
                      variant="outline"
                      variantColor="blue"
                      onClick={onOpenMetaModal}
                    />
                  </Tooltip>
                </Box>
                <Box>
                  <Popover placement="bottom-end">
                    <PopoverTrigger>
                      <Button size="xs" variant="outline" variantColor="blue">
                        <Tooltip
                          hasArrow
                          label="Emoji"
                          placement="top"
                          aria-label="emoji"
                          shouldWrapChildren
                        >
                          <Icon name="happy" size="0.8rem" />
                        </Tooltip>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      width="auto"
                      zIndex={4}
                      boxShadow="0px 5px 20px rgba(21, 27, 38, 0.08)"
                      _focus={{ boxShadow: '0px 5px 20px rgba(21, 27, 38, 0.08)' }}
                    >
                      <Picker onEmojiClick={onEmojiClick} preload={true} />
                    </PopoverContent>
                  </Popover>
                </Box>
              </Stack>
            </Box>
            <FormErrorMessage>{errors.content}</FormErrorMessage>
          </FormControl>
          <SectionFooter
            onGoBack={onGoBack}
            onContinue={handleSubmit}
            goBackLabel={goBackButtonLabel ?? ''}
            continueLabel={continueButtonLabel ?? ''}
          />
        </Box>
        <Box className="right-section">
          <PhoneContainer>
            {values.content && (
              <>
                <Box mb="1rem" flex={1} maxH="calc(100% - 140px)">
                  <Box
                    p="0.5rem"
                    maxH="100%"
                    width="100%"
                    bg="#f3f3f3"
                    overflowY="auto"
                    borderRadius="8px"
                    wordBreak="break-word"
                    whiteSpace="pre-line"
                  >
                    <Text fontSize="0.75rem" color="color.700">
                      {html2Text(getContent(values.content))}
                    </Text>
                  </Box>
                </Box>
                <Box>
                  <Button
                    size="sm"
                    isFullWidth
                    variant="outline"
                    variantColor="blue"
                    onClick={onOpenTestMessageModal}
                  >
                    Send test message
                  </Button>
                </Box>
              </>
            )}
          </PhoneContainer>
        </Box>
      </Box>
      <TestMessageModal
        credit_balance={credit_balance}
        isOpen={testMessageModalIsOpen}
        onSubmit={handleSendTestMessage}
        onClose={onCloseTestMessageModal}
        isLoading={loading === 'pending'}
      />
      <TemplateSelectModal
        goBack={onOpenMetaModal}
        isOpen={templateModalIsOpen}
        onClose={onCloseTemplateModal}
        categories={templateCategories}
        fetchTemplates={fetchTemplates}
        selectedTemplate={values.template_id}
        onSelectTemplate={handleSelectTemplate}
        fetchSampleTemplates={fetchSampleTemplates}
      />
      <CampaignLinkModal
        goBack={onOpenMetaModal}
        onSubmit={handleShortenLink}
        isOpen={campaignLinkModalIsOpen}
        isLoading={loading === 'pending'}
        onClose={onCloseCampaignLinkModal}
        initialValues={{ link: initialValues?.link }}
      />
      <CampaignMetaModal
        isOpen={metaModalIsOpen}
        onClose={onCloseMetaModal}
        options={[
          {
            icon: 'copy',
            title: 'Templates',
            onSelect: handleOpenTemplateModal,
            caption: 'Use your custom templates or one of our prewritten ones.',
          },
          {
            icon: 'link',
            title: 'Short link',
            onSelect: handleOpenCampaignLinkModal,
            caption: 'A shortened link that redirects recipients to an expanded URL',
          },
        ]}
      />
    </>
  );
};

function contentHasURL(content: string) {
  return !!content.split('\n').filter(item => item.startsWith('http')).length;
}

function contentWithoutURL(content: string) {
  return content
    .split('\n')
    .filter(item => !item.startsWith('http'))
    .join('');
}
