import {
  Box,
  FormControl,
  FormErrorMessage,
  Heading,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/core';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AdvancedSelect, Button, getTimeArray, SmallText, ToastBox } from 'app/components';
import { getMarketingSettings, saveMarketingSettings } from '../campaigns';
import { MarketingSettingsSchema } from '../campaigns/campaigns.types';

type MarketingSettingsFormValues = {
  smart_sending_hours: string;
  quiet_hour_start: string;
  quiet_hour_end: string;
};

export const MarketingSettings = () => {
  const { data } = useQuery('marketing-settings', getMarketingSettings);
  const { marketing } = data ?? {};

  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate, isLoading: isSavingSettings } = useMutation<any, AxiosError, any, any>(
    (payload: MarketingSettingsSchema) => saveMarketingSettings(payload),
    {
      onMutate: async data => {
        await queryClient.cancelQueries('marketing-settings');

        const previousData = queryClient.getQueryData('marketing-settings');

        queryClient.setQueryData('marketing-settings', data);

        return { previousData, data };
      },
      onSuccess: () => {
        queryClient.invalidateQueries('marketing-settings');
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" message="Settings saved successfully" onClose={onClose} />
          ),
        });
      },
      onError: (error, newTodo, context) => {
        queryClient.setQueryData('marketing-settings', context.previousTodo);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox message={error.message} onClose={onClose} />,
        });
      },
    },
  );

  const handleSaveSettigns = (values: MarketingSettingsFormValues) => {
    const { smart_sending_hours, quiet_hour_start, quiet_hour_end } = values;
    const payload = {
      ...data,
      marketing: {
        smart_send: parseFloat(smart_sending_hours),
        quiet_hour: {
          from: quiet_hour_start,
          to: quiet_hour_end,
        },
      },
    };
    mutate(payload);
  };

  const {
    values,
    errors,
    touched,
    handleSubmit,
    setFieldValue,
  } = useFormik<MarketingSettingsFormValues>({
    enableReinitialize: true,
    initialValues: {
      smart_sending_hours: marketing?.smart_send.toString(),
      quiet_hour_start: marketing?.quiet_hour?.from,
      quiet_hour_end: marketing?.quiet_hour?.to,
    },
    onSubmit: values => handleSaveSettigns(values),
  });

  return (
    <Box>
      <Heading as="h4" pb="2rem" fontSize="1.2rem" fontWeight={600} color="black">
        Message Settings
      </Heading>
      <form onSubmit={handleSubmit}>
        <Box mb="2rem" pb="2rem" borderBottomWidth="1px">
          <Heading as="h6" pb="0.2rem" fontSize="1.2rem" fontWeight={600} color="black">
            Smart Sending
          </Heading>
          <SmallText pb="1.5rem" maxW="640px" color="#4f4f4f">
            Smart Sending protects you from inadvertently sending messages too often - recipients
            will be skipped if they've already received a message within the Smart Sending period.
          </SmallText>
          <SmallText pb="1.5rem" maxW="640px" color="#4f4f4f">
            The default Smart Sending period is <strong>8 hours</strong>, meaning any recipient who
            have received a message from you within the last 8 hours will be skipped.
          </SmallText>
          <Stack maxW="640px" isInline alignItems="center">
            <FormControl
              width={['100%', '100%', '48%']}
              isInvalid={!!touched.smart_sending_hours && !!errors.smart_sending_hours}
            >
              <AdvancedSelect
                size="sm"
                isSearchable
                value={values?.smart_sending_hours}
                placeholder="Select Smart Sending Hour"
                isInvalid={!!touched.smart_sending_hours && !!errors.smart_sending_hours}
                onChange={({ value }) => setFieldValue('smart_sending_hours', [value])}
                options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(
                  item => ({
                    label: item,
                    value: item,
                  }),
                )}
              />
              <FormErrorMessage>{errors.smart_sending_hours}</FormErrorMessage>
            </FormControl>
            <Text fontWeight={600}>Hour(s)</Text>
          </Stack>
        </Box>
        <Box mb="2rem" pb="2rem" borderBottomWidth="1px">
          <Heading as="h6" pb="0.2rem" fontSize="1.2rem" fontWeight={600} color="black">
            Quiet Hours
          </Heading>
          <SmallText pb="1.5rem" maxW="640px" color="#4f4f4f">
            Quiet Hours prevent your recipients from receiving automated messages during specified
            hours, delaying delivery until the window is over.
          </SmallText>
          <SmallText pb="1.5rem" maxW="640px" color="#4f4f4f">
            Default Quiet Hours are <strong>9pm</strong> to <strong>12pm</strong>, based on the
            receipients time zone. This means that all scheduled messages will be delayed until
            12pm.
          </SmallText>
          <Stack maxW="640px" isInline alignItems="center">
            <FormControl
              width={['100%', '100%', '48%']}
              isInvalid={!!touched.quiet_hour_start && !!errors.quiet_hour_start}
            >
              <AdvancedSelect
                size="sm"
                isSearchable
                placeholder="Select time"
                value={values?.quiet_hour_start ? values.quiet_hour_start : ''}
                isInvalid={!!touched.quiet_hour_start && !!errors.quiet_hour_start}
                onChange={({ value }) => setFieldValue('quiet_hour_start', [value])}
                options={getTimeArray().map(item => ({ label: item, value: item }))}
              />
              <FormErrorMessage>{errors.quiet_hour_start}</FormErrorMessage>
            </FormControl>
            <FormControl
              width={['100%', '100%', '48%']}
              isInvalid={!!touched.quiet_hour_end && !!errors.quiet_hour_end}
            >
              <AdvancedSelect
                size="sm"
                isSearchable
                placeholder="Select time"
                value={values?.quiet_hour_end ? values.quiet_hour_end : ''}
                isInvalid={!!touched.quiet_hour_end && !!errors.quiet_hour_end}
                onChange={({ value }) => setFieldValue('quiet_hour_end', [value])}
                options={getTimeArray().map(item => ({ label: item, value: item }))}
              />
              <FormErrorMessage>{errors.quiet_hour_end}</FormErrorMessage>
            </FormControl>
          </Stack>
        </Box>
        <Button size="sm" type="submit" variantColor="blue" isLoading={isSavingSettings}>
          Save changes
        </Button>
      </form>
    </Box>
  );
};
