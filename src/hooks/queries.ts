import {useQuery} from '@tanstack/react-query';
import {useSupabase} from './useSupabase.ts';

export function useProfileById(userId?: string) {
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

export function useProfiles() {
  const client = useSupabase();
  const key = ['profiles_with_points_and_teams'];

  return useQuery(key, async () => {
    const {data} = await client
      .from('profiles')
      .select(`
        id, userId, createdAt, firstName, lastName, user_points (
          id, score, createdAt
        ),
        teams (
          id, name
        )
      `)
      .throwOnError();

    return data;
  }, {
    refetchOnWindowFocus: import.meta.env.PROD,
  });
}

export function useTeams() {
  const client = useSupabase();
  const key = ['teams_with_points'];

  return useQuery(key, async () => {
    const {data} = await client
      .from('teams')
      .select(`
        id, name, createdAt, team_points (
          id, score, createdAt
        )
      `)
      .throwOnError();

    return data;
  }, {
    refetchOnWindowFocus: import.meta.env.PROD,
  });
}

export function useSettings() {
  const client = useSupabase();
  const key = ['settings'];

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

export function useMotd(): string | undefined {
  const {data} = useSettings();
  return data?.find((setting) => setting.name === 'motd')?.value;
}

export function useIsAdmin() {
  const {data} = useUser();
  return data?.email?.endsWith('@samorzad.agh.edu.pl') ?? false;
}

export function useLatestEvents(limit?: number) {
  const client = useSupabase();
  const key = ['events', limit];

  return useQuery(key, async () => {
    const {data} = await client
      .from('events')
      .select('*')
      .order('created_at', {ascending: false})
      .limit(limit ?? 10)
      .throwOnError();

    return data;
  }, {
    refetchOnWindowFocus: import.meta.env.PROD,
  });
}

export function useBlackouts() {
  const client = useSupabase();
  const key = ['blackouts'];

  return useQuery(key, async () => {
    const {data} = await client
      .from('blackouts')
      .select('*')
      .throwOnError();

    return data;
  }, {
    refetchOnWindowFocus: import.meta.env.PROD,
  });
}

export function useBlackoutsByProfile(profileId: string | null) {
  const client = useSupabase();
  const key = ['blackouts', profileId];

  return useQuery(key, async () => {
    const {data} = await client
      .from('blackouts')
      .select('*')
      .eq('profileId', profileId)
      .throwOnError();

    return data;
  }, {
    refetchOnWindowFocus: import.meta.env.PROD,
    enabled: !!profileId,
  });
}

export function useAchievableTasks() {
  const client = useSupabase();
  const key = ['achievable_tasks'];

  return useQuery(
    key,
    async () => {
      const {data} = await client
        .from('achievable_tasks')
        .select('id,title,description,points,is_personal')
        .order('points', {ascending: false})
        .throwOnError();

      return data;
    },
    {
      refetchOnWindowFocus: import.meta.env.PROD,
    },
  );
}

export type AchievableTask = NonNullable<ReturnType<typeof useAchievableTasks>['data']>[number];
