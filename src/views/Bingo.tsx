import {
  Box, Container, GridItem, Grid,
} from '@chakra-ui/react';
import {ScrollRestoration} from 'react-router-dom';
import BingoCard from '../components/BingoCard.tsx';
import {useBingoTasks} from '../hooks/queries.ts';

export default function BingoView() {
  const {data: tasks, isLoading} = useBingoTasks();
  return (
    <>
      <Container overflow="scroll" maxW="container.xl" p={4}>
        <Grid templateColumns="repeat(5, 1fr)" gap={2} templateRows="repeat(5, 1fr)">
          {
          tasks?.map((task) => (
            <GridItem minW="210px" minH="210px" key={task.id}>
              <BingoCard
                task={task}
              />
            </GridItem>
          ))
        }
        </Grid>
      </Container>
      <ScrollRestoration />
    </>
  );
}
