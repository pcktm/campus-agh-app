import {useMutation} from '@tanstack/react-query';
import {useToast} from '@chakra-ui/react';
import {useSupabase} from './useSupabase.ts';

type TAchievement = {
  type: 'team' | 'personal';
  subjectId: number;
  title: string;
  description?: string;
  score: number;
}

export function useAddAchievement() {
  const supabase = useSupabase();
  const toast = useToast();
  return useMutation({
    mutationFn: async (achievement: TAchievement) => {
      if (achievement.type === 'team') {
        await supabase.from('team_achievements').insert({
          teamId: achievement.subjectId,
          title: achievement.title,
          description: achievement.description,
          score: achievement.score,
        }).single().throwOnError();
      } else if (achievement.type === 'personal') {
        await supabase.from('user_achievements').insert({
          profileId: achievement.subjectId,
          title: achievement.title,
          description: achievement.description,
          score: achievement.score,
        }).single().throwOnError();
      }
    },
    onSuccess: () => {
      toast({
        title: 'Osiągnięcie dodane',
        status: 'success',
      });
    },
    onError: (error: {message?: string}) => {
      console.error(error);
      toast({
        title: 'Błąd podczas dodawania osiągnięcia',
        status: 'error',
        description: error?.message ?? 'Check console',
      });
    },
  });
}
