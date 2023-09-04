import {
  Box, Button,
  FormControl,
  FormLabel,
  Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, Select, Text,
  useToast,
} from '@chakra-ui/react';
import {useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useAddBingoTaskSolve, useAddEvent} from '../../hooks/mutations.ts';
import {useBingoTasks, useTeams} from '../../hooks/queries.ts';
import TeamSelect from './TeamSelect.tsx';

type Inputs = {
  selectedSubject: string | null;
  selectedTask: string | null;
};

export default function AddBingoSolutionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {data: tasks} = useBingoTasks({enabled: isOpen});
  const addBingoSolve = useAddBingoTaskSolve();
  const toast = useToast();

  const {
    handleSubmit, reset, watch, setValue, register,
  } = useForm<Inputs>({
    mode: 'onBlur',
    defaultValues: {
      selectedSubject: null,
    },
  });

  const selectedSubject = watch('selectedSubject');

  // const subjects = useMemo(() => {
  //   let subs: {id: number, name: string, teamId?: number}[] = [];
  //   subs = (teams ?? []).map((profile) => ({
  //     id: profile.id,
  //     name: profile.name,
  //   }));
  //   return subs.sort((a, b) => a.name.localeCompare(b.name));
  // }, [teams]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.selectedSubject || !data.selectedTask) {
      toast({
        title: 'Nie udało się dodać bingo',
        description: 'Wypełnij wszystkie pola',
        status: 'error',
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setIsSubmitting(true);
    await addBingoSolve.mutateAsync({
      teamId: data.selectedSubject,
      taskId: data.selectedTask,
    }).finally(() => {
      setIsSubmitting(false);
      handleClose();
    });
  };

  return (
    <Box>
      <Button
        colorScheme="blue"
        onClick={() => setIsOpen(true)}
      >
        Dodaj rozwiązanie
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} size={['full', 'xl']}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dodaj rozwiązanie</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <TeamSelect onSelect={(id) => setValue('selectedSubject', id)} />
              <FormControl mt={4}>
                <FormLabel>
                  Wybierz zadanie
                </FormLabel>
                <Select placeholder="Wybierz zadanie" {...register('selectedTask')}>
                  {
                    tasks?.map((task) => (
                      <option key={task.id} value={task.id}>{task.title}</option>
                    ))
                  }
                </Select>
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
