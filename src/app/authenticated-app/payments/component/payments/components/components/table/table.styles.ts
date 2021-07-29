import styled from '@emotion/styled';

export const TableWrapper = styled.div`
  min-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: 30px;
  margin-top: 5px;

  .table {
    width: auto;
    border-radius: 2px;

    .thead {
      display: flex;
      width: auto;

      .tr {
        width: 100% !important;
        justify-content: space-between;
        border: none;
        border-top: 1px solid rgba(0, 0, 0, 0.1);

        .th {
          color: #333333;
          font-size: 14px;
          font-weight: 500;
        }
      }

      .td:first-of-type {
        border-right: 1px solid rgba(0, 0, 0, 0.1);
      }
    }

    .tbody {
      .tr {
        width: 100% !important;
        cursor: default;
        font-size: 14px;
        text-align: left;
        justify-content: space-between;
        :hover {
          background-color: #f9f9f9;
        }
      }
    }

    .tr {
      width: 100% !important;
      align-items: stretch;
      background: #ffffff;
      border-top: 1px solid #ececf2;

      .td:first-of-type,
      .th:first-of-type {
        border-right: 1px solid rgba(0, 0, 0, 0.1);
      }

      :last-child {
        td {
          border-bottom: 0;
          text-align: center;
        }
      }
    }

    .th {
      text-align: left;
    }

    .th,
    .td {
      overflow-wrap: anywhere;
      margin: 0;
      padding: 20px 15px;
      color: #333333;
      text-align: left;
      :last-child {
        //text-align: center;
        border-right: 0;
      }
    }
  }
`;
