import {
  Alert, AlertDescription, AlertIcon, AlertTitle, Box, Container,
} from '@chakra-ui/react';
import {Outlet} from 'react-router-dom';
import {Provider} from 'react-wrap-balancer';
import Hero from '../components/Hero.tsx';
import useOnlineStatus from '../hooks/useOnlineStatus.ts';

export function MainLayout() {
  const isOnline = useOnlineStatus();
  return (
    <>
      <Box mt={4}>
        <Hero />
      </Box>
      {
        !isOnline && (
          <Container my={4} maxW="container.md">
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>Jesteś offline!</AlertTitle>
              <AlertDescription>
                Większość funkcji może nie działać poprawnie.
              </AlertDescription>
            </Alert>
          </Container>
        )
      }
      <Provider>
        <Outlet />
      </Provider>
    </>
  );
}
