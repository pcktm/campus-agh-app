import {useMemo, useState} from 'react';
import {Box, Heading} from '@chakra-ui/react';
import {useAchievableTasks} from '../../hooks/queries.ts';
import RichSelect from '../RichSelect.tsx';

export default function TaskSelect({onSelect, type}: {onSelect: (id: string | null) => void, type: 'personal' | 'team'}) {
  const {data: tasks} = useAchievableTasks();

  const tasksToSelect = useMemo(() => tasks?.filter((t) => {
    if (type === 'personal') {
      return t.is_personal;
    }
    return !t.is_personal;
  }).map((t) => ({
    id: String(t.id),
    title: t.title,
    subtitle: t.description,
  })), [tasks, type]);

  return (
    <Box>
      <RichSelect
        items={tasksToSelect ?? []}
        label="Zadanie"
        placeholder="Wybierz zadanie"
        onSelect={(item) => {
          onSelect(item?.id ?? null);
        }}
      />
    </Box>
  );
}
