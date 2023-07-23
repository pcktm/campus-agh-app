import {Button, Box} from '@chakra-ui/react';
import {client} from '../utils/client.ts';

export default function IndexView() {
  return (
    <Box>
      <div>Index</div>
      <Button
        onClick={() => {
          client.auth.signOut();
        }}
      >
        Log out
      </Button>
    </Box>
  );
}
