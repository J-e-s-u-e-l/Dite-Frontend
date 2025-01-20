"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import apiClient from "@/utils/apiClient";
import { useToast } from "@/context/ToastContext";

const JoinAcademy = () => {
  const [loading, showLoading] = useState(false);
  const router = useRouter();
  const [academyCode, setAcademyCode] = useState("");
  const [error, setError] = useState("");
  const { showToast: showToast } = useToast();

  const handleJoinAcademy = async (event: React.FormEvent) => {
    event.preventDefault();
    showLoading(true);

    const payload = { academyCode };

    try {
      const response = await apiClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/Academies/join-academy`,
        payload
      );
      const data = await response.data;

      if (data.status) {
        showToast(data.message, "success");
        setAcademyCode("");
        setError("");

        // Redirect to academy home page
        router.push(`/academy/${data.data.academyId}/home`);
      } else {
        showToast(data.message, "error");
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Something went wrong. Please try again.", error);
    } finally {
      showLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      {loading && <Loader />}
      <section className="max-w-4xl mx-auto mb-6">
        {/* Join Academy */}
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Join an Academy
        </h2>
        <div className="bg-white shadow-md rounded-lg p-4">
          <form className="space-y-4" onSubmit={handleJoinAcademy}>
            <div>
              <label
                htmlFor="academyCode"
                className="block text-sm font-medium text-gray-700"
              >
                Academy Code
              </label>
              <input
                type="text"
                id="academyCode"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter academy code"
                value={academyCode}
                onChange={(e) => setAcademyCode(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              Join Academy
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default JoinAcademy;
