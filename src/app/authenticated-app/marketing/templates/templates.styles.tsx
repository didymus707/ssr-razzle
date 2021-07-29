import styled from '@emotion/styled';

export const TableStyles = styled.div`
  width: 100%;
  padding: 1rem;
  overflow-x: auto;

  table {
    border-spacing: 0;
    border: none;
    color: #212242;
    width: 100%;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    tr th {
      text-align: left;
      background: #f6f8fc;
      padding: 0.5rem 1rem;
    }

    tr td {
      padding: 0.5rem 1rem;
    }

    th,
    td {
      margin: 0;
      font-size: 0.875rem;
      border-right: none;
      border-bottom: 1px solid #eee;

      :last-child {
        border-right: 0;
      }
    }
  }
  .pagination {
    padding: 0.5rem;
  }
`;

export const TableTemplateRender = styled.p`
  width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
