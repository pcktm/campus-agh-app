import {createClient} from '@supabase/supabase-js';
import {useMemo} from 'react';
import type {Database} from '../utils/supabase';

export const getSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_BASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return createClient<Database>(supabaseUrl!, supabaseKey!, {
    auth: {
      flowType: 'pkce',
    },
  });
};

const supabaseClient = getSupabaseClient();

export const useSupabase = () => useMemo(() => supabaseClient, []);