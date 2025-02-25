"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import apiClient from "@/utils/apiClient";
import { useToast } from "@/context/ToastContext";

const Academy = () => {
  interface Academy {
    academyId: string;
    academyName: string;
    academyDescription: string;
    academyMembersCount: string;
    academyTracksCount: string;
    academyCreatedByUser: boolean;
  }

  const [academies, setAcademies] = useState<Academy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState<string | null>(null);
  const { showToast } = useToast();

  const router = useRouter();

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
      setError("Failed to load academies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveAcademy = async (academyId: string | null) => {
    try {
      const response = await apiClient.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/Academies/${academyId}/leave`
      );
      const data = response.data;
      if (data.status) {
        setAcademies((prev) =>
          prev.filter((academy) => academy.academyId !== academyId)
        );
        showToast(data.message, "success");
      } else {
        showToast(data.message, "error");
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Something went wrong. Please try again.", error);
    } finally {
      setConfirmLeave(null);
    }
  };

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

  // return (
  //   <div className="min-h-screen bg-gray-100 p-4">
  //     <header className="text-center mb-6">
  //       <h1 className="text-3xl font-bold text-gray-800">Academy</h1>
  //       <p className="text-gray-600">Join, create, and explore academies</p>
  //     </header>

  //     <div className="mb-5">
  //       <ul className="flex flex-row items-center justify-center gap-x-3">
  //         <li>
  //           <Link
  //             href="/academy/create-academy"
  //             className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none"
  //           >
  //             Create Academy
  //           </Link>
  //         </li>
  //         <li>
  //           <Link
  //             href="/academy/join-academy"
  //             className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none"
  //           >
  //             Join Academy
  //           </Link>
  //         </li>
  //       </ul>
  //     </div>

  //     <div className="max-w-4xl mx-auto">
  //       <section className="mb-6">
  //         <h2 className="text-xl font-semibold text-gray-700 mb-3">
  //           Joined Academies
  //         </h2>
  //         <div className="flex flex-col gap-4 mx-auto max-w-4xl">
  //           {academies.map((academy) => (
  //             <div
  //               key={academy.academyId}
  //               className={`bg-white shadow-lg rounded-lg flex justify-between items-center p-4 cursor-pointer ${
  //                 academy.academyCreatedByUser
  //                   ? "border-l-4 border-green-500"
  //                   : ""
  //               }`}
  //               onClick={(event) => {
  //                 if (
  //                   !(event.target as HTMLElement).closest(
  //                     ".dropdown-container"
  //                   )
  //                 ) {
  //                   // Added: Prevent navigation if clicked on dropdown or button
  //                   router.push(`/academy/${academy.academyId}/home`);
  //                 }
  //               }}
  //             >
  //               <div>
  //                 <h3 className="text-lg font-semibold text-gray-800">
  //                   {academy.academyName}
  //                 </h3>
  //                 <p className="text-sm text-gray-600">
  //                   {academy.academyDescription || "No description provided."}
  //                 </p>
  //                 <span className="text-sm text-gray-500">
  //                   {academy.academyMembersCount}{" "}
  //                   {academy.academyMembersCount === "1" ? "member" : "members"}{" "}
  //                   | {academy.academyTracksCount}{" "}
  //                   {academy.academyTracksCount === "1" ? "track" : "tracks"}
  //                 </span>
  //                 {academy.academyCreatedByUser && (
  //                   <p className="text-xs text-green-500">Created by you</p>
  //                 )}
  //               </div>

  //               <div
  //                 className="relative dropdown-container" // Added class for exclusion check
  //                 onClick={(event) => event.stopPropagation()}
  //               >
  //                 <button
  //                   className="text-gray-400 hover:text-gray-600"
  //                   onClick={() =>
  //                     setActiveMenu(
  //                       activeMenu === academy.academyId
  //                         ? null
  //                         : academy.academyId
  //                     )
  //                   }
  //                 >
  //                   <svg
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     className="h-6 w-6"
  //                     fill="none"
  //                     viewBox="0 0 24 24"
  //                     stroke="currentColor"
  //                   >
  //                     <path
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                       strokeWidth={2}
  //                       d="M12 6v.01M12 12v.01M12 18v.01"
  //                     />
  //                   </svg>
  //                 </button>
  //                 {activeMenu === academy.academyId && (
  //                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
  //                     <button
  //                       className="block px-4 py-2 text-left text-gray-700 hover:bg-gray-100 w-full"
  //                       onClick={() =>
  //                         router.push(
  //                           `/academy/${academy.academyId}/academyInfo`
  //                         )
  //                       }
  //                     >
  //                       Academy Info
  //                     </button>
  //                     <button
  //                       className="block px-4 py-2 text-left text-red-500 hover:bg-gray-100 w-full"
  //                       onClick={(event) => {
  //                         event.stopPropagation();
  //                         setConfirmLeave(academy.academyId);
  //                       }}
  //                     >
  //                       Leave Academy
  //                     </button>
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </section>
  //     </div>

  //     {confirmLeave && (
  //       <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20">
  //         <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
  //           <h3 className="text-lg font-semibold mb-4">Confirm Leave</h3>
  //           <p className="text-gray-600 mb-4">
  //             Are you sure you want to leave this academy?
  //           </p>
  //           <div className="flex justify-end gap-4">
  //             <button
  //               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
  //               onClick={() => setConfirmLeave(null)}
  //             >
  //               Cancel
  //             </button>
  //             <button
  //               className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
  //               onClick={() => handleLeaveAcademy(confirmLeave)}
  //             >
  //               Confirm
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
  return (
    <div className="p-4 min-h-screen bg-gray-100 flex flex-col">
      {/* Fixed Header */}
      <header className="sticky top-0 bg-gray-100 z-10 pb-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Academy</h1>
          <p className="text-gray-600">Join, create, and explore academies</p>
        </div>

        {/* Fixed Buttons */}
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/academy/create-academy"
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            Create Academy
          </Link>
          <Link
            href="/academy/join-academy"
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            Join Academy
          </Link>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3 mt-3">
          Joined Academies
        </h2>
      </header>

      {/* Scrollable List */}
      <div className="px-8 mt-4 flex-1 overflow-y-auto">
        <section className="mb-6">
          <div className="flex flex-col gap-4">
            {academies.map((academy) => (
              <div
                key={academy.academyId}
                className={`bg-white shadow-lg rounded-lg p-4 flex justify-between items-center cursor-pointer ${
                  academy.academyCreatedByUser
                    ? "border-l-4 border-green-500"
                    : ""
                }`}
                onClick={(event) => {
                  if (
                    !(event.target as HTMLElement).closest(
                      ".dropdown-container"
                    )
                  ) {
                    router.push(`/academy/${academy.academyId}/home`);
                  }
                }}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {academy.academyName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {academy.academyDescription || "No description provided."}
                  </p>
                  <span className="text-sm text-gray-500">
                    {academy.academyMembersCount}{" "}
                    {academy.academyMembersCount === "1" ? "member" : "members"}{" "}
                    | {academy.academyTracksCount}{" "}
                    {academy.academyTracksCount === "1" ? "track" : "tracks"}
                  </span>
                  {academy.academyCreatedByUser && (
                    <p className="text-xs text-green-500">Created by you</p>
                  )}
                </div>

                {/* Dropdown */}
                <div
                  className="relative dropdown-container"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() =>
                      setActiveMenu(
                        activeMenu === academy.academyId
                          ? null
                          : academy.academyId
                      )
                    }
                  >
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
                  {activeMenu === academy.academyId && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                      <button
                        className="block px-4 py-2 text-left text-gray-700 hover:bg-gray-100 w-full"
                        onClick={() =>
                          router.push(
                            `/academy/${academy.academyId}/academyInfo`
                          )
                        }
                      >
                        Academy Info
                      </button>
                      <button
                        className="block px-4 py-2 text-left text-red-500 hover:bg-red-500 hover:text-white w-full"
                        onClick={(event) => {
                          event.stopPropagation();
                          setConfirmLeave(academy.academyId);
                        }}
                      >
                        Leave Academy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Confirm Leave Modal */}
      {confirmLeave && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Leave</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to leave this academy?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setConfirmLeave(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleLeaveAcademy(confirmLeave)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academy;
