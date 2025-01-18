"use client";

import React from "react";
import { useRouter } from "next/router";

const AcademyHomePage = () => {
  const router = useRouter();
  const { academyId } = router.query;

  const handleRedirectToResourceRepository = () => {
    router.push(`/academy/${academyId}/resources`);
  };

  const handleRedirectToDiscussionHub = () => {
    router.push(`/academy/${academyId}/discussion-hub`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to {academyId} Academy
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
