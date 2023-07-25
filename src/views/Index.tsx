import {
  Button, Box, Container, Image, Center, Heading, Skeleton,
} from '@chakra-ui/react';
import logo from '../assets/logo.svg';
import {useUser, useProfileQuery} from '../hooks/useProfileQuery.ts';

export default function IndexView() {
  const {data: user} = useUser();
  const {data: profile, isLoading: isProfileLoading} = useProfileQuery(user?.id);
  return (
    <Box>
      <Container mt={4}>
        <Center flexDirection="column">
          <Image src={logo} alt="logo" height="175px" />
          <Skeleton isLoaded={!isProfileLoading}>
            <Heading color="white" as="h1" size="md">
              Witaj na Campusie,
              {' '}
              {profile?.name}
              !
            </Heading>
          </Skeleton>
        </Center>
      </Container>
    </Box>
  );
}
