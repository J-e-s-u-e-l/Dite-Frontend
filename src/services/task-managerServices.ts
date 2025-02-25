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
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || "failed to get all tasks");
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
  } catch {
    throw new Error("failed to get all possible task statuses");
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
  } catch {
    throw new Error("failed to add new task");
  }
};

// export const updateTask = async (editedTask: Task) => {
export const updateTask = async (
  taskId: string,
  updatedFields: Partial<Task>
) => {
  try {
    const payload = { taskId, ...updatedFields };
    const response = await apiClient.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/TaskManager/update-task`,
      payload
    );

    if (!response.data.status) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch {
    throw new Error("failed to update task");
  }
};

// export const updateTaskStatus = async (editedTask: Task) => {
export const updateTaskStatus = async (
  taskId: string,
  statusUpdate: Partial<Task>
) => {
  try {
    const payload = { taskId, ...statusUpdate };
    const response = await apiClient.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/TaskManager/update-task`,
      payload
    );

    if (!response.data.status) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch {
    throw new Error("failed to update task status");
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const response = await apiClient.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/TaskManager/${taskId}`
    );

    if (!response.data.status) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch {
    throw new Error("failed to delete task");
  }
};

export const fetchCompletionRate = async (selectedFilter: string) => {
  try {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/TaskManager/completion-rate?timeFilter=${selectedFilter}`
    );

    if (!response.data.status) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch {
    throw new Error("failed to fetch completion rate for selected filter");
  }
};
