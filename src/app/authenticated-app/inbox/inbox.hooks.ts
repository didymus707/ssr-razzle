import {
  selectOrganisationID,
  selectProfile,
  selectUserID,
} from 'app/unauthenticated-app/authentication';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { initializePusher, pusher } from 'utils/pusher';
import { onNewWebsocketEvent } from './slices';

export const useReactQuerySubscription = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user_id = useSelector(selectUserID);
  const profile = useSelector(selectProfile);
  const organisation_id = useSelector(selectOrganisationID);
  const profile_id = profile?.id;

  useEffect(() => {
    if (!pusher) {
      console.log('pusher connection is not set');

      initializePusher(profile_id);
    }

    const orgChannel = pusher.subscribe(`presence_${organisation_id}`);

    if (orgChannel) {
      orgChannel.unbind();

      orgChannel.bind('thread_new', (data: any) => {
        queryClient.invalidateQueries('filters-unread-count');
        queryClient.invalidateQueries(['threads', 'queued', user_id]);
      });
    }

    const userChannel = pusher.subscribe(`private_${profile_id}`);

    if (userChannel) {
      userChannel.unbind();

      const messageCallback = (message: any) => {
        if (message?.author_id !== profile_id) {
          dispatch(onNewWebsocketEvent());
          queryClient.invalidateQueries('filters-unread-count');
          queryClient.invalidateQueries('messages');
          queryClient.invalidateQueries('threads');
        }
      };

      userChannel.bind('message_new', messageCallback);
      userChannel.bind('message_retry', messageCallback);
      orgChannel.bind('message_new', messageCallback);
    }

    return () => {
      //TODO: close connection
    };
  }, [user_id, organisation_id, profile_id, queryClient, dispatch]);
};
