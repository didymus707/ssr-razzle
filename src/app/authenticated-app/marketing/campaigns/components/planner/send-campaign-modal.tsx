import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  ModalCloseButton,
  Stack,
  Text,
} from '@chakra-ui/core';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { numberWithCommas } from '../../../../../../utils';
import {
  AdvancedSelect,
  DatePickerComponent,
  getTimeArray,
  ModalContainer,
  ModalContainerOptions,
  timezones,
  Button,
} from 'app/components';
import scheduleImage from '../../assets/campaign-schedule.svg';
import sendNowImage from '../../assets/campaign-send-now.svg';
import { CampaignData } from '../../campaigns.types';
import { CreditTopupCard } from '../credit-topup-card';
import { CampaignPayload } from './planner.index';

type SendCampaignModalProps = {
  isLoading?: boolean;
  credit_balance: number;
  campaign?: CampaignPayload;
  onCreateCampaign(payload: CampaignPayload): void;
} & ModalContainerOptions;

interface SectionProps {
  credit_balance: number;
  initialValues?: CampaignPayload;
  onSubmit(data: CampaignData): void;
  onClose: SendCampaignModalProps['onClose'];
  isLoading: SendCampaignModalProps['isLoading'];
}

const SendNow = ({ onClose, initialValues, isLoading, onSubmit, credit_balance }: SectionProps) => {
  const timezone =
    typeof window.Intl === undefined ? '' : window.Intl.DateTimeFormat().resolvedOptions().timeZone;
  const handleSubmit = () => {
    if (initialValues) {
      const { template_type, campaign_id, ...rest } = initialValues;
      onSubmit({
        ...rest,
        timezone,
        state: 'started',
        template_id: template_type === 'built-in' ? null : rest.template_id,
        content: rest.template_id && template_type !== 'built-in' ? null : rest.content,
      });
    }
  };

  const amountToPay = (initialValues?.count ?? 0) * 2.65;

  return (
    <>
      {!!initialValues?.count && credit_balance / 100 < amountToPay && (
        <Box px="1.5rem" pb="1rem">
          <CreditTopupCard
            amount={amountToPay}
            content={`We'll only be sending approximately ${numberWithCommas(
              Math.floor(credit_balance / (2.65 * 100)),
            )} SMSs as you are low on campaign credits for the number of recipients (${numberWithCommas(
              initialValues?.count,
            )}) for this campaign. Please top-up to ensure all recipients receive this campaign.`}
          />
        </Box>
      )}
      <Flex
        py="1rem"
        px="1.5rem"
        alignItems="center"
        borderTopWidth="1px"
        justifyContent="space-between"
      >
        <Button size="sm" width="48%" onClick={onClose} variant="outline" variantColor="blue">
          Cancel
        </Button>
        <Button
          size="sm"
          width="48%"
          variantColor="blue"
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          Send
        </Button>
      </Flex>
    </>
  );
};

const Schedule = ({
  onClose,
  isLoading,
  onSubmit,
  initialValues,
  credit_balance,
}: SectionProps) => {
  const userTimezone =
    typeof window.Intl === undefined ? '' : window.Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { values, touched, errors, handleSubmit, setFieldValue } = useFormik({
    onSubmit: payload => {
      const { template_type, campaign_id, ...rest } = payload;
      onSubmit({
        ...rest,
        state: 'started',
        template_id: template_type === 'built-in' ? null : rest.template_id,
        content: rest.template_id && template_type !== 'built-in' ? null : rest.content,
        schedule_end: rest.schedule_end && format(rest.schedule_end, 'yyyy-MM-dd hh:mm a'),
        schedule_start: rest.schedule_start && format(rest.schedule_start, 'yyyy-MM-dd hh:mm a'),
      });
    },
    validationSchema: yup.object().shape({
      timezone: yup.string().required('Timezone is required'),
      schedule_end: yup.date().required('End date is required'),
      schedule_start: yup.date().required('Start date is required'),
      send_time: yup.array().required('Send time is required').nullable(),
    }),
    initialValues: initialValues
      ? {
          ...initialValues,
          timezone: initialValues.timezone ?? userTimezone,
          schedule_start: initialValues?.schedule_start
            ? new Date(initialValues?.schedule_start)
            : undefined,
          schedule_end: initialValues?.schedule_end
            ? new Date(initialValues?.schedule_end)
            : undefined,
        }
      : {
          timezone: userTimezone,
          schedule_start: new Date(),
          schedule_end: new Date(),
          send_time: [`${new Date().getHours() + 1}:00`],
        },
  });

  const amountToPay = (initialValues?.count ?? 0) * 3.65;

  return (
    <>
      <Box px="1.5rem">
        <Stack isInline alignItems="center" justify="space-between">
          <FormControl
            mb="8px"
            width={['100%', '100%', '48%']}
            isInvalid={!!touched.schedule_start && !!errors.schedule_start}
          >
            <FormLabel fontSize="0.8rem">Start Date</FormLabel>
            <DatePickerComponent
              size="sm"
              value={values.schedule_start}
              onDayChange={date => setFieldValue('schedule_start', date)}
              dayPickerProps={{ disabledDays: { before: new Date() } }}
              isInvalid={!!touched.schedule_start && !!errors.schedule_start}
            />
            <FormErrorMessage>{errors.schedule_end}</FormErrorMessage>
          </FormControl>
          <FormControl
            mb="8px"
            width={['100%', '100%', '48%']}
            isInvalid={!!touched.schedule_end && !!errors.schedule_end}
          >
            <FormLabel fontSize="0.8rem">End Date</FormLabel>
            <DatePickerComponent
              size="sm"
              value={values.schedule_end}
              onDayChange={date => setFieldValue('schedule_end', date)}
              isInvalid={!!touched.schedule_end && !!errors.schedule_end}
              dayPickerProps={{ disabledDays: { before: new Date() } }}
            />
            <FormErrorMessage>{errors.schedule_end}</FormErrorMessage>
          </FormControl>
        </Stack>
        <Stack isInline alignItems="center" justify="space-between">
          <FormControl
            width={['100%', '100%', '48%']}
            isInvalid={!!touched.send_time && !!errors.send_time}
          >
            <AdvancedSelect
              size="sm"
              isSearchable
              placeholder="Select time"
              value={values?.send_time ? values.send_time[0] : ''}
              isInvalid={!!touched.send_time && !!errors.send_time}
              onChange={({ value }) => setFieldValue('send_time', [value])}
              options={getTimeArray().map(item => ({ label: item, value: item }))}
            />
            <FormErrorMessage>{errors.send_time}</FormErrorMessage>
          </FormControl>
          <FormControl
            width={['100%', '100%', '48%']}
            isInvalid={!!touched.timezone && !!errors.timezone}
          >
            <AdvancedSelect
              size="sm"
              isSearchable
              value={values.timezone}
              placeholder="Select timezone"
              isInvalid={!!touched.timezone && !!errors.timezone}
              onChange={({ value }) => setFieldValue('timezone', value)}
              options={timezones.map(item => ({ label: item, value: item }))}
            />
            <FormErrorMessage>{errors.timezone}</FormErrorMessage>
          </FormControl>
        </Stack>
      </Box>
      {!!initialValues?.count && credit_balance / 100 < amountToPay && (
        <Box px="1.5rem" pb="1rem">
          <CreditTopupCard
            amount={amountToPay}
            content={`We'll only be sending approximately ${numberWithCommas(
              Math.floor(credit_balance / (3.65 * 100)),
            )} SMSs as you are low on campaign credits for the number of recipients (${numberWithCommas(
              initialValues?.count,
            )}) for this campaign. Please top-up to ensure all recipients receive this campaign.`}
          />
        </Box>
      )}
      <Flex
        py="1rem"
        mt="1.5rem"
        px="1.5rem"
        alignItems="center"
        borderTopWidth="1px"
        justifyContent="space-between"
      >
        <Button size="sm" width="48%" onClick={onClose} variant="outline" variantColor="blue">
          Cancel
        </Button>
        <Button
          size="sm"
          width="48%"
          variantColor="blue"
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          Schedule
        </Button>
      </Flex>
    </>
  );
};

export const SendCampaignModal = ({
  isOpen,
  onClose,
  campaign,
  isLoading,
  credit_balance,
  onCreateCampaign,
}: SendCampaignModalProps) => {
  const [section, setSection] = React.useState(campaign?.schedule_start ? 0 : 1);

  return (
    <ModalContainer
      size="sm"
      isOpen={isOpen}
      onClose={onClose}
      title="Ready to send?"
      titleStyleProps={{ fontSize: '1rem' }}
    >
      <ModalCloseButton size="sm" />
      <Box px="1.5rem">
        <Flex w="100%" pb="1.5rem" justifyContent="space-between" alignItems="center">
          <Flex
            p="0.8rem"
            width="48%"
            as="button"
            align="center"
            outline="none"
            justify="center"
            borderRadius="4px"
            flexDirection="column"
            onClick={() => setSection(0)}
            borderWidth={section === 0 ? '2px' : '1px'}
            borderColor={section === 0 ? 'primary' : '#E2E8F0'}
          >
            <Image width="80px" src={scheduleImage} />
            <FormLabel pb="0" fontSize="0.8rem">
              Schedule
            </FormLabel>
            <Text pb="0.5rem" color="gray.600" fontSize="0.7rem">
              Send on a future date
            </Text>
          </Flex>
          <Flex
            p="0.8rem"
            as="button"
            width="48%"
            align="center"
            outline="none"
            justify="center"
            borderRadius="4px"
            flexDirection="column"
            onClick={() => setSection(1)}
            borderWidth={section === 1 ? '2px' : '1px'}
            borderColor={section === 1 ? 'primary' : '#E2E8F0'}
          >
            <Image width="110px" src={sendNowImage} />
            <FormLabel textAlign="center" pb="0" fontSize="0.8rem">
              Send now
            </FormLabel>
            <Text textAlign="center" pb="0.5rem" color="gray.600" fontSize="0.7rem">
              Send immediately
            </Text>
          </Flex>
        </Flex>
      </Box>
      {section === 0 && (
        <Schedule
          onClose={onClose}
          isLoading={isLoading}
          initialValues={campaign}
          onSubmit={onCreateCampaign}
          credit_balance={credit_balance}
        />
      )}
      {section === 1 && (
        <SendNow
          onClose={onClose}
          isLoading={isLoading}
          initialValues={campaign}
          onSubmit={onCreateCampaign}
          credit_balance={credit_balance}
        />
      )}
    </ModalContainer>
  );
};
