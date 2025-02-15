"use client";

import { useState, useEffect } from "react";
import AddEditTaskModal from "@/components/feature/task-manager/AddEditTaskModal";
import ConfirmationModal from "@/components/feature/task-manager/ConfirmationModal";
import { Task } from "@/types/interfaces";
import {
  fetchTaskStatuses,
  updateTaskStatus,
  deleteTask,
} from "@/services/task-managerServices";
import { useToast } from "@/context/ToastContext";

interface TaskProps {
  task: Task;
  onTaskUpdated: (updatedTask: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

// const TaskCard: React.FC<TaskProps> = ({ task, onTaskUpdated }) => {
const TaskCard: React.FC<TaskProps> = ({
  task,
  onTaskUpdated: onTaskUpdated,
  onTaskDeleted,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const response = await fetchTaskStatuses();
        setStatusOptions(response.data.taskStatuses);
      } catch (error) {
        console.error("Failed to load statuses:", error);
      }
    };
    loadStatuses();
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    try {
      // const updatedTask = { ...task, taskStatus: newStatus };
      // await updateTaskStatus(updatedTask);
      await updateTaskStatus(task.taskId, { taskStatus: newStatus });
      // onTaskUpdated(updatedTask);
      onTaskUpdated({ ...task, taskStatus: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteTask = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteTask(task.taskId);
      if (response.status) {
        onTaskDeleted(task.taskId);
        showToast("Task deleted successfully", "success");
      } else {
        showToast("Failed to delete task", "error");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast("Something went wrong", "error");
    } finally {
      setIsDeleting(false);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <div className="border p-4 rounded-md shadow-md bg-white flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">{task.taskTitle}</h3>
        <p className="text-gray-600">{task.taskDescription}</p>
        <p className="text-sm text-gray-500">
          Due:{" "}
          {new Date(task.taskDueDate).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        {task.taskCourseTag && (
          <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 text-xs">
            {task.taskCourseTag}
          </span>
        )}

        <div className="mt-2 text-sm font-semibold">
          Status: <span className="text-blue-600">{task.taskStatus}</span>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-green-500"
        >
          Edit
        </button>
        <button
          onClick={() => setIsConfirmModalOpen(true)}
          className="text-red-500"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting" : "Delete"}
        </button>

        <select
          value={task.taskStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm mt-1"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {isEditModalOpen && (
        <AddEditTaskModal
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          existingTask={{ ...task, taskStatus: task.taskStatus ?? "" }}
          // existingTask={{
          //   ...task,
          //   taskStatus: task.taskStatus ?? "Pending", // Default value if undefined
          // }}
          onTaskSaved={onTaskUpdated}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this task?"
          onConfirm={handleDeleteTask}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TaskCard;
