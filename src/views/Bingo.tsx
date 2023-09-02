import {
  Box, Container, GridItem, Grid, Spinner, Heading,
} from '@chakra-ui/react';
import {ScrollRestoration} from 'react-router-dom';
import BingoCard from '../components/BingoCard.tsx';
import {useBingoTasks} from '../hooks/queries.ts';

export default function BingoView() {
  const {data: tasks, isLoading} = useBingoTasks();
  return (
    <>
      <Container pt={4} maxW="container.md">
        <Heading as="h1" size="lg" mb={4}>
          Bingo
        </Heading>
      </Container>
      <Container overflow="scroll" maxW="container.xl" p={2}>
        {
          isLoading && (
            <Box textAlign="center" py={5}>
              <Spinner size="lg" color="brandRed.500" />
            </Box>
          )
        }
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
