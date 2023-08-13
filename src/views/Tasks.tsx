import {useAchievableTasks} from '../hooks/queries.ts';

export default function TaskListView() {
  const {data: tasks} = useAchievableTasks();
  return (
    <div>{JSON.stringify(tasks)}</div>
  );
}
