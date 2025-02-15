// "use client";

import TaskCard from "@/components/feature/task-manager/TaskCard";
import { Task } from "@/types/interfaces";

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: (updatedTask: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskUpdated,
  onTaskDeleted,
}) => {
  return (
    <div className="mt-6 space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.taskId}
          task={task}
          onTaskUpdated={onTaskUpdated}
          onTaskDeleted={onTaskDeleted}
        />
      ))}
    </div>
  );
};

export default TaskList;
