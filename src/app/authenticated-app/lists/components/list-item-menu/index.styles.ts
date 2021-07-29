import styled from '@emotion/styled';

export const ListItemMenuWrapper = styled.div`
  z-index: 4;
  position: absolute;
  min-width: 265px;
  height: initial;
  display: flex;
  flex-direction: column;
  cursor: default;
  padding: 12px 12px;
  color: #333333;
  font-size: 14px;
  background: #ffffff;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 10px 10px 0px;
  border: rgba(67, 90, 111, 0.1) solid 1px;
  border-radius: 12px;

  .label-input {
    height: 28px;
    font-size: 12px;
    padding: 3px 5px;
    outline: none;
    box-shadow: none;
    margin-bottom: 10px;

    :focus,
    :active {
      outline: none;
      box-shadow: none;
    }
  }

  .color-option {
    height: 20px;
    width: 20px;
    border-radius: 10px;
    transition: all 0.05s ease-in;

    :hover {
      transform: scale(1.1);
    }
  }

  .icon-select-section {
    margin-top: 10px;
    height: 150px;
    overflow-y: scroll;

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2px;
      height: 18px;
      border-radius: 3px;

      :hover {
        background-color: #eeeeee;
      }
    }
  }

  hr {
    margin: 5px 0 5px;
  }

  .action-item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    border-radius: 3px;
    padding: 2px 3px;
    color: #eb5757;
    :hover {
      background-color: #eeeeee;
    }

    * {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
`;
