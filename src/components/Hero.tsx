import {
  Box, Image, Center, Heading, Skeleton, LinkOverlay,
} from '@chakra-ui/react';
import {useLocation, Link} from 'react-router-dom';
import logo from '../assets/logo.svg';
import {useUser, useProfileById} from '../hooks/queries.ts';

export default function Hero() {
  const {pathname} = useLocation();
  return (
    <Box>
      <Center flexDirection="column">
        <Link to="/">
          <Image src={logo} alt="logo" height="175px" />
        </Link>
      </Center>
    </Box>
  );
}
