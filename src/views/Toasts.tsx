import {useEffect, useState, useReducer} from 'react';
import {
  Box, Container, Heading, Center, Button, Text, Portal,
} from '@chakra-ui/react';
import {Balancer} from 'react-wrap-balancer';
import toastsCollections from '../assets/toasts.json';
import {CanvasBackgroundConfetti} from '../components/CanvasConfetti.tsx';

type Toast = {
  toast: string;
  collection: string;
}
type State = {
  toasts: Toast[];
  currentToast: Toast;
  currentIdx: number;
}

const allToasts = toastsCollections
  .flatMap((collection) => collection.toasts.map((toast) => ({toast, collection: collection.title})), [] as Toast[]);

function reduceToasts(state: State, action: 'next' | 'prev'): State {
  const {toasts, currentIdx} = state;
  if (action === 'next') {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= toasts.length) {
      state.toasts.sort(() => Math.random() - 0.5);
      return {
        ...state,
        currentIdx: 0,
        currentToast: toasts[0],
      };
    }
    return {
      ...state,
      currentIdx: nextIdx,
      currentToast: toasts[nextIdx],
    };
  }
  return state;
}

export default function ToastsView() {
  const [fire, setFire] = useState(false);
  const [state, dispatch] = useReducer(reduceToasts, {
    toasts: allToasts.sort(() => Math.random() - 0.5),
    currentToast: allToasts[0],
    currentIdx: 0,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFire(false);
    }, 50);
    return () => clearTimeout(timeout);
  }, [fire, state.currentToast]);

  const handleNext = () => {
    setFire(true);
    dispatch('next');
  };

  useEffect(() => {
    setFire(true);
  }, []);

  return (
    <Container overflow="visible" mt={4}>
      <Portal>
        <Box
          position="fixed"
          top={0}
          left={0}
          zIndex={-1}
          pointerEvents="none"
          overflow="visible"
          width="100vw"
          height="100vh"
        >
          <CanvasBackgroundConfetti fire={fire} />
        </Box>
      </Portal>
      <Center minH="320px" textAlign="center" flexDirection="column" position="relative" overflow="visible">
        <Box
          position="relative"
          zIndex={1}
          p={4}
          backdropFilter="blur(5px)"
          borderRadius="md"
          boxShadow="xs"
          minW="100%"
        >
          <Text color="gray.500" mb={1}>
            {
            state.currentToast.collection
          }
          </Text>
          <Balancer ratio={0.5}>
            <Heading as="h2" size="xl" width="100%">
              {
            state.currentToast.toast
          }
            </Heading>
          </Balancer>
        </Box>
      </Center>
      <Center>
        <Button onClick={handleNext} colorScheme="brandRed" mt={4} size="lg">
          Następny!
        </Button>
      </Center>
    </Container>
  );
}
