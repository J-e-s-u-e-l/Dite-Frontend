// "use client";

import TaskCard from "@/components/feature/task-manager/TaskCard";
import { Task } from "@/types/interfaces";

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: (updatedTask: Task) => void; // Callback to notify parent component about task updates. This could be a task update event or a separate action. This function should be passed down to TaskCard.  // Props are destructured for better readability.  // TaskList is a functional component that renders a list of TaskCard components.  // Tasks prop is an array of Task objects, and onTaskUpdated prop is a callback function to notify parent component about task
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdated }) => {
  return (
    <div className="mt-6 space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.taskId} task={task} onTaskUpdated={onTaskUpdated} />
      ))}
    </div>
  );
};

export default TaskList;
