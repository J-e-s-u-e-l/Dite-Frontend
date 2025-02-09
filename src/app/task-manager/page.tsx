"use client";

import TaskList from "@/components/feature/task-manager/TaskList";
import ProgressTracker from "@/components/feature/task-manager/ProgressTracker";
import AddEditTaskModal from "@/components/feature/task-manager/AddEditTaskModal";
import { useState } from "react";

const TaskManagerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>

      <ProgressTracker />
      <TaskList />

      {isModalOpen && (
        <AddEditTaskModal onClose={() => setIsModalOpen(false)} mode="add" />
      )}
    </div>
  );
};

export default TaskManagerPage;
