import {
  Icon, Text,
  List, ListItem,
  Stack, Box, IconButton,
} from '@chakra-ui/react';
import React, {useMemo} from 'react';
import {formatDistanceToNowStrict, formatRelative} from 'date-fns';
import {pl} from 'date-fns/locale';
import {
  RiHeartFill,
  RiHeartLine,
  RiNotification2Line, RiSkullLine, RiTrophyFill,
} from 'react-icons/ri';
import {useQueryClient} from '@tanstack/react-query';
import {Event, useUser} from '../hooks/queries.ts';
import type {EventType} from '../types.d.ts';
import {useAddEventReaction, useDeleteEventReaction} from '../hooks/mutations.ts';

const iconMap: Record<EventType, React.ElementType> = {
  blackout: RiSkullLine,
  achievement: RiTrophyFill,
  generic: RiNotification2Line,
} as const;

function ReactionDisplay({reactions, eventId}: {reactions: Event['event_reactions'], eventId: number}) {
  const postReaction = useAddEventReaction();
  const deleteReaction = useDeleteEventReaction();
  const {data: me} = useUser();
  const heartAmount = useMemo(() => new Set(reactions?.map((r) => r.user_id)).size, [reactions]);
  const hasUserLiked = useMemo(() => reactions?.some((r) => r.user_id === me?.id), [reactions, me]);

  const handleClick = () => {
    if (hasUserLiked) {
      deleteReaction.mutate(eventId);
    } else {
      postReaction.mutate(eventId);
    }
  };
  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <IconButton
        icon={<Icon fontSize="xl" as={hasUserLiked ? RiHeartFill : RiHeartLine} />}
        color={heartAmount > 0 ? 'brandRed.500' : 'gray.400'}
        size="xl"
        variant="ghost"
        aria-label="Polub"
        onClick={handleClick}
      />
      <Text fontSize="sm" color="gray.600">
        {heartAmount}
      </Text>
    </Stack>
  );
}

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
            <Stack spacing={0} flex={1}>
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
            <ReactionDisplay reactions={a.event_reactions} eventId={a.id} />
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
