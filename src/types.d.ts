const EventTypeArray = ['generic', 'blackout', 'achievement'] as const;
export type EventType = typeof EventTypeArray[number];
