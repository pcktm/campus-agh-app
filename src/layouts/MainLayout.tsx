import {Box} from '@chakra-ui/react';
import {Outlet} from 'react-router-dom';
import Hero from '../components/Hero.tsx';

export function MainLayout() {
  return (
    <>

      <Box mt={4}>
        <Hero />
      </Box>
      <Outlet />
    </>
  );
}
