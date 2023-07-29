import {
  Box, Container, Divider, Icon, SimpleGrid, Stack, Text, Link,
} from '@chakra-ui/react';
import {RiArrowRightLine} from 'react-icons/ri';
import {Link as RouterLink, ScrollRestoration} from 'react-router-dom';
import Hero from '../components/Hero.tsx';
import PointsDisplay from '../components/PointsDisplay.tsx';
import AchievementList from '../components/AchievementList.tsx';

export default function IndexView() {
  return (
    <Box mb={6}>
      <Container mt={4}>
        <Hero />
      </Container>
      <Container mt={6}>
        <PointsDisplay />
        <Box mt={4} />
        <AchievementList />
        <Stack direction="row" spacing={2} mt={3} alignContent="center" justifyContent="flex-end">
          <Link as={RouterLink} to="/leaderboard" display="flex" alignItems="center" gap={1}>
            <Text fontSize="sm">
              Cały ranking
            </Text>
            <Icon as={RiArrowRightLine} color="brandRed.400" fontSize="xl" />
          </Link>
        </Stack>
        <Divider mt={4} borderColor="gray.400" />
      </Container>
      <Container mt={6}>
        <SimpleGrid columns={2} spacing={4}>
          <Box bgColor="red.300" height="200px" />

        </SimpleGrid>
      </Container>
    </Box>
  );
}
