import {Box} from '@chakra-ui/react';
import {useMemo} from 'react';
import {useTeams} from '../../hooks/queries.ts';
import RichSelect from '../RichSelect.tsx';

export default function TeamSelect({onSelect}: {onSelect: (id: string | null) => void}) {
  const {data: teams} = useTeams();

  const teamsToSelect = useMemo(() => teams?.map((team) => ({
    id: String(team.id),
    title: team.name,
  })), [teams]);

  return (
    <Box>
      <RichSelect
        items={teamsToSelect ?? []}
        label="Drużyna"
        placeholder="Wybierz drużynę"
        onSelect={(item) => {
          onSelect(item?.id ?? null);
        }}
      />
    </Box>
  );
}
