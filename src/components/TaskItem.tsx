import {
  Box, Button, Card, CardBody, CardFooter, Center, Heading, Stack, Text, Badge,
} from '@chakra-ui/react';
import {AchievableTask, useIsAdmin} from '../hooks/queries.ts';

export default function TaskItem({task}: {task: AchievableTask}) {
  const isAdmin = useIsAdmin();
  let bgColor: string;
  if (task.points >= 35) {
    bgColor = 'yellow.300';
  } else if (task.points >= 20) {
    bgColor = 'gray.200';
  } else {
    bgColor = 'orange.200';
  }
  return (
    <Box>
      <Card
        direction="column"
        overflow="hidden"
        variant="outline"
      >
        <Stack direction="row" spacing={4} align="center">
          <CardBody>
            <Badge colorScheme={task.is_personal ? 'green' : 'blue'} mb={1}>
              {task.is_personal ? 'Indywidualne' : 'Drużynowe'}
            </Badge>
            <Heading size="md">{task.title}</Heading>
            <Text py="2">
              {task.description}
            </Text>
          </CardBody>
          <Box p={4}>
            <Center bg={bgColor} w="100px" h="100px" borderRadius="full">
              <Stack spacing={0} align="center">
                <Text fontSize="lg">{task.points}</Text>
                <Text fontSize="xs">punktów</Text>
              </Stack>
            </Center>
          </Box>
        </Stack>
        {
          false && (
          <CardFooter mt={0} pt={0}>
            <Button variant="solid" colorScheme="blue">
              Buy Latte
            </Button>
          </CardFooter>
          )
        }
      </Card>
    </Box>
  );
}
