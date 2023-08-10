import {useMutation} from '@tanstack/react-query';
import {useToast} from '@chakra-ui/react';
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
