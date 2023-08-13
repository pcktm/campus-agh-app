import {
  Center, Heading, ScaleFade, Spinner, Stack,
} from '@chakra-ui/react';
import {Session} from '@supabase/supabase-js';
import {useQueryClient} from '@tanstack/react-query';
import React, {Suspense, useEffect, useState} from 'react';
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import {useSupabase} from './hooks/useSupabase.ts';
import IndexView from './views/Index.tsx';
import LeaderboardView from './views/Leaderboard.tsx';
import PartnershipView from './views/Partnerships.tsx';
import TaskListView from './views/Tasks.tsx';
import {MainLayout} from './layouts/MainLayout.tsx';

const AdminView = React.lazy(() => import('./views/Admin.tsx'));
const AuthView = React.lazy(() => import('./views/Auth.tsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <IndexView />,
      },
      {
        path: '/leaderboard',
        element: <LeaderboardView />,
      },
      {
        path: '/partnerships',
        element: <PartnershipView />,
      },
      {
        path: '/tasks',
        element: <TaskListView />,
      },
      {
        path: '/admin',
        element: (
          <Suspense
            fallback={(
              <Center py={10}>
                <Stack spacing={4} align="center">
                  <Spinner size="xl" color="brandRed.500" />
                  <Heading as="h1" size="xs">Ładowanie panelu...</Heading>
                </Stack>
              </Center>
              )}
          >
            <AdminView />
          </Suspense>
        ),
      },
    ],
  },
], {
  basename: import.meta.env.BASE_URL,
});

function App() {
  const client = useSupabase();
  const [session, setSession] = useState<Session | null | false>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    client.auth.getSession().then(({data: {session: s}}) => {
      setSession(s);
    });

    const {
      data: {subscription},
    } = client.auth.onAuthStateChange((_event, s) => {
      queryClient.invalidateQueries();
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, [client, queryClient]);

  if (session === false) {
    return (
      <Center h="100vh">
        <ScaleFade in delay={0.5}>
          <Spinner size="xl" color="brandRed.500" />
        </ScaleFade>
      </Center>
    );
  }

  if (session === null) {
    return (
      <Suspense
        fallback={(
          <Center h="100vh">
            <Spinner size="xl" color="brandRed.500" />
          </Center>
        )}
      >
        <AuthView />
      </Suspense>
    );
  }

  return (
    <RouterProvider router={router} />
  );
}

export default App;
