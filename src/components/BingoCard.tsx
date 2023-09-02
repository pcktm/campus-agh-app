import {
  Card, Heading, CardBody, Text, CardFooter, Wrap, Box, WrapItem, Tooltip,
} from '@chakra-ui/react';
import {BingoTask, useProfileById, useUser} from '../hooks/queries.ts';

export default function BingoCard({task}: {task: BingoTask}) {
  const {data: user} = useUser();
  const {data: profile} = useProfileById(user?.id);
  const hasPlayerTeamSolvedThis = task.bingo_solves.some((solve) => solve.teams?.id === profile?.teamId);
  return (
    <Card
      w="100%"
      h="100%"
      border={hasPlayerTeamSolvedThis ? '2px solid green' : 'none'}
      borderColor={hasPlayerTeamSolvedThis ? 'green.500' : 'gray.500'}
    >
      <CardBody p={4}>
        <Heading as="h1" size="md" mb={1}>{task.title}</Heading>
        <Text fontSize="xs">
          {task.hint}
        </Text>
      </CardBody>
      <CardFooter pt={1}>
        <Wrap>
          {
            task.bingo_solves.map((solve) => (
              <WrapItem key={solve.teams?.id}>
                <Tooltip label={solve.teams?.name} closeOnClick={false}>
                  <Box
                    w="20px"
                    h="20px"
                    borderRadius="50%"
                    bg={solve.teams?.color ?? 'gray.500'}
                  />
                </Tooltip>
              </WrapItem>
            ))
          }
        </Wrap>
      </CardFooter>
    </Card>
  );
}