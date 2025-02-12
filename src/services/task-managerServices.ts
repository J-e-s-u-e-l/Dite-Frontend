import apiClient from "@/utils/apiClient";
import { Task } from "@/types/interfaces";

export const fetchAllTasks = async () => {
  try {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/TaskManager/all-tasks`
    );

    if (!response.data.status) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "failed to get all tasks");
  }
};

export const fetchTaskStatuses = async () => {
  try {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/TaskManager/tasks-statuses`
    );

    if (!response.data.status) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "failed to get all possible task statuses"
    );
  }
};

export const addNewTask = async (newTask: Task) => {
  try {
    const response = await apiClient.post(
      `${process.env.NEXT_PUBLIC_API_URL}/TaskManager/new-task`,
      newTask
    );

    if (!response.data.status) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "failed to add new task");
  }
};

export const updateTask = async (editedTask: Task) => {
  try {
    const response = await apiClient.put(
      `${process.env.NEXT_PUBLIC_API_URL}/TaskManager/update-task`,
      editedTask
    );

    if (!response.data.status) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "failed to update task");
  }
};

export const updateTaskStatus = async (editedTask: Task) => {
  try {
    const response = await apiClient.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/TaskManager/update-task-status`,
      editedTask
    );

    if (!response.data.status) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "failed to update task status"
    );
  }
};
