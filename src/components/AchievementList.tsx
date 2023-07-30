import {
  Box,
  Icon, List, ListItem, Skeleton, Stack, Text,
} from '@chakra-ui/react';
import {formatDistanceToNow} from 'date-fns';
import {pl} from 'date-fns/locale';
import {useMemo} from 'react';
import {RiAccountCircleLine, RiAwardFill, RiGroup2Line} from 'react-icons/ri';
import {usePersonalAchievements, useTeamAchievements} from '../hooks/queries.ts';

export default function AchievementList() {
  const {data: personalAchievements, isLoading: personalLoading} = usePersonalAchievements();
  const {data: teamAchievements, isLoading: teamLoading} = useTeamAchievements();
  const achievementList = useMemo(() => {
    const achievements: {
      id: string;
      createdAt: Date;
      title: string,
      score: number | null;
      subject: string;
      type: 'personal' | 'team';
    }[] = [];

    personalAchievements?.forEach((a) => {
      if (!a.profiles?.id) return;
      achievements.push({
        id: `${a.id}-personal`,
        createdAt: new Date(a.createdAt!),
        score: a.score,
        subject: `${a.profiles.firstName} ${a.profiles.lastName}`,
        type: 'personal',
        title: a.title,
      });
    });

    teamAchievements?.forEach((a) => {
      if (!a.teams) return;
      achievements.push({
        id: `${a.id}-team`,
        createdAt: new Date(a.createdAt!),
        score: a.score,
        subject: a.teams.name,
        type: 'team',
        title: a.title,
      });
    });

    achievements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return achievements;
  }, [personalAchievements, teamAchievements]);

  return (
    <Skeleton isLoaded={!!achievementList && !personalLoading && !teamLoading}>
      {
        achievementList.length > 0 && (
          <Box bg="#eff6f7" p={4} borderRadius="md">
            <List spacing={3}>
              {
                  achievementList.slice(0, 4).map((a) => (
                    <ListItem key={a.id} display="flex" alignItems="center" gap={3}>
                      <Icon as={a.type === 'personal' ? RiAccountCircleLine : RiGroup2Line} color="brandRed.500" fontSize="xl" />
                      <Stack spacing={0}>
                        <Text fontSize="sm" color="gray.600">
                          {formatDistanceToNow(a.createdAt, {addSuffix: true, locale: pl})}
                        </Text>
                        <Text>
                          {a.subject}
                          {' '}
                          {a.type === 'personal' ? 'zdobywa' : 'zdobywają'}
                          {' '}
                          osiągnięcie
                          <Text as="span" color="brandRed.500" fontWeight="bold">
                            {' '}
                            „
                            {a.title}
                            ”
                            {' '}
                          </Text>
                          {
                            a.score && (
                              <>
                                {' '}
                                za
                                {' '}
                                <Text as="span" color="brandRed.500" fontWeight="bold">
                                  {a.score}
                                </Text>
                                {' '}
                                punktów
                              </>
                            )
                          }
                          .
                        </Text>
                      </Stack>
                    </ListItem>
                  ))
                }
            </List>
          </Box>
        )
      }
      {
        achievementList.length === 0 && (
          <Box minH="100px" display="flex" alignItems="center" justifyContent="center" bg="gray.700" borderRadius="md">
            <Stack spacing={2} textAlign="center" direction="column" alignItems="center">
              <Icon as={RiAwardFill} fontSize="2xl" color="white" />
              <Text color="white" textAlign="center">
                Tutaj pojawią się Wasze osiągnięcia!
              </Text>
            </Stack>
          </Box>
        )
      }
    </Skeleton>
  );
}
