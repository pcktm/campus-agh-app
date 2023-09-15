import {
  Center,
  Container, Heading,
  Spinner, Stack, Tab, TabList, TabPanel, TabPanels, Tabs,
} from '@chakra-ui/react';
import {ScrollRestoration} from 'react-router-dom';
import TaskItem from '../components/TaskItem.tsx';
import {useAchievableTasks} from '../hooks/queries.ts';
import AddTaskSuggestionModal from '../components/AddTaskSuggestion.tsx';

export default function TaskListView() {
  const {data: tasks, isLoading: tasksLoading} = useAchievableTasks();
  return (
    <>
      <Container py={5} maxW="container.md">
        <Heading as="h1" size="lg" mb={5}>Zadania do wykonania</Heading>
        <AddTaskSuggestionModal />
        <Tabs colorScheme="brandRed" isFitted variant="soft-rounded">
          <TabList gap={2}>
            <Tab>Drużynowe</Tab>
            <Tab>Indywidualne</Tab>
          </TabList>
          {
          tasksLoading && (
            <Center py={10}>
              <Spinner size="xl" color="brandRed.500" />
            </Center>
          )
        }
          <TabPanels>
            <TabPanel px={0}>
              <Stack>
                {tasks?.filter((t) => !t.is_personal)?.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </Stack>
            </TabPanel>
            <TabPanel px={0}>
              <Stack>
                {tasks?.filter((t) => t.is_personal).map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
      <ScrollRestoration />
    </>
  );
}
