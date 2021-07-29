import { Box, Heading, Stack, Text, useDisclosure, useToast } from '@chakra-ui/core';
import { ToastBox } from 'app/components';
import { format } from 'date-fns';
import { FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { generateMarketingReport } from '../campaigns';
import { MarketingReportSchema } from '../campaigns/campaigns.types';
import { GenerateReportModal, ReportCard } from './components';

export const MarketingReports = () => {
  const [selectedReport, setSelectedReport] = useState<number | undefined>();

  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const reportTypes: { [key: number]: string } = {
    1: 'marketing.schedule',
    2: 'marketing.onetime',
    3: 'marketing.billable',
  };

  const handleOpenModal = (type: number) => {
    onOpen();
    setSelectedReport(type);
  };

  const handleCloseModal = () => {
    setSelectedReport(undefined);
    onClose();
  };

  const handleGenerateReport = async (
    values: Pick<MarketingReportSchema, 'from' | 'recipient' | 'to'>,
    formikBag: FormikHelpers<Pick<MarketingReportSchema, 'from' | 'recipient' | 'to'>>,
  ) => {
    try {
      if (selectedReport) {
        formikBag.setSubmitting(true);
        await generateMarketingReport({
          ...values,
          type: reportTypes[selectedReport],
          to: format(values.to ? new Date(values.to) : new Date(), 'yyyy-MM-dd'),
          from: format(values.from ? new Date(values.from) : new Date(), 'yyyy-MM-dd'),
        });
        formikBag.setSubmitting(false);
        onClose();
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" onClose={onClose} message="Report generated successfully" />
          ),
        });
      }
    } catch (error) {
      formikBag.setSubmitting(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
      });
    }
  };

  return (
    <Box>
      <Box pb="2.5rem" alignItems="center">
        <Box>
          <Heading as="h4" pb="0.2rem" fontSize="1.2rem" fontWeight={600} color="black">
            Generate a Report
          </Heading>
          <Text maxW="500px" color="#4f4f4f" fontSize="0.875rem">
            Select a report below to get started.
          </Text>
        </Box>
      </Box>
      <Stack isInline spacing="1rem" alignItems="center" flexWrap="wrap">
        <Box width={['100%', '100%', 'calc(50% - 1rem)', 'calc(50% - 1rem)']}>
          <ReportCard
            onClick={() => handleOpenModal(1)}
            heading="Scheduled Message Performance"
            caption="See how each of your scheduled messages is performing by day"
          />
        </Box>
        <Box width={['100%', '100%', 'calc(50% - 1rem)', 'calc(50% - 1rem)']}>
          <ReportCard
            onClick={() => handleOpenModal(2)}
            heading="One-Time Message Performance"
            caption="See your aggregated one-time message performance across a specified date range"
          />
        </Box>
        <Box width={['100%', '100%', 'calc(50% - 1rem)', 'calc(50% - 1rem)']}>
          <ReportCard
            heading="Billable Spend"
            onClick={() => handleOpenModal(3)}
            caption="Break down invoices with estimated message costs and carrier fees"
          />
        </Box>
      </Stack>
      <GenerateReportModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onSubmit={handleGenerateReport}
      />
    </Box>
  );
};
