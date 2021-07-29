import { Box, PseudoBox, Skeleton } from '@chakra-ui/core';
import React, { ReactNode } from 'react';
import { numberWithCommas } from 'utils';
import { DashboardTableLayout } from '../../components/layout';

type DashboardTableProps<T> = {
  data: T[];
  headings: string[];
  renderItem(item: T, index?: number): ReactNode;
};

export function DashboardTable<T>({ data, headings, renderItem }: DashboardTableProps<T>) {
  return (
    <Box borderWidth="1px" borderRadius="5px">
      <Box overflowY="auto">
        <DashboardTableLayout>
          <thead>
            <tr>
              {headings.map((heading, index) => (
                <th key={`${index}`}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>{data.map(renderItem)}</tbody>
        </DashboardTableLayout>
      </Box>
    </Box>
  );
}

export function DashboardTableItem(props: { item: any; onClick?(): void }) {
  const { item, onClick } = props;
  return (
    <PseudoBox as="tr" onClick={onClick} cursor="pointer" _hover={{ bg: 'gray.100' }}>
      <td>{item.title}</td>
      <td>{numberWithCommas(item.sent)}</td>
      <td>{numberWithCommas(item.delivered)}</td>
      <td>{item.ctr !== undefined ? `${parseFloat(item.ctr).toFixed(1)}%` : '-'}</td>
      <td>{item.cvr !== undefined ? `${parseFloat(item.cvr).toFixed(1)}%` : '-'}</td>
    </PseudoBox>
  );
}

export function DashboardTableLoadingItem() {
  return (
    <tr>
      <td>
        <Box width="100%">
          <Skeleton height="10px" width="100%" my="10px" />
        </Box>
      </td>
      <td>
        <Box width="100%">
          <Skeleton height="10px" width="100%" my="10px" />
        </Box>
      </td>
      <td>
        <Box width="100%">
          <Skeleton height="10px" width="100%" my="10px" />
        </Box>
      </td>
      <td>
        <Box width="100%">
          <Skeleton height="10px" width="100%" my="10px" />
        </Box>
      </td>
      <td>
        <Box width="100%">
          <Skeleton height="10px" width="100%" my="10px" />
        </Box>
      </td>
    </tr>
  );
}
