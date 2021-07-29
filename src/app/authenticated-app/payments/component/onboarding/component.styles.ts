import styled from '@emotion/styled';
import { Box } from '@chakra-ui/core';

export const Wrapper = styled(Box)`
  top: -60px;
  position: absolute;
  display: flex;
  z-index: 1000;
  background-color: #ffffff;
  height: 100vh;
  width: 100vw;

  .close-icon {
    position: absolute;
    color: #333333;
    right: -0;
    margin: 20px;
  }

  .side-bar {
    width: 400px;
    font-size: 16px;
    padding: 40px 45px;
    background-color: #3d43df;
    color: #ffffff;

    .heading {
      margin-left: 10px;
      margin-top: 40px;
      display: flex;
      flex-direction: column;

      .title {
        font-size: 28px;
        font-weight: 600;
      }

      .subtitle {
        font-weight: 400;
      }

      margin-bottom: 10px;
    }

    .section-stages {
      margin-top: 20px;

      display: flex;
      flex-direction: column;

      .item {
        display: flex;
        align-items: center;
        flex-direction: row;
        padding: 10px 0;

        * {
          transition: all 0.2s ease-in-out;
        }

        .icon {
          margin-right: 10px;
        }

        .label {
          font-weight: 500;
          text-decoration: none;
          position: relative;
          display: flex;

          ::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2.5px;
            margin: 0;
            border: none;
            bottom: 0;
            left: 0;
            background-color: #ffffff;
            transition: all 0.1s ease-in-out 0s;
          }
        }

        .active {
          ::after {
            width: 100%;
          }
        }

        :hover {
          cursor: default;

          .label {
            ::after {
              width: 100%;
            }
          }
        }
      }
    }
  }

  .content {
    padding: 80px 100px 0;
    width: 100%;
    overflow-y: scroll;

    .heading {
      margin-bottom: 60px;

      .title {
        font-size: 28px;
        font-weight: 600;
      }

      .subtitle {
        font-size: 14px;
        font-weight: 400;
      }
    }

    .form-section {
      max-width: 600px;

      * {
        font-size: 14px;
      }

      .file-input {
        display: flex;
        flex-direction: row;
        align-items: center !important;
        width: 50%;
      }

      .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 35px;

        .field-item {
          display: flex;
          flex-direction: column;
          width: 100%;

          .label {
            color: #757575;
            margin-bottom: 10px;
            font-weight: 500;
          }
        }
      }

      .financial-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 50px;
        border-radius: 5px;
        background-color: #f3f3f3;
        margin-bottom: 35px;

        .info-container {
          display: flex;
          align-items: center;
          font-weight: 500;
        }
      }
    }

    .summary-section {
      max-width: 600px;
      width: 100%;
      padding: 20px 0;
      border-top: solid 1px #e9e9e9;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .section-title {
        width: 150px;
        color: #757575;
        font-weight: 500;
      }

      * {
        font-size: 14px;
      }

      .section-info {
        width: 350px;

        .field {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;

          :nth-last-of-type(1) {
            margin-bottom: 0px;
          }

          .label {
            font-size: 14px;
            color: #757575;
            font-weight: 500;
          }

          .value {
          }
        }
      }
    }

    .action-section {
      border-top: solid 1px #e9e9e9;
      padding: 35px 0;
      max-width: 600px;
      justify-content: flex-end;
      width: 100%;
      display: flex;
      flex-direction: row;
    }
  }
`;
