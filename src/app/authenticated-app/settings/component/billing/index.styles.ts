import styled from '@emotion/styled';

// noinspection CssUnknownTarget
export const Wrapper = styled.div`
  .tab-section {
    display: flex;
    flex-direction: row;
    .tab {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin-right: 20px;
      cursor: pointer;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      box-sizing: border-box;
    }

    .active {
      border-bottom: 3px solid #3d50df;
    }

    .active,
    .tab:hover {
      color: #3d50df;
      box-sizing: border-box;
    }
  }

  .content-section {
    margin-top: 75px;

    .plan-info {
      .name {
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
        color: #1a1a1a;
        margin-bottom: 20px;
      }

      .pricing {
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 22px;
        color: rgba(26, 26, 26, 0.85);
        margin-bottom: 25px;
      }

      .billing-period {
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        color: rgba(26, 26, 26, 0.87);
        margin-bottom: 32px;
      }

      .actions {
        display: flex;
        flex-direction: row;

        .button {
          border-radius: 3px;
          margin-right: 20px;
          font-weight: 500;
          font-size: 14px;
          line-height: 17px;
        }
        .change {
          background: #3d50df;
          color: white;
        }
        .cancel {
        }
      }
    }

    .payment-info {
      margin-top: 75px;
      margin-bottom: 75px;
      .title {
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 17px;
        color: rgba(26, 26, 26, 0.87);
        margin-bottom: 22px;
      }
      hr {
        max-width: 800px;
        margin-bottom: 34px;
      }
      .credit-card {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        max-width: 500px;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-bottom: 34px;

        .card-logo {
          height: 35px;
          width: auto;
          margin-right: 50px;

          @media (max-width: 375px) {
            display: none;
          }
        }

        .text-primary {
          color: #333333;
          font-weight: 600;
          font-size: 16px;
          overflow: hidden;
          white-space: nowrap;
        }
        .text-secondary {
          font-weight: 400;
          font-size: 14px;
          color: rgba(17, 17, 17, 0.5);
          overflow: hidden;
          white-space: nowrap;
        }

        .actions {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 200px;

          * {
            margin: 0 10px;
          }
        }
      }
      .add-button {
        color: rgba(26, 26, 26, 0.87);
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 17px;
      }
    }

    .billing-history {
      margin-top: 75px;
      margin-bottom: 75px;
      .title {
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 17px;
        color: rgba(26, 26, 26, 0.87);
        margin-bottom: 22px;
      }
      hr {
        max-width: 800px;
        margin-bottom: 34px;
      }
      .section-list {
        .item {
          display: flex;
          flex-direction: row;
          padding-top: 10px;
          padding-bottom: 10px;

          .date {
            width: 300px;
            margin-right: 50px;
          }

          .cost {
            width: 50px;
            margin-right: 50px;
          }

          .plan {
            width: 300px;
          }
        }
      }
    }
  }
`;
