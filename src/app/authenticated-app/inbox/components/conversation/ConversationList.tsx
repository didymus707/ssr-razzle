import { Box, Flex, Image, Skeleton, Spinner, Stack } from '@chakra-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../root';
import { selectOrganisationID } from '../../../../unauthenticated-app/authentication';
import { ConversationListProps, ThreadSchema } from '../../inbox.types';
import {
  fetchThreadsByState,
  makeSelectStatusByState,
  selectThreadIdsByState,
  updateHasMore,
} from '../../slices';
import { ConversationItem } from './ConversationItem';
import emptyViewImage from '../no-thread.svg';

export function ConversationList({ heading = '', highlight, list }: ConversationListProps) {
  const selectStatus = useMemo(makeSelectStatusByState, []);
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const organisation_id = useSelector(selectOrganisationID);
  const listIDs = useSelector((state: RootState) =>
    selectThreadIdsByState(state, {
      state: heading as ThreadSchema['state'],
      organisation_id: organisation_id || '',
    }),
  );
  const { meta, hasMore } = useSelector((state: RootState) =>
    selectStatus(state, { statusState: heading, organisation_id: organisation_id || '' }),
  );

  const fetchMoreData = async () => {
    if (organisation_id && !list) {
      const { count, page } = meta;
      if (count !== 0 && Math.ceil(count / 15 - page) === 0) {
        return dispatch(
          updateHasMore({
            state: heading as ThreadSchema['state'],
            organisation_id: organisation_id || '',
          }),
        );
      }
      if (listIDs.length === 0) {
        setLoading(true);
      }

      await dispatch(
        fetchThreadsByState({
          organisation_id,
          state: heading,
          page: meta.page + 1,
        }),
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organisation_id]);

  return (
    <Stack className="thread-list" flexDirection="column" spacing=".25rem">
      {listIDs.length > 0 || (list || []).length > 0 ? (
        <InfiniteScroll
          dataLength={list ? list.length : listIDs.length}
          next={fetchMoreData}
          scrollableTarget="scrollableDiv"
          hasMore={hasMore}
          loader={
            <Box textAlign="center" paddingTop="2rem">
              <Spinner color="blue.500" size="md" />
            </Box>
          }
        >
          {(list ? list : listIDs).map(itemID =>
            isLoading ? (
              Array.from({ length: 15 }, (v, i) => (
                <Box
                  px="1rem"
                  borderBottomWidth="1px"
                  key={`${i.toString()}-${new Date().getTime()}`}
                >
                  <Skeleton height="10px" width="80%" my="10px" />
                  <Skeleton height="10px" my="10px" />
                </Box>
              ))
            ) : (
              <ConversationItem
                key={`${heading}-${itemID}`}
                highlight={highlight}
                itemID={itemID}
              />
            ),
          )}
        </InfiniteScroll>
      ) : (
        <Flex marginTop="8.625rem" justifyContent="center" alignItems="center">
          <Image src={emptyViewImage} size="4rem" />
        </Flex>
      )}
    </Stack>
  );
}
