import styled from '@emotion/styled';
import { ModalContent } from '@chakra-ui/core';

export const RecordModalWrapper = styled(ModalContent)`
  min-width: 600px;
  max-height: 80vh;
  padding: 30px 40px;

  //overflow-x: hidden;
  overflow-y: scroll;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #ccc;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #999;
  }

  @media print {
    overflow-y: visible;
    max-height: max-content;
    box-shadow: none;
    margin-top: 0;
    padding: 10px 0;

    .section-header {
      position: relative;
      padding-top: 0;

      .actions {
        display: none !important;
      }
    }

    .add-button {
      display: none;
    }
  }

  .section-header {
    position: -webkit-sticky;
    position: sticky;
    top: -30px;
    z-index: 100000;
    background-color: white;
    transition: all 0.2s ease-in;
    padding-top: 20px;
    border-bottom: solid #e7e6e6 2px;

    .actions {
      display: flex;
      margin-bottom: 15px;
      align-items: center;
    }
  }

  .section-header + .section-header-stuck {
  }

  .heading {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 15px;
  }

  .section-info {
    display: flex;
    flex-direction: column;

    .info-item {
      padding: 20px 0;

      .label {
        display: flex;
        align-items: center;
        flex-direction: row;
        margin-bottom: 5px;
        color: #7a7a7a;
        font-weight: 500;

        .icon {
          margin-right: 8px;
        }

        .column-name {
          font-size: 12px;
        }
      }

      .value {
        font-size: 12px;
      }
    }
  }

  .add-button {
    align-self: flex-start;
    font-weight: 500;
    margin: 10px 0;
  }
`;
