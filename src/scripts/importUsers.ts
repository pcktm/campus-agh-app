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
  team_id: number;
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
if (!absolutePath.endsWith('.json')) {
  console.error('File must be a json file');
  process.exit(1);
}

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
  const users = (JSON.parse(usersJSON) as InitialUser[]);

  const {data: {users: existingUsers}} = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });

  const {data: existingProfiles} = await supabase.from('profiles').select('userId');

  for await (const user of users) {
    const {data, error} = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    let id = data?.user?.id;

    if (error?.status === 422) {
      const existingUser = existingUsers?.find((u) => u.email === user.email);
      if (existingUser) {
        console.log(`User ${user.email} already exists with id ${existingUser.id}`);
        id = existingUser.id;
      } else {
        console.error(`User ${user.email} already exists but was not found`);
        process.exit(1);
      }
    } else if (error) {
      console.error(error);
      process.exit(1);
    }

    try {
      if (existingProfiles?.find((p) => p.userId === id)) {
        console.log(`User ${user.email} already has a profile`);
        // eslint-disable-next-line no-continue
        continue;
      }
      await supabase.from('profiles').insert({
        userId: id,
        firstName: user.first_name,
        lastName: user.last_name,
        teamId: user.team_id,
      }).single().throwOnError();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }

    console.log(`Created user ${user.email} with id ${id}`);
  }
})();
