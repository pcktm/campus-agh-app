import {useMemo, useState} from 'react';
import {Box, Heading} from '@chakra-ui/react';
import {useProfiles} from '../../hooks/queries.ts';
import RichSelect from '../RichSelect.tsx';

export default function ProfileSelect({onSelect}: {onSelect: (id: string | null) => void}) {
  const {data: profiles} = useProfiles();

  const profilesToSelect = useMemo(() => profiles?.map((profile) => ({
    id: String(profile.id),
    title: `${profile.firstName} ${profile.lastName}`,
    subtitle: profile.teams?.name,
  })), [profiles]);

  return (
    <Box>
      <RichSelect
        items={profilesToSelect ?? []}
        label="Uczestnik"
        placeholder="Wybierz uczestnika"
        onSelect={(item) => {
          onSelect(item?.id ?? null);
        }}
      />
    </Box>
  );
}
