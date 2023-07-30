import {
  Box, Button, Container, Divider, Icon,
  Link,
  SimpleGrid, Stack, Text,
} from '@chakra-ui/react';
import {RiArrowRightLine, RiCalendarTodoFill} from 'react-icons/ri';
import {Link as RouterLink} from 'react-router-dom';
import AchievementList from '../components/AchievementList.tsx';
import Hero from '../components/Hero.tsx';
import LinkCard from '../components/LinkCard.tsx';
import MotdDisplay from '../components/MotdDisplay.tsx';
import PointsDisplay from '../components/PointsDisplay.tsx';
import {useUser} from '../hooks/queries.ts';
import {useSupabase} from '../hooks/useSupabase.ts';

export default function IndexView() {
  const {data: user} = useUser();
  const supabase = useSupabase();
  return (
    <Container mb={3}>
      <Box mt={4}>
        <Hero />
      </Box>
      <Box mt={6}>
        <PointsDisplay />
        <Box mt={4} />
        <MotdDisplay />
        <AchievementList />
        <Stack direction="row" spacing={2} mt={3} alignContent="center" justifyContent="flex-end">
          <Link as={RouterLink} to="/leaderboard" display="flex" alignItems="center" gap={1}>
            <Text fontSize="sm">
              Cały ranking
            </Text>
            <Icon as={RiArrowRightLine} color="brandRed.400" fontSize="xl" />
          </Link>
        </Stack>
      </Box>

      <Divider mt={4} borderColor="gray.400" />

      <Box mt={6}>
        <SimpleGrid columns={2} spacing={4}>
          <LinkCard
            title="Harmonogram"
            description="Sprawdź, co będzie się działo"
            link="/schedule"
            icon={<Icon as={RiCalendarTodoFill} color="brandRed.400" fontSize="xl" />}
          />
        </SimpleGrid>
      </Box>

      <Stack mt={6} spacing={2} align="center" justifyContent="center">
        <Button
          variant="link"
          size="xs"
          onClick={() => {
            supabase.auth.signOut();
          }}
        >
          Wyloguj się
        </Button>
        <Text fontSize="xs" color="gray.500" textAlign="center">
          {user?.id}
        </Text>
      </Stack>
    </Container>
  );
}
