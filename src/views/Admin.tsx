import {
  Heading, Box, Container, Divider, Wrap, WrapItem, Stack, Button,
} from '@chakra-ui/react';
import AddAchievementModal from '../components/admin/AddAchievement.tsx';
import UpdateMotdModal from '../components/admin/UpdateMotd.tsx';
import {useSupabase} from '../hooks/useSupabase.ts';

export default function AdminView() {
  const supabase = useSupabase();
  const handleLogout = () => {
    supabase.auth.signOut();
  };
  return (
    <Container mt={4} borderRadius="md" p={4} maxW="container.sm">
      <Stack direction="row" alignItems="center">
        <Heading as="h1" size="md" flex={1}>Epic Campus Admin</Heading>
        <Button colorScheme="red" onClick={handleLogout} size="sm" variant="link">
          Wyloguj
        </Button>
      </Stack>
      <Divider my={4} />
      <Box>
        <Heading as="h3" size="sm" mb={2}>Generalne ustawienia</Heading>
        <Wrap>
          <WrapItem>
            <UpdateMotdModal />
          </WrapItem>
        </Wrap>
      </Box>

      <Divider my={4} />

      <Box>
        <Heading as="h3" size="sm" mb={2}>Zarządzanie osiągnięciami</Heading>
        <Wrap>
          <WrapItem>
            <AddAchievementModal />
          </WrapItem>
        </Wrap>
      </Box>

    </Container>
  );
}
