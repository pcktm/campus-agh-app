import {
  Box, Container, Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table, TableContainer,
  Tabs,
  Tbody, Td,
  Th, Thead, Tr,
} from '@chakra-ui/react';
import {useMemo} from 'react';
import {ScrollRestoration} from 'react-router-dom';
import {
  useProfiles, useTeams,
} from '../hooks/queries.ts';

type TScore = {
  id: number;
  subject: string;
  score: number;
}

function LeaderboardTable({data}: {data: TScore[]}) {
  if (data.length === 0) {
    return (
      <Box textAlign="center" py={5}>
        <Spinner size="lg" color="brandRed.500" />
      </Box>
    );
  }
  return (
    <TableContainer bg="#eff6f7" borderRadius="md" py={2} px={2}>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Lp.</Th>
            <Th>Nazwa</Th>
            <Th isNumeric>Wynik</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            data.map((score, index) => (
              <Tr key={score.id}>
                <Td>{index + 1}</Td>
                <Td>{score.subject}</Td>
                <Td isNumeric>{score.score}</Td>
              </Tr>
            ))
          }
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default function LeaderboardView() {
  const {data: usersWithAchivements} = useProfiles();
  const {data: teamWithAchievements} = useTeams();

  const personalLeaderboard: TScore[] = useMemo(() => {
    const scores: TScore[] = [];
    for (const user of usersWithAchivements ?? []) {
      const score = user.user_points.reduce((acc, curr) => acc + (curr.score ?? 0), 0);
      scores.push({
        id: user.id,
        subject: `${user.firstName} ${user.lastName}`,
        score: score ?? 0,
      });
    }
    return scores.sort((a, b) => b.score - a.score);
  }, [usersWithAchivements]);

  const teamLeaderboard: TScore[] = useMemo(() => {
    const scores: TScore[] = [];
    for (const team of teamWithAchievements ?? []) {
      const score = team.team_points.reduce((acc, curr) => acc + (curr.score ?? 0), 0);
      scores.push({
        id: team.id,
        subject: team.name,
        score: score ?? 0,
      });
    }
    return scores.sort((a, b) => b.score - a.score);
  }, [teamWithAchievements]);

  return (
    <>
      <Box>
        <Container pt={4}>
          <Heading as="h1" size="lg" mb={4}>
            Tablica wyników
          </Heading>
          <Tabs colorScheme="brandRed" align="center" isFitted variant="soft-rounded">
            <TabList gap={2}>
              <Tab>Drużynowa</Tab>
              <Tab>Indywidualna</Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <LeaderboardTable data={teamLeaderboard} />
              </TabPanel>
              <TabPanel px={0}>
                <LeaderboardTable data={personalLeaderboard} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
      <ScrollRestoration />
    </>
  );
}
