import styled from '@emotion/styled';
import { ModalContent } from '@chakra-ui/core';

export const DashboardSideSheetWrapper = styled(ModalContent)`
  max-height: calc(100vh - 100px);
  height: fit-content;
  width: 428px;
  background-color: white;
  border-radius: 20px;
  margin-top: 75px;
  margin-right: 10px;
  padding: 40px 24px;
  display: flex;
  transition: all 0.2s ease;

  overflow-x: hidden;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    display: none;
  }

  ::-webkit-scrollbar-thumb {
    display: none;
  }

  .profile-info {
    display: flex;

    .text-section {
      display: flex;
      flex-direction: column;
      margin-left: 26px;

      .name {
        margin-bottom: 8px;
        line-height: 29px;
        font-size: 23px;
        font-weight: 500;
        color: #333333;
      }

      .email {
        font-size: 13px;
        line-height: 16px;
        color: #828282;
      }
    }
  }

  hr {
    margin: 24px 0;
  }

  .pending-setup {
    display: flex;
    flex-direction: column;
    background: #3d43df;
    border-radius: 10px;
    padding: 27px 16px;
    color: white;
    .title {
      margin-bottom: 22px;
      font-weight: 600;
      font-size: 17px;
      line-height: 24px;
      color: #ffffff;
    }

    .item {
      margin-bottom: 24px;
      align-items: center;
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      line-height: 16px;

      * {
        transition: all 0.15s ease-in-out;
      }

      .name-section {
        display: flex;
        flex-direction: row;
        align-items: center;

        :hover {
          cursor: pointer;
          .name {
            font-weight: 600;
          }
        }
      }
    }

    .item:nth-last-of-type(1) {
      margin-bottom: 0;
    }

    .done {
      .name-section {
        * {
          text-decoration: line-through;
        }
        :hover {
          .name {
            cursor: default;
            font-weight: normal;
          }
        }
      }

      .duration {
        display: none;
      }
    }
  }

  .section-organizations {
    display: flex;
    flex-direction: column;
    padding: 0px 0;

    .organization-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 5px 0;

      :hover {
        font-weight: 500;
      }
    }
  }

  .section-actions {
    .item {
      display: flex;
      align-items: center;
      color: #333333;
      margin-bottom: 25px;
      cursor: pointer;
      font-size: 13px;
      line-height: 16px;

      * {
        transition: all 0.2s ease;
      }

      :hover {
        .label {
          font-weight: 500;
        }
      }
    }

    .item:nth-last-of-type(1) {
      margin-bottom: 0;
    }
  }
`;
