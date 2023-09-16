import {
  Badge,
  Box,
  Card, CardBody, CardFooter, Center, Heading,
  Skeleton,
  Stack, Text,
} from '@chakra-ui/react';
import {polishPlurals} from 'polish-plurals';
import React, {Suspense, useMemo} from 'react';
import {formatRelative} from 'date-fns/esm';
import {pl} from 'date-fns/esm/locale';
import {AchievableTask, useTaskSolves, useTeams} from '../hooks/queries.ts';
import type {GalleryImage} from './ImageGallery.tsx';

const ImageGallery = React.lazy(() => import('./ImageGallery.tsx'));

export default function TaskItem({task}: {task: AchievableTask}) {
  const {data: solutions, isLoading} = useTaskSolves(task.id, task.task_solves.length > 0);
  const {data: teams} = useTeams();

  const mappedSolutions = useMemo<GalleryImage[]>(() => {
    const filtered = solutions?.filter((s) => !!s.imageUrl);
    if (!filtered) {
      return [];
    }
    return filtered.map((s) => {
      const sub = task.is_personal ? `${s.profiles?.firstName} ${s.profiles?.lastName}` : s.teams?.name;
      return {
        id: s.id,
        url: s.imageUrl as string,
        description: `${sub}
        ${formatRelative(new Date(s.created_at), new Date(), {locale: pl})}`,
      };
    });
  }, [solutions, task]);

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
            <Skeleton isLoaded={!isLoading}>
              <Suspense fallback={(
                <Text>Wczytywanie...</Text>
              )}
              >
                <ImageGallery
                  buttonText="Galeria"
                  images={mappedSolutions}
                />
              </Suspense>
            </Skeleton>
          </CardFooter>
          )
        }
      </Card>
    </Box>
  );
}
