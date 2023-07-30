import {
  Center, ScaleFade, Spinner,
} from '@chakra-ui/react';
import {Session} from '@supabase/supabase-js';
import {useEffect, useState} from 'react';
import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import {useSupabase} from './hooks/useSupabase.ts';
import AuthView from './views/Auth.tsx';
import IndexView from './views/Index.tsx';
import LeaderboardView from './views/Leaderboard.tsx';
import {useIsAdmin} from './hooks/queries.ts';
import {AdminView} from './views/Admin.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexView />,
  },
  {
    path: '/leaderboard',
    element: <LeaderboardView />,
  },
], {
  basename: import.meta.env.BASE_URL,
});

function App() {
  const client = useSupabase();
  const [session, setSession] = useState<Session | null | false>(false);
  const isAdmin = useIsAdmin();
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
          <Spinner size="xl" color="white" />
        </ScaleFade>
      </Center>
    );
  }

  if (session === null) {
    return (
      <AuthView />
    );
  }

  if (session && isAdmin) {
    return <AdminView />;
  }

  return (
    <RouterProvider router={router} />
  );
}

export default App;
