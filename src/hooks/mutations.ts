import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useToast} from '@chakra-ui/react';
import {nanoid} from 'nanoid';
import {useSupabase} from './useSupabase.ts';
import type {EventType} from '../types.d.ts';

type TAddPointsMutationInput = {
  type: 'team' | 'personal';
  subjectId: number;
  reason: string;
  score: number;
}

export function useAddEvent() {
  const supabase = useSupabase();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({content, icon = 'generic'}: {content: string, icon?: EventType}) => {
      await supabase.from('events').insert({
        content,
        icon,
      }).single().throwOnError();
    },
    onSuccess: () => {
      toast({
        title: 'Zdarzenie dodane',
        status: 'success',
      });
    },
    onError: (error: {message?: string}) => {
      console.error(error);
      toast({
        title: 'Błąd podczas dodawania zdarzenia',
        status: 'error',
        description: error?.message ?? 'Check console',
      });
    },
  });
}

export function useAddPoints() {
  const supabase = useSupabase();
  const toast = useToast();
  return useMutation({
    mutationFn: async (data: TAddPointsMutationInput) => {
      if (data.type === 'team') {
        await supabase.from('team_points').insert({
          teamId: data.subjectId,
          reason: data.reason,
          score: data.score,
        }).single().throwOnError();
      } else if (data.type === 'personal') {
        await supabase.from('user_points').insert({
          profileId: data.subjectId,
          reason: data.reason,
          score: data.score,
        }).single().throwOnError();
      }
    },
    onSuccess: () => {
      toast({
        title: 'Punkty dodane',
        status: 'success',
      });
    },
    onError: (error: {message?: string}) => {
      console.error(error);
      toast({
        title: 'Błąd podczas dodawania punktów',
        status: 'error',
        description: error?.message ?? 'Check console',
      });
    },
  });
}

export function useUpdateMotd() {
  const supabase = useSupabase();
  const toast = useToast();
  return useMutation({
    mutationFn: async (newMotd: string | null) => {
      await supabase.from('settings')
        .update({
          value: newMotd ?? '',
        })
        .eq('name', 'motd')
        .single()
        .throwOnError();
    },
    onSuccess: () => {
      toast({
        title: 'Motd zaktualizowany',
        status: 'success',
      });
    },
    onError: (error: {message?: string}) => {
      console.error(error);
      toast({
        title: 'Błąd podczas aktualizacji',
        status: 'error',
        description: error?.message ?? 'Check console',
      });
    },
  });
}

export type TAddBlackoutMutationInput = {
  profileId: number;
};

export function useAddBlackout() {
  const supabase = useSupabase();
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TAddBlackoutMutationInput) => {
      await supabase.from('blackouts').insert({
        profileId: data.profileId,
      }).single().throwOnError();
    },
    onSuccess: (_, v) => {
      toast({
        title: 'Zgon dodany',
        status: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['blackouts'],
      });
      queryClient.invalidateQueries({
        queryKey: ['blackouts', v.profileId],
      });
    },
    onError: (error: {message?: string}) => {
      console.error(error);
      toast({
        title: 'Błąd podczas dodawania zgona',
        status: 'error',
        description: error?.message ?? 'Check console',
      });
    },
  });
}

export type TAddTaskSolveMutationInput = {
  taskId: string;
  type: 'team' | 'personal';
  subjectId: string;
  image?: File;
}

export function useAddTaskSolve() {
  const supabase = useSupabase();
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSolve: TAddTaskSolveMutationInput) => {
      let imagePath: string | null = null;
      if (newSolve.image) {
        const {data, error} = await supabase.storage.from('solves')
          .upload(`${newSolve.taskId}/${nanoid()}${newSolve.image?.name ?? '.jpg'}`, newSolve.image);
        if (error) {
          throw error;
        }
        const {data: signedUrlResponse} = await supabase.storage.from('solves').createSignedUrl(data.path, 60 * 60 * 24 * 365);
        toast({title: 'Zdjęcie wrzucone', status: 'success'});
        imagePath = signedUrlResponse?.signedUrl ?? null;
        console.log(imagePath);
      }
      const {data, error} = await supabase.from('task_solves')
        .insert({
          // @ts-expect-error - Yeah, there's something wrong with either supabase or typescript and I don't care
          profileId: newSolve.type === 'personal' ? newSolve.subjectId : null,
          teamId: newSolve.type === 'team' ? newSolve.subjectId : null,
          imageUrl: imagePath,
          taskId: Number(newSolve.taskId),
        })
        .single()
        .throwOnError();
    },
    onError: (error: {message?: string}) => {
      console.error(error);
      toast({
        title: 'Błąd podczas wrzucania zdjęcia',
        status: 'error',
        description: error?.message ?? 'Check console',
      });
    },
  });
}
