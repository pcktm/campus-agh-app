import {useState, useEffect} from 'react';
import {Session} from '@supabase/supabase-js';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import AuthView from './views/Auth.tsx';
import {client} from './utils/client.ts';
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
  const [session, setSession] = useState<Session | null>(null);

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
  }, []);

  if (!session) {
    return (
      <AuthView />
    );
  }

  return (
    <RouterProvider router={router} />
  );
}

export default App;
