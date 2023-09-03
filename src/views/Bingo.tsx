import {
  Box, Container, GridItem, Grid, Spinner, Heading,
} from '@chakra-ui/react';
import {ScrollRestoration, useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import BingoCard from '../components/BingoCard.tsx';
import {useBingoTasks, useIsBingoShown} from '../hooks/queries.ts';

export default function BingoView() {
  const {data: tasks, isLoading} = useBingoTasks();
  const isBingoShown = useIsBingoShown();

  return (
    <>
      <Container pt={4} maxW="container.md">
        <Heading as="h1" size="lg" mb={4}>
          Bingo
        </Heading>
      </Container>
      <Container overflow="scroll" maxW="container.xl" p={2} mb={3}>
        {
          isLoading && (
            <Box textAlign="center" py={5}>
              <Spinner size="lg" color="brandRed.500" />
            </Box>
          )
        }
        { !isLoading && isBingoShown
        && (
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
        )}
      </Container>
      <ScrollRestoration />
    </>
  );
}
