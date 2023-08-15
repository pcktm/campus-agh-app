import {
  Box, Button, FormControl, FormLabel,
  Input,
  Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, Radio, RadioGroup, Select as ChakraSelect, Stack, useToast, FormHelperText,
} from '@chakra-ui/react';
import {useEffect, useMemo, useState} from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import {RiUpload2Line} from 'react-icons/ri';
import {useAddPoints, useAddEvent, useAddTaskSolve} from '../../hooks/mutations.ts';
import {useAchievableTasks, useProfiles, useTeams} from '../../hooks/queries.ts';
import ProfileSelect from './ProfileSelect.tsx';
import TeamSelect from './TeamSelect.tsx';
import TaskSelect from './TaskSelect.tsx';
import FileUploadInput from '../FileInput.tsx';

type Inputs = {
  selectedType: 'personal' | 'team';
  selectedSubject: string | null;
  selectedTask: string | null;
  achievementTitle: string;
  achievementScore: number;
  image: FileList;
};

export default function AddAchievementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {data: profiles} = useProfiles();
  const {data: teams} = useTeams();
  const {data: tasks} = useAchievableTasks();
  const addPoints = useAddPoints();
  const addEvent = useAddEvent();
  const addTaskSolve = useAddTaskSolve();
  const toast = useToast();

  const {
    register, handleSubmit, reset, watch, resetField, setValue, formState: {errors},
  } = useForm<Inputs>({
    mode: 'onChange',
    defaultValues: {
      selectedType: 'team',
      selectedSubject: null,
      achievementTitle: '',
      achievementScore: 15,
    },
  });
  const selectedType = watch('selectedType');
  const selectedTask = watch('selectedTask');
  const selectedFile = watch('image');

  useEffect(() => {
    if (selectedTask && tasks) {
      const task = tasks?.find((t) => t.id === Number(selectedTask));
      if (task) {
        setValue('achievementTitle', task.title);
        setValue('achievementScore', task.points);
      }
    }
  }, [selectedTask, tasks, setValue]);

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
    resetField('selectedTask');
  }, [selectedType, resetField]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.selectedSubject || (!data.achievementTitle && !data.selectedTask) || !data.achievementScore) {
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
    if (data.selectedTask) {
      await addTaskSolve.mutateAsync({
        image: data.image[0],
        taskId: data.selectedTask,
        type: data.selectedType,
        subjectId: data.selectedSubject,
      });
    }
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
                  <ProfileSelect onSelect={(id) => setValue('selectedSubject', id)} />
                ) : (
                  <TeamSelect onSelect={(id) => setValue('selectedSubject', id)} />
                )
              }
              </Box>

              <Box mt={3}>
                <TaskSelect type={selectedType} onSelect={(id) => setValue('selectedTask', id)} />
              </Box>

              {
                selectedTask && (
                  <FormControl mt={3} isInvalid={!!errors.image}>
                    <FormLabel>Zdjęcie wykonanego zadania</FormLabel>
                    <FileUploadInput
                      register={register('image', {
                        validate: (value: FileList) => {
                          for (const file of Array.from(value)) {
                            // it must not be larger than 5mb
                            if (file.size > 5 * 1024 * 1024) {
                              return 'Zdjęcie nie może być większe niż 5MB';
                            }
                          }
                          return true;
                        },
                      })}
                      accept="image/jpeg,image/png"
                    >
                      <Button
                        colorScheme="blue"
                        leftIcon={<RiUpload2Line />}
                      >
                        {selectedFile?.length ? 'Zmień zdjęcie' : 'Dodaj zdjęcie'}
                      </Button>
                    </FileUploadInput>
                    <FormHelperText>
                      {errors.image?.message}
                    </FormHelperText>
                  </FormControl>
                )
              }

              <FormControl mt={3} isDisabled={!!selectedTask}>
                <FormLabel>Tytuł osiągnięcia</FormLabel>
                <Input placeholder="Pierwszy zgon" {...register('achievementTitle')} />
              </FormControl>

              <FormControl mt={3} isDisabled={!!selectedTask}>
                <FormLabel>Wartość punktowa</FormLabel>
                <NumberInput defaultValue={15} min={0} max={300}>
                  <NumberInputField {...register('achievementScore')} required />
                </NumberInput>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleClose}>Anuluj</Button>
              <Button
                colorScheme="green"
                type="submit"
                isLoading={isSubmitting}
              >
                Dodaj
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
