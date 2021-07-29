import React from 'react';
import { Box, Alert, AlertIcon, IconButton, Modal, ModalOverlay } from '@chakra-ui/core';
import { EnrichConfirmationModalWrapper as Wrapper } from './index.styles';
import { Button, EmptyState } from 'app/components';
import enrichData from '../../assets/enrich.svg';
import { useSelector } from 'react-redux';
import { selectCreditBalance } from '../../../payments/selectors';
import { selectListMeta } from '../../lists.selectors';
import { formatCurrency } from '../../../../../utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  isLoading: boolean;
}

export const EnrichConfirmationModal = ({ isOpen, onClose, onProceed, isLoading }: Props) => {
  const creditBalance = useSelector(selectCreditBalance);
  const meta = useSelector(selectListMeta);

  const unitCheckPrice = 100;
  const totalCheckPrice = meta.count_total * unitCheckPrice;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <Wrapper id="enrich-modal">
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
          image={enrichData}
          heading="Check for DND"
          subheading={
            <>
              Immediately detect if your contacts are on the DND list. You can also detect if their
              lines are ported, their mobile network and the country of registration. NB: Extra
              charges are accrued for this service, which would be billed from your available
              campaign credits:{' '}
              <span style={{ color: '#333333', fontWeight: 500 }}>
                NGN {formatCurrency(totalCheckPrice / 100)}
              </span>
            </>
          }
          subheadingProps={{
            color: 'rgba(51,51,51, 0.5)',
            opacity: 1,
          }}
          children={
            <Box>
              {totalCheckPrice > creditBalance ? (
                <Box>
                  <Alert
                    status="error"
                    borderRadius="10px"
                    textAlign="left"
                    fontSize="14px"
                    marginY="1rem"
                  >
                    <AlertIcon />
                    Looks like you don't have enough credits in your balance to carry out this DND
                    check
                  </Alert>
                  <Button
                    size="sm"
                    marginY="0.5rem"
                    variant="link"
                    variantColor="blue"
                    fontWeight="500"
                    onClick={() => window.open('/s/marketing', '_blank')}
                  >
                    Manage Credits
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Alert
                    status="info"
                    borderRadius="10px"
                    textAlign="left"
                    fontSize="14px"
                    marginY="1rem"
                  >
                    <AlertIcon />
                    Because the request is queued, the results of this check are fairly quick, but
                    not immediate, so depending on the quantity of entries, you may need to refresh
                    this list after a short while
                  </Alert>
                  <Button
                    variantColor="blue"
                    size="sm"
                    marginY="0.5rem"
                    onClick={onProceed}
                    // @ts-ignore
                    leftIcon="premium"
                    isLoading={isLoading}
                  >
                    Check for DND
                  </Button>
                </Box>
              )}
            </Box>
          }
        />
      </Wrapper>
    </Modal>
  );
};
