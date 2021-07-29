import { Badge, Flex, Heading, PseudoBox, Stack } from '@chakra-ui/core';
import * as React from 'react';
import { getZonedTime, numberWithCommas } from '../../../../../utils';
import { SmallText, TableDropdown, XSmallText } from '../../../../components';
import { CampaignData } from '../campaigns.types';

type CampaignListItemProps = {
  isLoading?: boolean;
  getTableActions: any;
  campaign: CampaignData;
};

export function CampaignListItem(props: CampaignListItemProps) {
  const { campaign, isLoading, getTableActions } = props;
  const campaignStatusColors: { [key: string]: string } = {
    draft: 'gray',
    pristine: 'gray',
    stopped: 'red',
    started: 'green',
    paused: 'yellow',
  };
  const campaignStateLabel: { [key: string]: string } = {
    draft: 'Draft',
    pristine: 'Not Started',
    stopped: 'Stopped',
    started: 'Started',
    paused: 'Paused',
  };

  const [isOpen, setIsOpen] = React.useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <PseudoBox cursor="pointer" _hover={{ bg: '#f9f9f9' }} onClick={!isLoading ? toggle : () => {}}>
      <Stack
        isInline
        pt="1rem"
        spacing="1rem"
        flexWrap="wrap"
        alignItems="center"
        borderTopWidth="1px"
      >
        <Stack
          pl="1rem"
          // minW="200px"
          spacing="0.2rem"
          marginBottom="1rem"
          width={['calc(33.33% - 1rem)', 'calc(50% - 1rem)', 'calc(33.33% - 1rem)']}
        >
          <Heading fontSize="1rem" color="blue.500" textTransform="capitalize">
            {campaign.name}
          </Heading>
          <SmallText color="#595e8a">
            {campaign.created_datetime &&
              getZonedTime(campaign.created_datetime, 'dd MMM yyyy, hh:mm:a')}
          </SmallText>
          <XSmallText color="#4f4f4f">
            Audience Nos: {numberWithCommas(campaign?.audience?.count)}
          </XSmallText>
        </Stack>
        {campaign.state && (
          <Flex
            marginBottom="1rem"
            justifyContent="flex-end"
            width={['calc(33.33% - 1rem)', 'calc(50% - 1rem)', 'calc(33.33% - 1rem)']}
          >
            <Badge rounded="100px" variantColor={campaignStatusColors[campaign.state]}>
              {campaignStateLabel[campaign.state]}
            </Badge>
          </Flex>
        )}
        <Flex
          marginBottom="1rem"
          justifyContent="flex-end"
          width={['calc(33.33% - 1rem)', 'calc(50% - 1rem)', 'calc(33.33% - 1rem)']}
        >
          <TableDropdown<CampaignData>
            data={campaign}
            isOpen={isOpen}
            close={close}
            open={open}
            actions={getTableActions(campaign)}
          />
        </Flex>
      </Stack>
    </PseudoBox>
  );
}
