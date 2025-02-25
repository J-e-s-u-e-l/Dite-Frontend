"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import apiClient from "@/utils/apiClient";
import Loader from "@/components/common/Loader";
// import { useToast } from "@/context/ToastContext";

const AcademyHomePage = () => {
  const router = useRouter();
  const { academyId } = useParams();
  const [academyName, setAcademyName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const { showToast: showToast } = useToast();

  const handleRedirectToResourceRepository = () => {
    router.push(`/academy/${academyId}/resources-repo`);
  };

  const handleRedirectToDiscussionHub = () => {
    router.push(`/academy/${academyId}/discussion-hub`);
  };

  // Fetch academy data when ID is available
  const fetchAcademyDetails = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Academies/${academyId}`
      );
      const data = await response.data;

      if (data.status) {
        setError("");
        setAcademyName(data.data.academyName);
        setLoading(false);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error fetching academies", error);
      setError("Failed to load academy details. Please try again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademyDetails();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchAcademyDetails}
          className="mt-4 p-2 rounded bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to {academyName} Academy
        </h1>
      </header>

      <div className="max-w-4xl mx-auto">
        <section>
          <button
            onClick={handleRedirectToResourceRepository}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-700"
          >
            Go to Resource Repository
          </button>

          <button
            onClick={handleRedirectToDiscussionHub}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Go to Discussion Hub
          </button>
        </section>
      </div>
    </div>
  );
};

export default AcademyHomePage;
