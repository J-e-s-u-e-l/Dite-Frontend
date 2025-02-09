const ProgressTracker = () => {
  const completedTasks = 6;
  const totalTasks = 8;
  const completionRate = (completedTasks / totalTasks) * 100;

  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-4">
      <h2 className="text-lg font-semibold mb-2">Task Completion Rate</h2>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full"
          style={{ width: `${completionRate}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mt-1">{completionRate}% Completed</p>
    </div>
  );
};

export default ProgressTracker;
