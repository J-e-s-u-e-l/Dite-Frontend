import { useState } from "react";
import { addNewTask, updateTask } from "@/services/task-managerServices";
import Loader from "@/components/common/Loader";
import { useToast } from "@/context/ToastContext";
import { Task } from "@/types/interfaces";

interface AddEditTaskModalProps {
  onClose: () => void;
  onTaskSaved: (newTask: Task) => void;
  mode: "add" | "edit";
  existingTask?: {
    // taskId: string | null;
    taskId?: string | null;
    taskTitle: string;
    taskDescription: string;
    taskDueDate: string;
    taskCourseTag: string;
    taskStatus: string;
  };
}

const AddEditTaskModal: React.FC<AddEditTaskModalProps> = ({
  onClose,
  mode,
  existingTask: existingTask,
  onTaskSaved,
}) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [taskData, setTaskData] = useState({
    taskId: existingTask?.taskId || "",
    taskTitle: existingTask?.taskTitle || "",
    taskDescription: existingTask?.taskDescription || "",
    taskDueDate: existingTask?.taskDueDate || "",
    taskCourseTag: existingTask?.taskCourseTag || "",
    taskStatus: existingTask?.taskStatus || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);

      let response;

      if (mode === "edit") {
        // response = await updateTask(taskData);
        const payload: Partial<Task> = {};

        if (taskData.taskTitle !== existingTask?.taskTitle)
          payload.taskTitle = taskData.taskTitle;

        if (taskData.taskDescription !== existingTask?.taskDescription)
          payload.taskDescription = taskData.taskDescription;

        if (taskData.taskDueDate !== existingTask?.taskDueDate)
          payload.taskDueDate = taskData.taskDueDate;

        if (taskData.taskCourseTag !== existingTask?.taskCourseTag)
          payload.taskCourseTag = taskData.taskCourseTag;

        // if (taskData.taskStatus !== existingTask?.taskStatus)
        //   payload.taskStatus = taskData.taskStatus;

        if (Object.keys(payload).length > 0) {
          response = await updateTask(taskData.taskId, payload);
        }

        if (response.status) {
          showToast(response.message, "success");
        }
      } else if (mode === "add") {
        const payload = {
          taskTitle: taskData.taskTitle,
          taskDescription: taskData.taskDescription,
          taskDueDate: taskData.taskDueDate,
          taskCourseTag: taskData.taskCourseTag,
        };
        response = await addNewTask(payload);
        if (response.status) {
          showToast("Task updated successfully", "success");
        }

        onTaskSaved(response.data);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save task", error);
      showToast("Failed to save task. Please try again", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-xl font-bold mb-4">
          {mode === "add" ? "Add New Task" : "Edit Task"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="taskTitle"
            placeholder="Task Title"
            value={taskData.taskTitle}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />

          <textarea
            name="taskDescription"
            placeholder="Description (optional)"
            value={taskData.taskDescription}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />

          <input
            type="date"
            name="taskDueDate"
            value={taskData.taskDueDate}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />

          <input
            type="text"
            name="taskCourseTag"
            placeholder="Course Tag (optional)"
            value={taskData.taskCourseTag}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            {mode === "add" ? "Add Task" : "Update Task"}
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-2 text-red-500 hover:underline text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddEditTaskModal;
