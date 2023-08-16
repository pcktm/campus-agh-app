import {
  Box,
  Center,
  Image,
} from '@chakra-ui/react';
import {Link, useLocation} from 'react-router-dom';
import logo from '../assets/logo.svg';

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
