import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/core';
import { selectOrganisations } from 'app/authenticated-app/settings/slices';
import { Button, Input, ToastBox } from 'app/components';
import { selectOrganisationID } from 'app/unauthenticated-app/authentication';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { sendAmplitudeData } from 'utils/amplitude';
import * as yup from 'yup';
import { numberWithCommas } from '../../../../../utils';
import { AdvancedSelect, FileUploader } from '../../../../components';
import { getCampaignAudience } from '../../campaigns';
import { SectionFooter } from '../../campaigns/components/planner/planner.layout';
import { CouponPayload } from './create-coupon';

type FormValues = CouponPayload & { campaign_id: string; isUnique: string };

export type CouponSetupProps = {
  lists?: any;
  onCancel(): void;
  type?: 'static' | 'upload';
  initialValues?: CouponPayload;
  onSubmit(payload: Partial<CouponPayload>): void;
};

export const CouponSetup = (props: CouponSetupProps) => {
  const { lists, onSubmit, onCancel, initialValues } = props;

  const toast = useToast();
  const organisations = useSelector(selectOrganisations);
  const organizationID = useSelector(selectOrganisationID);
  const currentOrganization = organisations?.find((i: any) => i.id === organizationID);

  const organisationName = currentOrganization?.['name'];
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    submitForm,
  } = useFormik<FormValues>({
    onSubmit: values => {
      const { isUnique, campaign_id, ...rest } = values;
      onSubmit({ ...rest, unique: !!(isUnique === '1') });
    },
    enableReinitialize: true,
    //@ts-ignore
    initialValues: isEmpty(initialValues)
      ? {
          name: '',
          count: 0,
          unique: '1',
          table_id: '',
          type: 'coupon',
          campaign_id: '',
          file: undefined,
          sender_id: organisationName,
        }
      : {
          ...initialValues,
          isUnique: initialValues?.unique ? '1' : '0',
          campaign_id:
            initialValues?.smart_list_id ||
            initialValues?.table_id ||
            initialValues?.audience_id ||
            initialValues?.segment_id,
        },
    validationSchema: yup.object().shape({
      name: yup.string().required('Coupon name is required'),
      campaign_id: yup.string().required('Select coupon recipients'),
      file: yup.string().required('File is required'),
    }),
  });

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = (files: File[]) => {
    setFieldValue('file', files[0]);
  };

  const handleRemoveFile = () => {
    setFieldValue('file', undefined);
  };

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

  const handleAudienceChange = async (value?: string) => {
    if (value?.endsWith('-smartList')) {
      value = value.replace('-smartList', '');
      const count = await handleGetListCount({ smart_list_id: value, audience_type: 2 });
      setFieldValue('smart_list_id', value);
      setFieldValue('campaign_id', value);
      setFieldValue('table_id', null);
      setFieldValue('segment_id', null);
      setFieldValue('count', count);
      setFieldValue('audience_type', 2);
      sendAmplitudeData('couponListSelected', {
        smart_list_id: value,
      });
    } else if (value?.endsWith('-segment')) {
      value = value.replace('-segment', '');
      const count = await handleGetListCount({ segment_id: value, audience_type: 2 });
      setFieldValue('segment_id', value);
      setFieldValue('campaign_id', value);
      setFieldValue('table_id', null);
      setFieldValue('smart_list_id', null);
      setFieldValue('count', count);
      setFieldValue('audience_type', 2);
      sendAmplitudeData('couponListSelected', {
        smart_list_id: value,
      });
    } else {
      const count = await handleGetListCount({ table_id: value, audience_type: 2 });
      setFieldValue('table_id', value);
      setFieldValue('campaign_id', value);
      setFieldValue('smart_list_id', null);
      setFieldValue('segment_id', null);
      setFieldValue('count', count);
      setFieldValue('audience_type', 2);
      sendAmplitudeData('campaignListSelected', {
        table_id: value,
      });
    }
  };

  const getAudienceValue = () => {
    const { table_id, smart_list_id, segment_id } = values;
    if (!!table_id) {
      return table_id;
    }
    if (!!smart_list_id) {
      return `${smart_list_id}-smartList`;
    }
    if (!!segment_id) {
      return `${segment_id}-segment`;
    }
    return '';
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <Box className="content">
        <Box className="left-section">
          <Box mb="2rem">
            <Input
              type="text"
              name="name"
              ref={inputRef}
              value={values.name}
              label="Coupon set name"
              onChange={handleChange}
              errorMessage={errors.name}
              isInvalid={!!touched.name && !!errors.name}
              placeholder="Give your coupon set a name"
            />
          </Box>
          <Box>
            <FormLabel fontSize="0.875rem" marginBottom="0.2rem">
              <Stack isInline alignItems="center">
                <Text>Select coupons to upload</Text>
                <Tooltip
                  zIndex={10000}
                  placement="right"
                  aria-label="Coupon set upload"
                  label="File must be in CSV format with a single column and no header"
                >
                  <Icon size="0.75rem" name="info" color="gray.500" />
                </Tooltip>
              </Stack>
            </FormLabel>
            <FormControl mb="2rem" isInvalid={!!errors.file}>
              <Stack isInline alignItems="center">
                <FileUploader
                  maxSize={52428800}
                  onUpload={handleUpload}
                  accept={'.csv, .xls, .xlsx'}
                >
                  <Button
                    w="200px"
                    variant="outline"
                    variantColor="blue"
                    size="sm"
                    fontWeight="500"
                  >
                    Choose file
                  </Button>
                </FileUploader>
                <Stack isInline alignItems="center">
                  <Text>{values?.file?.name}</Text>
                  {!!values.file && (
                    <IconButton
                      size="sm"
                      rounded="50%"
                      variant="ghost"
                      icon="small-close"
                      aria-label="remove file"
                      onClick={handleRemoveFile}
                    />
                  )}
                </Stack>
              </Stack>

              <FormErrorMessage>{errors.file}</FormErrorMessage>
            </FormControl>
          </Box>
          <FormControl mb="1rem" isInvalid={!!touched.campaign_id && !!errors.campaign_id}>
            <AdvancedSelect
              isGroup
              isSearchable
              options={lists}
              value={getAudienceValue()}
              label={
                <Stack isInline alignItems="center">
                  <Text>Who will you send this campaign to?</Text>
                </Stack>
              }
              placeholder="Search & Select a list"
              isInvalid={!!touched.campaign_id && !!errors.campaign_id}
              onChange={({ value }) => handleAudienceChange(value)}
            />
            <FormErrorMessage>{errors.campaign_id}</FormErrorMessage>
          </FormControl>
          <Stack spacing="0.5rem">
            <FormLabel pb="0" fontSize="0.875rem">
              <Stack isInline alignItems="center">
                <Text>Do you want the coupons to be unique for each recipient?</Text>
              </Stack>
            </FormLabel>
            <RadioGroup
              isInline
              spacing={5}
              name="isUnique"
              onChange={handleChange}
              value={values.isUnique}
            >
              <Radio size="sm" value="1">
                Yes
              </Radio>
              <Radio size="sm" value="0">
                No
              </Radio>
            </RadioGroup>
          </Stack>

          <SectionFooter
            onGoBack={onCancel}
            goBackLabel="Cancel"
            onContinue={submitForm}
            continueLabel="Save & Continue "
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
    </>
  );
};
