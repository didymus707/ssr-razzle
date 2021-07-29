import { Flex, Heading, Icon, PseudoBox, Stack, Tooltip } from '@chakra-ui/core';
import { SmallText, TableDropdown, XSmallText } from 'app/components';
import React from 'react';
import { getZonedTime } from '../../../../../utils';
import { TemplateData } from '../templates.types';

type Props = {
  tableActions: any[];
  template: TemplateData;
  showActionBtns?: boolean;
  hasActiveTable?: boolean;
  onClick?: (data: TemplateData) => void;
};

export const TemplateListItem = (props: Props) => {
  const { template, tableActions, onClick, hasActiveTable = true, showActionBtns = true } = props;

  const handleClick = (e: any) => {
    e.preventDefault();
    onClick?.(template);
  };

  return (
    <PseudoBox
      pt="1rem"
      display="flex"
      borderTopWidth="1px"
      _hover={{ bg: '#f9f9f9' }}
      justifyContent="space-between"
      cursor={onClick ? 'pointer' : 'default'}
    >
      <Stack
        pl="1rem"
        flex={1}
        spacing="0.2rem"
        marginBottom="1rem"
        onClick={onClick ? handleClick : undefined}
      >
        <Stack isInline alignItems="center">
          <Heading fontSize="1rem" color="blue.500" textTransform="capitalize">
            {template.name}
          </Heading>
          {!hasActiveTable && (
            <Tooltip
              zIndex={10000}
              placement="right"
              aria-label="Template item info"
              label="The list associated to this template has been deleted."
            >
              <Icon size="0.75rem" name="info" color="gray.500" />
            </Tooltip>
          )}
        </Stack>
        <SmallText
          maxW="600px"
          color="#595e8a"
          overflow="hidden"
          whiteSpace="nowrap"
          style={{ textOverflow: 'ellipsis' }}
        >
          {template.template}
        </SmallText>
        <XSmallText color="#595e8a">
          {template.created_datetime &&
            getZonedTime(template.created_datetime, 'dd MMM yyyy, hh:mm:a')}
        </XSmallText>
      </Stack>
      {showActionBtns && (
        <Flex marginBottom="1rem" justifyContent="flex-end">
          <TableDropdown<TemplateData> data={template} actions={tableActions} />
        </Flex>
      )}
    </PseudoBox>
  );
};
