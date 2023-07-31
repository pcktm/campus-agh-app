import {
  Box, Button, FormControl, FormLabel,
  Input,
  Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Radio, RadioGroup, Select, Stack, useToast,
} from '@chakra-ui/react';
import {useEffect, useMemo, useState} from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import {useAddAchievement} from '../../hooks/mutations.ts';
import {useProfilesWithAchievements, useTeamsWithAchievements} from '../../hooks/queries.ts';

type Inputs = {
  selectedType: 'personal' | 'team';
  selectedSubject: string | null;
  achievementTitle: string;
  achievementScore: number;
};

export default function AddAchievementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const {data: profiles} = useProfilesWithAchievements();
  const {data: teams} = useTeamsWithAchievements();
  const addAchievement = useAddAchievement();
  const toast = useToast();

  const {
    register, handleSubmit, reset, watch, resetField,
  } = useForm<Inputs>({
    mode: 'onBlur',
    defaultValues: {
      selectedType: 'team',
      selectedSubject: null,
      achievementTitle: '',
      achievementScore: 15,
    },
  });
  const selectedType = watch('selectedType');

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

  useEffect(() => {
    resetField('selectedSubject');
  }, [selectedType, resetField]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.debug(data);
    if (!data.selectedSubject || !data.achievementTitle || !data.achievementScore) {
      toast({
        title: 'Nie udało się dodać osiągnięcia',
        description: 'Wypełnij wszystkie pola',
        status: 'error',
        isClosable: true,
        position: 'top',
      });
      return;
    }
    addAchievement.mutate({
      type: data.selectedType,
      subjectId: Number(data.selectedSubject),
      title: data.achievementTitle,
      score: data.achievementScore,
    });
    handleClose();
  };

  return (
    <Box>
      <Button
        colorScheme="blue"
        onClick={() => setIsOpen(true)}
      >
        Dodaj osiągnięcie
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} size={['full', 'xl']}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dodaj osiągnięcie</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>

              <FormControl mb={3}>
                <FormLabel>Typ osiągnięcia</FormLabel>
                <RadioGroup defaultValue="team">
                  <Stack direction="row">
                    <Radio value="team" {...register('selectedType')}>
                      Drużynowe
                    </Radio>
                    <Radio value="personal" {...register('selectedType')}>
                      Osobiste
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel>
                  {selectedType === 'personal' ? 'Uczestnik' : 'Drużyna'}
                </FormLabel>
                <Select
                  placeholder={`Wybierz ${selectedType === 'personal' ? 'uczestnika' : 'drużynę'}`}
                  required
                  {...register('selectedSubject')}
                >
                  {
                subjects?.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))
              }
                </Select>
              </FormControl>

              <FormControl mt={3}>
                <FormLabel>Tytuł osiągnięcia</FormLabel>
                <Input placeholder="Pierwszy zgon" {...register('achievementTitle')} required />
              </FormControl>

              <FormControl mt={3}>
                <FormLabel>Wartość punktowa</FormLabel>
                <NumberInput defaultValue={15} min={0} max={300}>
                  <NumberInputField {...register('achievementScore')} required />
                </NumberInput>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleClose}>Anuluj</Button>
              <Button colorScheme="green" type="submit">
                Dodaj
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
