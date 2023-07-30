import {
  Box, Skeleton, Stat, StatGroup, StatHelpText, StatLabel, StatNumber,
} from '@chakra-ui/react';
import {useMemo} from 'react';
import {
  usePersonalAchievements, useProfileQuery, useTeamAchievements, useUser,
} from '../hooks/queries.ts';

export default function PointsDisplay() {
  const {data: user} = useUser();
  const {data: profile} = useProfileQuery(user?.id);
  const {data: personalAchievements, isLoading: personalLoading} = usePersonalAchievements();
  const {data: teamAchievements, isLoading: teamLoading} = useTeamAchievements();

  const pointsByUser = useMemo(() => {
    const points: Record<string, number> = {};
    personalAchievements?.forEach((a) => {
      if (!a.profiles?.id) return;
      points[a.profiles.id] = (points[a.profiles.id] ?? 0) + (a.score ?? 0);
    });
    const sorted = Object.entries(points).sort(([, a], [, b]) => b - a);
    return sorted;
  }, [personalAchievements]);

  const pointsByTeam = useMemo(() => {
    const points: Record<string, number> = {};
    teamAchievements?.forEach((a) => {
      if (!a.teams) return;
      points[a.teams.id] = (points[a.teams.id] ?? 0) + (a.score ?? 0);
    });
    const sorted = Object.entries(points).sort(([, a], [, b]) => b - a);
    return sorted;
  }, [teamAchievements]);

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
