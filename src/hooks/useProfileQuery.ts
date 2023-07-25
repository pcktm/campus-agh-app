import {useQuery} from '@tanstack/react-query';
import {useSupabase} from './useSupabase.ts';

export function useProfileQuery(userId?: string) {
  const client = useSupabase();
  const key = ['user', userId];

  return useQuery(key, async () => {
    const {data} = await client
      .from('profiles')
      .select('*')
      .eq('userId', userId)
      .throwOnError()
      .single();
    return data;
  }, {
    enabled: !!userId,
  });
}

export function useUser() {
  const client = useSupabase();

  return useQuery(['me'], async () => {
    const {data: {user}} = await client.auth.getUser();
    return user;
  });
}
