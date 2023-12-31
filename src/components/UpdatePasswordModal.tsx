import {
  Box, Button,
  FormControl, FormLabel, Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, useDisclosure,
} from '@chakra-ui/react';
import React, {useState} from 'react';
import {usePasswordChange} from '../hooks/mutations.ts';

export default function UpdatePasswordModal() {
  const [newPassword, setNewPassword] = useState<string>('');
  const {isOpen, onOpen, onClose} = useDisclosure();
  const changePassword = usePasswordChange();

  const handleChange = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    changePassword.mutate(newPassword);
    onClose();
  };
  return (
    <Box>
      <Button
        variant="link"
        my={0}
        size="xs"
        onClick={() => {
          onOpen();
          setNewPassword('');
        }}
      >
        Zmień hasło
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Zmień hasło</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleChange}>
            <ModalBody>
              <Box>
                <FormControl>
                  <FormLabel>Hasło</FormLabel>
                  <Input
                    type="password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Twoje nowe hasło"
                    required
                  />
                </FormControl>
              </Box>
              <ModalFooter pr={0}>
                <Button colorScheme="green" type="submit">
                  Zmień
                </Button>
              </ModalFooter>
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
