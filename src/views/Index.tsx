import {
  Box, Button, Center, Container, Divider, Heading, Icon,
  SimpleGrid, Skeleton, Stack, Text,
} from '@chakra-ui/react';
import {
  RiBarChart2Line,
  RiCheckboxLine,
  RiListCheck3, RiShakeHandsLine,
} from 'react-icons/ri';
import LatestEventsBox from '../components/LatestEventsBox.tsx';
import LinkCard from '../components/LinkCard.tsx';
import MotdDisplay from '../components/MotdDisplay.tsx';
import PointsDisplay from '../components/PointsStatDisplay.tsx';
import UpdatePasswordModal from '../components/UpdatePasswordModal.tsx';
import {
  useIsAdmin, useIsBingoShown, useProfileById, useUser,
} from '../hooks/queries.ts';
import {useSupabase} from '../hooks/useSupabase.ts';

export default function IndexView() {
  const {data: user} = useUser();
  const {data: profile, isLoading: isProfileLoading} = useProfileById(user?.id);
  const supabase = useSupabase();
  const isAdmin = useIsAdmin();
  const isBingoShown = useIsBingoShown();
  return (
    <Container mb={3} maxW="container.md">
      <Center>
        <Skeleton isLoaded={!isProfileLoading}>
          <Heading as="h1" size="md">
            Witaj na Campusie,
            {' '}
            {profile?.firstName || 'Uczestniku'}
            !
          </Heading>
        </Skeleton>
      </Center>
      <Box mt={6}>
        <PointsDisplay />
        <Box mt={4} />
        <MotdDisplay />
        <LatestEventsBox />
        {/* <Stack direction="row" spacing={2} mt={3} alignContent="center" justifyContent="flex-end">
          <Link as={RouterLink} to="/leaderboard" display="flex" alignItems="center" gap={1}>
            <Text fontSize="sm">
              Cały ranking
            </Text>
            <Icon as={RiArrowRightLine} color="brandRed.400" fontSize="xl" />
          </Link>
        </Stack> */}
      </Box>

      <Divider mt={4} borderColor="gray.400" />

      <Box mt={6}>
        <SimpleGrid columns={[1, 2]} spacing={4}>
          {
            isAdmin && (
              <LinkCard
                title="Panel administracyjny"
                description="Zarządzaj osiągnięciami, zgonami i więcej XD"
                link="/admin"
                borderColor="brandRed.400"
                icon={<Icon as={RiBarChart2Line} color="brandRed.400" fontSize="xl" />}
              />
            )
          }
          {
            isBingoShown && (
            <LinkCard
              title="Bingo"
              description="Czyli jak dobrze znasz już AGH"
              link="/bingo"
              icon={<Icon as={RiCheckboxLine} color="brandRed.400" fontSize="xl" />}
            />
            )
          }
          <LinkCard
            title="Ranking"
            description="Wyniki osobiste i drużynowe"
            link="/leaderboard"
            icon={<Icon as={RiBarChart2Line} color="brandRed.400" fontSize="xl" />}
          />
          <LinkCard
            title="Zadania"
            description="Za to zdobędziesz punkty!"
            link="/tasks"
            icon={<Icon as={RiListCheck3} color="brandRed.400" fontSize="xl" />}
          />
          <LinkCard
            title="Partnerzy"
            description="Zobacz, kto wspiera nasze przedsięwzięcie"
            link="/partnerships"
            icon={<Icon as={RiShakeHandsLine} color="brandRed.400" fontSize="xl" />}
          />
        </SimpleGrid>
      </Box>

      <Stack mt={6} spacing={0} align="center" justifyContent="center">
        <Stack direction="row-reverse" spacing={4} align="center" justifyContent="center" mb={2}>
          <Box>
            <Button
              variant="link"
              size="xs"
              my={0}
              onClick={() => {
                supabase.auth.signOut();
              }}
            >
              Wyloguj się
            </Button>
          </Box>
          <UpdatePasswordModal />
        </Stack>
        <Text fontSize="2xs" color="gray.400" textAlign="center">
          {user?.id}
        </Text>
        <Text fontSize="2xs" color="gray.400" textAlign="center">
          {/* eslint-disable-next-line no-undef */}
          {__BUILD_DATE__}
        </Text>
      </Stack>
    </Container>
  );
}
