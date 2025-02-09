import { useState } from "react";

interface AddEditTaskModalProps {
  onClose: () => void;
  mode: "add" | "edit";
  existingTrack?: {
    title: string;
    description: string;
    dueDate: string;
    courseTag: string;
  };
}

const AddEditTaskModal: React.FC<AddEditTaskModalProps> = ({
  onClose,
  mode,
  existingTrack,
}) => {
  const [title, setTitle] = useState(existingTrack?.title || "");
  const [description, setDescription] = useState(
    existingTrack?.description || ""
  );
  const [dueDate, setDueDate] = useState(existingTrack?.dueDate || "");
  const [courseTag, setCourseTag] = useState(existingTrack?.courseTag || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-xl font-bold mb-4">
          {mode === "add" ? "Add New Task" : "Edit Task"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md p-2"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-md p-2"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            placeholder="Course Tag (optional)"
            value={courseTag}
            onChange={(e) => setCourseTag(e.target.value)}
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
