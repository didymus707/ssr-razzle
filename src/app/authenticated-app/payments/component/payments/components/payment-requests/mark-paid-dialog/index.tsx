// @ts-nocheck
import React, { useState } from 'react';
import { Modal, ModalOverlay, SlideIn, Box, Icon, useToast } from '@chakra-ui/core';
import { PaymentRequest } from '../../../../../payments.types';
import { PaymentRequestMarkPaidDialogWrapper as Wrapper } from './index.styles';
import { formatToCurrency } from '../../../../../../inbox/inbox.utils';
import moment from 'moment';
import { ToastBox, Button } from 'app/components';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payment_request: PaymentRequest;
  mark_request_paid: Function;
}

export const PaymentRequestMarkPaidDialog = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onClose, payment_request, mark_request_paid } = props;

  const toast = useToast();

  const handleMarkRequestPaid = async () => {
    setLoading(true);
    const res = await mark_request_paid(payment_request['id']);

    if (res) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message="Payment request marked as paid successfully"
          />
        ),
      });
      onClose();
    } else {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            onClose={onClose}
            message="An issue occurred while trying to mark this request as paid, please try again"
          />
        ),
      });
    }
    setLoading(false);
  };

  return (
    <SlideIn in={isOpen}>
      {(styles: Object) => (
        <Modal size="sm" isOpen={true} onClose={onClose}>
          <ModalOverlay />
          <Wrapper {...styles}>
            <Box className="heading">Cancel Payment Request</Box>
            <Box className="info-box">
              <Box display="flex" justifyContent="space-between">
                <Box className="customer">
                  <Box className="name">{payment_request.platform_name}</Box>
                  <Box className="code">{payment_request.code}</Box>
                </Box>
                <Box className="status-badge">
                  <Icon size="16px" name="send" mr="10px" />
                  {moment(payment_request.created_datetime).format('MMM D')}
                </Box>
              </Box>
              <Box className="amount">₦ {formatToCurrency(payment_request.amount)}</Box>
            </Box>

            <Box mt="15px" display="flex" width="100%" justifyContent="flex-end">
              <Button mr="20px" size="sm" variant="ghost" onClick={onClose} isDisabled={loading}>
                Close
              </Button>
              <Button
                size="sm"
                variant="solid"
                variantColor="red"
                isLoading={loading}
                onClick={handleMarkRequestPaid}
              >
                Mark Request Paid
              </Button>
            </Box>
          </Wrapper>
        </Modal>
      )}
    </SlideIn>
  );
};
