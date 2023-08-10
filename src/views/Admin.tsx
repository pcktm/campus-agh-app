import {
  Box, Container, Divider,
  Heading,
  Stack,
  Wrap, WrapItem,
} from '@chakra-ui/react';
import AddAchievementModal from '../components/admin/AddAchievement.tsx';
import AddBlackOutModal from '../components/admin/AddBlackOut.tsx';
import UpdateMotdModal from '../components/admin/UpdateMotd.tsx';

export default function AdminView() {
  return (
    <Container mt={4} borderRadius="md" p={4} maxW="container.sm">
      <Stack direction="row" alignItems="center">
        <Heading as="h1" size="md" flex={1}>Epic Campus Admin</Heading>
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
          <WrapItem>
            <AddBlackOutModal />
          </WrapItem>
        </Wrap>
      </Box>

    </Container>
  );
}
