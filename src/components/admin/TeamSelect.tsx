import {useMemo, useState} from 'react';
import {Box, Heading} from '@chakra-ui/react';
import {useTeams} from '../../hooks/queries.ts';
import RichSelect from '../RichSelect.tsx';

export default function TeamSelect({onSelect}: {onSelect: (id: string | number) => void}) {
  const {data: teams} = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<number | string>();

  const teamsToSelect = useMemo(() => teams?.map((team) => ({
    id: team.id,
    title: team.name,
  })), [teams]);

  return (
    <Box>
      <RichSelect
        items={teamsToSelect ?? []}
        label="Drużyna"
        onSelect={(item) => {
          setSelectedTeam(item.id);
          onSelect(item.id);
        }}
      />
    </Box>
  );
}
