"use client";

import { useState, useEffect } from "react";
import { fetchCompletionRate } from "@/services/task-managerServices";
import { useToast } from "@/context/ToastContext";

const timeFilters = [
  { label: "Yesterday", value: "yesterday" },
  { label: "Last Week", value: "last_week" },
  { label: "Last Month", value: "last_month" },
];

const ProgressTracker = () => {
  const [selectedFilter, setSelectedFilter] = useState("yesterday");
  const [completionRate, setCompletionRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showToast: showToast } = useToast();

  useEffect(() => {
    const fetchCompletionRateFromServer = async () => {
      setLoading(true);
      try {
        const response = await fetchCompletionRate(selectedFilter);

        setCompletionRate(response.data.completionRate);
      } catch (error) {
        showToast(
          "Failed to fetch completion rate. Please try again.",
          "error"
        );
        console.error("Error fetching completion rate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletionRateFromServer();
  }, [selectedFilter]);

  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Task Completion Rate</h2>

        {/* Dropdown for selecting time period */}
        <select
          className="border p-1 rounded"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          {timeFilters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 relative">
        <div
          className="bg-green-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${completionRate}%` }}
        ></div>
      </div>

      {/* Completion percentage */}
      <p className="text-sm text-gray-600 mt-1">
        {loading ? "Loading..." : `${completionRate}% Completed`}
      </p>
    </div>
  );
};

export default ProgressTracker;
