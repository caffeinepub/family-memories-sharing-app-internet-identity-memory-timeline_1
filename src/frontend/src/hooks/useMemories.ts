import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Memory, MemoryId } from '../backend';

const MEMORIES_QUERY_KEY = 'memories';

export function useGetAllMemories() {
  const { actor, isFetching } = useActor();

  return useQuery<Memory[]>({
    queryKey: [MEMORIES_QUERY_KEY],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMemories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMemory(id: MemoryId) {
  const { actor, isFetching } = useActor();

  return useQuery<Memory | null>({
    queryKey: [MEMORIES_QUERY_KEY, id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMemory(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      content,
      photo,
    }: {
      title: string;
      content: string;
      photo: Uint8Array | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createMemory(title, content, photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEMORIES_QUERY_KEY] });
    },
  });
}

export function useUpdateMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      photo,
    }: {
      id: MemoryId;
      title: string;
      content: string;
      photo: Uint8Array | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateMemory(id, title, content, photo);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [MEMORIES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [MEMORIES_QUERY_KEY, variables.id.toString()],
      });
    },
    onError: (error) => {
      if (error instanceof Error && error.message.includes('Can only edit own memories')) {
        throw new Error('You can only edit your own memories');
      }
      throw error;
    },
  });
}

export function useDeleteMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: MemoryId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteMemory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEMORIES_QUERY_KEY] });
    },
    onError: (error) => {
      if (error instanceof Error && error.message.includes('Can only delete own memories')) {
        throw new Error('You can only delete your own memories');
      }
      throw error;
    },
  });
}
