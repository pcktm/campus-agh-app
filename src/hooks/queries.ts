import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
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

export function useIsBingoShown(): boolean {
  const {data} = useSettings();
  return data?.find((setting) => setting.name === 'bingo_shown')?.value === 'true';
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
      .select('*, event_reactions(id,user_id)')
      .order('created_at', {ascending: false})
      .limit(limit ?? 10)
      .throwOnError();

    return data;
  }, {
    refetchOnWindowFocus: import.meta.env.PROD,
    refetchInterval: 10000,
  });
}

export type Event = NonNullable<ReturnType<typeof useLatestEvents>['data']>[number];

export function useLatestEventsInfinite({itemsPerPage = 10, enabled = true} = {}) {
  const client = useSupabase();
  const key = ['events', 'infinite', itemsPerPage];

  return useInfiniteQuery(
    key,
    async ({pageParam = 0}) => {
      const {data} = await client
        .from('events')
        .select('*, event_reactions(id,user_id)')
        .order('created_at', {ascending: false})
        .range(pageParam, pageParam + itemsPerPage - 1)
        .throwOnError();
      return {
        data, nextCursor: pageParam + itemsPerPage,
      };
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.data?.length === itemsPerPage) {
          return lastPage.nextCursor;
        }
        return undefined;
      },
      enabled,
      refetchOnWindowFocus: true,
    },
  );
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
        .select('id,title,description,points,is_personal, task_solves (id, imageUrl)')
        .order('points', {ascending: false})
        .throwOnError();

      return data;
    },
    {
      refetchOnWindowFocus: import.meta.env.PROD,
    },
  );
}

export function useTaskSolves(taskId: number, enabled = true) {
  const client = useSupabase();
  const key = ['task_solves', taskId];

  return useQuery(
    key,
    async () => {
      const {data} = await client
        .from('task_solves')
        .select(`id, created_at, imageUrl, profiles (
          id, firstName, lastName
        ), teams (
          id, name
        )`)
        .eq('taskId', taskId)
        .order('created_at', {ascending: false})
        .throwOnError();

      return data;
    },
    {
      refetchOnWindowFocus: false,
      enabled,
    },
  );
}

export type AchievableTask = NonNullable<ReturnType<typeof useAchievableTasks>['data']>[number];
export type TaskSolve = NonNullable<ReturnType<typeof useTaskSolves>['data']>[number];

export function useHasSubjectSolvedTask(type: 'personal' | 'team', subjectId: string | null, taskId: string | null) {
  const client = useSupabase();
  const key = ['task_solves', taskId, type, subjectId];
  return useQuery(key, async () => {
    const q = client.from('task_solves').select('id, created_at').eq('taskId', taskId);
    if (type === 'personal') {
      q.eq('profileId', subjectId);
    } else {
      q.eq('teamId', subjectId);
    }
    const {data} = await q.maybeSingle().throwOnError();

    return data;
  }, {
    enabled: !!subjectId && !!taskId,
    refetchOnWindowFocus: false,
  });
}

export function useBingoTasks({enabled = true} = {}) {
  const client = useSupabase();
  const key = ['bingo_tasks'];

  return useQuery(
    key,
    async () => {
      const {data} = await client
        .from('bingo_tasks')
        .select('id,title,hint,min_people,bingo_solves(id, teams(color, id, name))')
        .order('ordinal', {ascending: true})
        .throwOnError();

      return data;
    },
    {
      refetchOnWindowFocus: import.meta.env.PROD,
      enabled,
    },
  );
}

export type BingoTask = NonNullable<ReturnType<typeof useBingoTasks>['data']>[number];
