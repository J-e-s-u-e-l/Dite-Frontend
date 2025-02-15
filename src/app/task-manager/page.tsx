"use client";

import TaskList from "@/components/feature/task-manager/TaskList";
import ProgressTracker from "@/components/feature/task-manager/ProgressTracker";
import AddEditTaskModal from "@/components/feature/task-manager/AddEditTaskModal";
import { useState, useEffect } from "react";
import { Task } from "@/types/interfaces";
import Loader from "@/components/common/Loader";
import {
  fetchAllTasks,
  fetchTaskStatuses,
} from "@/services/task-managerServices";

const TaskManagerPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  const fetchAllTasksFromServer = async () => {
    try {
      setLoading(true);
      const [tasksResponse, statusResponse] = await Promise.all([
        fetchAllTasks(),
        fetchTaskStatuses(),
      ]);

      setTasks(tasksResponse.data.tasks);
      setStatusOptions(statusResponse.data.taskStatuses);
    } catch (err) {
      console.error("Error loading data:", err);
      setPageError("Failed to load tasks or statuses.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllTasksFromServer();
  }, []);

  const handleStatusFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(event.target.value);
  };

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((task) => task.taskStatus === statusFilter);

  if (loading) {
    return <Loader />;
  }

  if (pageError) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{pageError}</p>
        <button
          onClick={fetchAllTasksFromServer}
          className="mt-4 p-2 rounded bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Tasks</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={() => setIsModalOpen(true)}
          >
            Add Task
          </button>
        </div>
      </div>
      <ProgressTracker />

      {filteredTasks.length > 0 ? (
        <TaskList
          tasks={filteredTasks}
          onTaskUpdated={(updatedTask) => {
            // setTasks(
            //   tasks.map((t) =>
            //     t.taskId === updatedTask.taskId ? updatedTask : t
            //   )
            // );
            setTasks((prevTasks) =>
              prevTasks.map((t) =>
                t.taskId === updatedTask.taskId ? { ...t, ...updatedTask } : t
              )
            );
          }}
          onTaskDeleted={(taskId) => {
            setTasks(tasks.filter((t) => t.taskId !== taskId));
          }}
        />
      ) : (
        <p className="text-center text-gray-500">No tasks available.</p>
      )}

      {isModalOpen && (
        <AddEditTaskModal
          onClose={() => setIsModalOpen(false)}
          onTaskSaved={(newTask) => setTasks([...tasks, newTask])}
          mode="add"
        />
      )}
    </div>
  );
};

export default TaskManagerPage;
