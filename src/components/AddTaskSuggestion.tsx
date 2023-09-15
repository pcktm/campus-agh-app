import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel, Input,
  Modal, ModalBody, ModalFooter, ButtonGroup,
  ModalCloseButton,
  ModalContent, ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, {useState} from 'react';
import {useAddTaskSuggestion} from '../hooks/mutations.ts';

export default function AddTaskSuggestionModal() {
  const addTaskSuggestion = useAddTaskSuggestion();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>();
  const [content, setContent] = useState('');
  const handleClose = () => {
    setIsOpen(false);
    setTitle(undefined);
    setContent('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content) return;
    addTaskSuggestion.mutate({
      title,
      content,
    });
    handleClose();
  };

  return (
    <Box mb={5}>
      <Center>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          Zaproponuj nam własne zadanie!
        </Button>
      </Center>
      <Modal isOpen={isOpen} onClose={handleClose} size={['xl', 'xl']}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dodaj propozycję zadania</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl>
                <FormLabel>
                  Tytuł
                </FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tytuł"
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>
                  Treść zadania
                  <span color="red">*</span>
                </FormLabel>
                <Input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Treść"
                  required
                />
              </FormControl>

            </ModalBody>
            <ModalFooter>
              <ButtonGroup justifyContent="end" flex={1}>
                <Button variant="ghost" mr={3} onClick={handleClose}>Anuluj</Button>
                <Button
                  colorScheme="green"
                  type="submit"
                  disabled={!content || content.length < 10}
                >
                  Dodaj
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
