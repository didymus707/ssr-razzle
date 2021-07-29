import { Box, Icon, ModalBody, ModalCloseButton, Stack, Text } from '@chakra-ui/core';
import { format } from 'date-fns';
import React from 'react';
import { ModalContainer, ModalContainerOptions } from '../../../../components';
import { CampaignData } from '../campaigns.types';

type Props = {
  campaign?: CampaignData;
  isOpen: ModalContainerOptions['isOpen'];
  onClose: ModalContainerOptions['onClose'];
};

export const CampaingPreviewModal = (props: Props) => {
  const { isOpen, onClose, campaign } = props;
  const { name, audience, schedule_start, schedule_end, template, content, template_content } =
    campaign ?? {};
  return (
    <ModalContainer title={name} isOpen={isOpen} onClose={onClose}>
      <ModalCloseButton size="sm" />
      <ModalBody p="0">
        <Box py="1.5rem">
          <Stack px="1.5rem" isInline borderBottomWidth="1px" pb="1rem" mb="1rem">
            <Icon top="4px" position="relative" name="check-circle" color="#47B881" />
            <Box>
              <Text pb="0.5rem" fontWeight={500}>
                Audience
              </Text>
              <Text>{audience?.count}</Text>
            </Box>
          </Stack>
          {schedule_start && schedule_end && (
            <Stack px="1.5rem" isInline borderBottomWidth="1px" pb="1rem" mb="1rem">
              <Icon top="4px" position="relative" name="check-circle" color="#47B881" />
              <Box>
                <Text pb="0.5rem" fontWeight={500}>
                  Schedule
                </Text>
                <Stack isInline alignItems="center" spacing="2rem">
                  <Stack>
                    <Text>Start Date</Text>
                    <Stack isInline alignItems="center">
                      <Icon name="calendar" />
                      <Text>{format(new Date(schedule_start), 'dd MMM yyyy')}</Text>
                    </Stack>
                  </Stack>
                  <Stack>
                    <Text>End Date</Text>
                    <Stack isInline alignItems="center">
                      <Icon name="calendar" />
                      <Text>{format(new Date(schedule_end), 'dd MMM yyyy')}</Text>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          )}
          <Stack px="1.5rem" isInline borderBottomWidth="1px" pb="1rem" mb="1rem">
            <Icon top="4px" position="relative" name="check-circle" color="#47B881" />
            <Box>
              <Text pb="0.5rem" fontWeight={500}>
                Message (Text)
              </Text>
              <Text>{content || template || template_content}</Text>
            </Box>
          </Stack>
        </Box>
      </ModalBody>
    </ModalContainer>
  );
};
