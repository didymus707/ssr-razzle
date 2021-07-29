import styled from '@emotion/styled'

// noinspection CssUnknownTarget
export const Wrapper = styled.div`
  max-width: 900px;
  margin: auto;

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
    margin-top: 50px;
  }

  .section-top-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
    width: 100%;

    @media (max-width: 1024px) {
      padding-bottom: 10px;
    }
  }

  .credit-card-default {
    display: flex;
    flex-direction: column;
    height: 210px;
    width: 335px;
    padding: 30px 50px 20px 25px;
    background-image: url('/images/credit-card-bg.svg');
    background-repeat: no-repeat;
    border-radius: 20px;
    margin-right: 30px;
    justify-content: space-between;

    @media (max-width: 1024px) {
      padding-bottom: 30px;
    }

    * {
      color: white;
    }

    .card-logo {
      align-self: flex-start;
      height: 40px;
      width: auto;
    }

    .info {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .primary {
        font-size: 18px;
        font-weight: 500;
      }

      .secondary {
        font-size: 14px;
      }
    }
  }

  .new-credit-card-button {
    display: flex;
    flex-direction: column;
    height: 200px;
    width: 320px;
    min-width: 320px;
    border: 1px dashed rgba(67, 90, 111, 0.301);
    box-sizing: border-box;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: #3d50df;
    margin-top: 10px;

    :hover {
      -webkit-box-shadow: -6px 3px 40px -25px rgba(0, 0, 0, 0.48);
      -moz-box-shadow: -6px 3px 40px -25px rgba(0, 0, 0, 0.48);
      box-shadow: -6px 3px 40px -25px rgba(0, 0, 0, 0.48);
    }
  }

  .cards-list {
    margin-top: 80px;
    max-width: 800px;
    width: 100%;

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-right: 100px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.0334353);

      @media (max-width: 1024px) {
        padding-right: 0;
      }

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

      :nth-last-of-type(1) {
        border-bottom: none;
      }
    }
  }

  .bank-account-list {
    max-width: 800px;
    width: 100%;
    .item {
      width: 100%;
      padding: 15px 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0, 0, 0, 0.0334353);
      cursor: default;

      :nth-last-of-type(1) {
        border-bottom: none;
      }

      * {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .text-primary {
        margin-bottom: 5px;
        font-weight: 500;
        font-size: 14px;
        color: rgb(17, 17, 17);
      }

      .text-secondary {
        color: rgba(17, 17, 17, 0.5);
        font-weight: 500;
        font-size: 14px;
      }
    }
  }

  .bank-account-actions {
    margin-top: 50px;
    max-width: 800px;
    width: 100%;
    display: flex;
    flex-direction: row;

    @media (max-width: 350px) {
    }
  }
`

export const DialogWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;

  * {
    font-size: 16px;
  }

  .heading {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 15px;
  }

  .text-prompt {
    margin: 40px 0;
  }

  .prompt-button {
    padding: 10px 0;
    font-weight: 500;

    color: white;
    border-radius: 3px;
    background-color: #3d50df;
    font-size: 14px;
    width: 100%;
  }

  .options {
    margin: 30px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .item-button {
      width: 47.5%;
    }

    @media (max-width: 450px) {
      flex-direction: column;
      .item-button {
        width: 100%;

        :nth-of-type(1) {
          margin-bottom: 15px;
        }
      }
    }
  }

  .actions {
    margin-top: 20px;
    display: flex;
    flex-direction: column;

    .secondary {
      background-color: inherit;
      color: #3d50df;
    }

    *:nth-last-of-type(1) {
      margin-top: 5px;
    }
  }
`
