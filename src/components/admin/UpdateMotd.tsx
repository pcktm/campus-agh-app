import {
  Box, Button, FormControl, FormHelperText, FormLabel,
  Input,
  Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay,
} from '@chakra-ui/react';
import {useQueryClient} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useUpdateMotd} from '../../hooks/mutations.ts';
import {useMotd} from '../../hooks/queries.ts';

type Inputs = {
  motd: string;
};

export default function UpdateMotdModal() {
  const [isOpen, setIsOpen] = useState(false);
  const currentMotd = useMotd();
  const updateMotd = useUpdateMotd();
  const queryClient = useQueryClient();
  const {
    register, handleSubmit, setValue, watch,
  } = useForm<Inputs>();

  const handleClose = () => {
    setIsOpen(false);
    // reset();
  };

  useEffect(() => {
    if (currentMotd) {
      setValue('motd', currentMotd);
    }
  }, [currentMotd, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await updateMotd.mutateAsync(data.motd.trim());
    queryClient.invalidateQueries(['settings']);
    handleClose();
  };

  const motd = watch('motd');
  return (
    <Box>
      <Button
        colorScheme="blue"
        onClick={() => setIsOpen(true)}
      >
        Zaktualizuj MOTD
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} size={['full', 'xl']}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Zaktualizuj MOTD</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl>
                <FormLabel>Treść wiadomości</FormLabel>
                <Input placeholder="Dzisiaj obiad wyjątkowo o 6:45" {...register('motd')} />
                <FormHelperText>
                  Wiadomość widoczna na stronie głownej dla wszystkich uczesników Campusu.
                  <br />
                  Może być pusta, wtedy nie będzie wyświetlana.
                </FormHelperText>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleClose}>Anuluj</Button>
              <Button
                colorScheme="green"
                type="submit"
                isDisabled={(currentMotd ?? '') === motd}
              >
                Zmień
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
