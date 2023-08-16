import {
  Badge,
  Box,
  Card, CardBody, CardFooter, Center, Heading,
  Skeleton,
  Stack, Text,
} from '@chakra-ui/react';
import {polishPlurals} from 'polish-plurals';
import React, {Suspense} from 'react';
import {AchievableTask, useIsAdmin} from '../hooks/queries.ts';

const ImageGallery = React.lazy(() => import('./ImageGallery.tsx'));

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
            <Stack gap={2} direction="row" mb={2}>
              {/* <Badge colorScheme={task.is_personal ? 'teal' : 'blue'}>
                {task.is_personal ? 'Indywidualne' : 'Drużynowe'}
              </Badge> */}
              <Badge colorScheme="teal">
                {`${task.task_solves.length} ${polishPlurals('rozwiązanie', 'rozwiązania', 'rozwiązań', task.task_solves.length)}`}
              </Badge>
            </Stack>
            <Heading size="md">{task.title}</Heading>
            <Text py="2">
              {task.description}
            </Text>
          </CardBody>
          <Box p={4}>
            <Center bg={bgColor} w="75px" h="75px" borderRadius="full">
              <Stack spacing={0} align="center">
                <Text fontSize="lg">{task.points}</Text>
                <Text fontSize="xs">pkt</Text>
              </Stack>
            </Center>
          </Box>
        </Stack>
        {
          task?.task_solves.filter((t) => !!t.imageUrl)?.length > 0 && (
          <CardFooter mt={0} pt={0}>
            <Suspense fallback={(
              <Skeleton isLoaded={false}>
                <Text>Wczytywanie...</Text>
              </Skeleton>
          )}
            >
              <ImageGallery
                buttonText="Galeria"
                images={task.task_solves.filter(({imageUrl}) => !!imageUrl).map((t) => ({
                  id: t.id, url: t.imageUrl as string,
                })) ?? []}
              />
            </Suspense>
          </CardFooter>
          )
        }
      </Card>
    </Box>
  );
}
