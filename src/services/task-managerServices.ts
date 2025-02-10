import apiClient from "@/utils/apiClient";
import { Task } from "@/types/interfaces";

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
    const response = await apiClient.post(
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
