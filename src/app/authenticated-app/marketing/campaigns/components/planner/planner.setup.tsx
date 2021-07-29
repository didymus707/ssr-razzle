import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import { Input } from 'app/components';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import * as yup from 'yup';
import { useLoading } from '../../../../../../hooks';
import { client, numberWithCommas, toFormData } from '../../../../../../utils';
import { sendAmplitudeData } from '../../../../../../utils/amplitude';
import { AdvancedSelect, ToastBox } from '../../../../../components';
import { getCampaignAudience } from '../../campaigns.service';
import { NewAudienceModal } from './new-audience-modal';
import { CampaignPayload } from './planner.index';
import { SectionFooter, SectionFooterProps } from './planner.layout';

interface SetupProps {
  lists?: any;
  audience?: [];
  states?: any[];
  genders?: any[];
  religions?: any[];
  isAbTest?: boolean;
  ethnicGroups?: any[];
  hasAudiences?: boolean;
  organisationName?: string;
  initialValues?: CampaignPayload;
  onGoBack: SectionFooterProps['onGoBack'];
  onSubmit: (data: CampaignPayload) => void;
  importBulkUpload?: (payload: FormData) => Promise<any>;
  addAudience: (payload: {
    name: string;
    filters: { [key: string]: string[] | string | number | undefined };
  }) => any;
}

export const Setup = ({
  lists,
  states,
  genders,
  onGoBack,
  onSubmit,
  religions,
  addAudience,
  hasAudiences,
  ethnicGroups,
  initialValues,
  isAbTest = false,
  organisationName,
  importBulkUpload,
}: SetupProps) => {
  const setupInitialValues: CampaignPayload = {
    name: '',
    count: 0,
    table_id: null,
    import_id: null,
    campaign_id: '',
    segment_id: null,
    audience_id: null,
    smart_sending: '1',
    variants_count: '',
    smart_list_id: null,
    sender_id: organisationName ?? '',
  };
  const validationSchema = yup.object().shape({
    name: yup.string().required('Campaign name is required'),
    campaign_id: yup.string().required('Select campaign recipients'),
    variants_count: isAbTest ? yup.string().required('Variant count is required') : yup.string(),
  });

  const toast = useToast();
  const { dispatch, loading } = useLoading();
  const {
    isOpen: isOpenNewAudienceModal,
    onOpen: onOpenNewAudienceModal,
    onClose: onCloseNewAudienceModal,
  } = useDisclosure();
  const { touched, errors, values, handleSubmit, handleChange, setFieldValue } = useFormik({
    validationSchema,
    enableReinitialize: true,
    onSubmit: values => {
      const { smart_sending, ...rest } = values;
      onSubmit({
        ...rest,
        smart_sending,
        is_smart_send: smart_sending === '1',
      });
    },
    initialValues: isEmpty(initialValues)
      ? setupInitialValues
      : {
          ...initialValues,
          campaign_id:
            initialValues?.smart_list_id ||
            initialValues?.table_id ||
            initialValues?.import_id ||
            initialValues?.segment_id ||
            initialValues?.audience_id,
          smart_sending: initialValues?.is_smart_send ? '1' : '0',
          variants_count:
            initialValues?.variants_count ?? initialValues?.contents?.length.toString(),
        },
  });

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleGetListCount = async (payload: {
    smart_list_id?: string;
    table_id?: string;
    group_id?: string;
    segment_id?: string;
    audience_type: number;
  }) => {
    try {
      const { audience } = await getCampaignAudience(payload);
      return audience.count;
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleGetAudience = async (audienceId: string) => {
    try {
      const response = await client(`audience_list/${audienceId}`);
      const { audience_list } = response.data;
      return audience_list;
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const handleBulkUpload = async (files: File[]) => {
    const file = files[0];
    if (importBulkUpload) {
      try {
        const payload = toFormData({ name: file.name }, file, 'file');
        const data = await importBulkUpload(payload);
        setFieldValue('import_id', data.import.id);
        setFieldValue('campaign_id', data.import.id);
        setFieldValue('count', data.import.count);
        setFieldValue('table_id', null);
        setFieldValue('smart_list_id', null);
        setFieldValue('segment_id', null);
        setFieldValue('audience_type', 3);
        sendAmplitudeData('campaignBulkUpload', {
          count: data.import.count,
          id: data.import.id,
        });
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" onClose={onClose} message="File uploaded successfully" />
          ),
        });
      } catch (error) {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
        });
      }
    }
  };

  const handleAudienceChange = async (value?: string) => {
    if (value === 'import') {
      open();
    } else if (value === 'new-audience') {
      onOpenNewAudienceModal();
    } else {
      if (value?.endsWith('-smartList')) {
        value = value.replace('-smartList', '');
        const count = await handleGetListCount({ smart_list_id: value, audience_type: 2 });
        setFieldValue('smart_list_id', value);
        setFieldValue('campaign_id', value);
        setFieldValue('table_id', null);
        setFieldValue('import_id', null);
        setFieldValue('audience_id', null);
        setFieldValue('segment_id', null);
        setFieldValue('count', count);
        setFieldValue('audience_type', 2);
        sendAmplitudeData('campaignListSelected', {
          smart_list_id: value,
        });
      } else if (value?.endsWith('-audience')) {
        value = value.replace('-audience', '');
        const audience = await handleGetAudience(value);
        setFieldValue('audience_id', value);
        setFieldValue('campaign_id', value);
        setFieldValue('table_id', null);
        setFieldValue('import_id', null);
        setFieldValue('smart_list_id', null);
        setFieldValue('segment_id', null);
        setFieldValue('count', audience.filters.count ?? 0);
        setFieldValue('audience_type', 1);
        sendAmplitudeData('campaignListSelected', {
          audience_id: value,
        });
      } else if (value?.endsWith('-segment')) {
        value = value.replace('-segment', '');
        const audience = await handleGetListCount({ segment_id: value, audience_type: 2 });
        setFieldValue('segment_id', value);
        setFieldValue('campaign_id', value);
        setFieldValue('table_id', null);
        setFieldValue('import_id', null);
        setFieldValue('smart_list_id', null);
        setFieldValue('audience_id', null);
        setFieldValue('count', audience?.filters?.count ?? 0);
        setFieldValue('audience_type', 2);
        sendAmplitudeData('campaignListSelected', {
          audience_id: value,
        });
      } else {
        const count = await handleGetListCount({ table_id: value, audience_type: 2 });
        setFieldValue('table_id', value);
        setFieldValue('campaign_id', value);
        setFieldValue('import_id', null);
        setFieldValue('smart_list_id', null);
        setFieldValue('audience_id', null);
        setFieldValue('segment_id', null);
        setFieldValue('count', count);
        setFieldValue('audience_type', 2);
        sendAmplitudeData('campaignListSelected', {
          table_id: value,
        });
      }
    }
  };

  const handleCreateNewAudience = async (payload: {
    name: string;
    count: number;
    lga?: string[];
    state?: string[];
    gender?: string[];
    predicted_religion?: string[];
    predicted_ethnicity?: string[];
  }) => {
    try {
      const { name, state, lga, gender, count, predicted_religion, predicted_ethnicity } = payload;
      dispatch({ type: 'LOADING_STARTED' });
      const audience_list = await addAudience({
        name,
        filters: {
          lga: lga ? lga : undefined,
          state: state ? state : undefined,
          count: count ? count : undefined,
          gender: gender ? gender : undefined,
          predicted_religion: predicted_religion ? predicted_religion : undefined,
          predicted_ethnicity: predicted_ethnicity ? predicted_ethnicity : undefined,
        },
      });
      dispatch({ type: 'LOADING_RESOLVED' });
      setFieldValue('audience_id', `${audience_list.id}`);
      setFieldValue('campaign_id', `${audience_list.id}`);
      setFieldValue('count', audience_list.filters.count);
      setFieldValue('audience_type', 1);
      onCloseNewAudienceModal();
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Audience created" />
        ),
      });
      sendAmplitudeData('newAudienceCreated', { data: payload });
    } catch (error) {
      dispatch({ type: 'LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  const { getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    maxSize: 52428800,
    onDrop: handleBulkUpload,
    accept: '.csv, .xls, .xlsx',
  });

  const getAudienceValue = () => {
    const { table_id, audience_id, smart_list_id, segment_id } = values;
    if (!!table_id) {
      return table_id;
    }
    if (!!smart_list_id) {
      return `${smart_list_id}-smartList`;
    }
    if (!!audience_id) {
      return `${audience_id}-audience`;
    }
    if (!!segment_id) {
      return `${segment_id}-segment`;
    }
    return '';
  };

  return (
    <>
      <Box className="content">
        <Box className="left-section">
          <input {...getInputProps()} />
          <Box mb="2rem">
            <Input
              type="text"
              name="name"
              ref={inputRef}
              value={values.name}
              label="Campaign name"
              onChange={handleChange}
              errorMessage={errors.name}
              placeholder="Give your campaign a name"
              isInvalid={!!touched.name && !!errors.name}
            />
          </Box>
          <Box mb="2rem">
            <Input
              type="text"
              isDisabled
              name="sender_id"
              onChange={handleChange}
              value={values.sender_id}
              errorMessage={errors.sender_id}
              isInvalid={!!touched.sender_id && !!errors.sender_id}
              label={
                <Stack isInline alignItems="center">
                  <Text>Campaign sender ID</Text>
                  <Tooltip
                    zIndex={10000}
                    placement="right"
                    aria-label="Campaign sender id"
                    label="A Sender ID is a quick way to let recipients of your campaign know exactly who it is from."
                  >
                    <Icon size="0.75rem" name="info" color="gray.500" />
                  </Tooltip>
                </Stack>
              }
              placeholder="Give your campaign a sender ID"
            />
          </Box>
          {isAbTest && (
            <FormControl mb="2rem" isInvalid={!!touched.variants_count && !!errors.variants_count}>
              <AdvancedSelect
                options={[1, 2, 3, 4].map(item => ({
                  value: item.toString(),
                  label: item.toString(),
                }))}
                value={values.variants_count}
                placeholder="Select the number of variants"
                isInvalid={!!touched.variants_count && !!errors.variants_count}
                onChange={({ value }) => setFieldValue('variants_count', value)}
                label={
                  <Stack isInline alignItems="center">
                    <Text>Number of message variants</Text>
                    <Tooltip
                      zIndex={10000}
                      placement="right"
                      aria-label="Number of message variants"
                      label="More recipients means more accurate results. We recommend at least 500 recipients per message variant."
                    >
                      <Icon size="0.75rem" name="info" color="gray.500" />
                    </Tooltip>
                  </Stack>
                }
              />
              <FormErrorMessage>{errors.variants_count}</FormErrorMessage>
            </FormControl>
          )}
          <FormControl mb="1rem" isInvalid={!!touched.campaign_id && !!errors.campaign_id}>
            <AdvancedSelect
              isGroup
              isSearchable
              options={lists}
              value={getAudienceValue()}
              label={
                <Stack isInline alignItems="center">
                  <Text>Who will you send this campaign to?</Text>
                  <Tooltip
                    zIndex={10000}
                    placement="right"
                    aria-label="Campaign recipients"
                    label="Choose from your list, smart lists, segments, or target new audiences."
                  >
                    <Icon size="0.75rem" name="info" color="gray.500" />
                  </Tooltip>
                </Stack>
              }
              placeholder="Search & Select a list"
              onChange={({ value }) => handleAudienceChange(value)}
              isInvalid={!!touched.campaign_id && !!errors.campaign_id}
            />
            <FormErrorMessage>{errors.campaign_id}</FormErrorMessage>
          </FormControl>

          <Stack spacing="0.5rem">
            <FormLabel pb="0" fontSize="0.875rem">
              <Stack isInline alignItems="center">
                <Text>Do you want to use Smart Sending?</Text>
                <Tooltip
                  zIndex={10000}
                  placement="right"
                  aria-label="Campaign smart sending"
                  label="Smart Sending automatically prevents subscribers who've recently received a one-time message from receiving another too quickly."
                >
                  <Icon size="0.75rem" name="info" color="gray.500" />
                </Tooltip>
              </Stack>
            </FormLabel>
            <Text fontSize="0.75rem">
              If used, subscribers who have received a message within your Smart Sending (8 hours)
              will be muted from this send.
            </Text>
            <RadioGroup
              isInline
              spacing={5}
              name="smart_sending"
              onChange={handleChange}
              value={values.smart_sending}
            >
              <Radio size="sm" value="1">
                Use Smart Sending
              </Radio>
              <Radio size="sm" value="0">
                Don't use Smart Sending
              </Radio>
            </RadioGroup>
          </Stack>
          <SectionFooter
            onGoBack={onGoBack}
            goBackLabel="Cancel"
            onContinue={handleSubmit}
            continueLabel="Save & Continue"
          />
        </Box>
        <Box className="right-section">
          <Box
            px="2rem"
            py="1rem"
            width="80%"
            borderRadius="8px"
            boxShadow="0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          >
            <Text pb="0.5rem" fontSize="0.875rem" fontWeight={500}>
              Estimated recipients
            </Text>
            <Text fontSize="1rem" fontWeight={600}>
              {numberWithCommas(values.count)}
            </Text>
          </Box>
        </Box>
      </Box>
      <NewAudienceModal
        states={states}
        genders={genders}
        religions={religions}
        ethnicGroups={ethnicGroups}
        hasAudiences={hasAudiences}
        isOpen={isOpenNewAudienceModal}
        isLoading={loading === 'pending'}
        onClose={onCloseNewAudienceModal}
        onSubmit={handleCreateNewAudience}
      />
    </>
  );
};
