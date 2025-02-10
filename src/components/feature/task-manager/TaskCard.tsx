import { useState } from "react";
import AddEditTaskModal from "@/components/feature/task-manager/AddEditTaskModal";
import ConfirmationModal from "@/components/feature/task-manager/ConfirmationModal";
import { Task } from "@/types/interfaces";

interface TaskProps {
  task: Task;
  onTaskUpdated: (updatedTask: Task) => void;
}

const TaskCard: React.FC<TaskProps> = ({ task, updatedTask }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  return (
    <div className="border p-4 rounded-md shadow-md bg-white flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">{task.taskTitle}</h3>
        <p className="text-gray-600">{task.taskDescription}</p>
        <p className="text-sm text-gray-500">Due: {task.taskDueDate}</p>
        {task.taskCourseTag && (
          <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 text-xs">
            {task.taskCourseTag}
          </span>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          className="text-green-500"
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit
        </button>
        <button
          className="text-red-500"
          onClick={() => setIsConfirmModalOpen(true)}
        >
          Delete
        </button>
      </div>

      {isEditModalOpen && (
        <AddEditTaskModal
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          existingTask={task}
          onTaskSaved={updatedTask}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this task?"
          onConfirm={() => console.log("Task deleted")}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TaskCard;
