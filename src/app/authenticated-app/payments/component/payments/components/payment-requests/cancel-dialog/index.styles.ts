import styled from '@emotion/styled';
import { ModalContent } from '@chakra-ui/core';

export const PaymentRequestCancelDialogWrapper = styled(ModalContent)`
  border-radius: 5px;
  margin-top: 150px;
  min-width: 450px;
  max-height: 800px;
  padding: 30px 40px;

  .heading {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 15px;
  }

  .info-box {
    padding: 20px;
    border-radius: 5px;
    border: 1px solid #eeeeee;
    display: flex;
    flex-direction: column;
    margin: 10px 0;

    .customer {
      .name {
        font-weight: 500;
        font-size: 16px;
      }
      .code {
        text-transform: uppercase;
        font-weight: 400;
        font-size: 12px;
        color: #757575;
      }
    }

    .status-badge {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      padding: 4px 10px;
      font-weight: 500;
      border-radius: 8px;
      background-color: #f4f6f9;
      color: #8a9ba7;
      height: fit-content;
    }

    .amount {
      margin-top: 15px;
      font-weight: 600;
      font-size: 22px;
    }
  }
`;
