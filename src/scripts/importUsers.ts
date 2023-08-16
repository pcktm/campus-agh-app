import 'dotenv/config';
import path from 'node:path';
import {promises as fs} from 'node:fs';
import {createClient} from '@supabase/supabase-js';
import {Database} from '../utils/database.ts';

type InitialUser = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

if (typeof window !== 'undefined') {
  throw new Error('This script must be run in node');
}

if (process.argv.length < 3) {
  console.error('Usage: yarn importusers <path-to-users.json>');
  process.exit(1);
}

const relativePath = process.argv[2];
const absolutePath = path.resolve(relativePath);

(async () => {
  const supabase = createClient<Database>(
    process.env.VITE_SUPABASE_BASE_URL!,
    process.env.SUPABSAE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
  const usersJSON = await fs.readFile(absolutePath, 'utf-8');
  const users = JSON.parse(usersJSON) as InitialUser[];

  for await (const user of users) {
    const {data, error} = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (error?.status === 422) {
      console.log(`User ${user.email} already exists`);
      // eslint-disable-next-line no-continue
      continue;
    } else if (error) {
      console.error(error);
      process.exit(1);
    }

    try {
      await supabase.from('profiles').insert({
        userId: data!.user.id,
        firstName: user.first_name,
        lastName: user.last_name,
      }).single().throwOnError();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }

    console.log(`Created user ${user.email} with id ${data!.user.id}`);
  }
})();
