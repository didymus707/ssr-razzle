import { ModalBody } from '@chakra-ui/core';
import { fetchPotentialAccts } from 'app/authenticated-app/channels';
import { ModalContainer, ModalContainerOptions } from 'app/components';
import React from 'react';
import { useQuery } from 'react-query';

export type PotentialChannelsModalProps = ModalContainerOptions & { id?: string; channel: string };

export const PotentialChannelsModal = (props: PotentialChannelsModalProps) => {
  const { isOpen, onClose, id, channel } = props;
  const { data: response } = useQuery('potential-channels', () =>
    fetchPotentialAccts({
      channel,
      id,
    }),
  );
  console.log(response?.data);
  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <ModalBody></ModalBody>
    </ModalContainer>
  );
};
