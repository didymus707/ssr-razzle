import { Flex, Icon, Stack, Tooltip } from '@chakra-ui/core';
import { Button, EmptyState, Menu, MenuItem, XSmallText } from 'app/components';
import React from 'react';
import { useHistory } from 'react-router';
import { InboxTag } from '../../inbox.types';

export type TagsMenuProps = {
  tags?: InboxTag[];
  conversationTags?: InboxTag[];
  onItemClick?(tag: InboxTag): void;
};

export const TagsMenu = (props: TagsMenuProps) => {
  const { tags, onItemClick, conversationTags } = props;
  const conversationTagIds = conversationTags?.map(item => item.uuid);
  const tagIconColor = !!conversationTags?.length ? conversationTags[0].color : 'gray.400';

  const history = useHistory();

  const renderTagItem = (item: InboxTag, isSelected: boolean = false) => {
    return (
      <MenuItem key={item.uuid} onClick={() => onItemClick?.(item)}>
        <Flex width="100%" alignItems="center" justifyContent="space-between">
          <Stack flex={1} isInline alignItems="center">
            <Icon color={item.color} size="1rem" name="inbox-tag" />
            <Flex
              px="0.8rem"
              rounded="100px"
              height="1.25rem"
              alignItems="center"
              justifyContent="center"
              bg={item.color ?? 'gray.400'}
            >
              <XSmallText textAlign="center" color="white">
                {item.name}
              </XSmallText>
            </Flex>
          </Stack>
          {isSelected && <Icon name="check" size="0.8rem" color="#5ACA75" />}
        </Flex>
      </MenuItem>
    );
  };

  return (
    <Menu
      options={tags ?? []}
      menuButtonProps={{
        px: '0',
        minW: 'unset',
        children: (
          <Tooltip label="Tags" aria-label="Tags" placement="bottom">
            <Icon size="1.5rem" name="inbox-tag" color={tagIconColor} />
          </Tooltip>
        ),
      }}
      renderEmptyState={() => (
        <EmptyState
          width="200px"
          heading="No tags"
          subheading="Click the button below to create a tag"
        >
          <Button
            mb="1rem"
            size="xs"
            variantColor="blue"
            onClick={() => history.push('/s/inbox/settings/tags/new')}
          >
            Create tag
          </Button>
        </EmptyState>
      )}
      renderItem={tag => renderTagItem(tag, !!conversationTagIds?.includes(tag.uuid))}
    />
  );
};
