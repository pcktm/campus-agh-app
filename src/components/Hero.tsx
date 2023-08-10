import {
  Box, Image, Center, Heading, Skeleton,
} from '@chakra-ui/react';
import logo from '../assets/logo.svg';
import {useUser, useProfileById} from '../hooks/queries.ts';

export default function Hero() {
  const {data: user} = useUser();
  const {data: profile, isLoading: isProfileLoading} = useProfileById(user?.id);
  return (
    <Box>
      <Center flexDirection="column">
        <Image src={logo} alt="logo" height="175px" />
        <Skeleton isLoaded={!isProfileLoading}>
          <Heading as="h1" size="md">
            Witaj na Campusie,
            {' '}
            {profile?.firstName || 'Uczestniku'}
            !
          </Heading>
        </Skeleton>
      </Center>
    </Box>
  );
}
