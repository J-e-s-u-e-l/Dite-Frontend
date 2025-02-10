"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import Loader from "@/components/common/Loader";
import apiClient from "@/utils/apiClient";
import { useRouter } from "next/navigation";

const CreateAcademy = () => {
  const [academyName, setAcademyName] = useState("");
  const [tracks, setTracks] = useState<string[]>([""]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { showToast: showToast } = useToast();
  const [loading, showLoading] = useState(false);

  const handleAddTrack = () => {
    setTracks([...tracks, ""]);
  };

  const handleRemoveTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  const handleTrackChange = (index: number, value: string) => {
    const updatedTracks = [...tracks];
    updatedTracks[index] = value;
    setTracks(updatedTracks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading(true);

    const payload = {
      AcademyName: academyName,
      Tracks: tracks.filter((tracks) => tracks.trim() !== ""),
      Description: description.trim(),
    };

    try {
      const response = await apiClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/Academies/create-academy`,
        payload
      );

      const data = await response.data;

      if (data.status) {
        showToast(data.message, "success");
        setAcademyName("");
        setTracks([]);
        setDescription("");
        setError("");

        router.push(`/academy/${data.data.academyId}/home`);
      } else {
        showToast(data.message, "error");
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Something went wrong", error);
    } finally {
      showLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {loading && <Loader />}
      {/* Page Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Create a New Academy
        </h1>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Create Academy Section */}
        <section>
          <h2 className="text-x1 font-semibold text-gray-700 mb-3">
            Create an Academy
          </h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Academy Name */}
              <div>
                <label
                  htmlFor="academyName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Academy Name
                </label>
                <input
                  type="text"
                  id="academyName"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter academy name"
                  value={academyName}
                  onChange={(e) => setAcademyName(e.target.value)}
                  required
                />
              </div>

              {/* Tracks */}
              <div>
                <label
                  htmlFor="tracks"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tracks (Courses)
                </label>
                {tracks.map((track, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder={`Track ${index + 1}`}
                      value={track}
                      onChange={(e) => handleTrackChange(index, e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTrack(index)}
                      className="text-red-500 hover:underline"
                      disabled={tracks.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddTrack}
                  className="text-indigo-600 hover:underline"
                >
                  + Add Another Track
                </button>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:borer-indigo-500 sm-text-sm"
                  placeholder="Enter academy description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green=700 focus:outline-none"
              >
                Create Academy
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreateAcademy;
