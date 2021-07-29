import styled from '@emotion/styled';

// noinspection CssUnknownTarget
export const CustomCellWrapper = styled.div`
  .email-cell,
  .phone-cell,
  .date-cell,
  .url-cell {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    transition: all 0.2s ease-in;

    .icon-button {
      display: none;
      padding: 5px;
      background-color: #fafafa;
      border-radius: 5px;
      cursor: pointer;
      height: 25px;
      width: 25px;

      transition: all 0.1s ease-in;

      :hover {
        box-shadow: rgba(99, 99, 99, 0.2) 0 0 3px;
        border: rgba(67, 90, 111, 0.1) solid 1px;
      }
    }

    :hover {
      .icon-button {
        display: flex;
        position: absolute;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        right: -0%;
      }
    }
  }

  .url-cell {
    text-decoration: underline;
  }
`;
