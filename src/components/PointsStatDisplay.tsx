import {
  Box, Skeleton, Stat, StatGroup, StatHelpText, StatLabel, StatNumber,
} from '@chakra-ui/react';
import {useMemo} from 'react';
import {
  useProfileById,
  useProfiles,
  useTeams, useUser,
} from '../hooks/queries.ts';

export default function PointsStatDisplay() {
  const {data: user} = useUser();
  const {data: profile} = useProfileById(user?.id);
  const {data: profiles, isLoading: personalLoading} = useProfiles();
  const {data: teams, isLoading: teamLoading} = useTeams();

  const pointsByUser = useMemo(() => {
    const points: Record<string, number> = {};
    profiles?.forEach((a) => {
      if (!a.id) return;
      points[a.id] = a.user_points.reduce((acc, p) => acc + (p.score ?? 0), 0);
    });
    const sorted = Object.entries(points).sort(([, a], [, b]) => b - a);
    return sorted;
  }, [profiles]);

  const pointsByTeam = useMemo(() => {
    const points: Record<string, number> = {};
    teams?.forEach((a) => {
      if (!a.id) return;
      points[a.id] = a.team_points.reduce((acc, p) => acc + (p.score ?? 0), 0);
    });
    const sorted = Object.entries(points).sort(([, a], [, b]) => b - a);
    return sorted;
  }, [teams]);

  const personalPoints = pointsByUser.find(([id]) => id === String(profile?.id))?.[1];
  const teamPoints = pointsByTeam.find(([id]) => id === String(profile?.teamId))?.[1];

  const userPlace = pointsByUser.findIndex(([id]) => id === String(profile?.id)) + 1;
  const teamPlace = pointsByTeam.findIndex(([id]) => id === String(profile?.teamId)) + 1;

  return (
    <Box maxW="sm" margin="0 auto" flex={1}>
      <StatGroup>
        <Stat>
          <StatLabel>Twoje punkty</StatLabel>
          <Skeleton isLoaded={!personalLoading && pointsByUser !== undefined}>
            <StatNumber>{personalPoints ?? 0}</StatNumber>
            <StatHelpText>
              {
                userPlace > 0 ? (
                  <>
                    {userPlace}
                    {' '}
                    miejsce
                  </>
                ) : 'Bez rankingu'
              }
            </StatHelpText>
          </Skeleton>
        </Stat>

        <Stat textAlign="end">
          <StatLabel>Drużynowe punkty</StatLabel>
          <Skeleton isLoaded={!teamLoading && pointsByTeam !== undefined}>
            <StatNumber>{teamPoints ?? 0}</StatNumber>
            <StatHelpText>
              {
                teamPlace > 0 ? (
                  <>
                    {teamPlace}
                    {' '}
                    miejsce
                  </>
                ) : 'Bez rankingu'
              }
            </StatHelpText>
          </Skeleton>
        </Stat>
      </StatGroup>
    </Box>
  );
}
