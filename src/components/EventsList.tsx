import {
  Icon, Text,
  List, ListItem,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import {formatDistanceToNowStrict, formatRelative} from 'date-fns';
import {pl} from 'date-fns/locale';
import {
  RiNotification2Line, RiSkullLine, RiTrophyFill,
} from 'react-icons/ri';
import {Event} from '../hooks/queries.ts';
import type {EventType} from '../types.d.ts';

const iconMap: Record<EventType, React.ElementType> = {
  blackout: RiSkullLine,
  achievement: RiTrophyFill,
  generic: RiNotification2Line,
} as const;

export default function EventsList({
  events,
  exactTime = false,
  variant = 'default',
}: {events: Event[], exactTime?: boolean, variant?: 'default' | 'expanded'}) {
  return (
    <List spacing={variant === 'expanded' ? 1 : 3}>
      {
        events.map((a) => (
          <ListItem
            key={a.id}
            display="flex"
            alignItems="center"
            gap={3}
            {
              ...(variant === 'expanded' ? {
                px: 4,
                py: 3,
                borderRadius: 'lg',
                borderWidth: '1px',
              } : {})
            }
          >
            <Icon
              as={iconMap[a.icon as EventType] ?? iconMap.generic}
              color="brandRed.400"
              fontSize="xl"
            />
            <Stack spacing={0}>
              <Text fontSize="sm" color="gray.600">
                {
                  exactTime
                    ? formatRelative(new Date(a.created_at), new Date(), {locale: pl})
                    : formatDistanceToNowStrict(new Date(a.created_at), {addSuffix: true, locale: pl})
                }
              </Text>
              <Text>
                {a.content}
              </Text>
            </Stack>
          </ListItem>
        ))
      }
    </List>
  );
}

EventsList.defaultProps = {
  exactTime: false,
  variant: 'default',
};
