import {
  Card, Heading, CardBody, Text, CardFooter, Wrap, Box, WrapItem, Tooltip, Tag, TagLabel, TagRightIcon,
} from '@chakra-ui/react';
import {RiUserLocationLine} from 'react-icons/ri';
import {BingoTask, useProfileById, useUser} from '../hooks/queries.ts';

export default function BingoCard({task}: {task: BingoTask}) {
  const {data: user} = useUser();
  const {data: profile} = useProfileById(user?.id);
  const hasPlayerTeamSolvedThis = task.bingo_solves.some((solve) => solve.teams?.id === profile?.teamId);
  return (
    <Card
      w="100%"
      h="100%"
      outline={hasPlayerTeamSolvedThis ? '2px solid green' : '0px'}
      outlineColor={hasPlayerTeamSolvedThis ? 'green.500' : 'gray.500'}
      transition="all 0.2s linear"
    >
      <CardBody p={4}>
        <Tag size="sm" mb={2}>
          <TagLabel>{task.min_people}</TagLabel>
          <TagRightIcon as={RiUserLocationLine} />
        </Tag>
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
