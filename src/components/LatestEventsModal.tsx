import {
  Stack, useDisclosure, Button, Box, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, Text, ModalHeader, ModalOverlay,
} from '@chakra-ui/react';
import {RiArrowRightLine} from 'react-icons/ri';
import {useMemo} from 'react';
import {useLatestEventsInfinite} from '../hooks/queries.ts';
import EventsList from './EventsList.tsx';

export default function LatestEventsModal() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {
    data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage,
  } = useLatestEventsInfinite({enabled: isOpen, itemsPerPage: 10});

  const events = useMemo(() => {
    if (!data) return undefined;
    return data.pages.flatMap((page) => {
      if (!page || !page?.data) return [];
      return page.data;
    });
  }, [data]);

  return (
    <Box>
      <Stack direction="row" spacing={2} mt={3} alignContent="center" justifyContent="flex-end">
        <Button
          display="flex"
          alignItems="center"
          gap={1}
          variant="link"
          onClick={onOpen}
          size="sm"
          colorScheme="brandRed"
          rightIcon={<Icon as={RiArrowRightLine} fontSize="xl" />}
        >
          Więcej zdarzeń
        </Button>
      </Stack>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={['full', '3xl']}
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ostatnie zdarzenia</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {
              events && (
                <EventsList events={events} exactTime variant="expanded" />
              )
            }
            <Stack spacing={2} direction="row" justifyContent="center" mt={4}>
              {
              hasNextPage && (
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  isLoading={isFetchingNextPage}
                >
                  Załaduj więcej
                </Button>
              )
            }
              {
              !hasNextPage && (
                <Text>
                  Brak więcej zdarzeń
                </Text>
              )
            }
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
