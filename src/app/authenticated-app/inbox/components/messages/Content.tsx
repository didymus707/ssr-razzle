import { Button, Flex } from '@chakra-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../../../../root';
import { selectUserID } from '../../../../unauthenticated-app/authentication';
import { INBOX_INIT } from '../../inbox.data';
import {
  fetchThreadAssignments,
  fetchThreadByID,
  selectAssignmentsByThreadID,
  selectThreadDetailByID,
} from '../../slices';
import { ConversationThread } from './ConversationThread';
import { Header } from './Header';

export function Content({
  threadRef,
  showCompose,
  setShowCompose,
  currentThreadID,
  onCloseMobileMessageDrawer,
}: any) {
  const dispatch = useDispatch();
  const history = useHistory();

  const user_id = useSelector(selectUserID);
  const assignments = useSelector((state: RootState) =>
    selectAssignmentsByThreadID(state, { thread_id: currentThreadID }),
  );

  const thread = useSelector((state: RootState) => selectThreadDetailByID(state, currentThreadID));
  const { state: threadState, sender_id, receiver_id } = thread || INBOX_INIT.thread;
  const isLastAssignee =
    assignments &&
    assignments.length > 0 &&
    assignments[assignments.length - 1]?.assignee_id === user_id;

  const isAssign = threadState === 'assigned';

  // fetch thread assignments
  useEffect(() => {
    const fetch = async () => {
      if (currentThreadID && currentThreadID !== 'start' && !currentThreadID.includes('unknown')) {
        if (!thread.uuid) {
          const r: any = await dispatch(fetchThreadByID({ thread_id: currentThreadID }));
          if (fetchThreadByID.rejected.match(r)) {
            history.push('/s/inbox');
          }
        }
        await dispatch(
          fetchThreadAssignments({
            thread_id: currentThreadID,
          }),
        );
      }
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentThreadID]);

  useEffect(() => {
    if (isAssign && isLastAssignee) {
      showCompose === false && setShowCompose(true);
    } else {
      showCompose === true && setShowCompose(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAssign, isLastAssignee]);

  return (
    <>
      <Flex
        pt="1rem"
        px={['1rem', '1rem', '1.75rem', '1.75rem']}
        display={['block', 'block', 'block', 'none']}
      >
        <Button
          size="xs"
          variant="ghost"
          leftIcon="chevron-left"
          onClick={onCloseMobileMessageDrawer}
        >
          Back
        </Button>
      </Flex>

      <Header
        paddingY="1rem"
        alignItems="center"
        marginX={['1rem', '1rem', '1.75rem', '1.75rem']}
        borderBottom="1px solid rgba(0, 0, 0, 0.0334353)"
        sender_id={sender_id}
        receiver_id={receiver_id}
        currentThreadID={currentThreadID}
      />

      <ConversationThread />
    </>
  );
}
