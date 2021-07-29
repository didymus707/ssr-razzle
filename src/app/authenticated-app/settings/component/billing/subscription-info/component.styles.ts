import styled from '@emotion/styled';

// noinspection CssUnknownTarget
export const Wrapper = styled.div`
  max-width: 900px;
  margin: auto;

  .current-sub-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: white;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    border-radius: 20px;
    padding: 30px 40px;

    .title-section {
      display: flex;
      justify-content: space-between;
      flex-direction: row;

      .billing-period {
        font-size: 14px;
        color: #757575;
        font-weight: 500;
      }

      .subscription-name {
        color: #333333;
        font-weight: 600;
        font-size: 24px;
      }
    }

    .item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 5px 0;
      font-size: 14px;
      font-weight: 500;

      .label {
      }

      .price {
        color: #757575;
      }

      .price_total {
        font-size: 24px;
      }
    }
  }

  .addon-prompt-card {
    margin: 30px 0;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    border-radius: 12px;
    padding: 25px 40px;
    background-color: rgba(53, 37, 230, 0.03);
    font-size: 14px;
    font-weight: 500;
  }
`;
