"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import apiClient from "@/utils/apiClient";
// import { useSpring, animated } from "react-spring";
// import { motion } from "framer-motion";

const Academy = () => {
  interface Academy {
    academyId: string;
    academyName: string;
    academyDescription: string;
    academyMembersCount: string;
    academyTracksCount: string;
    academyCreatedByUser: boolean;
  }

  // const fadeInAnimation = useSpring({
  //   from: { transform: "translateY(50px)", opacity: 0 },
  //   to: { transform: "translateY(0)", opacity: 1 },
  //   config: { mass: 1, tension: 200, friction: 30 },
  // });

  const [academies, setAcademies] = useState<Academy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAcademies = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Academies/user-academies`
      );

      setAcademies(response.data.data);
    } catch (error) {
      console.error("Error fetching academies", error);
      setError("Failed to load academies. Please try again");
    } finally {
      setLoading(false);
    }
  };

  // Fetch academies on component mount
  useEffect(() => {
    fetchAcademies();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchAcademies}
          className="mt-4 p-2 rounded bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Page Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Academy</h1>
        <p className="text-gray-600">Join, create, and explore academies</p>
      </header>

      {/* Join/Create Academy */}
      <div className="mb-5">
        <ul className="flex flex-row items-center justify-center gap-x-3">
          <li>
            <Link
              href="/academy/create-academy"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none"
            >
              Create Academy
            </Link>
          </li>
          <li>
            <Link
              href="/academy/join-academy"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              Join Academy
            </Link>
          </li>
        </ul>
      </div>

      {/* Academy List */}
      <div className="max-w-4xl mx-auto">
        <section className="mb-6">
          {/* List of joined Academies */}
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Joined Academies
          </h2>
          <div className="flex flex-col gap-4 mx-auto max-w-4xl">
            {academies.map((academy) => (
              <Link
                href={`/academy/${academy.academyId}/home`}
                className="w-full no-underline"
                key={academy.academyId}
              >
                <div
                  key={academy.academyId}
                  className={`bg-white shadow-lg rounded-lg p-4 flex justify-between items-center ${
                    academy.academyCreatedByUser
                      ? "border-1-4 border-green-500"
                      : ""
                  }`}
                >
                  <div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {academy.academyName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {academy.academyDescription ||
                          "No description provided."}
                      </p>

                      <span className="text-sm text-gray-500">
                        {academy.academyMembersCount}{" "}
                        {academy.academyMembersCount === "1"
                          ? "member"
                          : "members"}{" "}
                        |{academy.academyTracksCount}{" "}
                        {academy.academyTracksCount === "1"
                          ? "track"
                          : "tracks"}
                      </span>

                      {/* Show "Created by you" if academy was created by the user */}
                      {academy.academyCreatedByUser && (
                        <p className="txt-xs text-green-500">Created by you</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <button className="text-gray-400 hover:text-gray-600">
                      {/* Icon for three dots (e.g., Heroicons) */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v.01M12 12v.01M12 18v.01"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Academy;
