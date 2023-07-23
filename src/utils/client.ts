import {createClient} from '@supabase/supabase-js';

console.log({
  baseUrl: import.meta.env.VITE_SUPABASE_BASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

export const client = createClient(
  import.meta.env.VITE_SUPABASE_BASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: 'pkce',
    },
  },
);
