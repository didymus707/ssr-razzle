import React from 'react';
import { IconButton, Modal, ModalOverlay } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import { NoSubscriptionDialogWrapper as Wrapper } from './index.styles';
import { EmptyState } from '../EmptyState';
import noSubscription from '../../authenticated-app/marketing/campaigns/assets/no-subscription.svg';
import { RootState } from '../../../root';
import { connect } from 'react-redux';
import { closeNoSubscriptionModal } from '../../authenticated-app/globals';
import { Button } from '../Button';

interface Props {
  isOpen: boolean;
  heading: string;
  subHeading: string;
  onClose: () => void;
}

const mapStateToProps = (state: RootState) => ({
  isOpen: state.globals.noSubscriptionModalIsOpen,
  heading: state.globals.noSubscriptionModalHeading,
  subHeading: state.globals.noSubscriptionModalSubHeading,
});

const stateConnector = connect(mapStateToProps, {
  onClose: closeNoSubscriptionModal,
});

const Component = ({ isOpen, onClose, heading, subHeading }: Props) => {
  const router_history = useHistory();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <Wrapper>
        <IconButton
          position="absolute"
          aria-label="close"
          icon="small-close"
          variant="solid"
          variantColor="blue"
          borderRadius="15px"
          size="xs"
          right="-10px"
          top="-10px"
          onClick={onClose}
        />

        <EmptyState
          width="400px"
          imageSize="100px"
          image={noSubscription}
          heading={heading}
          subheading={subHeading}
        >
          <Button
            size="sm"
            marginY="10px"
            variantColor="blue"
            onClick={() => {
              onClose();
              router_history.push('/s/settings/organization/billing/upgrade');
            }}
          >
            Upgrade
          </Button>
        </EmptyState>
      </Wrapper>
    </Modal>
  );
};

// @ts-ignore
export const NoSubscriptionDialog = stateConnector(Component);
