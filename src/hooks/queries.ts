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

export function usePersonalAchievements() {
  const client = useSupabase();
  const key = ['user_achievements'];

  return useQuery(key, async () => {
    const {data} = await client
      .from('user_achievements')
      .select(`
        id, title, description, score, createdAt, profiles (
          id, userId, teamId, createdAt, firstName, lastName
        )
      `)
      .throwOnError();

    return data;
  }, {
    refetchOnWindowFocus: import.meta.env.PROD,
  });
}

export function useTeamAchievements() {
  const client = useSupabase();
  const key = ['team_achievements'];

  return useQuery(key, async () => {
    const {data} = await client
      .from('team_achievements')
      .select(`
        id, title, description, score, createdAt, teams (
          id, name, createdAt
        )
      `)
      .throwOnError();

    return data;
  }, {
    refetchOnWindowFocus: import.meta.env.PROD,
  });
}

export function useProfilesWithAchievements() {
  const client = useSupabase();
  const key = ['achievements_by_profile'];

  return useQuery(key, async () => {
    const {data} = await client
      .from('profiles')
      .select(`
        id, userId, createdAt, firstName, lastName, user_achievements (
          id, title, description, score, createdAt
        ),
        teams (
          id, name
        )
      `)
      .throwOnError();

    return data;
  });
}

export function useTeamsWithAchievements() {
  const client = useSupabase();
  const key = ['achievements_by_team'];

  return useQuery(key, async () => {
    const {data} = await client
      .from('teams')
      .select(`
        id, name, createdAt, team_achievements (
          id, title, description, score, createdAt
        )
      `)
      .throwOnError();

    return data;
  });
}

export function useSettings() {
  const client = useSupabase();
  const key = ['motd'];

  return useQuery(
    key,
    async () => {
      const {data} = await client
        .from('settings')
        .select('name, value')
        .throwOnError();

      return data;
    },
    {
      refetchOnWindowFocus: import.meta.env.PROD,
    },
  );
}

export function useMotd() {
  const {data} = useSettings();
  return data?.find((setting) => setting.name === 'motd')?.value as string | undefined;
}

export function useIsAdmin() {
  const {data} = useUser();
  return data?.email?.endsWith('@samorzad.agh.edu.pl') ?? false;
}
