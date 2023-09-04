import {
  Box,
  Icon,
  Skeleton, Stack, Text,
} from '@chakra-ui/react';
import {
  RiAwardFill,
} from 'react-icons/ri';
import {useLatestEvents} from '../hooks/queries.ts';
import LatestEventsModal from './LatestEventsModal.tsx';
import EventsList from './EventsList.tsx';

export default function LatestEventsBox() {
  const {data: events, isLoading: eventsLoading} = useLatestEvents(4);
  return (
    <Skeleton isLoaded={!eventsLoading}>
      {
        (events && events.length > 0) && (
          <Box>
            <Box bg="#eff6f7" p={4} borderRadius="md">
              <EventsList events={events} />
            </Box>
            <LatestEventsModal />
          </Box>
        )
      }
      {
        (!events || events?.length === 0) && (
        <Box minH="200px" display="flex" alignItems="center" justifyContent="center" bg="gray.700" borderRadius="md">
          <Stack spacing={2} textAlign="center" direction="column" alignItems="center">
            <Icon as={RiAwardFill} fontSize="2xl" color="white" />
            <Text color="white" textAlign="center">
              Tutaj pojawią się Wasze osiągnięcia, zgony i więcej!
            </Text>
          </Stack>
        </Box>
        )
      }
    </Skeleton>
  );
}
