import TaskCard from "@/components/feature/task-manager/TaskCard";

const mockTasks = [
  {
    id: "1",
    title: "Complete Assignment 1",
    description: "Work on the data structures assignment.",
    dueDate: "2025-02-15",
    courseTag: "Computer Science",
    isCompleted: false,
  },
  {
    id: "2",
    title: "Prepare for Networking Quiz",
    description: "Revise TCP/IP and OSI models.",
    dueDate: "2025-02-18",
    courseTag: "Networking",
    isCompleted: true,
  },
];

const TaskList = () => {
  return (
    <div className="mt-6 space-y-4">
      {mockTasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks added yet.</p>
      ) : (
        mockTasks.map((task) => <TaskCard key={task.id} task={task} />)
      )}
    </div>
  );
};

export default TaskList;
