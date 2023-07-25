import {useState, useEffect} from 'react';
import {Session} from '@supabase/supabase-js';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import {
  Center, ScaleFade, Spinner,
} from '@chakra-ui/react';
import AuthView from './views/Auth.tsx';
import {useSupabase} from './hooks/useSupabase.ts';
import IndexView from './views/Index.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexView />,
  },
], {
  basename: import.meta.env.BASE_URL,
});

function App() {
  const client = useSupabase();
  const [session, setSession] = useState<Session | null | false>(false);

  useEffect(() => {
    client.auth.getSession().then(({data: {session: s}}) => {
      setSession(s);
    });

    const {
      data: {subscription},
    } = client.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, [client]);

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

  return (
    <RouterProvider router={router} />
  );
}

export default App;
