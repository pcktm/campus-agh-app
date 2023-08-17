import {
  Box,
  Icon, List, ListItem, Skeleton, Stack, Text,
} from '@chakra-ui/react';
import {formatDistanceToNowStrict} from 'date-fns/esm';
import {pl} from 'date-fns/esm/locale';
import React from 'react';
import {
  RiAwardFill, RiNotification2Line, RiSkullLine, RiTrophyFill,
} from 'react-icons/ri';
import {useLatestEvents} from '../hooks/queries.ts';
import type {EventType} from '../types.d.ts';

const iconMap: Record<EventType, React.ElementType> = {
  blackout: RiSkullLine,
  achievement: RiTrophyFill,
  generic: RiNotification2Line,
} as const;

export default function LatestEventsBox() {
  const {data: events, isLoading: eventsLoading} = useLatestEvents(4);
  return (
    <Skeleton isLoaded={!eventsLoading}>
      {
        (events && events.length > 0) && (
          <Box bg="#eff6f7" p={4} borderRadius="md">
            <List spacing={3}>
              {
                  events.map((a) => (
                    <ListItem key={a.id} display="flex" alignItems="center" gap={3}>
                      <Icon
                        as={iconMap[a.icon as EventType] ?? iconMap.generic}
                        color="brandRed.400"
                        fontSize="xl"
                      />
                      <Stack spacing={0}>
                        <Text fontSize="sm" color="gray.600">
                          {formatDistanceToNowStrict(new Date(a.created_at), {addSuffix: true, locale: pl})}
                        </Text>
                        <Text>
                          {a.content}
                        </Text>
                      </Stack>
                    </ListItem>
                  ))
                }
            </List>
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
