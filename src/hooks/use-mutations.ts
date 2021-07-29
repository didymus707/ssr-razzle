import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

type MutationOptions = {
  key: string;
  action: any;
  onError?(err: AxiosError): void;
  onSettled?(): void;
};

export const useCreateMutation = ({ key, action, onError, onSettled }: MutationOptions) => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any, any>(action, {
    // When mutate is called:
    onMutate: async newItem => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(key);

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData(key);

      // Optimistically update to the new value
      if (previousItems) {
        //@ts-ignore
        queryClient.setQueryData(key, old => [...old, newItem]);
      }

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newItem, context) => {
      //@ts-ignore
      queryClient.setQueryData(key, context.previousItems);
      onError?.(err);
    },
    // Always refetch after error or success:
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      onSettled?.();
    },
  });
};

export const useUpdateMutation = ({ key, action, onError, onSettled }: MutationOptions) => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any, any>(action, {
    // When mutate is called:
    onMutate: async newItem => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      //@ts-ignore
      await queryClient.cancelQueries([key, newItem.id]);

      // Snapshot the previous value
      //@ts-ignore
      const previousItem = queryClient.getQueryData([key, newItem.id]);

      // Optimistically update to the new value
      //@ts-ignore
      queryClient.setQueryData([key, newItem.id], newItem);

      // Return a context with the previous and new todo
      return { previousItem, newItem };
    },
    // If the mutation fails, use the context we returned above
    onError: (err, newItem, context) => {
      //@ts-ignore
      queryClient.setQueryData([key, context.newItem.id], context.previousItem);
      onError?.(err);
    },
    // Always refetch after error or success:
    onSuccess: newItem => {
      //@ts-ignore
      queryClient.invalidateQueries(['todos', newItem.id]);
      onSettled?.();
    },
  });
};

export const useDeleteMutation = ({ key, action, onError, onSettled }: MutationOptions) => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any, any>(action, {
    // When mutate is called:
    onMutate: async newItem => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      //@ts-ignore
      await queryClient.cancelQueries([key, newItem.id]);

      // Snapshot the previous value
      //@ts-ignore
      const previousItem = queryClient.getQueryData([key, newItem.id]);

      // Optimistically update to the new value
      //@ts-ignore
      queryClient.setQueryData(key, old => old.filter(item => item.id !== newItem.id));

      // Return a context with the previous and new todo
      return { previousItem, newItem };
    },
    // If the mutation fails, use the context we returned above
    onError: (err, newItem, context) => {
      //@ts-ignore
      queryClient.setQueryData([key, context.newItem.id], context.previousItem);
      onError?.(err);
    },
    // Always refetch after error or success:
    onSuccess: newItem => {
      //@ts-ignore
      queryClient.invalidateQueries(['todos', newItem.id]);
      onSettled?.();
    },
  });
};
