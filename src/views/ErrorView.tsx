import {useRouteError} from 'react-router-dom';
import {
  Alert, AlertDescription, AlertIcon, AlertTitle, Button, Code, Text,
} from '@chakra-ui/react';

export default function ErrorView() {
  const error = useRouteError() as Partial<Error>;
  console.error(error);

  const message = error?.message ?? 'Coś poszło naprawdę nie tak - odśwież stronę lub zamknij i otwórz aplikację.';

  const isJustRefresh = message.toLowerCase().includes('error loading dynamically imported module')
    || message.toLowerCase().includes('not a valid javascript mime type');

  return (
    <Alert
      status={isJustRefresh ? 'warning' : 'error'}
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="100vh"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {
          isJustRefresh
            ? 'Nowa wersja aplikacji została zainstalowana'
            : '3.0 panie Kopańko🤙🤙 esa'
        }
      </AlertTitle>
      <AlertDescription maxWidth="sm" mt={2}>
        {
          isJustRefresh && (
            <Button
              colorScheme="brandRed"
              onClick={() => window.location.reload()}
              size="lg"
            >
              Odśwież
            </Button>
          )
        }
        <Code maxWidth="sm" p={1} fontSize="small" mt={3}>
          {
            error?.message ?? 'Coś poszło naprawdę nie tak - odśwież stronę lub zamknij i otwórz aplikację.'
          }
        </Code>
      </AlertDescription>
    </Alert>
  );
}
