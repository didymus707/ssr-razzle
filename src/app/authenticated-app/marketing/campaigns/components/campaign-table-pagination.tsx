import { PseudoBox, PseudoBoxProps, Stack } from '@chakra-ui/core';
import styled from '@emotion/styled';
import React from 'react';

const PaginationItemContainer = styled.div`
  button {
    &.active {
      color: white;
      background-color: #3525e6;
      border: 1px solid #3525e6;
    }
  }
`;

function PaginationItem({
  active,
  children,
  ...rest
}: { active?: boolean; disabled?: boolean; children: React.ReactNode } & PseudoBoxProps) {
  return (
    <PaginationItemContainer>
      <PseudoBox
        py="4px"
        px="16px"
        as="button"
        outline="none"
        color="gray.900"
        cursor="pointer"
        borderWidth="1px"
        backgroundColor="white"
        className={active ? 'active' : ''}
        _disabled={{ cursor: 'not-allowed', opacity: 0.4 }}
        {...rest}
      >
        {children}
      </PseudoBox>
    </PaginationItemContainer>
  );
}

export function CampaignTablePagination({
  page,
  onClick,
  metaData,
  ...rest
}: {
  page?: number;
  metaData: { noOfPages: number; pageCount: number };
  onClick?(page: number): void;
}) {
  let [currentPage, setCurrentPage] = React.useState(page || 1);

  React.useEffect(() => {
    if (page) {
      setCurrentPage(page);
    }
  }, [page]);

  function handleNextClick() {
    if (currentPage < metaData.pageCount) {
      let page = currentPage + 1;
      setCurrentPage(page);
      onClick?.(page);
    }
  }

  function handlePreviousClick() {
    if (currentPage >= 1) {
      let page = currentPage - 1;
      setCurrentPage(page);
      onClick?.(page);
    }
  }

  return (
    <Stack isInline spacing="0" {...rest}>
      <PaginationItem
        borderRight="none"
        borderTopLeftRadius="4px"
        borderBottomLeftRadius="4px"
        disabled={currentPage === 1}
        onClick={() => handlePreviousClick()}
      >
        &laquo;
      </PaginationItem>
      <PaginationItem
        borderTopRightRadius="4px"
        borderBottomRightRadius="4px"
        onClick={() => handleNextClick()}
        disabled={currentPage === metaData.noOfPages}
      >
        &raquo;
      </PaginationItem>
    </Stack>
  );
}
