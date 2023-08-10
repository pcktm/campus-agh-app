import {
  Box, Button, FormControl, FormLabel,
  Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay,
  Select,
  useToast,
} from '@chakra-ui/react';
import {useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useAddEvent, useAddPoints} from '../../hooks/mutations.ts';
import {useProfiles} from '../../hooks/queries.ts';

type Inputs = {
  selectedSubject: string | null;
};

export default function AddBlackOutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {data: profiles} = useProfiles();
  const addPoints = useAddPoints();
  const addEvent = useAddEvent();
  const toast = useToast();

  const {
    register, handleSubmit, reset,
  } = useForm<Inputs>({
    mode: 'onBlur',
    defaultValues: {
      selectedSubject: null,
    },
  });

  const subjects = useMemo(() => {
    let subs: {id: number, name: string, teamId?: number}[] = [];
    subs = (profiles ?? []).map((profile) => ({
      id: profile.id,
      name: `${profile.firstName} ${profile.lastName} (${profile?.teams?.name})`,
      teamId: profile?.teams?.id,
    }));
    return subs.sort((a, b) => a.name.localeCompare(b.name));
  }, [profiles]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.selectedSubject) {
      toast({
        title: 'Nie udało się dodać zgona',
        description: 'Wypełnij wszystkie pola',
        status: 'error',
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setIsSubmitting(true);
    const subject = subjects?.find((s) => s.id === Number(data.selectedSubject));
    if (subject && subject.teamId) {
      await addPoints.mutateAsync({
        type: 'team',
        subjectId: Number(subject.teamId),
        reason: `Blackout: ${subject.name}`,
        score: 25,
      });
      await addEvent.mutateAsync({
        // eslint-disable-next-line max-len
        content: `${subject.name} zalicza zgona! 25 pkt dla drużyny!`,
        icon: 'blackout',
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
        Dodaj zgona
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} size={['full', 'xl']}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dodaj zgona</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl>
                <FormLabel>
                  Uczestnik
                </FormLabel>
                <Select
                  placeholder="Wybierz uczestnika"
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
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleClose}>Anuluj</Button>
              <Button colorScheme="green" type="submit" isLoading={isSubmitting}>
                Dodaj XD
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
