import { Box, Heading, Icon, Stack, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/core';
import { FormikHelpers } from 'formik';
import React from 'react';
import { useLoading } from '../../../../../../hooks';
import { numberWithCommas } from '../../../../../../utils';
import { sendAmplitudeData } from '../../../../../../utils/amplitude';
import { ToastBox, Button } from 'app/components';
import { html2Text } from '../../../templates/templates.utils';
import { sendTestCampaignMessage } from '../../campaigns.service';
import { CampaignPayload } from './planner.index';
import { SectionFooter, SectionFooterProps } from './planner.layout';
import { SendCampaignModal } from './send-campaign-modal';
import { TestMessageModal } from './test-message-modal';

interface ReviewProps {
  isAbTest?: boolean;
  isSaving?: boolean;
  credit_balance: number;
  isSavingDraft?: boolean;
  campaign: CampaignPayload;
  onGoToSection?(section: number): void;
  onGoBack: SectionFooterProps['onGoBack'];
  onSubmit: (payload: Partial<CampaignPayload>) => Promise<void>;
  onSaveDraft: (payload: Partial<CampaignPayload>) => Promise<void>;
}

export const Review = ({
  isAbTest,
  onGoBack,
  campaign,
  isSaving,
  onSubmit,
  onSaveDraft,
  isSavingDraft,
  onGoToSection,
  credit_balance,
}: ReviewProps) => {
  const { count, state, content, sender_id, is_smart_send, contents } = campaign;
  const {
    isOpen: testMessageIsOpen,
    onOpen: onOpenTestMessage,
    onClose: onCloseTestMessage,
  } = useDisclosure();
  const {
    isOpen: sendCampaignIsOpen,
    onOpen: onOpenSendCampaignModal,
    onClose: onCloseSendCampaignModal,
  } = useDisclosure();

  const toast = useToast();
  const { dispatch, loading } = useLoading();

  const handleSaveDraft = () => {
    const { template_type, campaign_id, ...rest } = campaign;
    onSaveDraft({
      ...rest,
      template_id: template_type === 'built-in' ? null : campaign.template_id,
      content: campaign.template_id && template_type !== 'built-in' ? null : campaign.content,
    });
  };

  const handleSendTestMessage = async (
    { recipients }: { recipients: string },
    { resetForm }: FormikHelpers<{ recipients: string }>,
  ) => {
    if (content) {
      const payload = {
        recipients,
        sender_id,
        content: isAbTest ? contents?.[0].content ?? '' : content,
      };
      try {
        dispatch({ type: 'LOADING_STARTED' });
        await sendTestCampaignMessage(payload);
        dispatch({ type: 'LOADING_RESOLVED' });
        onCloseTestMessage();
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

  return (
    <>
      <Box className="content">
        <Box className="left-section">
          <Box>
            <Stack
              py="1rem"
              isInline
              spacing="0.2rem"
              borderBottomWidth="1px"
              justifyContent="space-between"
            >
              <Stack>
                <Heading fontSize="0.875rem" fontWeight={600}>
                  Estimated recipients
                </Heading>
                <Text fontSize="0.75rem" fontWeight={600}>
                  {numberWithCommas(count)}
                </Text>
                <Text fontSize="0.75rem">This campaign will be sent to all subscribers.</Text>
                <Stack isInline alignItems="center">
                  <Text fontSize="0.75rem" fontWeight={600}>
                    Smart Sending {is_smart_send ? 'ON' : 'OFF'}
                  </Text>
                  <Tooltip
                    zIndex={10000}
                    placement="right"
                    aria-label="Campaign sender id"
                    label="A Sender ID is a quick way to let recipients of your campaign know exactly who it is from."
                  >
                    <Icon size="0.75rem" name="info" color="gray.500" />
                  </Tooltip>
                </Stack>
              </Stack>
              <Button
                size="sm"
                variant="outline"
                variantColor="blue"
                onClick={() => onGoToSection && onGoToSection(0)}
              >
                Edit recipients
              </Button>
            </Stack>
            <Stack py="1rem" isInline justifyContent="space-between">
              <Box>
                <Heading pb="0.5rem" fontSize="0.875rem" fontWeight={600}>
                  Campaign design
                </Heading>
                {isAbTest ? (
                  contents?.map(item => (
                    <ReviewContentBox content={item.content} onClick={onOpenTestMessage} />
                  ))
                ) : (
                  <ReviewContentBox content={content} onClick={onOpenTestMessage} />
                )}
              </Box>
              <Button size="sm" onClick={onGoBack} variant="outline" variantColor="blue">
                Edit design
              </Button>
            </Stack>
            {(!state || state === 'pristine' || state === 'draft') && (
              <Button
                size="sm"
                variant="link"
                variantColor="blue"
                isLoading={isSavingDraft}
                onClick={handleSaveDraft}
              >
                Save campaign as draft
              </Button>
            )}
          </Box>
          <SectionFooter
            onGoBack={onGoBack}
            goBackLabel="Back"
            onContinue={onOpenSendCampaignModal}
            continueLabel="Schedule or Send Now"
          />
        </Box>
      </Box>
      <SendCampaignModal
        campaign={campaign}
        isLoading={isSaving}
        isOpen={sendCampaignIsOpen}
        onCreateCampaign={onSubmit}
        credit_balance={credit_balance}
        onClose={onCloseSendCampaignModal}
      />
      <TestMessageModal
        isOpen={testMessageIsOpen}
        onClose={onCloseTestMessage}
        credit_balance={credit_balance}
        isLoading={loading === 'pending'}
        onSubmit={handleSendTestMessage}
      />
    </>
  );
};

const ReviewContentBox = ({ content, onClick }: { content?: string | null; onClick(): void }) => {
  return (
    <Box
      p="1rem"
      mb="1rem"
      width="340px"
      borderWidth="1px"
      borderRadius="4px"
      borderLeftWidth="4px"
      borderLeftColor="blue.500"
    >
      {content && (
        <Text maxH="150px" pb="0.5rem" overflowY="auto" fontSize="0.75rem">
          {html2Text(content)}
        </Text>
      )}
      <Button size="sm" isFullWidth variant="outline" variantColor="blue" onClick={onClick}>
        Send test message
      </Button>
    </Box>
  );
};
