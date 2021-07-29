import { Flex, IconButton, Tooltip, useToast } from '@chakra-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Search, ToastBox } from '../../../../components';
import { searchInbox } from '../../slices';

export function Header({ searchQuery, setSearchQuery, setSearchedResult }: any) {
  const toast = useToast();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleConversationSearch = async (query: string) => {
    try {
      setSearchQuery(query);
      if (query.length >= 2) {
        // search here
        const r: any = await dispatch(searchInbox({ q: query }));
        if (searchInbox.fulfilled.match(r) && r?.payload?.result) {
          setSearchedResult(r?.payload?.result);
        }
      } else {
        setSearchedResult(undefined);
      }
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  };

  return (
    <Flex alignItems="center" paddingX="1rem" paddingTop="1rem" paddingBottom=".875rem">
      <Search
        flex={1}
        value={searchQuery}
        placeholder="Search conversations"
        onChange={handleConversationSearch}
      />

      <Tooltip aria-label="Write Message" label="Write Message">
        <IconButton
          size="sm"
          aria-label="write message"
          ml="1rem"
          variantColor="blue"
          rounded="50%"
          icon="edit"
          onClick={() => history.push('/s/inbox/start')}
          _hover={{
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        />
      </Tooltip>
    </Flex>
  );
}
