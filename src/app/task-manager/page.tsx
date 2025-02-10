"use client";

import TaskList from "@/components/feature/task-manager/TaskList";
import ProgressTracker from "@/components/feature/task-manager/ProgressTracker";
import AddEditTaskModal from "@/components/feature/task-manager/AddEditTaskModal";
import { useState, useEffect } from "react";
import { Task } from "@/types/interfaces";

// interface Task {
//   taskId: string | null;
//   taskTitle: string;
//   taskDescription: string;
//   taskDueDate: string;
//   taskCourseTag: string;
// }

const TaskManagerPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const mockTasks = [
    {
      taskId: "1",
      taskTitle: "Complete Assignment 1",
      taskDescription: "Work on the data structures assignment.",
      taskDueDate: "2025-02-15",
      taskCourseTag: "Computer Science",
      isCompleted: false,
    },
  ];
  // Mock data for demonstration purposes
  useEffect(() => {
    setTasks(mockTasks);
  }, []);

  const handleAddNewTask = () => {
    setIsModalOpen(true);
  };

  const handleNewTaskAdded = (task: Task) => {
    setTasks([...tasks, task]);
    setIsModalOpen(false);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) =>
        task.taskId === updatedTask.taskId ? updatedTask : task
      )
    );

    // return <TaskList tasks={tasks} onTaskUpdated />
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={handleAddNewTask}
        >
          Add Task
        </button>
      </div>

      <ProgressTracker />

      {tasks.length > 0 ? (
        <TaskList tasks={tasks} onTaskUpdated={handleTaskUpdated} />
      ) : (
        <p className="text-center text-gray-500">No tasks added yet.</p>
      )}

      {isModalOpen && (
        <AddEditTaskModal
          onClose={() => setIsModalOpen(false)}
          onTaskSaved={handleNewTaskAdded}
          mode="add"
        />
      )}
    </div>
  );
};

export default TaskManagerPage;
