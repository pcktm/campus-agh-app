import {
  Box, Button, FormControl, FormLabel,
  Input,
  Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Radio, RadioGroup, Select as ChakraSelect, Stack, useToast,
} from '@chakra-ui/react';
import {useEffect, useMemo, useState} from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import {useAddPoints, useAddEvent} from '../../hooks/mutations.ts';
import {useAchievableTasks, useProfiles, useTeams} from '../../hooks/queries.ts';
import ProfileSelect from './ProfileSelect.tsx';
import TeamSelect from './TeamSelect.tsx';

type Inputs = {
  selectedType: 'personal' | 'team';
  selectedSubject: string | null;
  achievementTitle: string;
  achievementScore: number;
};

export default function AddAchievementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {data: profiles} = useProfiles();
  const {data: teams} = useTeams();
  const {data: tasks} = useAchievableTasks();
  const addPoints = useAddPoints();
  const addEvent = useAddEvent();
  const toast = useToast();

  const {
    register, handleSubmit, reset, watch, resetField, setValue,
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
    let subs: {id: number, name: string}[] = [];
    if (selectedType === 'personal') {
      subs = (profiles ?? []).map((profile) => ({
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName} (${profile?.teams?.name})`,
      }));
    } else {
      subs = (teams ?? []).map((team) => ({
        id: team.id,
        name: team.name,
      }));
    }
    return subs.sort((a, b) => a.name.localeCompare(b.name));
  }, [profiles, teams, selectedType]);

  useEffect(() => {
    resetField('selectedSubject');
  }, [selectedType, resetField]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
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
    setIsSubmitting(true);
    await addPoints.mutateAsync({
      type: data.selectedType,
      subjectId: Number(data.selectedSubject),
      reason: `Osiągnięcie: ${data.achievementTitle}`,
      score: data.achievementScore,
    });
    const subject = subjects?.find((s) => s.id === Number(data.selectedSubject));
    if (subject) {
      await addEvent.mutateAsync({
        // eslint-disable-next-line max-len
        content: `${subject.name} ${data.selectedType === 'team' ? 'zdobywają' : 'zdobywa'} osiągnięcie „${data.achievementTitle}” (${data.achievementScore} pkt)`,
        icon: 'achievement',
      });
    }
    setIsSubmitting(false);
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

              <Box mt={3}>
                {
                selectedType === 'personal' ? (
                  <ProfileSelect onSelect={(id) => setValue('selectedSubject', String(id))} />
                ) : (
                  <TeamSelect onSelect={(id) => setValue('selectedSubject', String(id))} />
                )
              }
              </Box>

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
              <Button colorScheme="green" type="submit" isLoading={isSubmitting}>
                Dodaj
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
