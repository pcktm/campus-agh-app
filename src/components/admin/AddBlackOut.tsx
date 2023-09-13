import {
  Box, Button,
  Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, Text,
  useToast,
} from '@chakra-ui/react';
import {useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useAddBlackout, useAddEvent, useAddPoints} from '../../hooks/mutations.ts';
import {useBlackoutsByProfile, useProfiles} from '../../hooks/queries.ts';
import ProfileSelect from './ProfileSelect.tsx';

type Inputs = {
  selectedSubject: string | null;
};

const generateMessage = (name: string) => {
  const templates = [
    `${name} zalicza zgona, 5 punktów dla drużyny!`,
    `${name} nie ma już z nami, 5 punktów dla drużyny ;)`,
    `Anielski orszak wita ${name}, 5 punktów dla drużyny XD`,
    `${name} musi już iść spać, na drużynę czeka 5 punktów 😉`,
    `${name} zapada w zimowy sen, 5 punktów dla drużyny 🐻`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
};

export default function AddBlackOutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {data: profiles} = useProfiles();
  const addPoints = useAddPoints();
  const addBlackout = useAddBlackout();
  const addEvent = useAddEvent();
  const toast = useToast();

  const {
    handleSubmit, reset, watch, setValue,
  } = useForm<Inputs>({
    mode: 'onBlur',
    defaultValues: {
      selectedSubject: null,
    },
  });

  const selectedSubject = watch('selectedSubject');
  const {data: blackoutsByProfile, isLoading: lastBlackoutsLoading} = useBlackoutsByProfile(selectedSubject);

  const hasBlackedOutInLast10Hours = useMemo(() => {
    if (!blackoutsByProfile) return false;
    const now = new Date();
    const last10Hours = new Date(now.getTime() - (10 * 60 * 60 * 1000));
    return blackoutsByProfile?.some((blackout) => new Date(blackout.created_at) > last10Hours);
  }, [blackoutsByProfile]);

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
      await Promise.allSettled([
        addPoints.mutateAsync({
          type: 'team',
          subjectId: Number(subject.teamId),
          reason: `Blackout: ${subject.name}`,
          score: 5,
        }),
        addBlackout.mutateAsync({
          profileId: Number(subject.id),
        }),
        addEvent.mutateAsync({
          content: generateMessage(subject.name),
          icon: 'blackout',
        }),
      ]);
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
              <ProfileSelect onSelect={(id) => setValue('selectedSubject', id)} />
              {
                hasBlackedOutInLast10Hours && (
                  <Text color="red.500">Ten wojownik zaliczył już zgona w ostatnich 10 godzinach!</Text>
                )
              }
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleClose}>Anuluj</Button>
              <Button
                colorScheme={hasBlackedOutInLast10Hours ? 'red' : 'green'}
                type="submit"
                isLoading={isSubmitting}
                isDisabled={lastBlackoutsLoading || !selectedSubject}
              >
                Dodaj
                {' '}
                {hasBlackedOutInLast10Hours && 'mimo tego XD'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
