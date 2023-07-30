import {Alert, AlertIcon} from '@chakra-ui/react';
import {useMotd} from '../hooks/queries.ts';

export default function MotdDisplay() {
  const motd = useMotd();

  if (!motd) {
    return null;
  }

  return (
    <Alert status="info" borderRadius="md" mb={4} my={3}>
      <AlertIcon />
      {motd}
    </Alert>
  );
}
