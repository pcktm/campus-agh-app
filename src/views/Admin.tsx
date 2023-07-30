import {
  Heading, Box, Container, Divider,
} from '@chakra-ui/react';
import AddAchievementModal from '../components/admin/AddAchievement.tsx';

export function AdminView() {
  return (
    <Container mt={4} borderRadius="md" p={4} maxW="container.sm">
      <Heading as="h1" size="md">Epic Campus Admin</Heading>
      <Divider my={4} />
      <Box>
        <Heading as="h3" size="sm" mb={2}>Zarządzanie osiągnięciami</Heading>
        <AddAchievementModal />
      </Box>
    </Container>
  );
}
