import {
  Box, Button, FormControl, FormLabel,
  Input,
  Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Radio, RadioGroup, Select, Stack, useToast,
} from '@chakra-ui/react';
import {useMemo, useState} from 'react';
import {useAddAchievement} from '../../hooks/mutations.ts';
import {useProfilesWithAchievements, useTeamsWithAchievements} from '../../hooks/queries.ts';

export default function AddAchievementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const {data: profiles} = useProfilesWithAchievements();
  const {data: teams} = useTeamsWithAchievements();
  const addAchievement = useAddAchievement();
  const toast = useToast();

  const [selectedType, setSelectedType] = useState<'personal' | 'team'>('team');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [achievementTitle, setAchievementTitle] = useState('');
  const [achievementScore, setAchievementScore] = useState<number>(0);

  const subjects = useMemo(() => {
    if (selectedType === 'personal') {
      return profiles?.map((profile) => ({
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName} (${profile?.teams?.name})`,
      }));
    }
    return teams?.map((team) => ({
      id: team.id,
      name: team.name,
    }));
  }, [profiles, teams, selectedType]);

  const handleChangeType = (type: 'personal' | 'team') => {
    setSelectedType(type);
    setSelectedSubject(null);
  };

  const handleSubmit = () => {
    console.log({
      selectedSubject, achievementTitle, achievementScore,
    });
    if (!selectedSubject || !achievementTitle || !achievementScore) {
      toast({
        title: 'Nie udało się dodać osiągnięcia',
        description: 'Wypełnij wszystkie pola',
        status: 'error',
        isClosable: true,
      });
      return;
    }
    addAchievement.mutate({
      type: selectedType,
      subjectId: Number(selectedSubject),
      title: achievementTitle,
      score: achievementScore,
    });
    setIsOpen(false);
  };

  const resetForm = () => {
    setSelectedType('team');
    setSelectedSubject(null);
    setAchievementTitle('');
    setAchievementScore(15);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resetForm();
  };

  return (
    <Box>
      <Button
        colorScheme="blue"
        onClick={() => setIsOpen(true)}
      >
        Dodaj osiągnięcie
      </Button>
      <Modal isOpen={isOpen} onClose={handleCancel} size={['full', 'xl']}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dodaj osiągnięcie</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            <FormControl mb={3}>
              <FormLabel>Typ osiągnięcia</FormLabel>
              <RadioGroup defaultValue="team" onChange={(v) => handleChangeType(v as 'personal' | 'team')}>
                <Stack direction="row">
                  <Radio value="team">Drużynowe</Radio>
                  <Radio value="personal">Osobiste</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>
                {selectedType === 'personal' ? 'Uczestnik' : 'Drużyna'}
              </FormLabel>
              <Select onChange={(e) => setSelectedSubject(e.target.value)}>
                {
                subjects?.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))
              }
              </Select>
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Tytuł osiągnięcia</FormLabel>
              <Input onChange={(e) => setAchievementTitle(e.target.value)} placeholder="Pierwszy zgon" />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Wartość punktowa</FormLabel>
              <NumberInput defaultValue={15} min={0} max={300}>
                <NumberInputField onChange={(e) => setAchievementScore(Number(e.target.value))} />
              </NumberInput>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCancel}>Anuluj</Button>
            <Button colorScheme="green" onClick={handleSubmit}>
              Dodaj
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
